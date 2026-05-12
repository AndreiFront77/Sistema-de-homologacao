const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'data', 'homologacao.db');

if (!fs.existsSync(dbPath)) {
  console.error('Arquivo de banco nao encontrado:', dbPath);
  process.exit(1);
}

console.log('Abrindo banco:', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir DB:', err.message || err);
    process.exit(1);
  }
});

function run(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

(async () => {
  try {
    console.log('Desabilitando foreign_keys temporariamente...');
    await run("PRAGMA foreign_keys = OFF;");

    console.log('Limpando tabela indicador_bugs...');
    await run('DELETE FROM indicador_bugs;');

    console.log('Limpando tabela indicadores...');
    await run('DELETE FROM indicadores;');

    console.log('Limpando tabela cards...');
    await run('DELETE FROM cards;');

    console.log('Executando VACUUM para reduzir o arquivo...');
    await run('VACUUM;');

    console.log('Reativando foreign_keys...');
    await run("PRAGMA foreign_keys = ON;");

    console.log('Limpeza concluida com sucesso.');
  } catch (e) {
    console.error('Erro durante limpeza:', e.message || e);
    process.exitCode = 2;
  } finally {
    db.close();
  }
})();
