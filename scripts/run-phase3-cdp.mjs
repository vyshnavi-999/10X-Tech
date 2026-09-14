import { writeFileSync } from 'fs';

async function main() {
    console.log('[CDP] Fetching open pages from 127.0.0.1:9222...');
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const pages = await listRes.json();
    
    let target = pages.find(p => p.url && p.url.includes('localhost:5173/qwen-test'));
    if (!target) {
        console.log('[CDP] Target tab not found, creating one...');
        const newRes = await fetch('http://127.0.0.1:9222/json/new?http://localhost:5173/qwen-test', { method: 'PUT' });
        target = await newRes.json();
    }
    
    console.log(`[CDP] Connecting to tab: ${target.id} (${target.url})`);
    console.log(`[CDP] WS URL: ${target.webSocketDebuggerUrl}`);

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
        }
    };

    await new Promise((resolve) => ws.onopen = resolve);
    console.log('[CDP] WebSocket connected.');

    const send = (method, params = {}) => {
        return new Promise((resolve, reject) => {
            const id = msgId++;
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    };

    await send('Runtime.enable');
    await send('Page.enable');

    const evaluate = async (expr, awaitPromise = true) => {
        const res = await send('Runtime.evaluate', {
            expression: expr,
            awaitPromise,
            returnByValue: true
        });
        if (res.exceptionDetails) {
            throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
        }
        return res.result ? res.result.value : undefined;
    };

    console.log('[CDP] Waiting for page readiness...');
    for (let i = 0; i < 30; i++) {
        const readyState = await evaluate('document.readyState');
        const hasBtn = await evaluate('!!document.getElementById("run-phase3-numerical-btn")');
        if (readyState === 'complete' && hasBtn) break;
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log('[CDP] Page ready. Triggering Numerical Validation...');
    await evaluate('document.getElementById("run-phase3-numerical-btn").click()');

    console.log('[CDP] Waiting for Numerical Validation results (window.__NUMERICAL_RESULTS__)...');
    let numericalResults = null;
    for (let i = 0; i < 60; i++) {
        numericalResults = await evaluate('window.__NUMERICAL_RESULTS__');
        if (numericalResults) break;
        const status = await evaluate('document.querySelector("div.text-emerald-300")?.innerText || ""');
        process.stdout.write(`\r[CDP] Polling Numerical: ${status.slice(0, 50)}... (${i}s)`);
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log('\n[CDP] Numerical Validation Completed!');
    console.log(JSON.stringify(numericalResults, null, 2));

    console.log('\n[CDP] Triggering Micro-Benchmark...');
    await evaluate('document.getElementById("run-phase3-microbench-btn").click()');

    console.log('[CDP] Waiting for Micro-Benchmark results (window.__MICRO_BENCHMARK_RESULTS__)...');
    let microResults = null;
    for (let i = 0; i < 60; i++) {
        microResults = await evaluate('window.__MICRO_BENCHMARK_RESULTS__');
        if (microResults) break;
        const status = await evaluate('document.querySelector("div.text-emerald-300")?.innerText || ""');
        process.stdout.write(`\r[CDP] Polling Micro-Benchmark: ${status.slice(0, 50)}... (${i}s)`);
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log('\n[CDP] Micro-Benchmark Completed!');
    console.log(JSON.stringify(microResults, null, 2));

    // Capture screenshot
    console.log('[CDP] Capturing screenshot...');
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(ss.data, 'base64');
    const artifactPath = 'C:\\Users\\PRANAY KUMAR\\.gemini\\antigravity-ide\\brain\\72129236-fc5b-4695-a31e-cfaf73896b82\\phase3_benchmark_results.png';
    writeFileSync(artifactPath, buffer);
    console.log(`[CDP] Screenshot saved to ${artifactPath}`);

    // Save report JSON
    const reportData = {
        timestamp: new Date().toISOString(),
        numericalValidation: numericalResults,
        microBenchmark: microResults
    };
    writeFileSync('C:\\Users\\PRANAY KUMAR\\.gemini\\antigravity-ide\\brain\\72129236-fc5b-4695-a31e-cfaf73896b82\\phase3_report.json', JSON.stringify(reportData, null, 2));
    console.log('[CDP] Phase 3 report saved successfully.');

    ws.close();
}

main().catch(err => {
    console.error('[CDP] Error:', err);
    process.exit(1);
});
