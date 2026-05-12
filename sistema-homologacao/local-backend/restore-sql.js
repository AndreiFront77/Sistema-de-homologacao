const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const rootDir = __dirname;
const dbPath = path.join(rootDir, 'data', 'homologacao.db');

const sqlFileArg = process.argv[2];

function usage() {
  console.log('Uso: npm run restore:sql -- <caminho-do-arquivo.sql>');
}

function runSql(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function main() {
  if (!sqlFileArg) {
    usage();
    process.exit(1);
  }

  const sqlPath = path.isAbsolute(sqlFileArg) ? sqlFileArg : path.join(process.cwd(), sqlFileArg);

  if (!fs.existsSync(sqlPath)) {
    throw new Error(`Arquivo SQL nao encontrado em ${sqlPath}`);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const db = new sqlite3.Database(dbPath);

  try {
    await runSql(db, sql);
    console.log(`Backup SQL restaurado com sucesso: ${sqlPath}`);
  } finally {
    db.close();
  }
}

main().catch((err) => {
  console.error('Falha ao restaurar backup SQL:', err.message || err);
  process.exit(1);
});