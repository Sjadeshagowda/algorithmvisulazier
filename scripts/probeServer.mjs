import { preview } from 'vite';
import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length }));
    }).on('error', reject);
  });
}

async function probe() {
  const server = await preview({
    preview: { port: 5174 },
  });

  const routes = [
    '/',
    '/algorithms',
    '/sorting',
    '/searching',
    '/graph',
    '/tree',
    '/dynamic-programming',
    '/greedy',
    '/backtracking',
    '/learn/bubble-sort',
    '/learn/selection-sort',
    '/learn/merge-sort',
    '/learn/quick-sort',
    '/learn/linear-search',
    '/learn/binary-search',
    '/learn/bfs',
    '/learn/dfs',
    '/learn/fibonacci-dp',
    '/learn/lcs',
    '/learn/coin-change-greedy',
    '/learn/n-queens',
    '/visualize/bubble-sort',
    '/visualize/n-queens',
    '/visualize/fibonacci-dp',
  ];

  console.log('Probing production preview server on port 5174:');
  let ok = true;
  for (const route of routes) {
    const url = `http://localhost:5174${route}`;
    const res = await get(url);
    if (res.status === 200) {
      console.log(`  ✓ 200 OK  ${route} (${res.length} bytes)`);
    } else {
      console.error(`  ✗ FAIL    ${route} -> ${res.status}`);
      ok = false;
    }
  }

  server.httpServer.close();

  if (!ok) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL ROUTES RETURNED 200 OK VIA VITE PREVIEW SERVER!');
  }
}

probe().catch(err => {
  console.error('Probe error:', err);
  process.exit(1);
});
