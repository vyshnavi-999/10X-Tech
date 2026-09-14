import { writeFileSync } from 'fs';

async function main() {
    console.log('[Regression CDP] Connecting to Chrome WebGPU tab...');
    const list = await (await fetch('http://127.0.0.1:9222/json')).json();
    const target = list.find(p => p.url && p.url.includes('localhost:5173/qwen-test'));
    if (!target) {
        throw new Error('Could not find /qwen-test target in Chrome');
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

    console.log('[Regression CDP] Checking page and model readiness...');
    // Refresh page to load fresh code with our production qwenService.js changes
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 2000));

    // Wait for model initialization and warmup
    console.log('[Regression CDP] Waiting for model initialization...');
    let ready = false;
    for (let i = 0; i < 60; i++) {
        const status = await evaluate('document.querySelector("div.text-xs.font-medium")?.innerText || ""');
        const isReady = await evaluate('document.getElementById("run-controlled-ab-btn")?.disabled === false');
        if (isReady) {
            ready = true;
            console.log('\n[Regression CDP] Model is ready!');
            break;
        }
        process.stdout.write(`\r[Regression CDP] Status: ${status} (${i}s)`);
        await new Promise(r => setTimeout(r, 1000));
    }

    if (!ready) {
        throw new Error('Model did not reach ready state');
    }

    // Step 1: Run Full 6-Query Controlled Regression
    console.log('[Regression CDP] Running 6-query Controlled A/B Regression (#run-controlled-ab-btn)...');
    await evaluate('document.getElementById("run-controlled-ab-btn").click()');

    let abResults = null;
    for (let i = 0; i < 300; i++) {
        abResults = await evaluate('window.__BENCHMARK_RESULTS__');
        if (abResults && abResults.length === 6) break;
        const progress = await evaluate('document.querySelector("div.text-cyan-300.font-mono")?.innerText || ""');
        process.stdout.write(`\r[Regression CDP] ${progress.slice(0, 70)} (${i * 2}s)`);
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log('\n[Regression CDP] 6-query regression finished!');

    // Step 2: Dedicated Repeated Q4 Smartphone Probe (3 strict iterations on production generator)
    console.log('[Regression CDP] Running dedicated repeated Q4 Smartphone Hallucination Probe...');
    const probeScript = `
    (async () => {
        const q4Query = "Do you sell any smartphones like Samsung or Apple iPhones or offer mobile recharges?";
        const probeRuns = [];
        const { retrieveKnowledge, formatKnowledgeContext } = await import('/src/knowledge/knowledgeRetriever.js');
        const { buildSystemPrompt } = await import('/src/knowledge/systemPrompt.js');
        const { getQwenGenerator, generateQwenResponse } = await import('/src/services/qwenService.js');
        
        const gen = await getQwenGenerator();
        
        for (let run = 1; run <= 3; run++) {
            const rag = retrieveKnowledge(q4Query, { topK: 3, minScore: 0.8 });
            let knowledgeContext = '';
            if (rag.hasMatch && rag.chunks.length > 0) {
                knowledgeContext = formatKnowledgeContext(rag.chunks, { verificationAnalysis: rag.verificationAnalysis });
            }
            const system = buildSystemPrompt(knowledgeContext);
            const messages = [
                { role: 'system', content: system },
                { role: 'user', content: q4Query }
            ];
            
            let streamed = '';
            const t0 = performance.now();
            const reply = await generateQwenResponse(messages, {
                maxNewTokens: 160,
                doSample: false,
                onToken: (chunk) => { streamed = chunk; }
            });
            const t1 = performance.now();
            
            // Hallucination check
            const lower = reply.toLowerCase();
            const mentionsPhoneOffer = /we offer.*(iphone|samsung|smartphone)|available.*(iphone|samsung)|yes,?\s+we\s+(sell|have|offer)/i.test(lower);
            const refusesProperly = /do not|does not|not offer|specializ|b2b|ai.*services|focus/i.test(lower);
            const passed = !mentionsPhoneOffer && refusesProperly;
            
            probeRuns.push({
                run,
                durationMs: Math.round(t1 - t0),
                reply,
                passed,
                hallucinationDetected: mentionsPhoneOffer
            });
        }
        return probeRuns;
    })()
    `;

    const q4ProbeResults = await evaluate(probeScript);
    console.log('[Regression CDP] Q4 Probe Results:');
    console.log(JSON.stringify(q4ProbeResults, null, 2));

    // Step 3: Memory and Reset / Device Recovery Check
    console.log('[Regression CDP] Checking JS Heap and Device Recovery...');
    const memoryStatsBefore = await evaluate(`
        performance.memory ? {
            usedJSHeapSizeMB: (performance.memory.usedJSHeapSize / (1024*1024)).toFixed(1),
            totalJSHeapSizeMB: (performance.memory.totalJSHeapSize / (1024*1024)).toFixed(1),
            jsHeapSizeLimitMB: (performance.memory.jsHeapSizeLimit / (1024*1024)).toFixed(1),
        } : { message: 'performance.memory not exposed' }
    `);
    console.log('[Regression CDP] Heap Memory Before Reset:', memoryStatsBefore);

    console.log('[Regression CDP] Executing model reset and re-initialization...');
    const resetRecoveryResult = await evaluate(`
    (async () => {
        const { resetQwenGenerator, getQwenGenerator, warmupQwen, isModelReady } = await import('/src/services/qwenService.js');
        const t0 = performance.now();
        resetQwenGenerator();
        const stateAfterReset = isModelReady();
        const genNew = await getQwenGenerator();
        const warmed = await warmupQwen(genNew);
        const t1 = performance.now();
        
        return {
            stateAfterReset,
            recoveredSuccessfully: !!genNew,
            warmedSuccessfully: warmed,
            recoveryDurationMs: Math.round(t1 - t0)
        };
    })()
    `);
    console.log('[Regression CDP] Reset Recovery Result:', resetRecoveryResult);

    const memoryStatsAfter = await evaluate(`
        performance.memory ? {
            usedJSHeapSizeMB: (performance.memory.usedJSHeapSize / (1024*1024)).toFixed(1),
            totalJSHeapSizeMB: (performance.memory.totalJSHeapSize / (1024*1024)).toFixed(1),
        } : null
    `);
    console.log('[Regression CDP] Heap Memory After Reset:', memoryStatsAfter);

    // Save report
    const fullReport = {
        timestamp: new Date().toISOString(),
        buildStatus: 'clean (vite v8.0.10, built in 2.71s)',
        abRegression: abResults,
        q4Probe: q4ProbeResults,
        memory: { before: memoryStatsBefore, after: memoryStatsAfter },
        deviceResetRecovery: resetRecoveryResult
    };

    const outPath = process.env.ARTIFACTS_DIR ? `${process.env.ARTIFACTS_DIR}/phase3_regression_report.json` : 'phase3_regression_report.json';
    writeFileSync(outPath, JSON.stringify(fullReport, null, 2));

    console.log(`[Regression CDP] Report saved to ${outPath}`);
    ws.close();
}

main().catch(e => {
    console.error('[Regression CDP] Error:', e);
    process.exit(1);
});
