PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;
DROP TABLE IF EXISTS indicador_bugs;
DROP TABLE IF EXISTS indicadores;
DROP TABLE IF EXISTS cards;

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

INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (1, '10813', 'Teste', 'Teste', 'Componente', 1, 'EXT', 'Homologador', 'EM_MODELAGEM', 'JANEIRO', 2026, '2026-05-05 20:31:40', '2026-05-05 20:31:40');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (2, '14151', 'WALL IN', 'BONTEMPO', 'PORTA DESLIZANTE', 1, 'EXT', 'Teste', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-06 11:51:10', '2026-05-07 14:31:43');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (4, '12963', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-06 13:02:31', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (9, '12975', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (10, '12974', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (11, '12973', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (12, '12972', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (13, '12971', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (14, '12970', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (15, '12969', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (16, '12967', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (17, '12966', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (18, '12965', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (19, '12964', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (21, '12962', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (22, '12796', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (23, '12793', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (24, '12792', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (25, '12791', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (26, '12790', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (27, '12789', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (28, '12788', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (29, '12787', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (30, '12786', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (31, '12785', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (32, '12784', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (33, '12783', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (34, '12782', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (35, '12781', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (36, '12780', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (37, '12779', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (38, '12776', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (39, '12757', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO cards (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, created_at, updated_at) VALUES (40, '12253', '', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, '2026-05-07 18:37:49', '2026-05-07 18:37:49');
INSERT INTO indicadores (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes, created_at, updated_at) VALUES (1, '10813', '', 'Teste', 'Componente', 1, 'EXT', 'Homologador', 'EM_MODELAGEM', 'JANEIRO', 2026, NULL, NULL, 0, 1, 'teste', '2026-05-05 20:31:40', '2026-05-05 20:31:40');
INSERT INTO indicadores (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes, created_at, updated_at) VALUES (2, '14151', 'WALL IN', 'BONTEMPO', 'PORTA DESLIZANTE', 1, 'EXT', 'Teste', 'MODELAGEM', 'JANEIRO', 2026, '2026-01-28', NULL, 0, 3, 'Teste de salvamento', '2026-05-06 11:51:10', '2026-05-06 11:51:10');
INSERT INTO indicadores (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes, created_at, updated_at) VALUES (3, '14151', 'WALL IN', 'BONTEMPO', 'PORTA DESLIZANTE', 1, 'EXT', 'Teste', 'MODELAGEM', 'JANEIRO', 2026, '2026-01-28', NULL, 0, 3, 'Teste de salvamento', '2026-05-06 12:01:56', '2026-05-06 12:01:56');
INSERT INTO indicadores (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes, created_at, updated_at) VALUES (4, '12963', 'Portobello', '', '', 1, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, NULL, NULL, 0, 2, 'Inconsistências:
Descrição (CATÁLOGO) x1
Links (CATÁLOGO) x1', '2026-05-06 13:02:31', '2026-05-06 13:02:31');
INSERT INTO indicadores (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes, created_at, updated_at) VALUES (5, '12963', 'Portobello', 'Portobello', '', 5, 'EXT', '', 'MODELAGEM', 'JANEIRO', 2026, NULL, NULL, 0, 4, 'Inconsistências:
Descrição (CATÁLOGO) x1
Links (CATÁLOGO) x2 - tese
Outros (3D) x1 - teste 2', '2026-05-06 13:03:42', '2026-05-06 13:03:42');
INSERT INTO indicadores (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes, created_at, updated_at) VALUES (6, '12963', 'Portobello', 'Portobello', 'Blocco Piano 2 Cubas com Rebaixo', 5, 'INT', 'Andrei Rodrigues', 'EM_HOMOLOGACAO', 'Maio', 2026, '2026-05-06', NULL, 0, 5, 'Inconsistências:
Descrição (CATÁLOGO) x1
Links (CATÁLOGO) x2 - tese
Outros (3D) x2 - teste 2', '2026-05-06 13:04:29', '2026-05-06 13:04:29');
INSERT INTO indicadores (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes, created_at, updated_at) VALUES (7, '12963', 'Portobello', 'Portobello', 'Blocco Piano 2 Cubas com Rebaixo', 5, 'EXT', 'Andrei Rodrigues', 'EM_HOMOLOGACAO', 'Maio', 2026, '2026-05-06', NULL, 0, 2, 'Inconsistências:
Links (CATÁLOGO) x2 - teste 3
teste 5', '2026-05-06 18:01:13', '2026-05-06 18:01:13');
INSERT INTO indicadores (id, card_id, fabrica, cliente, componente, nivel, mod, homologador, status, mes, ano, data_inicio, data_conclusao, dias_uteis, somatorio_bugs, observacoes, created_at, updated_at) VALUES (8, '14151', 'WALL IN', 'BONTEMPO', 'PORTA DESLIZANTE', 1, 'EXT', 'Teste', 'MODELAGEM', 'JANEIRO', 2026, '2026-01-28', NULL, 0, 1, 'Teste de salvamento

Inconsistências:
Ícone (CATÁLOGO) x1', '2026-05-07 14:31:43', '2026-05-07 14:31:43');
INSERT INTO indicador_bugs (id, indicador_id, icone, descricao, links, download, deformacoes, medidas, etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao, ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido, lista_pecas, xml, created_at) VALUES (1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-05 20:31:40');
INSERT INTO indicador_bugs (id, indicador_id, icone, descricao, links, download, deformacoes, medidas, etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao, ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido, lista_pecas, xml, created_at) VALUES (2, 2, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2026-05-06 11:51:10');
INSERT INTO indicador_bugs (id, indicador_id, icone, descricao, links, download, deformacoes, medidas, etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao, ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido, lista_pecas, xml, created_at) VALUES (3, 3, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2026-05-06 12:01:56');
INSERT INTO indicador_bugs (id, indicador_id, icone, descricao, links, download, deformacoes, medidas, etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao, ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido, lista_pecas, xml, created_at) VALUES (4, 4, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-06 13:02:31');
INSERT INTO indicador_bugs (id, indicador_id, icone, descricao, links, download, deformacoes, medidas, etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao, ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido, lista_pecas, xml, created_at) VALUES (5, 5, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-06 13:03:42');
INSERT INTO indicador_bugs (id, indicador_id, icone, descricao, links, download, deformacoes, medidas, etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao, ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido, lista_pecas, xml, created_at) VALUES (6, 6, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-06 13:04:29');
INSERT INTO indicador_bugs (id, indicador_id, icone, descricao, links, download, deformacoes, medidas, etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao, ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido, lista_pecas, xml, created_at) VALUES (7, 7, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-06 18:01:13');
INSERT INTO indicador_bugs (id, indicador_id, icone, descricao, links, download, deformacoes, medidas, etiqueta_proj_gab, aplicacao, cadastro, des_cabecalho, reg_configuracao, ficha, calculos_recursos, furacao, usinagem, roteiro, relatorio_pedido, lista_pecas, xml, created_at) VALUES (8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-07 14:31:43');

COMMIT;
PRAGMA foreign_keys = ON;