import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mic, Sparkles, MessageSquare, Plus, Trash2, Bot, User } from 'lucide-react';
import Starfield from '../components/Starfield';
import {
  retrieveKnowledge,
  formatKnowledgeContext,
  buildSystemPrompt,
  formatAssistantResponseStyle,
  isIdentityQuery
} from '../knowledge/index.js';
import {
  getQwenGenerator,
  generateQwenResponse,
  isWebGPUSupported,
  isModelReady,
  probeDeviceCapability,
  getCachedCapability,
  getRuntimeConfig,
  RUNTIME_TIERS,
  subscribeState
} from '../services/qwenService.js';

const SpacePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialQuery = state?.initialQuery ?? '';

  const [messages, setMessages] = useState([
    { 
      id: 'welcome', 
      sender: 'assistant', 
      text: 'Hello! I am LUCA, your AI assistant for 10X Technologies. Ask me anything about our Akshara models, Libre OS, the LUCA smart speaker, or our research!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modelStatus, setModelStatus] = useState(() => {
    if (isModelReady()) return 'ready';
    const cached = getCachedCapability();
    if (cached && !cached.supported) return cached.reason;
    return 'checking';
  });
  const [modelProgress, setModelProgress] = useState('');
  const [statusMessage, setStatusMessage] = useState(() => {
    const cached = getCachedCapability();
    return cached && !cached.supported ? cached.message : '';
  });
  const [hasLowMemory, setHasLowMemory] = useState(() => {
    const cached = getCachedCapability();
    return cached ? !!cached.hasLowMemory : false;
  });
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Subscribe to Qwen model lifecycle state changes (including device loss recovery)
  useEffect(() => {
    let mounted = true;

    // Listen to singleton state transitions
    const unsubscribe = subscribeState((state, detail) => {
      if (!mounted) return;
      if (state === 'ready') {
        setModelStatus('ready');
        setModelProgress('');
        setStatusMessage('');
      } else if (state === 'device_lost') {
        setModelStatus('error');
        setStatusMessage('WebGPU device was lost. Please send a message to reinitialize.');
      } else if (state === 'UNSUPPORTED_SHADER_F16' || state === 'UNSUPPORTED_LOCAL_WEBGPU' || state === 'INSUFFICIENT_DEVICE_RESOURCES') {
        setModelStatus(state);
        if (detail?.message) setStatusMessage(detail.message);
      } else if (state === 'INITIALIZATION_FAILED') {
        setModelStatus('INITIALIZATION_FAILED');
        setStatusMessage(detail?.message || 'Failed to initialize local AI model on this device.');
      }
    });

    if (isModelReady()) {
      setModelStatus('ready');
      return () => {
        mounted = false;
        unsubscribe();
      };
    }

    probeDeviceCapability().then((cap) => {
      if (!mounted) return;

      if (cap.hasLowMemory) {
        setHasLowMemory(true);
      }

      if (!cap.supported) {
        setModelStatus(cap.reason);
        setStatusMessage(cap.message);
        return;
      }

      setModelStatus('loading');
      setStatusMessage(
        cap.hasLowMemory
          ? 'Your device has limited available memory, so startup may take a little longer.'
          : 'Preparing LUCA AI...'
      );

      getQwenGenerator((progress) => {
        if (!mounted) return;
        if (progress.status === 'progress' && progress.total) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          setModelProgress(`${pct}%`);
          setStatusMessage(`Preparing LUCA AI (${pct}%)...`);
        } else if (progress.status === 'done') {
          setModelProgress('');
          setStatusMessage('Compiling shaders for your GPU...');
        }
      })
        .then(() => {
          if (mounted) {
            setModelStatus('ready');
            setModelProgress('');
            setStatusMessage('');
          }
        })
        .catch((err) => {
          console.error('Qwen WebGPU model loading error:', err);
          if (mounted) {
            const errCode = err.code || 'INITIALIZATION_FAILED';
            setModelStatus(errCode);
            setStatusMessage(err.message || 'Failed to initialize local AI model on this device.');
          }
        });
    });

    return () => {
      mounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Handle initial query from home page
  useEffect(() => {
    if (initialQuery.trim()) {
      // Small timeout to allow the transition animation to complete
      const timer = setTimeout(() => {
        handleSendMessage(initialQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend || !textToSend.trim() || isTyping) return;

    const tStartTotal = performance.now();

    const trimmedInput = textToSend.trim();
    // Add user message to conversation
    const userMsg = { id: Date.now().toString(), sender: 'user', text: trimmedInput };
    const replyMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: replyMsgId, sender: 'assistant', text: '' },
    ]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Retrieve relevant verified knowledge chunks client-side with tier-aware budget
      const cap = getCachedCapability();
      const runtimeConfig = getRuntimeConfig(cap);

      const tStartRetrieval = performance.now();
      const ragResult = retrieveKnowledge(trimmedInput, { topK: runtimeConfig.ragTopK, minScore: 0.8 });
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
      console.log('=== [10X RAG Flow: SpacePage] ===');
      console.log('1. User Query:', trimmedInput);
      console.log('2. Retrieved Chunk IDs:', ragResult.chunks.map(c => c.id));
      console.log('3. Retrieved Topics:', ragResult.chunks.map(c => c.title));
      console.log('4. Retrieval Scores:', ragResult.scoredResults ? ragResult.scoredResults.map(s => `${s.chunk.id}: ${s.score.toFixed(2)}`) : `Top: ${ragResult.topScore.toFixed(2)}`);
      console.log('5. Temporal Classification:', ragResult.verificationAnalysis?.temporalClassification || 'general');
      console.log('6. Verification Sensitive:', !!ragResult.verificationAnalysis?.isVerificationSensitive);
      console.log('7. Active Verification Guard:', ragResult.verificationAnalysis?.activeGuard?.id || 'None');
      console.log('8. Chunks Debug:', ragResult.chunksDebug);
      console.log('9. Safe Context Preview:', knowledgeContext ? knowledgeContext.slice(0, 200).replace(/\s+/g, ' ') + '...' : 'None');

      // 2. Check if query asks for unverified information that requires an insufficiency answer
      if (ragResult.verificationAnalysis?.isInsufficient && ragResult.verificationAnalysis?.suggestedAnswer) {
        const formattingTime = performance.now() - tStartFormatting;
        const verifiedAnswer = ragResult.verificationAnalysis.suggestedAnswer;
        const words = verifiedAnswer.split(' ');
        let accumulated = '';
        const tStartStream = performance.now();
        let tFirstToken = null;

        for (let i = 0; i < words.length; i++) {
          if (tFirstToken === null) {
            tFirstToken = performance.now();
          }
          accumulated += (i === 0 ? '' : ' ') + words[i];
          setMessages((prev) =>
            prev.map((msg) => (msg.id === replyMsgId ? { ...msg, text: accumulated } : msg))
          );
          if (i < words.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
        }

        const tEndStream = performance.now();
        const ttft = tFirstToken ? tFirstToken - tStartStream : 0;
        const genTime = tEndStream - tStartStream;
        const totalTime = performance.now() - tStartTotal;

        console.log(`[RAG] Retrieval: ${retrievalTime.toFixed(2)} ms`);
        console.log(`[RAG] Context formatting: ${formattingTime.toFixed(2)} ms`);
        console.log(`[QWEN] Time to first token: ${ttft.toFixed(2)} ms`);
        console.log(`[QWEN] Generation: ${genTime.toFixed(2)} ms`);
        console.log(`[TOTAL] End-to-end: ${totalTime.toFixed(2)} ms`);

        return;
      }

      // 3. Strict system instructions for LUCA grounded in verified knowledge (token-optimized)
      const systemContent = buildSystemPrompt(knowledgeContext);

      // Check if local inference cannot run on this hardware
      if (!isModelReady() && modelStatus !== 'ready' && modelStatus !== 'loading') {
        const detailMsg = statusMessage || cap?.message || 'Local WebGPU inference is unavailable on this device.';
        const responseText = `LUCA runs locally inside your browser via WebGPU. On this device, local AI model execution cannot start: ${detailMsg}\n\nPlease open this page on a desktop computer or a device with WebGPU support to run conversational inference.`;

        setMessages((prev) =>
          prev.map((msg) => (msg.id === replyMsgId ? { ...msg, text: responseText } : msg))
        );
        return;
      }

      // 4. Assemble chat messages for Qwen with adaptive conversation history
      const recentHistory = messages
        .filter((m) => m.id !== 'welcome' && m.text && m.text.trim())
        .slice(runtimeConfig.historyLimit)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      const chatMessages = [
        { role: 'system', content: systemContent },
        ...recentHistory,
        { role: 'user', content: trimmedInput },
      ];

      const formattingTime = performance.now() - tStartFormatting;

      // Detect if user specifically asked who LUCA is
      const isIdentity = isIdentityQuery(trimmedInput);

      // 5. Stream response using Qwen3-0.6B WebGPU
      let accumulated = '';
      const tStartQwen = performance.now();
      let tFirstToken = null;

      const finalReply = await generateQwenResponse(chatMessages, {
        maxNewTokens: runtimeConfig.maxNewTokens,
        temperature: runtimeConfig.temperature,
        topK: runtimeConfig.topK,
        doSample: runtimeConfig.doSample,
        onToken: (chunk) => {
          if (tFirstToken === null) {
            tFirstToken = performance.now();
          }
          accumulated = chunk;
          const formatted = formatAssistantResponseStyle(chunk, isIdentity);
          setMessages((prev) =>
            prev.map((msg) => (msg.id === replyMsgId ? { ...msg, text: formatted } : msg))
          );
        },
      });

      const tEndQwen = performance.now();
      const qwenTTFT = tFirstToken ? tFirstToken - tStartQwen : 0;
      const qwenGenTime = tEndQwen - tStartQwen;
      const totalEndToEnd = performance.now() - tStartTotal;

      const formattedFinal = formatAssistantResponseStyle(finalReply || accumulated, isIdentity);

      if (formattedFinal) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === replyMsgId ? { ...msg, text: formattedFinal } : msg))
        );
      }

      console.log(`[RAG] Retrieval: ${retrievalTime.toFixed(2)} ms`);
      console.log(`[RAG] Context formatting: ${formattingTime.toFixed(2)} ms`);
      console.log(`[QWEN] Time to first token: ${qwenTTFT.toFixed(2)} ms`);
      console.log(`[QWEN] Generation: ${qwenGenTime.toFixed(2)} ms`);
      console.log(`[TOTAL] End-to-end: ${totalEndToEnd.toFixed(2)} ms`);
    } catch (err) {
      console.error('Chatbot generation error:', err);
      const cap = getCachedCapability();
      const reasonMsg = err.message || statusMessage || 'Model inference error';
      const errorMsg = !cap?.supported
        ? `Local WebGPU inference is not available on this device: ${reasonMsg}. Please use a desktop browser or supported device.`
        : `I encountered an issue generating a response: ${reasonMsg}. Please try asking again.`;

      setMessages((prev) =>
        prev.map((msg) => (msg.id === replyMsgId ? { ...msg, text: errorMsg } : msg))
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      { 
        id: 'welcome', 
        sender: 'assistant', 
        text: 'Chat cleared. How can I help you now?' 
      }
    ]);
  };

  return (
    <div className="fixed inset-0 flex bg-[#07070f] text-white font-sans overflow-hidden">
      {/* Fullscreen Space Background */}
      <div className="fixed top-0 left-0 right-0 w-full h-[100svh] pointer-events-none z-0 overflow-hidden">
        <Starfield />
      </div>

      {/* Sidebar - Desktop only */}
      <div className="hidden md:flex flex-col w-64 bg-[#0d0d18]/90 backdrop-blur-md border-r border-white/[0.07] z-10 shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <span className="font-semibold text-sm tracking-wide text-white/90">LUCA Space</span>
          </div>
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-200"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleClearChat}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Chat History Placeholder */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-wider text-white/30 px-3 py-1 font-bold">
            Recent Chats
          </div>
          <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-left text-xs font-medium text-purple-300">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="truncate">Active Chat</span>
          </button>
        </div>

        {/* Developer Info Footer */}
        <div className="p-4 border-t border-white/[0.07] bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white/90">LUCA Engine</div>
              <div className="text-[10px] text-white/40">
                {modelStatus === 'ready'
                  ? 'Qwen3-0.6B ONNX / WebGPU'
                  : modelStatus === 'loading'
                  ? statusMessage || `Loading model${modelProgress ? ` ${modelProgress}` : '...'}`
                  : modelStatus === 'UNSUPPORTED_SHADER_F16'
                  ? 'Shader-f16 unsupported'
                  : modelStatus === 'UNSUPPORTED_LOCAL_WEBGPU'
                  ? 'WebGPU unavailable'
                  : modelStatus === 'INSUFFICIENT_DEVICE_RESOURCES'
                  ? 'Limited device memory'
                  : modelStatus === 'INITIALIZATION_FAILED'
                  ? 'Initialization failed'
                  : modelStatus === 'error'
                  ? 'WebGPU offline'
                  : 'Checking hardware...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col h-full relative z-10 bg-transparent">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#0d0d18]/90 backdrop-blur-md border-b border-white/[0.07] shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[13px] font-medium shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-px h-4 bg-white/10 shrink-0" />
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  modelStatus === 'ready'
                    ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse'
                    : modelStatus === 'loading'
                    ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse'
                    : modelStatus === 'error' || modelStatus === 'INITIALIZATION_FAILED'
                    ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'
                    : ['UNSUPPORTED_SHADER_F16', 'UNSUPPORTED_LOCAL_WEBGPU', 'INSUFFICIENT_DEVICE_RESOURCES'].includes(modelStatus)
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'bg-purple-400 animate-pulse'
                }`}
              />
              <span className="text-white/80 text-[13px] font-medium truncate">
                {modelStatus === 'ready'
                  ? 'LUCA AI (Qwen WebGPU)'
                  : modelStatus === 'loading'
                  ? `LUCA AI (${statusMessage || `Loading model${modelProgress ? ` ${modelProgress}` : '...'}`})`
                  : modelStatus === 'UNSUPPORTED_SHADER_F16'
                  ? 'LUCA AI (GPU Incompatible)'
                  : modelStatus === 'UNSUPPORTED_LOCAL_WEBGPU'
                  ? 'LUCA AI (WebGPU Unavailable)'
                  : modelStatus === 'INSUFFICIENT_DEVICE_RESOURCES'
                  ? 'LUCA AI (Limited Memory)'
                  : modelStatus === 'INITIALIZATION_FAILED'
                  ? 'LUCA AI (Startup Failed)'
                  : modelStatus === 'error'
                  ? 'LUCA AI (WebGPU Offline)'
                  : 'LUCA AI'}
              </span>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Hardware Status / Capability Notice Bar */}
        {['UNSUPPORTED_SHADER_F16', 'UNSUPPORTED_LOCAL_WEBGPU', 'INSUFFICIENT_DEVICE_RESOURCES', 'INITIALIZATION_FAILED'].includes(modelStatus) && (
          <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-200 text-xs flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>{statusMessage || 'Local WebGPU inference is unavailable on this device.'}</span>
          </div>
        )}
        {hasLowMemory && modelStatus === 'loading' && (
          <div className="px-5 py-2 bg-purple-500/10 border-b border-purple-500/20 text-purple-200 text-xs flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
            <span>Your device has limited available memory, so startup may take a little longer.</span>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#512da8] to-purple-600 flex items-center justify-center shadow-lg shrink-0 mt-0.5">
                    <Bot className="w-4.5 h-4.5 text-white" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative py-3.5 px-4.5 rounded-2xl text-[14.5px] leading-relaxed shadow-lg whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#512da8] to-[#6d28d9] text-white rounded-tr-sm max-w-[80%]'
                      : 'bg-[#1e1f20]/95 border border-white/[0.08] text-white rounded-tl-sm max-w-[85%]'
                  }`}
                >
                  {msg.text ? (
                    msg.text
                  ) : msg.sender === 'assistant' ? (
                    <div className="flex items-center gap-1.5 py-0.5">
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : null}
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4.5 h-4.5 text-white/80" />
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Bar */}
        <div className="p-4 border-t border-white/[0.05] bg-[#0d0d18]/40 backdrop-blur-md shrink-0">
          <div className="max-w-3xl mx-auto">
            <style>{`
              .glow-wrapper {
                position: absolute;
                inset: -1.5px;
                border-radius: 32px;
                background: linear-gradient(90deg, #a855f7, #6366f1, #3b82f6, #ec4899, #a855f7);
                background-size: 200% auto;
                animation: rotateGlow 3s linear infinite;
                z-index: 0;
                opacity: 0;
                transition: opacity 0.4s ease-in-out;
                pointer-events: none;
              }
              .glow-blur {
                inset: -3px;
                filter: blur(12px);
              }
              .glow-wrapper.active {
                opacity: 1;
              }
              .glow-blur.active {
                opacity: 0.65;
              }
              @keyframes rotateGlow {
                0% { background-position: 0% center; }
                100% { background-position: 200% center; }
              }
            `}</style>
            
            <div className="relative w-full">
              {/* Glow Border Wrappers */}
              <div className={`glow-wrapper ${input.trim() ? 'active' : ''}`} />
              <div className={`glow-wrapper glow-blur ${input.trim() ? 'active' : ''}`} />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="relative flex items-center bg-[#1e1f20]/95 border border-white/[0.06] focus-within:border-white/20 rounded-[32px] py-2 px-3 transition-all duration-300 w-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-10"
              >
                {/* Mic Button */}
                <button
                  type="button"
                  className="flex items-center justify-center w-9 h-9 rounded-full text-white/60 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>

                {/* Input Area */}
                <input
                  type="text"
                  placeholder="Message LUCA..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none text-white placeholder-white/30 text-sm px-3.5 py-2.5 focus:ring-0 focus:outline-none"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 shrink-0 cursor-pointer ${
                    input.trim()
                      ? 'bg-white text-black hover:bg-zinc-200 active:scale-95'
                      : 'text-white/30 hover:bg-white/5'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
            <div className="text-[10px] text-center text-white/30 mt-2">
              LUCA can make mistakes. Verify important info.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacePage;
