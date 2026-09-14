/**
 * Standalone Numerical Correctness & Micro-Benchmark Suite for GPU ArgMax
 */

import { GpuArgMaxEngine, cpuArgMax, VOCAB_SIZE } from './gpuArgMax.js';

/**
 * Runs strict numerical validation comparing GPU ArgMax vs CPU ArgMax
 * across 8 challenging distribution patterns.
 * 
 * @param {GPUDevice} device 
 * @returns {Promise<{ allPassed: boolean, tests: Array<{ name: string, passed: boolean, cpuToken: number, gpuToken: number, cpuScore: number, gpuScore: number, error?: string }> }>}
 */
export async function runNumericalValidation(device) {
    const engine = new GpuArgMaxEngine(device);
    await engine.init();

    const tests = [];

    // Helper to upload CPU array to a GPU storage buffer
    const createGpuLogitsBuffer = (floatArray) => {
        const buffer = device.createBuffer({
            label: 'test_logits_buffer',
            size: floatArray.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
        });
        device.queue.writeBuffer(buffer, 0, floatArray);
        return buffer;
    };

    const testCases = [
        {
            name: 'Uniform Random Distribution [-10, +10]',
            generate: () => {
                const arr = new Float32Array(VOCAB_SIZE);
                for (let i = 0; i < VOCAB_SIZE; i++) {
                    arr[i] = (Math.random() * 20) - 10;
                }
                return arr;
            }
        },
        {
            name: 'Boundary: Index 0 (First Token Max)',
            generate: () => {
                const arr = new Float32Array(VOCAB_SIZE).fill(-5.0);
                arr[0] = 50.0;
                return arr;
            }
        },
        {
            name: 'Boundary: Index 151,935 (Last Token Max)',
            generate: () => {
                const arr = new Float32Array(VOCAB_SIZE).fill(-5.0);
                arr[VOCAB_SIZE - 1] = 50.0;
                return arr;
            }
        },
        {
            name: 'Mid Boundary: Index 75,000 Max',
            generate: () => {
                const arr = new Float32Array(VOCAB_SIZE).fill(0.0);
                arr[75000] = 25.0;
                return arr;
            }
        },
        {
            name: 'Tie Resolution (Identical Max at 100, 500, 2000 -> Must Pick 100)',
            generate: () => {
                const arr = new Float32Array(VOCAB_SIZE).fill(-10.0);
                arr[100] = 12.5;
                arr[500] = 12.5;
                arr[2000] = 12.5;
                return arr;
            }
        },
        {
            name: 'Extreme Positive Magnitude (+1e6)',
            generate: () => {
                const arr = new Float32Array(VOCAB_SIZE).fill(1e5);
                arr[42424] = 1e6;
                return arr;
            }
        },
        {
            name: 'Extreme Negative Magnitude (-1e6)',
            generate: () => {
                const arr = new Float32Array(VOCAB_SIZE).fill(-1e6);
                arr[8888] = -100.0;
                return arr;
            }
        },
        {
            name: 'Near-Equal Precision (Delta = 1e-5)',
            generate: () => {
                const arr = new Float32Array(VOCAB_SIZE).fill(1.0);
                arr[12345] = 1.00005;
                arr[54321] = 1.00006; // Winner
                return arr;
            }
        }
    ];

    let allPassed = true;

    for (const tc of testCases) {
        let logitsBuf = null;
        try {
            const data = tc.generate();
            const cpuResult = cpuArgMax(data);

            logitsBuf = createGpuLogitsBuffer(data);
            const gpuResult = await engine.execute(logitsBuf);

            const tokenMatch = cpuResult.tokenId === gpuResult.tokenId;
            const scoreMatch = Math.abs(cpuResult.score - gpuResult.score) < 1e-4;
            const passed = tokenMatch && scoreMatch;

            if (!passed) allPassed = false;

            tests.push({
                name: tc.name,
                passed,
                cpuToken: cpuResult.tokenId,
                gpuToken: gpuResult.tokenId,
                cpuScore: cpuResult.score,
                gpuScore: gpuResult.score,
            });
        } catch (err) {
            allPassed = false;
            tests.push({
                name: tc.name,
                passed: false,
                cpuToken: -1,
                gpuToken: -1,
                cpuScore: 0,
                gpuScore: 0,
                error: err.message
            });
        } finally {
            if (logitsBuf) logitsBuf.destroy();
        }
    }

    engine.dispose();
    return { allPassed, tests };
}

/**
 * Runs isolated micro-benchmarks comparing Path A (608 KB readback) vs Path B (GPU ArgMax 8 B).
 * 
 * @param {GPUDevice} device 
 * @param {number} repetitions 
 * @returns {Promise<{ pathA: { avgMs: number, bytes: number, p50: number }, pathB: { avgMs: number, bytes: number, p50: number, gpuDispatchMs: number, mapAsyncMs: number }, speedup: number, bandwidthReductionPct: number }>}
 */
export async function runMicroBenchmark(device, repetitions = 10) {
    const engine = new GpuArgMaxEngine(device);
    await engine.init();

    // Prepare synthetic test logits buffer
    const testData = new Float32Array(VOCAB_SIZE);
    for (let i = 0; i < VOCAB_SIZE; i++) testData[i] = (Math.random() * 20) - 10;
    testData[12345] = 99.0;

    const logitsGpuBuffer = device.createBuffer({
        label: 'bench_logits_buffer',
        size: testData.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(logitsGpuBuffer, 0, testData);

    // Staging buffer for Path A (607,744 bytes)
    const stagingBufferA = device.createBuffer({
        label: 'bench_staging_608kb',
        size: testData.byteLength,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });

    // 1. Benchmark Path A: 608 KB Host Readback + CPU ArgMax
    const timesA = [];
    for (let i = 0; i < repetitions; i++) {
        const t0 = performance.now();

        const encoder = device.createCommandEncoder();
        encoder.copyBufferToBuffer(logitsGpuBuffer, 0, stagingBufferA, 0, testData.byteLength);
        device.queue.submit([encoder.finish()]);

        await stagingBufferA.mapAsync(GPUMapMode.READ);
        const mapped = stagingBufferA.getMappedRange();
        const floatView = new Float32Array(mapped.slice(0)); // clone to CPU memory
        stagingBufferA.unmap();

        const token = cpuArgMax(floatView);
        const tEnd = performance.now();
        timesA.push(tEnd - t0);
    }

    // 2. Benchmark Path B: GPU-Resident ArgMax + 8 Byte Readback
    const timesB = [];
    const dispatchTimes = [];
    const mapTimes = [];
    for (let i = 0; i < repetitions; i++) {
        const t0 = performance.now();
        const res = await engine.execute(logitsGpuBuffer);
        const tEnd = performance.now();
        timesB.push(tEnd - t0);
        dispatchTimes.push(res.timings.gpuDispatchMs);
        mapTimes.push(res.timings.mapAsyncMs);
    }

    // Cleanup
    logitsGpuBuffer.destroy();
    stagingBufferA.destroy();
    engine.dispose();

    const median = (arr) => {
        const s = [...arr].sort((a, b) => a - b);
        const m = Math.floor(s.length / 2);
        return s.length % 2 !== 0 ? s[m] : (s[m - 1] + s[m]) / 2;
    };
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const avgA = avg(timesA);
    const avgB = avg(timesB);

    return {
        pathA: {
            avgMs: Number(avgA.toFixed(2)),
            p50: Number(median(timesA).toFixed(2)),
            bytes: VOCAB_SIZE * 4, // 607,744
            samples: timesA
        },
        pathB: {
            avgMs: Number(avgB.toFixed(2)),
            p50: Number(median(timesB).toFixed(2)),
            bytes: 8,
            gpuDispatchMs: Number(avg(dispatchTimes).toFixed(2)),
            mapAsyncMs: Number(avg(mapTimes).toFixed(2)),
            samples: timesB
        },
        speedup: Number((avgA / avgB).toFixed(2)),
        bandwidthReductionPct: Number((((VOCAB_SIZE * 4) - 8) / (VOCAB_SIZE * 4) * 100).toFixed(3))
    };
}
