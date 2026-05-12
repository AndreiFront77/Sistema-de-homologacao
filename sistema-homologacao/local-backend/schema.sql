PRAGMA foreign_keys = ON;

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
);

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
);

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
);

CREATE INDEX IF NOT EXISTS idx_cards_card_id ON cards(card_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_card_id ON indicadores(card_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_status ON indicadores(status);
CREATE INDEX IF NOT EXISTS idx_indicadores_mes_ano ON indicadores(mes, ano);