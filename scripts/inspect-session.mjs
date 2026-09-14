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
        expression: `(() => {
            const g = window.__GENERATOR__;
            const s = g.model.sessions['model'];
            return {
                handlerProps: Object.getOwnPropertyNames(s.handler || {}),
                handlerProtoProps: Object.getOwnPropertyNames(Object.getPrototypeOf(s.handler || {})),
                sessionId: s.handler?.sessionId,
                inputNames: s.handler?.inputNames,
                outputNames: s.handler?.outputNames
            };
        })()`,
        returnByValue: true
    });
    console.log(JSON.stringify(res, null, 2));
    ws.close();
}
run();
