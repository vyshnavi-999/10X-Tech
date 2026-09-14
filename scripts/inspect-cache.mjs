async function run() {
    const list = await (await fetch('http://127.0.0.1:9222/json')).json();
    const target = list.find(p => p.url && p.url.includes('localhost:5173/qwen-test'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    
    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.id && pending.has(d.id)) {
            const { resolve } = pending.get(d.id);
            pending.delete(d.id);
            resolve(d.result);
        }
    };
    const send = (m, p) => new Promise(res => {
        const id = msgId++;
        pending.set(id, { resolve: res });
        ws.send(JSON.stringify({ id, method: m, params: p }));
    });

    await send('Runtime.enable');
    const res = await send('Runtime.evaluate', {
        expression: `(async () => {
            const cacheNames = await caches.keys();
            const details = [];
            for (const name of cacheNames) {
                const cache = await caches.open(name);
                const requests = await cache.keys();
                const items = [];
                for (const req of requests) {
                    const resp = await cache.match(req);
                    const blob = await resp.blob();
                    items.push({
                        url: req.url,
                        sizeBytes: blob.size,
                        sizeMB: Number((blob.size / (1024 * 1024)).toFixed(2)),
                        type: resp.headers.get('content-type')
                    });
                }
                details.push({
                    cacheName: name,
                    totalItems: requests.length,
                    totalMB: Number(items.reduce((a, b) => a + b.sizeMB, 0).toFixed(2)),
                    items
                });
            }
            return details;
        })()`,
        awaitPromise: true,
        returnByValue: true
    });
    console.log(JSON.stringify(res, null, 2));
    ws.close();
}
run();
