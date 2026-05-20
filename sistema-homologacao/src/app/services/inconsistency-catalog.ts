export interface InconsistencyCatalogGroup {
  group: string;
  items: Array<{ key: string; label: string }>;
}

export const INCONSISTENCY_CATALOG: InconsistencyCatalogGroup[] = [
  {
    group: 'CATÁLOGO',
    items: [
      { key: 'catalogo_icone', label: 'Ícone' },
      { key: 'catalogo_descricao', label: 'Descrição' },
      { key: 'catalogo_links', label: 'Links' },
      { key: 'catalogo_download', label: 'Download' }
    ]
  },
  {
    group: '3D',
    items: [
      { key: '3d_etiqueta', label: 'Etiqueta' },
      { key: '3d_projecao', label: 'Projeção' },
      { key: '3d_gabarito', label: 'Gabarito' },
      { key: '3d_incompatibilidade', label: 'Incompatibilidade' },
      { key: '3d_outros', label: 'Outros' }
    ]
  },
  {
    group: 'ACABAMENTOS',
    items: [{ key: 'acabamentos_aplicacao', label: 'Aplicação' }]
  },
  {
    group: 'OPÇÕES DO COMPONENTE',
    items: [
      { key: 'opcoes_cadastro', label: 'Cadastro' },
      { key: 'opcoes_cabecalho', label: 'Desenho de Cabeçalho' },
      { key: 'opcoes_configuracao', label: 'Regras de Configuração' }
    ]
  },
  {
    group: 'ARQUIT. PROD.',
    items: [{ key: 'arquitetura_ficha', label: 'Ficha' }]
  },
  {
    group: 'ORÇAMENTO',
    items: [{ key: 'orcamento_calculos', label: 'Cálculos de Recursos' }]
  },
  {
    group: 'PRODUÇÃO',
    items: [
      { key: 'producao_furacao', label: 'Furação' },
      { key: 'producao_usinagem', label: 'Usinagem' },
      { key: 'producao_roteiro', label: 'Roteiro' },
      { key: 'producao_relatorio', label: 'Relatório de Pedido' },
      { key: 'producao_lista_pecas', label: 'Lista de Peças para Produção' }
    ]
  },
  {
    group: 'INTEGRAÇÕES COM SISTEMAS FABRIS',
    items: [{ key: 'integracoes_xml', label: 'XML' }]
  }
];

export const FRONTEND_TO_BACKEND_INCONSISTENCY_KEY_MAP: Record<string, string> = {
  catalogo_icone: 'icone',
  catalogo_descricao: 'descricao',
  catalogo_links: 'links',
  catalogo_download: 'download',
  '3d_etiqueta': 'etiqueta_proj_gab',
  '3d_projecao': 'deformacoes',
  '3d_gabarito': 'medidas',
  '3d_incompatibilidade': 'deformacoes',
  '3d_outros': 'medidas',
  acabamentos_aplicacao: 'aplicacao',
  opcoes_cadastro: 'cadastro',
  opcoes_cabecalho: 'des_cabecalho',
  opcoes_configuracao: 'reg_configuracao',
  arquitetura_ficha: 'ficha',
  orcamento_calculos: 'calculos_recursos',
  producao_furacao: 'furacao',
  producao_usinagem: 'usinagem',
  producao_roteiro: 'roteiro',
  producao_relatorio: 'relatorio_pedido',
  producao_lista_pecas: 'lista_pecas',
  integracoes_xml: 'xml'
};

export const BACKEND_TO_FRONTEND_INCONSISTENCY_KEY_MAP: Record<string, string> = {
  icone: 'catalogo_icone',
  descricao: 'catalogo_descricao',
  links: 'catalogo_links',
  download: 'catalogo_download',
  deformacoes: '3d_projecao',
  medidas: '3d_gabarito',
  etiqueta_proj_gab: '3d_etiqueta',
  aplicacao: 'acabamentos_aplicacao',
  cadastro: 'opcoes_cadastro',
  des_cabecalho: 'opcoes_cabecalho',
  reg_configuracao: 'opcoes_configuracao',
  ficha: 'arquitetura_ficha',
  calculos_recursos: 'orcamento_calculos',
  furacao: 'producao_furacao',
  usinagem: 'producao_usinagem',
  roteiro: 'producao_roteiro',
  relatorio_pedido: 'producao_relatorio',
  lista_pecas: 'producao_lista_pecas',
  xml: 'integracoes_xml'
};

export const INCONSISTENCY_LABELS: Record<string, string> = INCONSISTENCY_CATALOG.reduce<Record<string, string>>((acc, group) => {
  group.items.forEach((item) => {
    acc[item.key] = item.label;
  });
  return acc;
}, {});

export function normalizeInconsistencyLabel(key: string): string {
  const normalizedKey = String(key ?? '').trim();
  return INCONSISTENCY_LABELS[normalizedKey] || normalizedKey;
}

export function mapFrontendInconsistencyKeyToBackend(key: string): string {
  return FRONTEND_TO_BACKEND_INCONSISTENCY_KEY_MAP[String(key ?? '')] || String(key ?? '');
}

export function mapBackendInconsistencyKeyToFrontend(key: string): string {
  return BACKEND_TO_FRONTEND_INCONSISTENCY_KEY_MAP[String(key ?? '')] || String(key ?? '');
}

export function buildBugTotalsFromIndicadores(indicadores: Array<{ bugs?: Record<string, number> | null }>): Record<string, number> {
  return (indicadores || []).reduce<Record<string, number>>((acc, indicador) => {
    const bugs = indicador?.bugs || {};
    Object.entries(bugs).forEach(([key, value]) => {
      const backendKey = String(key || '').trim();
      if (!backendKey) return;

      const frontendKey = mapBackendInconsistencyKeyToFrontend(backendKey) || backendKey;
      acc[frontendKey] = (acc[frontendKey] || 0) + Number(value || 0);
    });
    return acc;
  }, {});
}

export function buildMonthlyStatsFromIndicadores(indicadores: Array<{ mes?: string; ano?: number; status?: string; bugs?: Record<string, number> | null }>): Array<{ mes: string; ano: number; total: number; concluidos: number; media_bugs: number; total_bugs: number }> {
  const grouped = new Map<string, { mes: string; ano: number; total: number; concluidos: number; total_bugs: number }>();

  (indicadores || []).forEach((indicador) => {
    const mes = String(indicador?.mes || 'JANEIRO').trim();
    const ano = Number(indicador?.ano || new Date().getFullYear());
    const key = `${mes}-${ano}`;
    const current = grouped.get(key) || { mes, ano, total: 0, concluidos: 0, total_bugs: 0 };
    current.total += 1;
    current.concluidos += String(indicador?.status || '').toUpperCase() === 'CONCLUIDA' ? 1 : 0;
    current.total_bugs += Object.values(indicador?.bugs || {}).reduce((acc, value) => acc + Number(value || 0), 0);
    grouped.set(key, current);
  });

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    media_bugs: item.total > 0 ? Number((item.total_bugs / item.total).toFixed(1)) : 0
  }));
}

export function buildStatusStatsFromIndicadores(indicadores: Array<{ status?: string; bugs?: Record<string, number> | null }>): Array<{ status: string; total: number; concluidos: number }> {
  const grouped = new Map<string, { status: string; total: number; concluidos: number }>();

  (indicadores || []).forEach((indicador) => {
    const status = String(indicador?.status || 'MODELAGEM').trim().toUpperCase();
    const current = grouped.get(status) || { status, total: 0, concluidos: 0 };
    current.total += 1;
    current.concluidos += status === 'CONCLUIDA' ? 1 : 0;
    grouped.set(status, current);
  });

  return Array.from(grouped.values());
}

export function buildClientStatsFromIndicadores(indicadores: Array<{ cliente?: string; fabrica?: string; status?: string; bugs?: Record<string, number> | null }>): Array<{ cliente: string; cards: number; total: number; concluidos: number }> {
  const grouped = new Map<string, { cliente: string; cards: number; total: number; concluidos: number }>();

  (indicadores || []).forEach((indicador) => {
    const cliente = String(indicador?.cliente || indicador?.fabrica || 'SEM CLIENTE').trim();
    const current = grouped.get(cliente) || { cliente, cards: 0, total: 0, concluidos: 0 };
    current.cards += 1;
    current.total += 1;
    current.concluidos += String(indicador?.status || '').toUpperCase() === 'CONCLUIDA' ? 1 : 0;
    grouped.set(cliente, current);
  });

  return Array.from(grouped.values());
}