const http = require('http');

function getJson(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.end();
  });
}

async function run() {
  try {
    console.log('Fetching /api/dashboard/analytics');
    const a = await getJson('/api/dashboard/analytics');
    console.log('Status:', a.status);
    console.log(JSON.stringify(a.data, null, 2));

    console.log('\nFetching /api/dashboard/bugs-stats');
    const b = await getJson('/api/dashboard/bugs-stats');
    console.log('Status:', b.status);
    console.log(JSON.stringify(b.data, null, 2));
  } catch (err) {
    console.error('Failed to fetch analytics:', err.message || err);
  }
}

run();
