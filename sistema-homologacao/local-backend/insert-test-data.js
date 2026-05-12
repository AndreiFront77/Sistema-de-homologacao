const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/homologacao.db');

const indicadores = [
  {
    card_id: '12345',
    fabrica: 'Fabrica A',
    cliente: 'Cliente XYZ',
    componente: 'Componente A',
    nivel: 1,
    mod: 'EXT',
    homologador: 'João',
    status: 'CONCLUIDA',
    mes: 'MAIO',
    ano: 2026,
    data_inicio: '2026-05-01',
    data_conclusao: '2026-05-10',
    dias_uteis: 7,
    somatorio_bugs: 5,
    observacoes: 'Teste 1'
  },
  {
    card_id: '12346',
    fabrica: 'Fabrica B',
    cliente: 'Cliente ABC',
    componente: 'Componente B',
    nivel: 2,
    mod: 'INT',
    homologador: 'Maria',
    status: 'EM_HOMOLOGACAO',
    mes: 'MAIO',
    ano: 2026,
    data_inicio: '2026-05-05',
    data_conclusao: null,
    dias_uteis: 5,
    somatorio_bugs: 3,
    observacoes: 'Teste 2'
  }
];

indicadores.forEach(ind => {
  db.run(`INSERT INTO indicadores (card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ind.card_id, ind.fabrica, ind.cliente, ind.componente, ind.nivel, ind.mod, ind.homologador, ind.status, ind.mes, ind.ano, ind.data_inicio, ind.data_conclusao, ind.dias_uteis, ind.somatorio_bugs, ind.observacoes],
    (err) => {
      if (err) console.error('Erro ao inserir indicador:', err);
      else console.log('✓ Indicador', ind.card_id, 'inserido');
    }
  );
});

setTimeout(() => {
  db.close();
  console.log('✓ Indicadores de teste criados!');
}, 1000);
