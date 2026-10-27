import { preview } from 'vite';
import { spawn } from 'child_process';
import http from 'http';

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBrowserAudit() {
  console.log('='.repeat(75));
  console.log('   ALGOVIZ — HEADLESS CHROME E2E AUDIT & RUNTIME CONSOLE VERIFICATION');
  console.log('='.repeat(75));

  // 1. Start preview server
  const previewServer = await preview({
    preview: { port: 5174 },
  });
  console.log('[1] Vite preview server running on http://localhost:5174');

  // 2. Launch Chrome
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    '--user-data-dir=C:\\Users\\HP\\AppData\\Local\\Temp\\chrome-qa-run',
  ]);

  await sleep(1500);

  let targets = [];
  for (let i = 0; i < 10; i++) {
    try {
      targets = await httpGetJson('http://localhost:9222/json');
      if (targets && targets.length > 0) break;
    } catch {
      await sleep(500);
    }
  }

  if (!targets || targets.length === 0) {
    console.error('Could not connect to Chrome debugging target');
    chromeProc.kill();
    previewServer.httpServer.close();
    process.exit(1);
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const wsUrl = pageTarget.webSocketDebuggerUrl;
  console.log(`[2] Connected to Chrome DevTools WebSocket: ${wsUrl}`);

  // Simple CDP client over native WebSocket in Node 22+
  const ws = new WebSocket(wsUrl);

  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const { type, args } = msg.params;
      if (type === 'error') {
        const text = args.map(a => a.value || a.description || '').join(' ');
        consoleErrors.push(text);
        console.error(`  [BROWSER CONSOLE ERROR]: ${text}`);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const text = msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || '');
      consoleErrors.push(text);
      console.error(`  [BROWSER UNCAUGHT EXCEPTION]: ${text}`);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand('Runtime.enable');
  await sendCommand('Page.enable');
  await sendCommand('DOM.enable');

  const pagesToTest = [
    { url: 'http://localhost:5174/', title: 'Home Page' },
    { url: 'http://localhost:5174/algorithms', title: 'Algorithms Directory' },
    { url: 'http://localhost:5174/sorting', title: 'Sorting Category' },
    { url: 'http://localhost:5174/graph', title: 'Graph Category' },
    { url: 'http://localhost:5174/learn/bubble-sort', title: 'Bubble Sort Lesson' },
    { url: 'http://localhost:5174/visualize/bubble-sort', title: 'Bubble Sort Visualizer' },
    { url: 'http://localhost:5174/learn/n-queens', title: 'N-Queens Lesson' },
    { url: 'http://localhost:5174/visualize/fibonacci-dp', title: 'Fibonacci DP Visualizer' },
    { url: 'http://localhost:5174/learn/coin-change-greedy', title: 'Coin Change Lesson' },
    { url: 'http://localhost:5174/visualize/bst-search', title: 'BST Search Visualizer' },
    { url: 'http://localhost:5174/reinforcement-learning', title: 'Reinforcement Learning Category' },
    { url: 'http://localhost:5174/learn/q-learning', title: 'Tabular Q-Learning Lesson' },
    { url: 'http://localhost:5174/visualize/q-learning', title: 'Tabular Q-Learning Visualizer' },
  ];

  console.log('\n[3] Auditing pages in Chrome Headless:');

  for (const p of pagesToTest) {
    console.log(`\nNavigating to ${p.title} (${p.url})...`);
    await sendCommand('Page.navigate', { url: p.url });
    await sleep(1200);

    // Evaluate document title and check for errors
    const titleRes = await sendCommand('Runtime.evaluate', { expression: 'document.title' });
    const pageTitle = titleRes.result?.value;
    console.log(`  ✓ Title: "${pageTitle}"`);

    // Check root rendering
    const hasRoot = await sendCommand('Runtime.evaluate', {
      expression: 'document.getElementById("root") && document.getElementById("root").children.length > 0'
    });
    console.log(`  ✓ DOM rendered: ${hasRoot.result?.value}`);

    // If on visualizer or lesson, test clicking Step Forward
    if (p.url.includes('visualize') || p.url.includes('learn')) {
      const stepForwardRes = await sendCommand('Runtime.evaluate', {
        expression: `
          (() => {
            const btn = document.querySelector('button[aria-label="Step forward"]');
            if (btn) {
              btn.click();
              return true;
            }
            return false;
          })()
        `
      });
      console.log(`  ✓ Step Forward interaction tested: ${stepForwardRes.result?.value}`);
    }
  }

  // Close Chrome & Preview
  ws.close();
  chromeProc.kill();
  previewServer.httpServer.close();

  console.log('\n' + '='.repeat(75));
  console.log(`BROWSER AUDIT COMPLETE: ${consoleErrors.length} Console Errors Detected`);
  console.log('='.repeat(75));

  if (consoleErrors.length > 0) {
    console.error(`FAILED: ${consoleErrors.length} browser errors occurred during audit.`);
    process.exit(1);
  } else {
    console.log('🎉 100% CLEAN BROWSER AUDIT: Zero console errors, zero unhandled exceptions!');
  }
}

runBrowserAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
