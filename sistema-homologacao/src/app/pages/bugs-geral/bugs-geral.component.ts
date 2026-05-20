import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';
import { INCONSISTENCY_LABELS } from '../../services/inconsistency-catalog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-bugs-geral',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  templateUrl: './bugs-geral.component.html',
  styleUrls: ['./bugs-geral.component.css']
})
export class BugsGeralComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  error: string | null = null;

  // Dados de bugs
  bugsData: any = {};
  bugsArray: BugItem[] = [];
  totalBugs = 0;

  // Mapeamento de nomes em português
  bugLabels: { [key: string]: string } = {
    ...INCONSISTENCY_LABELS
  };

  // Chart config - Horizontal Bar Chart
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Quantidade de Inconsistências',
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return (context.raw || 0) + ' inconsistência(s)';
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('BugsGeral component initialized');
    this.loadBugsData();
  }

  private loadBugsData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getBugStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bugs) => {
          this.processBugsData(bugs);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Erro ao carregar bugs:', err);
          this.error = 'Erro ao carregar dados de inconsistências: ' + String(err?.message || err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  public processBugsData(bugs: any): void {
    console.log('Processando bugs data:', bugs);

    if (!bugs) return;

    this.bugsData = bugs;

    // Converter em array para exibição em tabela e gráfico
    this.bugsArray = Object.entries(bugs)
      .map(([key, value]) => ({
        key,
        label: this.bugLabels[key] || key,
        quantidade: Number(value) || 0
      }))
      .sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0));

    // Calcular total
    this.totalBugs = this.bugsArray.reduce((acc, item) => acc + (item.quantidade || 0), 0);

    // Atualizar gráfico
    this.updateChart();

    this.cdr.detectChanges();
  }

  private updateChart(): void {
    if (!this.bugsArray || this.bugsArray.length === 0) {
      this.barChartData.labels = [];
      this.barChartData.datasets[0].data = [];
      return;
    }

    const labels = this.bugsArray.map(item => item.label);
    const data = this.bugsArray.map(item => item.quantidade);

    // Gerar cores gradualmente
    const colors = this.bugsArray.map((_, index) => {
      const hue = (index * 360) / this.bugsArray.length;
      return `hsl(${hue}, 70%, 60%)`;
    });

    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data = data as number[];
    this.barChartData.datasets[0].backgroundColor = colors;
  }

  public refresh(): void {
    this.loadBugsData();
  }

  public exportData(): void {
    const csv = this.generateCSV();
    this.downloadFile(csv, 'bugs-geral.csv', 'text/csv');
  }

  private generateCSV(): string {
    let csv = 'Subcategoria,Quantidade\n';
    this.bugsArray.forEach(item => {
      csv += `${item.label},${item.quantidade}\n`;
    });
    csv += `\nTOTAL,${this.totalBugs}\n`;
    return csv;
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  public getUrgencyClass(count: number): string {
    if (count === 0) return 'critical';
    if (count < 5) return 'high';
    if (count < 15) return 'medium';
    return 'low';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

interface BugItem {
  key: string;
  label: string;
  quantidade: number;
}
