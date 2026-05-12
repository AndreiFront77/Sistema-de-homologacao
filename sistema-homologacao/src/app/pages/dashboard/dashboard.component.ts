import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';
import { ExportService } from '../../services/export.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  error: string | null = null;
  Object = Object; // Expor Object para usar no template

  // Dados brutos
  monthlyData: any[] = [];
  statusData: any[] = [];
  clientData: any[] = [];
  bugData: any = {};
  bugDataArray: any[] = [];

  // Resumo
  totalIndicadores = 0;
  totalCards = 0;
  totalBugs = 0;
  taxaConclusao = 0;

  // Chart config - Bugs por Categoria
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Quantidade',
        backgroundColor: []
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { beginAtZero: true }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initialized');
    this.loadDashboard();
  }

  // Método acionado pelo botão de debug/usuário
  public debugLoad(): void {
    console.log('🔧 debugLoad chamado');
    this.loadDashboard(true);
  }

  public refresh(): void {
    this.debugLoad();
  }

  private loadDashboard(forceNetwork = false): void {
    const cachedStats = this.dashboardService.getCachedDashboardStats();

    this.error = null;
    this.loading = forceNetwork || !cachedStats;

    if (cachedStats) {
      this.processStats(cachedStats);
    }

    this.dashboardService.loadDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.processStats(stats);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ ERRO ao carregar dashboard:', err);

          if (!cachedStats) {
            this.error = 'Erro: ' + String(err);
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }

          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  public exportCSV(): void {
    this.exportService.exportCSV()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          const now = new Date().toISOString().slice(0, 10);
          this.exportService.downloadFile(blob, `indicadores_${now}.csv`);
        },
        error: (err: any) => {
          alert('Erro ao exportar CSV: ' + (err?.message || err));
        }
      });
  }

  public exportJSON(): void {
    this.exportService.exportJSON()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          const now = new Date().toISOString().slice(0, 10);
          this.exportService.downloadJSON(data, `indicadores_${now}.json`);
        },
        error: (err: any) => {
          alert('Erro ao exportar JSON: ' + (err?.message || err));
        }
      });
  }

  public processStats(stats: any): void {
    console.log('processStats chamado com:', stats);

    if (!stats) return;

    if (stats.status && Array.isArray(stats.status)) {
      this.statusData = stats.status;
    }
    if (stats.clients && Array.isArray(stats.clients)) {
      this.clientData = stats.clients;
    }
    if (stats.monthly && Array.isArray(stats.monthly)) {
      this.monthlyData = stats.monthly;
    }
    if (stats.bugs) {
      // Suporta bugs vindo como objeto ou como array com um único elemento
      const bugsObj = Array.isArray(stats.bugs) ? (stats.bugs[0] || {}) : stats.bugs || {};
      this.bugData = bugsObj;
      // Converter bugData em array para exibir em tabela
      this.bugDataArray = Object.entries(this.bugData).map(([key, value]) => ({
        categoria: this.formatBugName(key),
        quantidade: Number(value) || 0,
        key
      }));

      // Atualizar gráfico
      this.updateBugChart();
    }

    // Totais
    try {
      this.totalIndicadores = this.monthlyData.reduce((acc: number, m: any) => acc + (m.total || 0), 0);
      const totalConcluidos = this.monthlyData.reduce((acc: number, m: any) => acc + (m.concluidos || 0), 0);
      this.taxaConclusao = this.totalIndicadores > 0 ? Math.round((totalConcluidos / this.totalIndicadores) * 100) : 0;
    } catch (e) {
      console.warn('Erro ao calcular totais mensais', e);
    }

    try {
      this.totalCards = this.clientData.reduce((acc: number, c: any) => acc + (c.cards || 0), 0);
    } catch (e) {
      console.warn('Erro ao calcular totalCards', e);
    }

    try {
      if (this.bugData) {
        const values = Object.values(this.bugData).map(v => Number(v) || 0);
        this.totalBugs = values.reduce((a, b) => a + b, 0);
      }
    } catch (e) {
      console.warn('Erro ao calcular totalBugs', e);
    }

    this.cdr.detectChanges();
  }

  private updateBugChart(): void {
    if (!this.bugDataArray || this.bugDataArray.length === 0) {
      this.barChartData.labels = [];
      this.barChartData.datasets[0].data = [];
      this.barChartData.datasets[0].backgroundColor = [];
      return;
    }

    // Ordenar desc por quantidade
    const sorted = [...this.bugDataArray].sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0));

    const labels = sorted.map(s => s.categoria);
    const data = sorted.map(s => s.quantidade || 0);

    // Gerar cores simples (azul com variação de alpha)
    const colors = data.map(() => 'rgba(54, 162, 235, 0.85)');

    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data = data as number[];
    this.barChartData.datasets[0].backgroundColor = colors;
  }

  public translateStatus(status: any): string {
    const s = String(status || '');
    const translations: { [key: string]: string } = {
      'MODELAGEM': 'Modelagem',
      'HOMOLOGACAO': 'Homologação',
      'EM_HOMOLOGACAO': 'Em Homologação',
      'CONCLUIDA': 'Concluída'
    };
    return translations[s] || s;
  }

  public formatBugName(key: any): string {
    const k = String(key || '');
    const translations: { [key: string]: string } = {
      'icone': 'Ícone',
      'descricao': 'Descrição',
      'links': 'Links',
      'download': 'Download',
      'deformacoes': 'Deformações',
      'medidas': 'Medidas',
      'etiqueta_proj_gab': 'Etiqueta/Proj/Gab',
      'aplicacao': 'Aplicação',
      'cadastro': 'Cadastro',
      'des_cabecalho': 'Desenho de Cabeçalho',
      'reg_configuracao': 'Regras de Configuração',
      'ficha': 'Ficha',
      'calculos_recursos': 'Cálculos de Recursos',
      'furacao': 'Furação',
      'usinagem': 'Usinagem',
      'roteiro': 'Roteiro',
      'relatorio_pedido': 'Relatório de Pedido',
      'lista_pecas': 'Lista de Peças',
      'xml': 'XML'
    };
    return translations[k] || k;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }
}
