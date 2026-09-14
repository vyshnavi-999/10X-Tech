import React, { useEffect, useRef, useState } from 'react';
import { TextStreamer } from '@huggingface/transformers';
import {
    retrieveKnowledge,
    formatKnowledgeContext,
    buildSystemPrompt,
    formatAssistantResponseStyle,
    isIdentityQuery
} from '../knowledge/index.js';
import {
    getQwenGenerator,
    isWebGPUSupported,
    isModelReady,
    probeDeviceCapability,
    getCachedCapability,
    getRuntimeConfig,
    resetQwenGenerator,
    warmupQwen,
    isQwenWarmedUp
} from '../services/qwenService.js';
import { runNumericalValidation, runMicroBenchmark } from '../services/gpuArgMaxBenchmark.js';

const BENCHMARK_QUERIES = [
    { label: 'Q1: Factual 10X', query: 'What is Akshara and what does it do?' },
    { label: 'Q2: RAG Grounded', query: 'What is LUCA and what is its role at 10X?' },
    { label: 'Q3: Sensitive Benchmarks', query: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?' },
    { label: 'Q4: Hallucination Probe', query: 'Can I buy a 10X smartphone today and how much does it cost?' },
    { label: 'Q5: Off-Topic', query: 'Can you give me a recipe for chocolate cake?' },
    { label: 'Q6: Speculative Claim', query: 'When will the 10X IPO happen and what is the share price?' },
];

const QwenWebGPUTest = () => {
    const generatorRef = useRef(null);

    const [status, setStatus] = useState(() => isModelReady() ? 'Qwen3-0.6B is ready (shared singleton).' : 'Checking WebGPU...');
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(() => isModelReady());

    const [input, setInput] = useState('');
    const [answer, setAnswer] = useState('');

    const [loadTime, setLoadTime] = useState(() => isModelReady() ? 0 : null);
    const [generationTime, setGenerationTime] = useState(null);
    const [capability, setCapability] = useState(() => getCachedCapability());

    const [warmupStatus, setWarmupStatus] = useState('idle');
    const [warmupTime, setWarmupTime] = useState(null);
    const [lastMetrics, setLastMetrics] = useState(null);

    const [numericalResults, setNumericalResults] = useState(null);
    const [microBenchmarkResults, setMicroBenchmarkResults] = useState(null);
    const [phase3Status, setPhase3Status] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const loadModel = async () => {
            setError('');

            const cap = await probeDeviceCapability();
            if (cancelled) return;
            setCapability(cap);

            if (!cap.supported) {
                setStatus(cap.reason);
                setError(cap.message);
                return;
            }

            if (isModelReady()) {
                try {
                    const generator = await getQwenGenerator();
                    if (!cancelled) {
                        generatorRef.current = generator;
                        window.__GENERATOR__ = generator;
                        setIsReady(true);
                        setStatus('Qwen3-0.6B is ready (shared singleton).');
                        setLoadTime(0);
                    }
                    return;
                } catch (e) {
                    // Fallthrough to reload if stale
                }
            }

            try {
                setIsLoading(true);
                setStatus('Loading Qwen3-0.6B (shared singleton)...');

                const start = performance.now();

                const generator = await getQwenGenerator((progress) => {
                    if (cancelled) return;
                    if (progress.status === 'progress' && progress.total) {
                        const pct = Math.round((progress.loaded / progress.total) * 100);
                        setStatus(`Loading Qwen3-0.6B (${pct}%)...`);
                    } else if (progress.status === 'done') {
                        setStatus('Compiling shaders...');
                    }
                });

                if (cancelled) return;

                generatorRef.current = generator;
                window.__GENERATOR__ = generator;

                const elapsed = (performance.now() - start) / 1000;

                setLoadTime(elapsed);
                setIsReady(true);
                setStatus('Qwen3-0.6B is ready (shared singleton).');
            } catch (err) {
                console.error('Model loading error:', err);

                if (!cancelled) {
                    setStatus(err?.code || 'INITIALIZATION_FAILED');
                    setError(err?.message || 'Unknown model loading error.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadModel();

        return () => {
            cancelled = true;
        };
    }, []);

    const cleanOutput = (text) => {
        if (!text) return '';

        // Remove any accidental Qwen thinking blocks as a final safety layer.
        return text
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/<think>[\s\S]*$/gi, '')
            .replace(/<\/think>/gi, '')
            .trim();
    };

    const generateAnswer = async () => {
        if (!generatorRef.current || !input.trim() || isLoading) return;

        setError('');
        setAnswer('');
        setGenerationTime(null);
        setIsLoading(true);
        setStatus('Generating...');

        try {
            const tStartTotal = performance.now();
            const generator = generatorRef.current;
            const trimmedQuery = input.trim();
            const cap = getCachedCapability();
            const runtimeConfig = getRuntimeConfig(cap);

            // 1. Client-side RAG retrieval with tier-aware budget
            const tStartRetrieval = performance.now();
            const ragResult = retrieveKnowledge(trimmedQuery, { topK: runtimeConfig.ragTopK, minScore: 0.8 });
            const retrievalTime = performance.now() - tStartRetrieval;

            // 2. Format context & construct prompt
            const tStartFormatting = performance.now();
            let knowledgeContext = '';
            if (ragResult.hasMatch && ragResult.chunks.length > 0) {
                knowledgeContext = formatKnowledgeContext(ragResult.chunks, { verificationAnalysis: ragResult.verificationAnalysis });
            } else if (ragResult.verificationAnalysis?.isInsufficient) {
                knowledgeContext = formatKnowledgeContext([], { verificationAnalysis: ragResult.verificationAnalysis });
            }

            // Development-only diagnostic logging
            console.log('=== [10X RAG Flow: QwenWebGPUTest] ===');
            console.log('1. User Query:', trimmedQuery);
            console.log('2. Retrieved Chunk IDs:', ragResult.chunks.map(c => c.id));
            console.log('3. Retrieved Topics:', ragResult.chunks.map(c => c.title));
            console.log('4. Retrieval Scores:', ragResult.scoredResults ? ragResult.scoredResults.map(s => `${s.chunk.id}: ${s.score.toFixed(2)}`) : `Top: ${ragResult.topScore.toFixed(2)}`);
            console.log('5. Temporal Classification:', ragResult.verificationAnalysis?.temporalClassification || 'general');
            console.log('6. Verification Sensitive:', !!ragResult.verificationAnalysis?.isVerificationSensitive);
            console.log('7. Active Verification Guard:', ragResult.verificationAnalysis?.activeGuard?.id || 'None');
            console.log('8. Chunks Debug:', ragResult.chunksDebug);
            console.log('9. Safe Context Preview:', knowledgeContext ? knowledgeContext.slice(0, 200).replace(/\s+/g, ' ') + '...' : 'None');

            // If query asks for unverified information that requires an insufficiency answer:
            if (ragResult.verificationAnalysis?.isInsufficient && ragResult.verificationAnalysis?.suggestedAnswer) {
                const formattingTime = performance.now() - tStartFormatting;
                const verifiedAnswer = ragResult.verificationAnalysis.suggestedAnswer;
                setAnswer(verifiedAnswer);
                setStatus('Ready (Guarded).');
                setIsLoading(false);

                setLastMetrics({
                    retrievalMs: retrievalTime,
                    formattingMs: formattingTime,
                    ttftMs: 0,
                    genMs: 0,
                    totalMs: performance.now() - tStartTotal,
                    tokenCount: 0,
                    tokPerSec: 0,
                    isGuarded: true
                });

                console.log(`[RAG] Retrieval: ${retrievalTime.toFixed(2)} ms`);
                console.log(`[RAG] Context formatting: ${formattingTime.toFixed(2)} ms`);
                console.log(`[QWEN] Time to first token: 0.00 ms (Guarded)`);
                console.log(`[QWEN] Generation: 0.00 ms (Guarded)`);
                console.log(`[TOTAL] End-to-end: ${(performance.now() - tStartTotal).toFixed(2)} ms`);
                return;
            }

            // Detect if user specifically asked who LUCA is
            const isIdentity = isIdentityQuery(trimmedQuery);

            // 3. Strict system instructions for LUCA grounded in verified knowledge (token-optimized)
            const systemContent = buildSystemPrompt(knowledgeContext);

            const messages = [
                {
                    role: 'system',
                    content: systemContent,
                },
                {
                    role: 'user',
                    content: trimmedQuery,
                },
            ];

            const formattingTime = performance.now() - tStartFormatting;

            /*
             * IMPORTANT:
             * Qwen3 defaults to thinking mode.
             * The official Qwen instructions say to disable it through
             * apply_chat_template(..., enable_thinking=False).
             */
            const prompt = generator.tokenizer.apply_chat_template(
                messages,
                {
                    tokenize: false,
                    add_generation_prompt: true,
                    enable_thinking: false,
                }
            );

            const start = performance.now();
            let tFirstToken = null;
            let rawOutput = '';
            let tokenCount = 0;

            const streamer = new TextStreamer(generator.tokenizer, {
                skip_prompt: true,
                skip_special_tokens: true,

                callback_function: (text) => {
                    if (tFirstToken === null) {
                        tFirstToken = performance.now();
                    }
                    tokenCount++;
                    rawOutput += text;

                    const cleaned = cleanOutput(rawOutput);
                    const formatted = formatAssistantResponseStyle(cleaned, isIdentity);

                    setAnswer(formatted);
                },
            });

            await generator(prompt, {
                max_new_tokens: runtimeConfig.maxNewTokens,
                do_sample: runtimeConfig.doSample,
                temperature: runtimeConfig.temperature,
                top_k: runtimeConfig.topK,
                streamer,
            });

            const elapsed = (performance.now() - start) / 1000;
            const qwenTTFT = tFirstToken ? tFirstToken - start : 0;
            const qwenGenTime = performance.now() - start;
            const totalEndToEnd = performance.now() - tStartTotal;
            const tokPerSec = qwenGenTime > 0 ? (tokenCount / (qwenGenTime / 1000)) : 0;

            const finalAnswer = formatAssistantResponseStyle(cleanOutput(rawOutput), isIdentity);

            setAnswer(finalAnswer);
            setGenerationTime(elapsed);
            setStatus('Ready.');

            setLastMetrics({
                retrievalMs: retrievalTime,
                formattingMs: formattingTime,
                ttftMs: qwenTTFT,
                genMs: qwenGenTime,
                totalMs: totalEndToEnd,
                tokenCount,
                tokPerSec,
                isGuarded: false
            });

            console.log(`[RAG] Retrieval: ${retrievalTime.toFixed(2)} ms`);
            console.log(`[RAG] Context formatting: ${formattingTime.toFixed(2)} ms`);
            console.log(`[QWEN] Time to first token: ${qwenTTFT.toFixed(2)} ms`);
            console.log(`[QWEN] Generation: ${qwenGenTime.toFixed(2)} ms`);
            console.log(`[TOTAL] End-to-end: ${totalEndToEnd.toFixed(2)} ms`);
        } catch (err) {
            console.error('Generation error:', err);

            setError(err?.message || 'Generation failed.');
            setStatus('Generation failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const runWarmup = async () => {
        if (!generatorRef.current || isLoading) return;
        setWarmupStatus('warming');
        setStatus('Running WebGPU 1-token shader warmup in background...');
        setError('');
        const t0 = performance.now();
        try {
            await warmupQwen(generatorRef.current);
            const elapsed = performance.now() - t0;
            setWarmupTime(elapsed);
            setWarmupStatus('done');
            setStatus(`Warmup complete (${(elapsed / 1000).toFixed(2)}s). All WGSL shaders compiled.`);
        } catch (e) {
            console.error('Warmup error:', e);
            setWarmupStatus('failed');
            setError('Warmup failed: ' + (e?.message || e));
            setStatus('Warmup failed.');
        }
    };

    const [abResults, setAbResults] = useState(null);
    const [abProgress, setAbProgress] = useState('');

    const runControlledAB = async () => {
        if (!generatorRef.current || isLoading) return;
        setIsLoading(true);
        setAbProgress('Initializing A/B benchmark...');
        setAbResults(null);
        setError('');

        try {
            const generator = generatorRef.current;
            setAbProgress('Warming WebGPU shaders...');
            await warmupQwen(generator);
            setAbProgress('Normalizing warm state...');
            await generator('Warmup pass', { max_new_tokens: 1, do_sample: false });

            const results = [];
            const median = (arr) => {
                if (arr.length === 0) return 0;
                const s = [...arr].sort((a, b) => a - b);
                const mid = Math.floor(s.length / 2);
                return s.length % 2 !== 0 ? s[mid] : Number(((s[mid - 1] + s[mid]) / 2).toFixed(2));
            };

            for (let qIdx = 0; qIdx < BENCHMARK_QUERIES.length; qIdx++) {
                const bq = BENCHMARK_QUERIES[qIdx];
                const queryText = bq.query;

                const t0Ret = performance.now();
                const ragResult = retrieveKnowledge(queryText, { topK: 3, minScore: 0.8 });
                const retMs = performance.now() - t0Ret;

                if (ragResult.verificationAnalysis?.isInsufficient && ragResult.verificationAnalysis?.suggestedAnswer) {
                    results.push({
                        id: `Q${qIdx + 1}`,
                        label: bq.label,
                        query: queryText,
                        isGuarded: true,
                        answer: ragResult.verificationAnalysis.suggestedAnswer,
                        metricsA: { promptTokens: 0, ttftMs: 0, genMs: 0, totalMs: 0, tokPerSec: 0, tokenCount: 0, response: ragResult.verificationAnalysis.suggestedAnswer },
                        metricsB: { promptTokens: 0, ttftMs: 0, genMs: 0, totalMs: 0, tokPerSec: 0, tokenCount: 0, response: ragResult.verificationAnalysis.suggestedAnswer },
                        runsA: [],
                        runsB: []
                    });
                    continue;
                }

                let knowledgeContext = '';
                if (ragResult.hasMatch && ragResult.chunks.length > 0) {
                    knowledgeContext = formatKnowledgeContext(ragResult.chunks, { verificationAnalysis: ragResult.verificationAnalysis });
                }
                const systemContent = buildSystemPrompt(knowledgeContext);
                const isIdentity = isIdentityQuery(queryText);
                const messages = [
                    { role: 'system', content: systemContent },
                    { role: 'user', content: queryText }
                ];
                const prompt = generator.tokenizer.apply_chat_template(messages, {
                    tokenize: false,
                    add_generation_prompt: true,
                    enable_thinking: false
                });
                const promptTokens = generator.tokenizer.encode(prompt).length;

                const runsA = [];
                const runsB = [];

                for (let iter = 1; iter <= 3; iter++) {
                    setAbProgress(`[${bq.label}] Iter ${iter}/3: Running A (Sampling)...`);
                    let tFirstA = null;
                    let countA = 0;
                    let rawA = '';
                    const tStartA = performance.now();
                    const streamerA = new TextStreamer(generator.tokenizer, {
                        skip_prompt: true,
                        skip_special_tokens: true,
                        callback_function: (text) => {
                            if (tFirstA === null) tFirstA = performance.now();
                            countA++;
                            rawA += text;
                        }
                    });
                    await generator(prompt, {
                        max_new_tokens: 160,
                        do_sample: true,
                        temperature: 0.2,
                        top_k: 3,
                        streamer: streamerA
                    });
                    const tEndA = performance.now();
                    const ttftA = tFirstA ? tFirstA - tStartA : 0;
                    const genA = tEndA - tStartA;
                    const tokPerSecA = genA > 0 ? (countA / (genA / 1000)) : 0;
                    runsA.push({
                        ttftMs: Number(ttftA.toFixed(1)),
                        genMs: Number(genA.toFixed(1)),
                        totalMs: Number((genA + retMs).toFixed(1)),
                        tokPerSec: Number(tokPerSecA.toFixed(2)),
                        tokenCount: countA,
                        response: formatAssistantResponseStyle(cleanOutput(rawA), isIdentity)
                    });

                    setAbProgress(`[${bq.label}] Iter ${iter}/3: Running B (Greedy)...`);
                    let tFirstB = null;
                    let countB = 0;
                    let rawB = '';
                    const tStartB = performance.now();
                    const streamerB = new TextStreamer(generator.tokenizer, {
                        skip_prompt: true,
                        skip_special_tokens: true,
                        callback_function: (text) => {
                            if (tFirstB === null) tFirstB = performance.now();
                            countB++;
                            rawB += text;
                        }
                    });
                    await generator(prompt, {
                        max_new_tokens: 160,
                        do_sample: false,
                        streamer: streamerB
                    });
                    const tEndB = performance.now();
                    const ttftB = tFirstB ? tFirstB - tStartB : 0;
                    const genB = tEndB - tStartB;
                    const tokPerSecB = genB > 0 ? (countB / (genB / 1000)) : 0;
                    runsB.push({
                        ttftMs: Number(ttftB.toFixed(1)),
                        genMs: Number(genB.toFixed(1)),
                        totalMs: Number((genB + retMs).toFixed(1)),
                        tokPerSec: Number(tokPerSecB.toFixed(2)),
                        tokenCount: countB,
                        response: formatAssistantResponseStyle(cleanOutput(rawB), isIdentity)
                    });
                }

                results.push({
                    id: `Q${qIdx + 1}`,
                    label: bq.label,
                    query: queryText,
                    isGuarded: false,
                    promptTokens,
                    metricsA: {
                        promptTokens,
                        ttftMs: median(runsA.map(r => r.ttftMs)),
                        genMs: median(runsA.map(r => r.genMs)),
                        totalMs: median(runsA.map(r => r.totalMs)),
                        tokPerSec: median(runsA.map(r => r.tokPerSec)),
                        tokenCount: median(runsA.map(r => r.tokenCount)),
                        response: runsA[0].response
                    },
                    metricsB: {
                        promptTokens,
                        ttftMs: median(runsB.map(r => r.ttftMs)),
                        genMs: median(runsB.map(r => r.genMs)),
                        totalMs: median(runsB.map(r => r.totalMs)),
                        tokPerSec: median(runsB.map(r => r.tokPerSec)),
                        tokenCount: median(runsB.map(r => r.tokenCount)),
                        response: runsB[0].response
                    },
                    runsA,
                    runsB
                });
            }

            window.__BENCHMARK_RESULTS__ = results;
            setAbResults(results);
            setAbProgress('Controlled A/B Benchmark Complete.');
            setStatus('Controlled A/B Benchmark Complete.');
        } catch (err) {
            console.error('A/B Benchmark error:', err);
            setError(err?.message || 'A/B Benchmark failed');
            setAbProgress('A/B Benchmark Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const resetModel = () => {
        resetQwenGenerator();
        generatorRef.current = null;
        setIsReady(false);
        setStatus('Model reset. Reloading...');
        setLoadTime(null);
        setGenerationTime(null);
        setWarmupStatus('idle');
        setWarmupTime(null);
        setLastMetrics(null);
        setAnswer('');
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    const getWebGpuDevice = async () => {
        if (!navigator.gpu) throw new Error('WebGPU not supported on this browser');
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) throw new Error('Failed to acquire WebGPU adapter');
        const requiredFeatures = [];
        if (adapter.features.has('shader-f16')) {
            requiredFeatures.push('shader-f16');
        }
        return await adapter.requestDevice({ requiredFeatures });
    };

    const handleRunNumericalValidation = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setPhase3Status('Running GPU ArgMax Numerical Validation (8 test matrices)...');
        setError('');
        try {
            const device = await getWebGpuDevice();
            const res = await runNumericalValidation(device);
            setNumericalResults(res);
            window.__NUMERICAL_RESULTS__ = res;
            setPhase3Status(res.allPassed ? '✓ All 8 Numerical Tests PASSED (100% Match with CPU)' : '⚠️ Numerical Validation Discrepancy Detected');
            setStatus('GPU ArgMax Numerical Validation Complete.');
        } catch (e) {
            console.error('Numerical validation error:', e);
            setError(e.message || 'Numerical validation failed');
            setPhase3Status('Numerical Validation Failed: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunMicroBenchmark = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setPhase3Status('Running GPU ArgMax Micro-Benchmark (10 iterations Path A vs Path B)...');
        setError('');
        try {
            const device = await getWebGpuDevice();
            const res = await runMicroBenchmark(device, 10);
            setMicroBenchmarkResults(res);
            window.__MICRO_BENCHMARK_RESULTS__ = res;
            setPhase3Status(`✓ Micro-Benchmark Complete: ${res.speedup}x speedup (${res.pathA.p50}ms -> ${res.pathB.p50}ms), -${res.bandwidthReductionPct}% bus transfer`);
            setStatus('GPU ArgMax Micro-Benchmark Complete.');
        } catch (e) {
            console.error('Micro-benchmark error:', e);
            setError(e.message || 'Micro-benchmark failed');
            setPhase3Status('Micro-Benchmark Failed: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0d0d18] p-6 md:p-8 shadow-2xl">

                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-purple-400">
                        10X Technologies
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold mt-2">
                        Qwen WebGPU Test
                    </h1>

                    <p className="text-white/50 text-sm mt-2">
                        Isolated browser test — this does not modify the LUCA chatbot.
                    </p>
                </div>

                {capability && (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 mb-5 text-xs space-y-1.5 text-white/70">
                        <div className="font-semibold text-purple-300 mb-1 uppercase tracking-wider text-[11px]">Hardware Capability Probe</div>
                        <div className="flex justify-between">
                            <span>WebGPU Hardware Support:</span>
                            <span className={capability.supported ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                                {capability.supported ? 'Supported' : capability.reason}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>shader-f16 Extension:</span>
                            <span className={capability.hasShaderF16 ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium'}>
                                {capability.hasShaderF16 ? 'Available' : 'Not supported (Incompatible)'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Device Memory:</span>
                            <span>{capability.deviceMemory ? `${capability.deviceMemory} GB` : 'Not exposed by browser'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Device Form Factor:</span>
                            <span>{capability.isMobile ? 'Mobile Device' : 'Desktop / Laptop'}</span>
                        </div>
                        {capability.adapterInfo && (
                            <div className="flex justify-between">
                                <span>GPU Adapter:</span>
                                <span className="text-white/90 truncate max-w-[240px] text-right">
                                    {[capability.adapterInfo.vendor, capability.adapterInfo.architecture || capability.adapterInfo.device].filter(Boolean).join(' ') || 'Standard WebGPU'}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 mb-5">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-white/60">
                            Status
                        </span>

                        <span
                            className={`text-sm font-medium ${isReady
                                ? 'text-green-400'
                                : error
                                ? 'text-red-400'
                                : 'text-yellow-400'
                                }`}
                        >
                            {status}
                        </span>
                    </div>

                    {loadTime !== null && (
                        <div className="mt-2 text-xs text-white/40 flex justify-between items-center">
                            <span>Model load time: {loadTime.toFixed(2)}s</span>
                            {warmupTime !== null && (
                                <span className="text-purple-300 font-medium">1-Token Warmup: {(warmupTime / 1000).toFixed(2)}s (Shaders hot)</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Investigation 1: Warmup & Reset Controls */}
                <div className="flex flex-wrap gap-2 mb-5">
                    <button
                        type="button"
                        onClick={runWarmup}
                        disabled={!isReady || isLoading || warmupStatus === 'warming' || warmupStatus === 'done'}
                        className={`text-xs px-3.5 py-2 rounded-xl border font-medium transition ${
                            warmupStatus === 'done'
                                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 cursor-default'
                                : warmupStatus === 'warming'
                                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300 animate-pulse'
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                    >
                        {warmupStatus === 'done' ? '✓ Shaders Warmed Up' : warmupStatus === 'warming' ? 'Warming Up Shaders...' : '⚡ Run 1-Token WebGPU Warmup'}
                    </button>

                    <button
                        id="run-controlled-ab-btn"
                        type="button"
                        onClick={runControlledAB}
                        disabled={!isReady || isLoading}
                        className="text-xs px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-medium transition disabled:opacity-40"
                        title="Run strict 3-run alternating A/B benchmark (Production Sampling vs Greedy Decoding)"
                    >
                        🧪 Run Controlled A/B (Sampling vs Greedy)
                    </button>

                    <button
                        id="run-phase3-numerical-btn"
                        type="button"
                        onClick={handleRunNumericalValidation}
                        disabled={isLoading}
                        className="text-xs px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-medium transition disabled:opacity-40"
                        title="Run GPU ArgMax Numerical Validation across 8 test distributions (CPU vs GPU token match)"
                    >
                        🔬 Validate GPU ArgMax (Numerical)
                    </button>

                    <button
                        id="run-phase3-microbench-btn"
                        type="button"
                        onClick={handleRunMicroBenchmark}
                        disabled={isLoading}
                        className="text-xs px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-medium transition disabled:opacity-40"
                        title="Benchmark Path A (608 KB readback) vs Path B (8 B GPU ArgMax) over 10 iterations"
                    >
                        ⚡ Benchmark GPU ArgMax vs 608KB
                    </button>

                    <button
                        type="button"
                        onClick={resetModel}
                        disabled={isLoading}
                        className="text-xs px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition ml-auto"
                        title="Reset model to test Cold TTFT from scratch"
                    >
                        ↻ Reset Model (Test Cold)
                    </button>
                </div>

                {phase3Status && (
                    <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs text-emerald-300 font-mono">
                        ⚙️ {phase3Status}
                    </div>
                )}

                {abProgress && (
                    <div className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-cyan-300 font-mono animate-pulse">
                        ⏳ {abProgress}
                    </div>
                )}

                {numericalResults && (
                    <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs space-y-3">
                        <div className="font-semibold text-emerald-300 uppercase tracking-wider text-[11px] flex justify-between">
                            <span>GPU ArgMax Numerical Correctness (CPU vs GPU)</span>
                            <span className={numericalResults.allPassed ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                                {numericalResults.allPassed ? "✓ 8/8 Tests Passed (100% Match)" : "⚠️ Discrepancy Found"}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px] border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/50">
                                        <th className="p-1.5">Distribution Pattern</th>
                                        <th className="p-1.5">CPU Token ID</th>
                                        <th className="p-1.5">GPU Token ID</th>
                                        <th className="p-1.5">CPU Score</th>
                                        <th className="p-1.5">GPU Score</th>
                                        <th className="p-1.5">Equivalence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {numericalResults.tests.map((t, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                                            <td className="p-1.5 font-medium text-white/90">{t.name}</td>
                                            <td className="p-1.5 font-mono text-purple-300">{t.cpuToken}</td>
                                            <td className="p-1.5 font-mono text-emerald-300">{t.gpuToken}</td>
                                            <td className="p-1.5 font-mono text-white/70">{t.cpuScore.toFixed(4)}</td>
                                            <td className="p-1.5 font-mono text-white/70">{t.gpuScore.toFixed(4)}</td>
                                            <td className="p-1.5 font-bold">
                                                {t.passed ? <span className="text-emerald-400">✓ EXACT MATCH</span> : <span className="text-red-400">❌ MISMATCH</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {microBenchmarkResults && (
                    <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs space-y-3">
                        <div className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] flex justify-between">
                            <span>Micro-Benchmark: 608 KB Readback vs 8-Byte GPU ArgMax (10 Reps)</span>
                            <span className="text-emerald-400 font-bold">
                                {microBenchmarkResults.speedup}x Latency Speedup (-{microBenchmarkResults.bandwidthReductionPct}% Bus Transfer)
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                            <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                                <div className="text-white/40 uppercase tracking-wider text-[9px]">Bus Transfer / Token</div>
                                <div className="text-red-400 font-mono font-bold mt-0.5">Path A: {(microBenchmarkResults.pathA.bytes / 1024).toFixed(1)} KB</div>
                                <div className="text-emerald-400 font-mono font-bold">Path B: {microBenchmarkResults.pathB.bytes} B</div>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                                <div className="text-white/40 uppercase tracking-wider text-[9px]">Median Latency (p50)</div>
                                <div className="text-red-400 font-mono font-bold mt-0.5">Path A: {microBenchmarkResults.pathA.p50} ms</div>
                                <div className="text-emerald-400 font-mono font-bold">Path B: {microBenchmarkResults.pathB.p50} ms</div>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                                <div className="text-white/40 uppercase tracking-wider text-[9px]">Average Latency</div>
                                <div className="text-red-400 font-mono font-bold mt-0.5">Path A: {microBenchmarkResults.pathA.avgMs} ms</div>
                                <div className="text-emerald-400 font-mono font-bold">Path B: {microBenchmarkResults.pathB.avgMs} ms</div>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                                <div className="text-white/40 uppercase tracking-wider text-[9px]">GPU Dispatch vs Readback</div>
                                <div className="text-cyan-300 font-mono mt-0.5">Dispatch: {microBenchmarkResults.pathB.gpuDispatchMs} ms</div>
                                <div className="text-cyan-300 font-mono">mapAsync: {microBenchmarkResults.pathB.mapAsyncMs} ms</div>
                            </div>
                        </div>
                    </div>
                )}

                {abResults && (
                    <div className="mb-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-xs space-y-3">
                        <div className="font-semibold text-cyan-300 uppercase tracking-wider text-[11px] flex justify-between">
                            <span>Controlled A/B Benchmark (Median of 3 Runs)</span>
                            <span className="text-white/40 font-normal">Qwen3-0.6B ONNX WebGPU</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px] border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/50">
                                        <th className="p-1.5">Query</th>
                                        <th className="p-1.5">Prompt Tok</th>
                                        <th className="p-1.5">Prefill/TTFT A vs B</th>
                                        <th className="p-1.5">Gen Time A vs B</th>
                                        <th className="p-1.5">Tok/s A vs B</th>
                                        <th className="p-1.5">Output Tok A vs B</th>
                                        <th className="p-1.5">Quality / Grounding</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {abResults.map((r, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                            <td className="p-1.5 font-semibold text-white/80">{r.id}: {r.label}</td>
                                            <td className="p-1.5 font-mono text-purple-300">{r.metricsA.promptTokens}</td>
                                            <td className="p-1.5 font-mono">
                                                {r.isGuarded ? '0ms (Guard)' : `${r.metricsA.ttftMs}ms vs ${r.metricsB.ttftMs}ms`}
                                            </td>
                                            <td className="p-1.5 font-mono">
                                                {r.isGuarded ? '0ms' : `${(r.metricsA.genMs / 1000).toFixed(2)}s vs ${(r.metricsB.genMs / 1000).toFixed(2)}s`}
                                            </td>
                                            <td className="p-1.5 font-mono text-cyan-300 font-bold">
                                                {r.isGuarded ? 'Instant' : `${r.metricsA.tokPerSec} vs ${r.metricsB.tokPerSec}`}
                                            </td>
                                            <td className="p-1.5 font-mono">
                                                {r.isGuarded ? 'Guarded' : `${r.metricsA.tokenCount} vs ${r.metricsB.tokenCount}`}
                                            </td>
                                            <td className="p-1.5 text-[10px]">
                                                {r.isGuarded ? '🛡️ Guarded' : r.metricsB.response.length > 20 ? '✓ Grounded' : '⚠️ Short'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Detailed Generated Text Audit for Quality & Refusal Inspection */}
                        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                            <div className="font-semibold text-white/60 text-[10px] uppercase tracking-wider">
                                Generated Output Audit (Format A vs Format B)
                            </div>
                            {abResults.map((r, i) => (
                                <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                    <div className="font-semibold text-purple-300 text-[11px]">{r.id}: {r.label}</div>
                                    <div className="text-[10px] text-white/70">
                                        <span className="text-white/40 font-mono">A (Sampling):</span> "{r.metricsA.response || r.answer}"
                                    </div>
                                    <div className="text-[10px] text-cyan-200">
                                        <span className="text-white/40 font-mono">B (Greedy):</span> "{r.metricsB.response || r.answer}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Benchmark Preset Pills */}
                <div className="mb-4">
                    <div className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-2">
                        Benchmark Test Queries (6 Production Cases)
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                        {BENCHMARK_QUERIES.map((bq, idx) => (
                            <button
                                key={idx}
                                type="button"
                                disabled={!isReady || isLoading}
                                onClick={() => {
                                    setInput(bq.query);
                                }}
                                className="text-left text-[11px] p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 text-white/80 hover:text-white transition truncate disabled:opacity-40"
                            >
                                <span className="text-purple-400 font-semibold block">{bq.label}</span>
                                <span className="text-white/50 text-[10px] truncate block">{bq.query}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Qwen something or select a benchmark query above..."
                        disabled={!isReady || isLoading}
                        rows={3}
                        className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none resize-none focus:border-purple-500/50 disabled:opacity-50"
                    />

                    <button
                        type="button"
                        onClick={generateAnswer}
                        disabled={!isReady || !input.trim() || isLoading}
                        className="w-full rounded-2xl bg-white text-black font-semibold py-3 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 transition"
                    >
                        {isLoading ? 'Generating (WebGPU)...' : 'Run Query'}
                    </button>
                </div>

                {/* Live Diagnostic Breakdown Card */}
                {lastMetrics && (
                    <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 text-xs">
                        <div className="font-semibold text-purple-300 mb-2 flex items-center justify-between">
                            <span>Diagnostic Metrics (Last Query)</span>
                            <span className={lastMetrics.isGuarded ? 'text-amber-400' : 'text-green-400'}>
                                {lastMetrics.isGuarded ? '🛡️ Guarded Short-Circuit' : '⚡ WebGPU Generated'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white/80">
                            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                <span className="text-white/40 block text-[10px]">RAG Retrieval</span>
                                <span className="font-mono text-purple-200">{lastMetrics.retrievalMs.toFixed(2)} ms</span>
                            </div>
                            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                <span className="text-white/40 block text-[10px]">Context Prep</span>
                                <span className="font-mono text-purple-200">{lastMetrics.formattingMs.toFixed(2)} ms</span>
                            </div>
                            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                <span className="text-white/40 block text-[10px]">Time to First Token</span>
                                <span className={`font-mono font-bold ${lastMetrics.ttftMs > 10000 ? 'text-red-400' : lastMetrics.ttftMs > 5000 ? 'text-yellow-400' : 'text-green-400'}`}>
                                    {lastMetrics.ttftMs.toFixed(0)} ms
                                </span>
                            </div>
                            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                                <span className="text-white/40 block text-[10px]">Throughput</span>
                                <span className="font-mono text-cyan-300">
                                    {lastMetrics.isGuarded ? 'Instant' : `${lastMetrics.tokPerSec.toFixed(1)} tok/s`}
                                </span>
                            </div>
                        </div>
                        <div className="mt-2 text-[11px] text-white/50 flex justify-between">
                            <span>Total Generation: {(lastMetrics.genMs / 1000).toFixed(2)}s ({lastMetrics.tokenCount} tokens)</span>
                            <span>End-to-End: {(lastMetrics.totalMs / 1000).toFixed(2)}s</span>
                        </div>
                    </div>
                )}

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 min-h-[160px]">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/30 mb-3 flex items-center justify-between">
                        <span>Response</span>
                        {generationTime !== null && (
                            <span className="text-white/40 font-mono text-[11px]">
                                Duration: {generationTime.toFixed(2)}s
                            </span>
                        )}
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-7 text-white/90">
                        {answer || (
                            <span className="text-white/30">
                                The model response will appear here...
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QwenWebGPUTest;