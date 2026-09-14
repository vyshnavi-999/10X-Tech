import { writeFileSync } from 'fs';

async function main() {
    console.log('[CDP Benchmark] Connecting to browser...');
    const list = await (await fetch('http://127.0.0.1:9222/json')).json();
    const target = list.find(p => p.url && p.url.includes('localhost:5173/qwen-test'));
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

    console.log('[CDP Benchmark] Triggering Controlled A/B Benchmark (#run-controlled-ab-btn)...');
    await evaluate('document.getElementById("run-controlled-ab-btn").click()');

    console.log('[CDP Benchmark] Polling progress...');
    let results = null;
    for (let i = 0; i < 300; i++) {
        results = await evaluate('window.__BENCHMARK_RESULTS__');
        if (results && results.length === 6) break;
        const progress = await evaluate('document.querySelector("div.text-cyan-300.font-mono")?.innerText || ""');
        process.stdout.write(`\r[CDP Benchmark] ${progress.slice(0, 60)} (${i * 2}s)`);
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log('\n[CDP Benchmark] Benchmark completed!');
    console.log(JSON.stringify(results, null, 2));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(ss.data, 'base64');
    const ssPath = 'C:\\Users\\PRANAY KUMAR\\.gemini\\antigravity-ide\\brain\\72129236-fc5b-4695-a31e-cfaf73896b82\\controlled_ab_phase3_results.png';
    writeFileSync(ssPath, buffer);
    console.log(`[CDP Benchmark] Screenshot saved to ${ssPath}`);

    writeFileSync('C:\\Users\\PRANAY KUMAR\\.gemini\\antigravity-ide\\brain\\72129236-fc5b-4695-a31e-cfaf73896b82\\ab_benchmark_phase3.json', JSON.stringify(results, null, 2));
    ws.close();
}

main().catch(e => {
    console.error('[CDP Benchmark] Error:', e);
    process.exit(1);
});
