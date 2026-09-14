/**
 * WebGPU-Resident ArgMax Kernel & Token Selection
 * 
 * Performs parallel reduction of logits tensor [1, 1, 151936] directly inside WebGPU VRAM.
 * Reads back only 8 bytes ([token_id: u32, score: f32]) instead of 607,744 bytes (Float32Array[151936]),
 * eliminating 99.998% of host bus staging traffic per token step.
 */

export const VOCAB_SIZE = 151936;

export const ARGMAX_WGSL = /* wgsl */ `
struct Output {
    token_id: u32,
    score: f32,
};

@group(0) @binding(0) var<storage, read> logits: array<f32>;
@group(0) @binding(1) var<storage, read_write> result: Output;

var<workgroup> s_val: array<f32, 256>;
var<workgroup> s_idx: array<u32, 256>;

const VOCAB_SIZE: u32 = 151936u;
const WORKGROUP_SIZE: u32 = 256u;

@compute @workgroup_size(256, 1, 1)
fn main(@builtin(local_invocation_id) local_id: vec3<u32>) {
    let tid = local_id.x;
    
    // Step 1: Sequential strided scan across vocab
    // Coalesced access: thread tid reads elements tid, tid+256, tid+512...
    var best_idx: u32 = tid;
    var best_val: f32 = -3.402823466e+38f; // -FLT_MAX
    
    if (tid < VOCAB_SIZE) {
        best_val = logits[tid];
    }
    
    for (var i: u32 = tid + WORKGROUP_SIZE; i < VOCAB_SIZE; i += WORKGROUP_SIZE) {
        let v = logits[i];
        if (v > best_val) {
            best_val = v;
            best_idx = i;
        }
    }
    
    s_val[tid] = best_val;
    s_idx[tid] = best_idx;
    workgroupBarrier();
    
    // Step 2: Parallel tree reduction in shared memory (128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1)
    // On ties, strictly preserve the smaller token_id to match standard CPU ArgMax semantics
    for (var s: u32 = WORKGROUP_SIZE / 2u; s > 0u; s = s >> 1u) {
        if (tid < s) {
            let other_val = s_val[tid + s];
            let other_idx = s_idx[tid + s];
            
            if (other_val > s_val[tid] || (other_val == s_val[tid] && other_idx < s_idx[tid])) {
                s_val[tid] = other_val;
                s_idx[tid] = other_idx;
            }
        }
        workgroupBarrier();
    }
    
    // Step 3: Thread 0 commits final 8-byte result
    if (tid == 0u) {
        result.token_id = s_idx[0];
        result.score = s_val[0];
    }
}
`;

/**
 * CPU reference implementation for strict numerical validation.
 * @param {Float32Array} logits 
 * @returns {{ tokenId: number, score: number }}
 */
export function cpuArgMax(logits) {
    let bestVal = -Infinity;
    let bestIdx = 0;
    const len = logits.length;
    for (let i = 0; i < len; i++) {
        const v = logits[i];
        if (v > bestVal) {
            bestVal = v;
            bestIdx = i;
        }
    }
    return { tokenId: bestIdx, score: bestVal };
}

export class GpuArgMaxEngine {
    /**
     * @param {GPUDevice} device 
     */
    constructor(device) {
        this.device = device;
        this.shaderModule = null;
        this.pipeline = null;
        this.resultGpuBuffer = null;
        this.stagingBuffer = null;
        this.bindGroupLayout = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        this.shaderModule = this.device.createShaderModule({
            label: 'gpu_argmax_shader',
            code: ARGMAX_WGSL,
        });

        this.bindGroupLayout = this.device.createBindGroupLayout({
            label: 'gpu_argmax_bind_group_layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'read-only-storage' }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'storage' }
                }
            ]
        });

        const pipelineLayout = this.device.createPipelineLayout({
            label: 'gpu_argmax_pipeline_layout',
            bindGroupLayouts: [this.bindGroupLayout]
        });

        this.pipeline = this.device.createComputePipeline({
            label: 'gpu_argmax_pipeline',
            layout: pipelineLayout,
            compute: {
                module: this.shaderModule,
                entryPoint: 'main'
            }
        });

        // 8 bytes: u32 token_id + f32 score
        this.resultGpuBuffer = this.device.createBuffer({
            label: 'gpu_argmax_result_storage',
            size: 8,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });

        this.stagingBuffer = this.device.createBuffer({
            label: 'gpu_argmax_result_staging',
            size: 8,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
        });

        this.isInitialized = true;
    }

    /**
     * Executes GPU ArgMax on the given GPU logits buffer and returns the selected token ID and score.
     * Only 8 bytes cross the GPU-to-host bus.
     * 
     * @param {GPUBuffer} logitsBuffer 
     * @returns {Promise<{ tokenId: number, score: number, timings: { gpuDispatchMs: number, mapAsyncMs: number, totalMs: number } }>}
     */
    async execute(logitsBuffer) {
        if (!this.isInitialized) {
            await this.init();
        }

        const t0 = performance.now();

        const bindGroup = this.device.createBindGroup({
            label: 'gpu_argmax_bind_group',
            layout: this.bindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: logitsBuffer } },
                { binding: 1, resource: { buffer: this.resultGpuBuffer } }
            ]
        });

        const encoder = this.device.createCommandEncoder({ label: 'gpu_argmax_encoder' });
        const pass = encoder.beginComputePass({ label: 'gpu_argmax_pass' });
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(1);
        pass.end();

        encoder.copyBufferToBuffer(this.resultGpuBuffer, 0, this.stagingBuffer, 0, 8);
        this.device.queue.submit([encoder.finish()]);

        const tGpuSubmit = performance.now();

        // Staging readback of ONLY 8 bytes
        await this.stagingBuffer.mapAsync(GPUMapMode.READ);
        const tMapDone = performance.now();

        const arrayBuffer = this.stagingBuffer.getMappedRange();
        const u32View = new Uint32Array(arrayBuffer);
        const f32View = new Float32Array(arrayBuffer);

        const tokenId = u32View[0];
        const score = f32View[1];

        this.stagingBuffer.unmap();
        const tTotal = performance.now();

        return {
            tokenId,
            score,
            timings: {
                gpuDispatchMs: tGpuSubmit - t0,
                mapAsyncMs: tMapDone - tGpuSubmit,
                totalMs: tTotal - t0
            }
        };
    }

    dispose() {
        if (this.resultGpuBuffer) {
            this.resultGpuBuffer.destroy();
            this.resultGpuBuffer = null;
        }
        if (this.stagingBuffer) {
            this.stagingBuffer.destroy();
            this.stagingBuffer = null;
        }
        this.pipeline = null;
        this.shaderModule = null;
        this.isInitialized = false;
    }
}
