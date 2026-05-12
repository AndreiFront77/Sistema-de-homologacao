const http = require('http');

function postJson(path, data) {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(json)
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy(new Error('Request timed out'));
    });

    req.write(json);
    req.end();
  });
}

async function run() {
  try {
    console.log('Posting cards import...');
    const cardsPayload = {
      data: [
        {
          card_id: 'TEST-123',
          title: 'PROJ-TEST - Test Card',
          fabrica: 'PROJ-TEST',
          cliente: 'CLIENT X',
          componente: 'COMP-A',
          status: 'MODELAGEM'
        }
      ]
    };

    const cardsRes = await postJson('/api/cards/import', cardsPayload);
    console.log('Cards response:', cardsRes.status, cardsRes.body);

    console.log('Posting indicadores batch...');
    const indicadoresPayload = {
      source: 'test-script',
      indicadores: [
        {
          card_id: 'TEST-123',
          fabrica: 'PROJ-TEST',
          cliente: 'CLIENT X',
          componente: 'COMP-A',
          nivel: 1,
          mod: 'EXT',
          homologador: 'Tester',
          status: 'MODELAGEM',
          mes: 'MAIO',
          ano: 2026,
          somatorio_bugs: 3,
          bugs: { 'UI': 2, 'BACKEND': 1 },
          observacoes: 'Import test',
          data_inicio: new Date().toISOString()
        }
      ]
    };

    const indRes = await postJson('/api/indicadores/batch', indicadoresPayload);
    console.log('Indicadores response:', indRes.status, indRes.body);

    console.log('Done.');
  } catch (err) {
    console.error('Test failed:', err.message || err);
    process.exitCode = 2;
  }
}

run();
