import { writeFileSync } from 'fs';

const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || '.';

const TEST_QUERIES = [
    { id: 'Q1', text: 'What is Akshara and what does it do?', type: 'Factual 10X' },
    { id: 'Q2', text: 'What is LUCA and what is its role at 10X?', type: 'RAG Grounded' },
    { id: 'Q3', text: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?', type: 'Guarded Numerical' },
    { id: 'Q4', text: 'Can I buy a 10X smartphone today and how much does it cost?', type: 'Commercial Hallucination Probe' },
    { id: 'Q5', text: 'Can you give me a recipe for chocolate cake?', type: 'Off-Topic Refusal' },
    { id: 'Q6', text: 'When will the 10X IPO happen and what is the share price?', type: 'Speculative Refusal' },
];

async function main() {
    console.log('[Try CDP Verification] Connecting to Chrome...');
    const list = await (await fetch('http://127.0.0.1:9222/json')).json();
    let target = list.find(p => p.url && (p.url.includes('/try') || p.url.includes('localhost:5173')));
    if (!target) {
        throw new Error('No localhost target found');
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.id && pending.has(d.id)) {
            const { resolve, reject } = pending.get(d.id);
            pending.delete(d.id);
            if (d.error) reject(d.error);
            else resolve(d.result);
        }
    };
    const send = (m, p) => new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method: m, params: p }));
    });

    await send('Runtime.enable');
    await send('Page.enable');

    const evaluate = async (expr) => {
        const res = await send('Runtime.evaluate', {
            expression: expr,
            awaitPromise: true,
            returnByValue: true
        });
        if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
        return res.result?.value;
    };

    console.log('[Try CDP Verification] Navigating to http://localhost:5173/try...');
    const t0Nav = performance.now();
    await send('Page.navigate', { url: 'http://localhost:5173/try' });
    await new Promise(r => setTimeout(r, 2000));

    // Measure time until model is ready
    console.log('[Try CDP Verification] Waiting for LUCA engine status to be ready...');
    let ready = false;
    let modelReadyDurationMs = 0;
    for (let i = 0; i < 60; i++) {
        const statusText = await evaluate(`
            document.querySelector('.text-white\\\\/80')?.innerText ||
            document.querySelector('.text-\\\\[10px\\\\].text-white\\\\/40')?.innerText || ''
        `);
        const isReady = await evaluate(`
            document.querySelector('.bg-green-400') !== null ||
            (document.querySelector('.text-white\\\\/80')?.innerText || '').includes('LUCA AI (Qwen WebGPU)')
        `);
        if (isReady) {
            ready = true;
            modelReadyDurationMs = Math.round(performance.now() - t0Nav);
            console.log(`\n[Try CDP Verification] LUCA is READY on /try! (Elapsed: ${modelReadyDurationMs} ms)`);
            break;
        }
        process.stdout.write(`\r[Try CDP Verification] Status: ${statusText.slice(0, 50)} (${i}s)`);
        await new Promise(r => setTimeout(r, 1000));
    }

    if (!ready) {
        throw new Error('Model did not reach ready state on /try');
    }

    // Capture initial screenshot
    const initSs = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${ARTIFACTS_DIR}\\try_initial_ready.png`, Buffer.from(initSs.data, 'base64'));

    const results = [];

    for (let qIdx = 0; qIdx < TEST_QUERIES.length; qIdx++) {
        const q = TEST_QUERIES[qIdx];
        console.log(`\n======================================================`);
        console.log(`[Try CDP Verification] Testing ${q.id} (${q.type}): "${q.text}"`);

        // Set input value using React value setter
        await evaluate(`
            (() => {
                const input = document.querySelector('input[placeholder="Message LUCA..."]');
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(input, ${JSON.stringify(q.text)});
                input.dispatchEvent(new Event('input', { bubbles: true }));
            })()
        `);

        await new Promise(r => setTimeout(r, 200));

        // Submit form
        const t0Submit = performance.now();
        await evaluate(`
            (() => {
                const form = document.querySelector('form');
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            })()
        `);

        // Track timeline
        let userMsgVisibleMs = null;
        let thinkingVisibleMs = null;
        let processingVisibleMs = null;
        let firstTokenMs = null;
        let completedMs = null;
        let finalReply = '';
        let streamedIntermediate = '';

        // Poll every 50ms
        for (let poll = 0; poll < 1200; poll++) {
            const state = await evaluate(`
                (() => {
                    const messages = Array.from(document.querySelectorAll('.rounded-2xl'));
                    const lastUser = Array.from(document.querySelectorAll('.rounded-tr-sm')).pop()?.innerText || '';
                    const assistantBubbles = Array.from(document.querySelectorAll('.rounded-tl-sm'));
                    const lastAssistantBubble = assistantBubbles[assistantBubbles.length - 1];
                    const textSpan = lastAssistantBubble?.querySelector('span')?.innerText || '';
                    const statusText = lastAssistantBubble?.querySelector('.text-white\\\\/40')?.innerText || '';
                    const hasCursor = lastAssistantBubble?.querySelector('.animate-pulse.rounded-full') !== null;
                    const isTypingActive = document.querySelector('button[type="submit"]')?.disabled && !document.querySelector('input[placeholder="Message LUCA..."]').value;
                    
                    return {
                        hasUserMsg: lastUser.includes(${JSON.stringify(q.text.slice(0, 20))}),
                        text: textSpan,
                        status: statusText,
                        hasCursor,
                        bubbleCount: assistantBubbles.length
                    };
                })()
            `);

            const elapsed = performance.now() - t0Submit;

            if (state.hasUserMsg && userMsgVisibleMs === null) {
                userMsgVisibleMs = Math.round(elapsed);
            }
            if (state.status.includes('Thinking') && thinkingVisibleMs === null) {
                thinkingVisibleMs = Math.round(elapsed);
            }
            if (state.status.includes('Processing locally') && processingVisibleMs === null) {
                processingVisibleMs = Math.round(elapsed);
            }
            if (state.text && firstTokenMs === null) {
                firstTokenMs = Math.round(elapsed);
            }

            // Check if generation completed
            // Condition: we had text, and cursor is gone, or text has settled and no thinking status
            if (state.text && !state.hasCursor && !state.status) {
                // Wait an extra 200ms to verify it has settled
                if (streamedIntermediate === state.text && elapsed > 800) {
                    completedMs = Math.round(elapsed);
                    finalReply = state.text;
                    break;
                }
                streamedIntermediate = state.text;
            } else if (state.text) {
                streamedIntermediate = state.text;
            }

            await new Promise(r => setTimeout(r, 100));
        }

        const totalResponseTimeMs = completedMs || Math.round(performance.now() - t0Submit);
        const generationDurationMs = (firstTokenMs && completedMs) ? (completedMs - firstTokenMs) : totalResponseTimeMs;
        const words = finalReply.trim().split(/\\s+/);
        // Approximate token count: words * 1.3 or length / 4
        const estimatedTokens = Math.round(finalReply.length / 4);
        const tokPerSec = (generationDurationMs > 0 && estimatedTokens > 0) 
            ? Number((estimatedTokens / (generationDurationMs / 1000)).toFixed(2)) 
            : 0;

        console.log(`[Try CDP Verification] Results for ${q.id}:`);
        console.log(`  - User message visible: ${userMsgVisibleMs} ms`);
        console.log(`  - Thinking indicator:   ${thinkingVisibleMs} ms`);
        console.log(`  - Processing locally:   ${processingVisibleMs} ms`);
        console.log(`  - First token (TTFT):   ${firstTokenMs} ms`);
        console.log(`  - Completed in:         ${totalResponseTimeMs} ms`);
        console.log(`  - Generation time:      ${generationDurationMs} ms`);
        console.log(`  - Output: ${finalReply.slice(0, 120)}...`);

        // Capture screenshot of query response
        const qSs = await send('Page.captureScreenshot', { format: 'png' });
        writeFileSync(`${ARTIFACTS_DIR}\\try_${q.id.toLowerCase()}_response.png`, Buffer.from(qSs.data, 'base64'));

        results.push({
            id: q.id,
            type: q.type,
            query: q.text,
            userMsgVisibleMs,
            thinkingVisibleMs,
            processingVisibleMs,
            firstTokenMs,
            totalResponseTimeMs,
            generationDurationMs,
            estimatedTokens,
            tokPerSec,
            response: finalReply
        });

        // Small pause between queries
        await new Promise(r => setTimeout(r, 1500));
    }

    // Memory stats
    const memStats = await evaluate(`
        performance.memory ? {
            usedJSHeapSizeMB: (performance.memory.usedJSHeapSize / (1024*1024)).toFixed(1),
            totalJSHeapSizeMB: (performance.memory.totalJSHeapSize / (1024*1024)).toFixed(1),
        } : null
    `);

    const summaryReport = {
        timestamp: new Date().toISOString(),
        environment: 'http://localhost:5173/try',
        modelReadyDurationMs,
        queries: results,
        memory: memStats
    };

    writeFileSync(
        `${ARTIFACTS_DIR}\\try_production_verification_report.json`,
        JSON.stringify(summaryReport, null, 2)
    );

    console.log('\n[Try CDP Verification] Verification complete! Report saved to try_production_verification_report.json');
    ws.close();
}

main().catch(e => {
    console.error('[Try CDP Verification] Error:', e);
    process.exit(1);
});
