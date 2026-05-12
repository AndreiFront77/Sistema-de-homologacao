import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BusinessmapCard } from '../../models/card.model';
import { HomologacaoService } from '../../services/homologacao.service';
import { Indicador, IndicadorService } from '../../services/indicador.service';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="page" *ngIf="card$ | async as card; else loading">
      <header class="hero">
        <div>
          <button class="back-button" (click)="voltar()">← Voltar</button>
          <p class="eyebrow">Entrada do card</p>
          <h1>{{ card.title }}</h1>
          <p class="subtext">Card ID: <strong>{{ card.card_id }}</strong></p>
        </div>
        <div class="hero-badges">
          <span class="badge">{{ card.column_name }}</span>
          <span class="badge muted">{{ card['status'] || 'MODELAGEM' }}</span>
        </div>
      </header>

      <section class="grid">
        <article class="panel">
          <h2>Dados do card</h2>
          <div class="info-list">
            <div><span>Cliente</span><strong>{{ card['cliente'] || 'Não informado' }}</strong></div>
            <div><span>Componente</span><strong>{{ card['componente'] || 'Não informado' }}</strong></div>
            <div><span>Nível</span><strong>{{ card['nivel'] || 1 }}</strong></div>
            <div><span>Modelo</span><strong>{{ card['mod'] || 'EXT' }}</strong></div>
            <div><span>Homologador</span><strong>{{ card['homologador'] || 'Não informado' }}</strong></div>
          </div>
        </article>

        <form class="panel form-panel" (ngSubmit)="salvar()">
          <h2>Cadastro da homologação</h2>

          <div class="form-grid">
            <label>
              Card ID
              <input name="card_id" [(ngModel)]="form.card_id" readonly />
            </label>
            <label>
              Cliente
              <input name="cliente" [(ngModel)]="form.cliente" />
            </label>
            <label>
              Componente
              <input name="componente" [(ngModel)]="form.componente" />
            </label>
            <label>
              Nível
              <input name="nivel" type="number" [(ngModel)]="form.nivel" min="1" max="7" />
            </label>
            <label>
              Modelagem
              <select name="mod" [(ngModel)]="form.mod">
                <option value="EXT">EXT</option>
                <option value="INT">INT</option>
              </select>
            </label>
            <label>
              Homologador
              <input name="homologador" [(ngModel)]="form.homologador" />
            </label>
            <label>
              Status
              <select name="status" [(ngModel)]="form.status">
                <option *ngFor="let option of getStatusOptions()" [value]="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>
            <label>
              Data de Início
              <input name="data_inicio" type="date" [(ngModel)]="form.data_inicio" />
            </label>
            <label>
              Data de Conclusão
              <input name="data_conclusao" type="date" [(ngModel)]="form.data_conclusao" />
            </label>
            <label>
              Mês
              <input name="mes" [(ngModel)]="form.mes" />
            </label>
            <label>
              Ano
              <input name="ano" type="number" [(ngModel)]="form.ano" />
            </label>
          </div>

          <label class="full-width">
            Observações
            <textarea name="observacoes" rows="4" [(ngModel)]="form.observacoes"></textarea>
          </label>

          <div class="bugs-box">
            <h3>Inconsistências</h3>
            <p class="hint">Escolha a categoria e adicione as inconsistências apontadas pelo homologador.</p>

            <div class="inconsistency-picker">
              <label class="wide">
                Grupo
                <select
                  name="selectedInconsistencyGroup"
                  [(ngModel)]="selectedInconsistencyGroup"
                  (ngModelChange)="onSelectedInconsistencyGroupChange($event)"
                >
                  <option *ngFor="let group of inconsistencyCatalog" [value]="group.group">
                    {{ group.group }}
                  </option>
                </select>
              </label>

              <label class="wide">
                Subgrupo
                <select name="selectedInconsistencyKey" [(ngModel)]="selectedInconsistencyKey">
                  <option *ngFor="let item of getSelectedInconsistencyItems()" [value]="item.key">
                    {{ item.label }}
                  </option>
                </select>
              </label>

              <p class="selected-subgroup-description" *ngIf="getSelectedInconsistencyOption() as selectedOption">
                {{ selectedOption.group }} / {{ selectedOption.label }}
              </p>

              <label class="wide">
                Descrição da inconsistência
                <textarea
                  name="selectedInconsistencyDescription"
                  rows="2"
                  [(ngModel)]="selectedInconsistencyDescription"
                  placeholder="Explique a inconsistência encontrada"
                ></textarea>
              </label>

              <button type="button" class="add-button" (click)="addInconsistency()">
                Adicionar
              </button>
            </div>

            <div class="selected-list" *ngIf="selectedInconsistencies.length > 0; else emptyInconsistencies">
              <div class="selected-item" *ngFor="let item of selectedInconsistencies">
                <div class="selected-info">
                  <label class="item-field">
                    Tipo da inconsistência
                    <select
                      [ngModel]="item.key"
                      [ngModelOptions]="{ standalone: true }"
                      (ngModelChange)="changeInconsistencyType(item.key, $event)"
                    >
                      <optgroup *ngFor="let group of inconsistencyCatalog" [label]="group.group">
                        <option *ngFor="let option of group.items" [value]="option.key">
                          {{ option.label }}
                        </option>
                      </optgroup>
                    </select>
                  </label>
                  <span>{{ item.group }}</span>
                  <p class="selected-description" *ngIf="item.description">{{ item.description }}</p>
                </div>
                <div class="selected-actions">
                  <span class="count">x{{ item.count }}</span>
                  <button type="button" class="remove-button" (click)="removeInconsistency(item.key)">
                    Remover
                  </button>
                </div>
              </div>
            </div>

            <ng-template #emptyInconsistencies>
              <p class="empty-bugs">Nenhuma inconsistência adicionada.</p>
            </ng-template>
          </div>

          <div class="actions">
            <button type="submit" class="save-button" [disabled]="saving">
              {{ saving ? 'Salvando...' : 'Salvar cadastro' }}
            </button>
          </div>
        </form>
      </section>

      <section class="panel dashboard-panel">
        <h2>Dashboard do card</h2>
        <ng-container *ngIf="dashboard$ | async as dashboard; else loadingDashboard">
          <div class="dashboard-grid">
            <article class="metric-card">
              <span>Registros</span>
              <strong>{{ dashboard.totalRegistros }}</strong>
            </article>
            <article class="metric-card">
              <span>Total de bugs</span>
              <strong>{{ dashboard.totalBugs }}</strong>
            </article>
            <article class="metric-card">
              <span>Média de bugs</span>
              <strong>{{ dashboard.mediaBugs }}</strong>
            </article>
            <article class="metric-card">
              <span>Status atual</span>
              <strong>{{ dashboard.ultimoStatus }}</strong>
            </article>
          </div>
        </ng-container>

        <ng-template #loadingDashboard>
          <p class="empty-bugs">Carregando dashboard do card...</p>
        </ng-template>
      </section>

      <section class="panel history-panel">
        <h2>Registros salvos deste card</h2>
        <ng-container *ngIf="historico$ | async as historico; else loadingHistorico">
          <ng-container *ngIf="historico.total > 0; else emptyHistorico">
            <div class="history-list">
              <div class="history-item" *ngFor="let item of historico.indicadores">
                <div class="history-top">
                  <strong>Status: {{ item.status || 'MODELAGEM' }}</strong>
                  <span>{{ item.created_at | date : 'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <p><strong>ID do card:</strong> {{ item.card_id }}</p>
                <p><strong>Nível:</strong> {{ item.nivel || 1 }} | <strong>Modelo:</strong> {{ item.mod || 'EXT' }}</p>
                <p><strong>Bugs/Inconsistências:</strong> {{ item.somatorio_bugs || 0 }}</p>
                <p class="history-note" *ngIf="item.observacoes">{{ item.observacoes }}</p>
              </div>
            </div>
          </ng-container>
        </ng-container>

        <ng-template #loadingHistorico>
          <p class="empty-bugs">Carregando registros salvos...</p>
        </ng-template>

        <ng-template #emptyHistorico>
          <p class="empty-bugs">Nenhum registro salvo para este card ainda.</p>
        </ng-template>
      </section>
    </main>

    <ng-template #loading>
      <main class="page">
        <div class="panel loading">Carregando card...</div>
      </main>
    </ng-template>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(180deg, #f6f8ff 0%, #ffffff 100%);
    }

    .hero {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .eyebrow {
      margin: 0 0 0.25rem 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #a3a7b9;
      font-size: 0.75rem;
      font-weight: 700;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #1f2937;
    }

    .subtext {
      margin: 0.5rem 0 0 0;
      color: #4b5563;
    }

    .hero-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .badge {
      background: #54db1f ;
      color: #000000;
      border: 1px solid #0a0a0a ;
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .badge.muted {
      background: #e5e7eb;
      color: #374151;
    }

    .back-button {
      margin-bottom: 0.75rem;
      border: none;
      background: #54db1f ;
      color: #000000 ;
      border: 1px solid #070707  ;
      font-weight: 700;
      cursor: pointer;
      padding: 0.25rem 0.75rem;
    }

    .grid {
      display: grid;
      grid-template-columns: 0.8fr 1.2fr;
      gap: 1rem;
    }

    .panel {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      padding: 1.25rem;
      box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
    }

    .panel h2 {
      margin: 0 0 1rem 0;
      color: #1f2937;
    }

    .info-list {
      display: grid;
      gap: 0.85rem;
    }

    .info-list div {
      display: grid;
      gap: 0.2rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 0.75rem;
    }

    .info-list span {
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
    }

    .info-list strong {
      color: #111827;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.85rem;
    }

    label {
      display: grid;
      gap: 0.35rem;
      font-weight: 600;
      color: #374151;
    }

    input, textarea, select {
      border: 1px solid #d1d5db;
      border-radius: 1rem;
      padding: 0.8rem 0.95rem;
      font: inherit;
      outline: none;
      background: #fff;
    }

    input:focus, textarea:focus, select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
    }

    .full-width {
      margin-top: 0.85rem;
    }

    .bugs-box {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .hint {
      margin: -0.25rem 0 0.75rem 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .inconsistency-picker {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.85rem;
      align-items: start;
    }

    .wide {
      width: 100%;
    }

    .inconsistency-picker select {
      width: 100%;
    }

    .selected-subgroup-description {
      margin: -0.3rem 0 0;
      color: #667eea;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .add-button,
    .remove-button {
      border: none;
      border-radius: 999px;
      padding: 0.75rem 1rem;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .add-button {
      background: #54db1f ;
      color: #000000;
      border: 1px solid #0a0a0a ;
    }

    .remove-button {
      background: #f3f4f6;
      color: #374151;
    }

    .selected-list {
      display: grid;
      gap: 0.65rem;
      margin-top: 1rem;
    }

    .selected-item {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
      padding: 0.8rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.85rem;
      background: #fafafa;
    }

    .selected-info {
      display: grid;
      gap: 0.2rem;
    }

    .item-field {
      display: grid;
      gap: 0.35rem;
      font-weight: 700;
      color: #374151;
    }

    .item-field select {
      min-width: 18rem;
    }

    .selected-info > span {
      font-size: 0.8rem;
      color: #667eea;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .selected-description {
      margin: 0;
      color: #4b5563;
      font-size: 0.9rem;
      white-space: pre-line;
    }

    .selected-actions {
      display: flex;
      gap: 0.65rem;
      align-items: center;
    }

    .count {
      font-weight: 800;
      color: #667eea;
      min-width: 2rem;
      text-align: right;
    }

    .empty-bugs {
      margin: 0.85rem 0 0 0;
      color: #6b7280;
      font-style: italic;
    }

    .actions {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
    }

    .save-button {
      background: #54db1f;
      color: #000000;
      padding: 0.9rem 1.25rem;
      border: 1px solid #000000;
      border-radius: 999px;
      font-weight: 700;
      cursor: pointer;
    }

    .save-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading {
      text-align: center;
      color: #6b7280;
    }

    .dashboard-panel {
      margin-top: 1rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.85rem;
    }

    .metric-card {
      display: grid;
      gap: 0.35rem;
      padding: 1rem;
      border-radius: 0.9rem;
      background: linear-gradient(180deg, #f8fbff 0%, #eef2ff 100%);
      border: 1px solid #e5e7eb;
    }

    .metric-card span {
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .metric-card strong {
      font-size: 1.35rem;
      color: #1f2937;
    }

    .history-panel {
      margin-top: 1rem;
    }

    .history-list {
      display: grid;
      gap: 0.85rem;
    }

    .history-item {
      border: 1px solid #e5e7eb;
      border-radius: 0.9rem;
      padding: 1rem;
      background: #fafafa;
    }

    .history-top {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
      color: #374151;
    }

    .history-note {
      color: #4b5563;
      margin: 0.5rem 0 0 0;
    }

    @media (max-width: 980px) {
      .grid {
        grid-template-columns: 1fr;
      }

      .form-grid,
      .bugs-grid {
        grid-template-columns: 1fr;
      }

      .hero {
        flex-direction: column;
      }
    }
  `]
})
export class CardDetailComponent implements OnInit {
  card$!: Observable<BusinessmapCard | null>;
  historico$!: Observable<{ ok: boolean; total: number; indicadores: Indicador[] }>;
  dashboard$!: Observable<{ totalRegistros: number; totalBugs: number; mediaBugs: string; ultimoStatus: string }>;
  saving = false;
  private currentCardId = '';
  private currentCardTitle = '';

  private readonly statusOptions: Array<{ value: string; label: string }> = [
    { value: 'EM_MODELAGEM', label: 'Em modelagem' },
    { value: 'EM_HOMOLOGACAO', label: 'Em homologacao' },
    { value: 'CONCLUIDA', label: 'Concluida' }
  ];

  inconsistencyCatalog = [
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
      items: [
        { key: 'acabamentos_aplicacao', label: 'Aplicação' }
      ]
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
      items: [
        { key: 'arquitetura_ficha', label: 'Ficha' }
      ]
    },
    {
      group: 'ORÇAMENTO',
      items: [
        { key: 'orcamento_calculos', label: 'Cálculos de Recursos' }
      ]
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
      items: [
        { key: 'integracoes_xml', label: 'XML' }
      ]
    }
  ];

  selectedInconsistencyGroup = this.inconsistencyCatalog[0].group;
  selectedInconsistencyKey = this.getFirstInconsistencyKey(this.selectedInconsistencyGroup);
  selectedInconsistencyDescription = '';
  selectedInconsistencies: Array<{ key: string; label: string; group: string; count: number; description: string }> = [];

  form: Indicador = {
    card_id: '',
    fabrica: '',
    cliente: '',
    componente: '',
    nivel: 1,
    mod: 'EXT',
    homologador: '',
    status: 'MODELAGEM',
    mes: 'JANEIRO',
    ano: new Date().getFullYear(),
    data_inicio: undefined,
    data_conclusao: undefined,
    observacoes: '',
    bugs: {}
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private homologacaoService: HomologacaoService,
    private indicadorService: IndicadorService
  ) {}

  ngOnInit(): void {
    const cardId = String(this.route.snapshot.paramMap.get('cardId') || '');
    this.currentCardId = cardId;
    this.card$ = this.homologacaoService.getCardById(cardId);
    this.loadCardHistory(cardId);

    this.card$.subscribe(card => {
      if (!card) {
        return;
      }

      this.currentCardTitle = String(card.title || '');

      this.form = {
        card_id: String(card.card_id),
        fabrica: this.resolveFabrica(card),
        cliente: String(card['cliente'] ?? ''),
        componente: String(card['componente'] ?? ''),
        nivel: Number(card['nivel'] ?? 1),
        mod: String(card['mod'] ?? 'EXT'),
        homologador: String(card['homologador'] ?? ''),
        status: String(card['status'] ?? 'MODELAGEM'),
        mes: String(card['mes'] ?? 'JANEIRO'),
        ano: Number(card['ano'] ?? new Date().getFullYear()),
        data_inicio: undefined,
        data_conclusao: undefined,
        observacoes: '',
        bugs: {}
      };

      this.selectedInconsistencies = [];
      this.resetSelectedInconsistency();
      this.selectedInconsistencyDescription = '';
    });

    this.loadLatestSavedIndicador(cardId);
  }

  private loadCardHistory(cardId: string): void {
    const historico$ = this.indicadorService.getIndicadoresByCardId(cardId).pipe(shareReplay(1));
    this.historico$ = historico$;
    this.dashboard$ = historico$.pipe(
      map((response) => {
        const totalRegistros = response.total || 0;
        const totalBugs = (response.indicadores || []).reduce((acc, item) => acc + Number(item.somatorio_bugs || 0), 0);
        return {
          totalRegistros,
          totalBugs,
          mediaBugs: totalRegistros > 0 ? (totalBugs / totalRegistros).toFixed(1) : '0.0',
          ultimoStatus: response.indicadores?.[0]?.status || 'MODELAGEM'
        };
      })
    );
  }

  bugLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  getStatusOptions(): Array<{ value: string; label: string }> {
    return this.statusOptions;
  }

  addInconsistency(): void {
    const found = this.findInconsistencyOption(this.selectedInconsistencyKey);
    if (!found) {
      return;
    }

    const description = this.selectedInconsistencyDescription.trim();
    const existing = this.selectedInconsistencies.find(item => item.key === found.key);
    if (existing) {
      existing.count += 1;
      if (description) {
        existing.description = existing.description
          ? `${existing.description}\n${description}`
          : description;
      }
    } else {
      this.selectedInconsistencies = [
        ...this.selectedInconsistencies,
        { key: found.key, label: found.label, group: found.group, count: 1, description }
      ];
    }

    this.syncSelectedInconsistenciesToBugs();

    this.selectedInconsistencyDescription = '';
    this.resetSelectedInconsistency(found.key);
  }

  changeInconsistencyType(currentKey: string, newKey: string): void {
    const currentItem = this.selectedInconsistencies.find(entry => entry.key === currentKey);
    if (!currentItem || currentKey === newKey) {
      return;
    }

    const found = this.findInconsistencyOption(newKey);
    if (!found) {
      return;
    }

    const duplicate = this.selectedInconsistencies.find(entry => entry.key === newKey);
    if (duplicate) {
      duplicate.count += currentItem.count;
      if (currentItem.description) {
        duplicate.description = duplicate.description
          ? `${duplicate.description}
${currentItem.description}`
          : currentItem.description;
      }
      this.selectedInconsistencies = this.selectedInconsistencies.filter(entry => entry.key !== currentKey);
      this.syncSelectedInconsistenciesToBugs();
      return;
    }

    currentItem.key = found.key;
    currentItem.label = found.label;
    currentItem.group = found.group;
    this.syncSelectedInconsistenciesToBugs();
  }

  removeInconsistency(key: string): void {
    const item = this.selectedInconsistencies.find(entry => entry.key === key);
    if (!item) {
      return;
    }

    if (item.count > 1) {
      item.count -= 1;
      this.syncSelectedInconsistenciesToBugs();
      return;
    }

    this.selectedInconsistencies = this.selectedInconsistencies.filter(entry => entry.key !== key);
    this.syncSelectedInconsistenciesToBugs();
  }

  private syncSelectedInconsistenciesToBugs(): void {
    this.form.bugs = this.selectedInconsistencies.reduce<Record<string, number>>((acc, item) => {
      acc[item.key] = item.count;
      return acc;
    }, {});
  }

  onSelectedInconsistencyGroupChange(groupName: string): void {
    const group = this.getInconsistencyGroup(groupName) || this.inconsistencyCatalog[0];
    this.selectedInconsistencyGroup = group?.group || '';
    this.selectedInconsistencyKey = group?.items[0]?.key || '';
    this.selectedInconsistencyDescription = '';
  }

  getSelectedInconsistencyItems(): Array<{ key: string; label: string }> {
    return this.getInconsistencyGroup(this.selectedInconsistencyGroup)?.items || [];
  }

  getSelectedInconsistencyOption(): { key: string; label: string; group: string } | null {
    return this.findInconsistencyOption(this.selectedInconsistencyKey);
  }

  private resetSelectedInconsistency(preferredKey?: string): void {
    if (preferredKey) {
      const found = this.findInconsistencyOption(preferredKey);
      if (found) {
        this.selectedInconsistencyGroup = found.group;
        this.selectedInconsistencyKey = found.key;
        return;
      }
    }

    const firstGroup = this.inconsistencyCatalog[0];
    this.selectedInconsistencyGroup = firstGroup?.group || '';
    this.selectedInconsistencyKey = firstGroup?.items[0]?.key || '';
  }

  private getFirstInconsistencyKey(groupName: string): string {
    return this.getInconsistencyGroup(groupName)?.items[0]?.key || this.inconsistencyCatalog[0]?.items[0]?.key || '';
  }

  private getInconsistencyGroup(groupName: string): { group: string; items: Array<{ key: string; label: string }> } | null {
    return this.inconsistencyCatalog.find(group => group.group === groupName) || null;
  }

  private loadLatestSavedIndicador(cardId: string): void {
    this.indicadorService.getIndicadoresByCardId(cardId).subscribe({
      next: (response) => {
        const latest = response.indicadores?.[0];
        if (!latest) {
          return;
        }

        this.applySavedIndicador(latest);
      },
      error: (error) => {
        console.error('Erro ao carregar histórico do card:', error);
      }
    });
  }

  private applySavedIndicador(indicador: Indicador): void {
    const bugs = this.mapBugsFromBackend(indicador.bugs || {});

    this.form = {
      ...this.form,
      card_id: String(indicador.card_id || this.form.card_id),
      fabrica: String(indicador.fabrica || this.form.fabrica || ''),
      cliente: String(indicador.cliente ?? this.form.cliente ?? ''),
      componente: String(indicador.componente ?? this.form.componente ?? ''),
      nivel: Number(indicador.nivel ?? this.form.nivel ?? 1),
      mod: String(indicador.mod ?? this.form.mod ?? 'EXT'),
      homologador: String(indicador.homologador ?? this.form.homologador ?? ''),
      status: String(indicador.status ?? this.form.status ?? 'MODELAGEM'),
      mes: String(indicador.mes ?? this.form.mes ?? 'JANEIRO'),
      ano: Number(indicador.ano ?? this.form.ano ?? new Date().getFullYear()),
      data_inicio: indicador.data_inicio || this.form.data_inicio,
      data_conclusao: indicador.data_conclusao || this.form.data_conclusao,
      observacoes: this.extractBaseObservacoes(String(indicador.observacoes || '')),
      bugs
    };

    this.selectedInconsistencies = this.buildSelectedInconsistenciesFromBugs(bugs);
    this.resetSelectedInconsistency(this.selectedInconsistencies[0]?.key);
    this.selectedInconsistencyDescription = '';
  }

  private findInconsistencyOption(key: string): { key: string; label: string; group: string } | null {
    for (const group of this.inconsistencyCatalog) {
      const item = group.items.find(entry => entry.key === key);
      if (item) {
        return { ...item, group: group.group };
      }
    }

    return null;
  }

  private resolveFabrica(card: BusinessmapCard): string {
    const fabrica = String(card['fabrica'] ?? card['cliente'] ?? '').trim();
    if (fabrica) {
      return fabrica;
    }

    return this.extractFabricaFromTitle(card.title) || 'SEM_FABRICA';
  }

  private extractFabricaFromTitle(title: string): string {
    return String(title || '')
      .split(' - ')[0]
      .trim();
  }

  private mapBugsToBackend(bugs: Record<string, number>): Record<string, number> {
    const keyMap: Record<string, string> = {
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

    return Object.entries(bugs || {}).reduce<Record<string, number>>((acc, [key, value]) => {
      const backendKey = keyMap[key] || key;
      acc[backendKey] = Number(value || 0);
      return acc;
    }, {});
  }

  private mapBugsFromBackend(bugs: Record<string, number>): Record<string, number> {
    const keyMap: Record<string, string> = {
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

    return Object.entries(bugs || {}).reduce<Record<string, number>>((acc, [key, value]) => {
      const frontendKey = keyMap[key] || key;
      const count = Number(value || 0);
      if (count > 0) {
        acc[frontendKey] = count;
      }
      return acc;
    }, {});
  }

  private buildSelectedInconsistenciesFromBugs(bugs: Record<string, number>): Array<{ key: string; label: string; group: string; count: number; description: string }> {
    return Object.entries(bugs || {}).reduce<Array<{ key: string; label: string; group: string; count: number; description: string }>>((items, [key, count]) => {
      const found = this.findInconsistencyOption(key);
      const amount = Number(count || 0);
      if (!found || amount <= 0) {
        return items;
      }

      return [...items, {
        key: found.key,
        label: found.label,
        group: found.group,
        count: amount,
        description: ''
      }];
    }, []);
  }

  private extractBaseObservacoes(observacoes: string): string {
    const marker = '\n\nInconsistências:\n';
    const position = observacoes.indexOf(marker);
    if (position === -1) {
      return observacoes.trim();
    }

    return observacoes.slice(0, position).trim();
  }

  salvar(): void {
    this.saving = true;

    const inconsistencyNotes = this.selectedInconsistencies
      .map(item => `${item.label} (${item.group}) x${item.count}${item.description ? ` - ${item.description}` : ''}`)
      .join('\n');

    const observacoes = [
      this.form.observacoes?.trim(),
      inconsistencyNotes ? `Inconsistências:\n${inconsistencyNotes}` : ''
    ].filter(Boolean).join('\n\n');

    const payload: Indicador = {
      ...this.form,
      fabrica: String(this.form.fabrica || this.extractFabricaFromTitle(this.currentCardTitle) || 'SEM_FABRICA').trim(),
      observacoes,
      somatorio_bugs: Object.values(this.form.bugs || {}).reduce((acc, value) => acc + Number(value || 0), 0),
      bugs: this.mapBugsToBackend(this.form.bugs || {})
    };

    this.indicadorService.createIndicador(payload).subscribe({
      next: (response) => {
        this.saving = false;
        
        // Atualizar card com os dados da homologação
        this.card$.pipe().subscribe(card => {
          if (card) {
            this.homologacaoService.updateCardWithIndicador(this.currentCardId, response.indicador);
            this.homologacaoService.addOrUpdateHomologacao(card, response.indicador);
          }
        });

        alert('Cadastro salvo com sucesso.');
        this.loadCardHistory(this.currentCardId);
      },
      error: (error) => {
        this.saving = false;
        console.error('Erro ao salvar indicador:', error);
        alert('Não foi possível salvar o cadastro.');
      }
    });
  }

  voltar(): void {
    void this.router.navigate(['/']);
  }
}
