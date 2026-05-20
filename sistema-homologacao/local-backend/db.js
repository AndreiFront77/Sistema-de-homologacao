const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, 'homologacao.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao conectar SQLite:', err);
  else console.log('SQLite conectado em:', dbPath);
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

// Inicializar schema
function initSchema() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela de cards importados do Businessmap
      db.run(`
        CREATE TABLE IF NOT EXISTS cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          card_id TEXT UNIQUE NOT NULL,
          fabrica TEXT,
          cliente TEXT,
          componente TEXT,
          nivel INTEGER DEFAULT 1,
          mod TEXT DEFAULT 'EXT',
          homologador TEXT,
          status TEXT DEFAULT 'MODELAGEM',
          mes TEXT,
          ano INTEGER DEFAULT 2026,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de indicadores preenchidos
      db.run(`
        CREATE TABLE IF NOT EXISTS indicadores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          card_id TEXT NOT NULL,
          fabrica TEXT NOT NULL,
          cliente TEXT,
          componente TEXT,
          nivel INTEGER DEFAULT 1,
          mod TEXT DEFAULT 'EXT',
          homologador TEXT,
          status TEXT DEFAULT 'MODELAGEM',
          mes TEXT,
          ano INTEGER DEFAULT 2026,
          data_inicio DATE,
          data_conclusao DATE,
          dias_uteis INTEGER DEFAULT 0,
          somatorio_bugs INTEGER DEFAULT 0,
          observacoes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (card_id) REFERENCES cards(card_id)
        )
      `);

      // Tabela de bugs por indicador
      db.run(`
        CREATE TABLE IF NOT EXISTS indicador_bugs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          indicador_id INTEGER NOT NULL,
          icone INTEGER DEFAULT 0,
          descricao INTEGER DEFAULT 0,
          links INTEGER DEFAULT 0,
          download INTEGER DEFAULT 0,
          deformacoes INTEGER DEFAULT 0,
          medidas INTEGER DEFAULT 0,
          etiqueta_proj_gab INTEGER DEFAULT 0,
          aplicacao INTEGER DEFAULT 0,
          cadastro INTEGER DEFAULT 0,
          des_cabecalho INTEGER DEFAULT 0,
          reg_configuracao INTEGER DEFAULT 0,
          ficha INTEGER DEFAULT 0,
          calculos_recursos INTEGER DEFAULT 0,
          furacao INTEGER DEFAULT 0,
          usinagem INTEGER DEFAULT 0,
          roteiro INTEGER DEFAULT 0,
          relatorio_pedido INTEGER DEFAULT 0,
          lista_pecas INTEGER DEFAULT 0,
          xml INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (indicador_id) REFERENCES indicadores(id) ON DELETE CASCADE
        )
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_cards_card_id ON cards(card_id)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_indicadores_card_id ON indicadores(card_id)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_indicadores_status ON indicadores(status)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_indicadores_mes_ano ON indicadores(mes, ano)
      `);

      db.all(
        `SELECT name FROM sqlite_master WHERE type='table'`,
        (err, tables) => {
          if (err) reject(err);
          else {
            console.log('Tabelas criadas:', tables.map(t => t.name).join(', '));
            resolve();
          }
        }
      );
    });
  });
}

// Funções de cards
async function upsertCard(card) {
  return new Promise((resolve, reject) => {
    const cardId = String(card?.card_id ?? card?.cardId ?? '').trim();
    if (!cardId) reject(new Error('card_id é obrigatório'));

    const sql = `
      INSERT INTO cards (card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(card_id) DO UPDATE SET
        fabrica = excluded.fabrica,
        cliente = excluded.cliente,
        componente = excluded.componente,
        nivel = excluded.nivel,
        mod = excluded.mod,
        homologador = excluded.homologador,
        status = excluded.status,
        mes = excluded.mes,
        ano = excluded.ano,
        updated_at = datetime('now')
    `;

    db.run(
      sql,
      [
        cardId,
        card?.fabrica || card?.cliente || '',
        card?.cliente || '',
        card?.componente || '',
        Number(card?.nivel || 1),
        String(card?.mod || 'EXT'),
        card?.homologador || '',
        card?.status || 'MODELAGEM',
        card?.mes || 'JANEIRO',
        Number(card?.ano || 2026)
      ],
      (err) => {
        if (err) reject(err);
        else resolve({ changes: 1 });
      }
    );
  });
}

async function getAllCards() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
         c.*,
         COALESCE((
           SELECT i.somatorio_bugs
           FROM indicadores i
           WHERE i.card_id = c.card_id
           ORDER BY i.created_at DESC, i.id DESC
           LIMIT 1
         ), 0) AS somatorio_bugs
       FROM cards c
       ORDER BY c.updated_at DESC`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

async function getCardById(cardId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT
         c.*,
         COALESCE((
           SELECT i.somatorio_bugs
           FROM indicadores i
           WHERE i.card_id = c.card_id
           ORDER BY i.created_at DESC, i.id DESC
           LIMIT 1
         ), 0) AS somatorio_bugs
       FROM cards c
       WHERE c.card_id = ?`,
      [cardId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

// Funções de indicadores
async function createIndicador(indicador) {
  return new Promise((resolve, reject) => {
    upsertCard(indicador)
      .then(() => {
        const sql = `
          INSERT INTO indicadores (
            card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano,
            data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
          sql,
          [
            indicador.card_id || '',
            indicador.fabrica || '',
            indicador.cliente || '',
            indicador.componente || '',
            Number(indicador.nivel || 1),
            String(indicador.mod || 'EXT'),
            indicador.homologador || '',
            indicador.status || 'MODELAGEM',
            indicador.mes || 'JANEIRO',
            Number(indicador.ano || 2026),
            indicador.data_inicio || null,
            indicador.data_conclusao || null,
            Number(indicador.dias_uteis || 0),
            Number(indicador.somatorio_bugs || 0),
            indicador.observacoes || ''
          ],
          function(err) {
            if (err) reject(err);
            else {
              // Inserir bugs se fornecidos
              if (indicador.bugs && this.lastID) {
                insertBugs(this.lastID, indicador.bugs)
                  .then(() => resolve({ id: this.lastID, ...indicador }))
                  .catch(reject);
              } else {
                resolve({ id: this.lastID, ...indicador });
              }
            }
          }
        );
      })
      .catch(reject);
  });
}

async function insertBugs(indicadorId, bugs) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO indicador_bugs (
        indicador_id, icone, descricao, links, download, deformacoes, medidas,
        etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao,
        ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido,
        lista_pecas, xml
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [
        indicadorId,
        Number(bugs?.icone || 0),
        Number(bugs?.descricao || 0),
        Number(bugs?.links || 0),
        Number(bugs?.download || 0),
        Number(bugs?.deformacoes || 0),
        Number(bugs?.medidas || 0),
        Number(bugs?.etiqueta_proj_gab || 0),
        Number(bugs?.aplicacao || 0),
        Number(bugs?.cadastro || 0),
        Number(bugs?.des_cabecalho || 0),
        Number(bugs?.reg_configuracao || 0),
        Number(bugs?.ficha || 0),
        Number(bugs?.calculos_recursos || 0),
        Number(bugs?.furacao || 0),
        Number(bugs?.usinagem || 0),
        Number(bugs?.roteiro || 0),
        Number(bugs?.relatorio_pedido || 0),
        Number(bugs?.lista_pecas || 0),
        Number(bugs?.xml || 0)
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

async function getAllIndicadores() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM indicadores ORDER BY updated_at DESC`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

async function getIndicadoresByCardId(cardId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM indicadores WHERE card_id = ? ORDER BY created_at DESC`,
      [cardId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

async function getIndicadorById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM indicadores WHERE id = ?`,
      [id],
      async (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          // Buscar bugs associados
          db.get(
            `SELECT * FROM indicador_bugs WHERE indicador_id = ?`,
            [id],
            (errBugs, bugs) => {
              if (errBugs) reject(errBugs);
              else resolve({ ...row, bugs: bugs || {} });
            }
          );
        }
      }
    );
  });
}

async function updateIndicador(id, updates) {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach((key) => {
      if (key !== 'id' && key !== 'bugs') {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      resolve({ changes: 0 });
      return;
    }

    fields.push('updated_at = datetime("now")');
    values.push(id);

    const sql = `UPDATE indicadores SET ${fields.join(', ')} WHERE id = ?`;

    db.run(sql, values, async function(err) {
      if (err) reject(err);
      else {
        // Atualizar bugs se fornecidos
        if (updates.bugs) {
          try {
            await db.run(`DELETE FROM indicador_bugs WHERE indicador_id = ?`, [id]);
            await insertBugs(id, updates.bugs);
          } catch (e) {
            reject(e);
            return;
          }
        }
        resolve({ changes: this.changes });
      }
    });
  });
}

async function deleteIndicador(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM indicadores WHERE id = ?`,
      [id],
      function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

async function getIndicadoresByMesAno(mes, ano) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM indicadores WHERE mes = ? AND ano = ? ORDER BY created_at DESC`,
      [mes, ano],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

async function getSummaryByMesAno() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        mes, 
        ano, 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'CONCLUIDA' THEN 1 ELSE 0 END) as concluidos,
        AVG(somatorio_bugs) as media_bugs,
        SUM(somatorio_bugs) as total_bugs
      FROM indicadores
      GROUP BY ano, mes
      ORDER BY ano, 
        CASE mes 
          WHEN 'JANEIRO' THEN 1 WHEN 'FEVEREIRO' THEN 2 WHEN 'MARCO' THEN 3
          WHEN 'ABRIL' THEN 4 WHEN 'MAIO' THEN 5 WHEN 'JUNHO' THEN 6
          WHEN 'JULHO' THEN 7 WHEN 'AGOSTO' THEN 8 WHEN 'SETEMBRO' THEN 9
          WHEN 'OUTUBRO' THEN 10 WHEN 'NOVEMBRO' THEN 11 WHEN 'DEZEMBRO' THEN 12
        END
      `,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// ==================== DASHBOARD ANALYTICS ====================

// Aggregar bugs por categoria
async function getBugStatistics() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        SUM(icone) as icone,
        SUM(descricao) as descricao,
        SUM(links) as links,
        SUM(download) as download,
        SUM(deformacoes) as deformacoes,
        SUM(medidas) as medidas,
        SUM(etiqueta_proj_gab) as etiqueta_proj_gab,
        SUM(aplicacao) as aplicacao,
        SUM(cadastro) as cadastro,
        SUM(des_cabecalho) as des_cabecalho,
        SUM(reg_configuracao) as reg_configuracao,
        SUM(ficha) as ficha,
        SUM(calculos_recursos) as calculos_recursos,
        SUM(furacao) as furacao,
        SUM(usinagem) as usinagem,
        SUM(roteiro) as roteiro,
        SUM(relatorio_pedido) as relatorio_pedido,
        SUM(lista_pecas) as lista_pecas,
        SUM(xml) as xml
      FROM indicador_bugs
      `,
      (err, row) => {
        if (err) reject(err);
        else resolve(row || {});
      }
    );
  });
}

// Estatísticas por status
async function getStatusStatistics() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        status,
        COUNT(*) as count,
        AVG(somatorio_bugs) as media_bugs,
        SUM(somatorio_bugs) as total_bugs
      FROM indicadores
      GROUP BY status
      ORDER BY count DESC
      `,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Estatísticas por cliente
async function getClientStatistics() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        cliente,
        COUNT(*) as count,
        COUNT(DISTINCT card_id) as cards,
        AVG(somatorio_bugs) as media_bugs,
        SUM(somatorio_bugs) as total_bugs,
        SUM(CASE WHEN status = 'CONCLUIDA' THEN 1 ELSE 0 END) as concluidos
      FROM indicadores
      WHERE cliente IS NOT NULL AND cliente != ''
      GROUP BY cliente
      ORDER BY count DESC
      `,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Estatísticas completas para gráficos
async function getDashboardStats() {
  return new Promise((resolve, reject) => {
    Promise.all([
      getSummaryByMesAno(),
      getStatusStatistics(),
      getClientStatistics(),
      getBugStatistics()
    ])
      .then(([monthly, status, clients, bugs]) => {
        resolve({
          monthly,
          status,
          clients,
          bugs,
          totalIndicadores: 0,
          totalCards: 0,
          totalBugs: 0
        });
      })
      .catch(reject);
  });
}

// ==================== EXPORTAÇÃO ====================

// Gerar CSV
async function exportToCSV() {
  return new Promise((resolve, reject) => {
    getAllIndicadores()
      .then((indicadores) => {
        if (indicadores.length === 0) {
          resolve('');
          return;
        }

        const headers = Object.keys(indicadores[0]).join(',');
        const rows = indicadores.map((ind) =>
          Object.values(ind)
            .map((v) => {
              if (v === null || v === undefined) return '';
              if (typeof v === 'string' && v.includes(',')) return `"${v}"`;
              return v;
            })
            .join(',')
        );

        resolve([headers, ...rows].join('\n'));
      })
      .catch(reject);
  });
}

// Gerar JSON estruturado
async function exportToJSON() {
  return new Promise((resolve, reject) => {
    Promise.all([
      getAllCards(),
      getAllIndicadores(),
      getBugStatistics(),
      getStatusStatistics(),
      getClientStatistics()
    ])
      .then(([cards, indicadores, bugs, status, clients]) => {
        resolve({
          exportedAt: new Date().toISOString(),
          summary: {
            totalCards: cards.length,
            totalIndicadores: indicadores.length,
            totalBugs: Object.values(bugs).reduce((a, b) => a + (b || 0), 0)
          },
          data: {
            cards,
            indicadores,
            bugs,
            statistics: {
              byStatus: status,
              byClient: clients
            }
          }
        });
      })
      .catch(reject);
  });
}

async function clearAllData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('PRAGMA foreign_keys = OFF;');

      db.run('DELETE FROM indicador_bugs;', (bugsErr) => {
        if (bugsErr) return reject(bugsErr);

        db.run('DELETE FROM indicadores;', (indicadoresErr) => {
          if (indicadoresErr) return reject(indicadoresErr);

          db.run('DELETE FROM cards;', (cardsErr) => {
            if (cardsErr) return reject(cardsErr);

            db.run('VACUUM;', (vacuumErr) => {
              db.run('PRAGMA foreign_keys = ON;');

              if (vacuumErr) return reject(vacuumErr);
              resolve({ ok: true });
            });
          });
        });
      });
    });
  });
}

// Inicializar e exportar
initSchema().catch(console.error);

module.exports = {
  db,
  upsertCard,
  getAllCards,
  getCardById,
  createIndicador,
  getAllIndicadores,
  getIndicadoresByCardId,
  getIndicadorById,
  updateIndicador,
  deleteIndicador,
  getIndicadoresByMesAno,
  getSummaryByMesAno,
  getBugStatistics,
  getStatusStatistics,
  getClientStatistics,
  getDashboardStats,
  exportToCSV,
  exportToJSON,
  clearAllData
};
