const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const rootDir = __dirname;
const dbPath = path.join(rootDir, 'data', 'homologacao.db');
const schemaPath = path.join(rootDir, 'schema.sql');
const backupsDir = path.join(rootDir, 'backups');

fs.mkdirSync(backupsDir, { recursive: true });

function quoteSqlValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : 'NULL';
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function exportTable(db, tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      if (!rows || rows.length === 0) {
        resolve([]);
        return;
      }

      const columns = Object.keys(rows[0]);
      const insertLines = rows.map((row) => {
        const values = columns.map((column) => quoteSqlValue(row[column]));
        return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
      });

      resolve(insertLines);
    });
  });
}

async function main() {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Banco nao encontrado em ${dbPath}`);
  }

  const schema = fs.readFileSync(schemaPath, 'utf8').trim();
  const dumpHeader = [
    'PRAGMA foreign_keys = OFF;',
    'BEGIN TRANSACTION;',
    'DROP TABLE IF EXISTS indicador_bugs;',
    'DROP TABLE IF EXISTS indicadores;',
    'DROP TABLE IF EXISTS cards;'
  ];

  const db = new sqlite3.Database(dbPath);

  try {
    const cardsSql = await exportTable(db, 'cards');
    const indicadoresSql = await exportTable(db, 'indicadores');
    const bugsSql = await exportTable(db, 'indicador_bugs');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupsDir, `homologacao-${timestamp}.sql`);
    const content = [
      ...dumpHeader,
      '',
      schema,
      '',
      ...cardsSql,
      ...indicadoresSql,
      ...bugsSql,
      '',
      'COMMIT;',
      'PRAGMA foreign_keys = ON;'
    ].join('\n');

    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`Backup SQL criado em: ${backupPath}`);
  } finally {
    db.close();
  }
}

main().catch((err) => {
  console.error('Falha ao gerar backup SQL:', err.message || err);
  process.exit(1);
});