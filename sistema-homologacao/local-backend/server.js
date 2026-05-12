const express = require('express');
const cors = require('cors');
const {
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
  exportToJSON
} = require('./db');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// ==================== CARDS (Businessmap) ====================

app.post('/api/cards/import', async (req, res) => {
  const cards = Array.isArray(req.body.cards) ? req.body.cards : [];
  let processed = 0;

  try {
    for (const card of cards) {
      await upsertCard(card);
      processed++;
    }

    res.json({ ok: true, processed });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.post('/api/cards', async (req, res) => {
  const card = req.body?.card ?? req.body;

  try {
    await upsertCard(card);
    const createdCard = await getCardById(String(card?.card_id ?? card?.cardId ?? '').trim());
    res.status(201).json({ ok: true, card: createdCard });
  } catch (err) {
    res.status(400).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/cards', async (req, res) => {
  try {
    const cards = await getAllCards();
    res.json({ ok: true, total: cards.length, cards });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/cards/:cardId', async (req, res) => {
  try {
    const card = await getCardById(req.params.cardId);
    if (!card) {
      return res.status(404).json({ ok: false, message: 'Card não encontrado' });
    }
    res.json({ ok: true, card });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

// ==================== INDICADORES ====================

app.post('/api/indicadores', async (req, res) => {
  try {
    const indicador = await createIndicador(req.body);
    res.status(201).json({ ok: true, indicador });
  } catch (err) {
    res.status(400).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/indicadores', async (req, res) => {
  try {
    const indicadores = await getAllIndicadores();
    res.json({ ok: true, total: indicadores.length, indicadores });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/indicadores/card/:cardId', async (req, res) => {
  try {
    const indicadores = await getIndicadoresByCardId(req.params.cardId);
    res.json({ ok: true, total: indicadores.length, indicadores });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/indicadores/:id', async (req, res) => {
  try {
    const indicador = await getIndicadorById(req.params.id);
    if (!indicador) {
      return res.status(404).json({ ok: false, message: 'Indicador não encontrado' });
    }
    res.json({ ok: true, indicador });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.put('/api/indicadores/:id', async (req, res) => {
  try {
    const result = await updateIndicador(req.params.id, req.body);
    if (result.changes === 0) {
      return res.status(404).json({ ok: false, message: 'Indicador não encontrado' });
    }
    const indicador = await getIndicadorById(req.params.id);
    res.json({ ok: true, indicador });
  } catch (err) {
    res.status(400).json({ ok: false, message: String(err?.message || err) });
  }
});

app.delete('/api/indicadores/:id', async (req, res) => {
  try {
    const result = await deleteIndicador(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ ok: false, message: 'Indicador não encontrado' });
    }
    res.json({ ok: true, message: 'Indicador deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

// ==================== DASHBOARD ====================

app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const summary = await getSummaryByMesAno();
    res.json({ ok: true, summary });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/dashboard/mes/:mes/:ano', async (req, res) => {
  try {
    const indicadores = await getIndicadoresByMesAno(req.params.mes, req.params.ano);
    const total = indicadores.length;
    const concluidos = indicadores.filter(i => i.status === 'CONCLUIDA').length;
    const pendentes = total - concluidos;
    const somaBugs = indicadores.reduce((acc, i) => acc + (i.somatorio_bugs || 0), 0);

    res.json({ ok: true, total, concluidos, pendentes, somaBugs, indicadores });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

// Dashboard analytics completo para gráficos
app.get('/api/dashboard/analytics', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({ ok: true, ...stats });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/dashboard/bugs-stats', async (req, res) => {
  try {
    const bugs = await getBugStatistics();
    res.json({ ok: true, bugs });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/dashboard/status-stats', async (req, res) => {
  try {
    const status = await getStatusStatistics();
    res.json({ ok: true, status });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/dashboard/client-stats', async (req, res) => {
  try {
    const clients = await getClientStatistics();
    res.json({ ok: true, clients });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

// ==================== EXPORTAÇÃO ====================

app.get('/api/export/csv', async (req, res) => {
  try {
    const csv = await exportToCSV();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=indicadores.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/api/export/json', async (req, res) => {
  try {
    const json = await exportToJSON();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=indicadores.json');
    res.json(json);
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

// ==================== INTEGRAÇÃO COM SISTEMAS EXTERNOS ====================

/**
 * Endpoint para receber indicadores de outros sistemas
 * POST /api/indicadores/batch
 * Body: { source: string, indicadores: Array }
 * Exemplo: Sistema de Qualidade, CRM, ERP, etc.
 */
app.post('/api/indicadores/batch', async (req, res) => {
  try {
    const { source, indicadores } = req.body;

    if (!source || !Array.isArray(indicadores)) {
      return res.status(400).json({
        ok: false,
        message: 'source e indicadores array são obrigatórios'
      });
    }

    const results = [];
    let errors = 0;

    for (const ind of indicadores) {
      try {
        const result = await createIndicador(ind);
        results.push({
          card_id: ind.card_id,
          status: 'success',
          id: result.id,
          source
        });
      } catch (err) {
        errors++;
        results.push({
          card_id: ind.card_id,
          status: 'error',
          message: String(err?.message || err),
          source
        });
      }
    }

    res.json({
      ok: true,
      source,
      total: indicadores.length,
      success: indicadores.length - errors,
      errors,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

/**
 * Endpoint de webhook para integração em tempo real
 * Recebe notificações de mudanças em indicadores de sistemas externos
 */
app.post('/api/webhook/indicadores', async (req, res) => {
  try {
    const { event, data, source, signature } = req.body;

    // Aqui você pode implementar validação de assinatura (HMAC-SHA256)
    // if (!verifySignature(signature)) return res.status(403).json({ ok: false });

    let result = null;

    switch (event) {
      case 'indicador.created':
        result = await createIndicador(data);
        break;
      case 'indicador.updated':
        result = await updateIndicador(data.id, data);
        break;
      case 'indicador.deleted':
        result = await deleteIndicador(data.id);
        break;
      default:
        return res.status(400).json({ ok: false, message: 'Evento inválido' });
    }

    res.json({
      ok: true,
      event,
      source,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.post('/import', async (req, res) => {
  const cards = Array.isArray(req.body.cards) ? req.body.cards : [];
  let processed = 0;

  try {
    for (const card of cards) {
      await upsertCard(card);
      processed++;
    }

    res.json({ ok: true, processed });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

app.get('/cards', async (req, res) => {
  try {
    const cards = await getAllCards();
    res.json({ ok: true, total: cards.length, cards });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Local SQLite backend listening on http://localhost:${port}`));

