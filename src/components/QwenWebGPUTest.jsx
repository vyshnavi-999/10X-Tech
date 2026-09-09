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
    getRuntimeConfig
} from '../services/qwenService.js';

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

            const streamer = new TextStreamer(generator.tokenizer, {
                skip_prompt: true,
                skip_special_tokens: true,

                callback_function: (text) => {
                    if (tFirstToken === null) {
                        tFirstToken = performance.now();
                    }
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

            const finalAnswer = formatAssistantResponseStyle(cleanOutput(rawOutput), isIdentity);

            setAnswer(finalAnswer);
            setGenerationTime(elapsed);
            setStatus('Ready.');

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
                        <div className="mt-2 text-xs text-white/40">
                            Model load time: {loadTime.toFixed(2)}s
                        </div>
                    )}
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
                        placeholder="Ask Qwen something..."
                        disabled={!isReady || isLoading}
                        rows={4}
                        className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none resize-none focus:border-purple-500/50 disabled:opacity-50"
                    />

                    <button
                        type="button"
                        onClick={generateAnswer}
                        disabled={!isReady || !input.trim() || isLoading}
                        className="w-full rounded-2xl bg-white text-black font-semibold py-3 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 transition"
                    >
                        {isLoading ? 'Working...' : 'Ask Qwen'}
                    </button>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 min-h-[160px]">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/30 mb-3">
                        Response
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-7 text-white/90">
                        {answer || (
                            <span className="text-white/30">
                                The model response will appear here...
                            </span>
                        )}
                    </div>
                </div>

                {generationTime !== null && (
                    <div className="mt-4 text-xs text-white/40">
                        Generation time: {generationTime.toFixed(2)}s
                    </div>
                )}
            </div>
        </div>
    );
};

export default QwenWebGPUTest;