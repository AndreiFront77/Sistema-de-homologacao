import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../../services/dashboard.service';
import { normalizeInconsistencyLabel } from '../../../services/inconsistency-catalog';

interface Bug3DData {
  model: string;
  type: string;
  count: number;
  percentage: number;
  status: 'success' | 'warning' | 'danger' | 'info';
  icon: string;
}

@Component({
  selector: 'app-bug-3d',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `
    <div class="dashboard-content">
      <div *ngIf="loading" class="loading-spinner"><div class="spinner"></div><p>Carregando dashboard...</p></div>
      <div *ngIf="!loading && error" class="error-state"><span style="font-size: 48px;">⚠️</span><p class="error-message">{{ error }}</p></div>
      <div *ngIf="!loading && !error" class="content">
        <div class="dashboard-section-header">
          <h2>🎯 Bugs - Modelos 3D</h2>
          <p class="description">Inconsistências relacionadas a modelos e projetos 3D</p>
        </div>
        <div class="infografia-container">
          <div class="infografia-card danger"><span class="infografia-icon">🎯</span><div class="infografia-value">{{ totalBugs }}</div><div class="infografia-label">Total de Bugs</div><div class="infografia-unit">Em modelos 3D</div></div>
          <div class="infografia-card info"><span class="infografia-icon">📐</span><div class="infografia-value">{{ modelCount }}</div><div class="infografia-label">Modelos</div><div class="infografia-unit">Com problemas</div></div>
          <div class="infografia-card warning"><span class="infografia-icon">⚠️</span><div class="infografia-value">{{ criticalCount }}</div><div class="infografia-label">Críticos</div><div class="infografia-unit">Requerem atenção</div></div>
          <div class="infografia-card success"><span class="infografia-icon">✓</span><div class="infografia-value">{{ resolutionRate }}%</div><div class="infografia-label">Taxa de Resolução</div><div class="infografia-unit">Bugs resolvidos</div></div>
        </div>
        <div class="chart-container">
          <h3 class="chart-title"><span class="chart-title-icon">📊</span>Distribuição por Tipo</h3>
          <div class="chart-content"><div style="display: flex; align-items: center; justify-content: center; height: 300px; color: #95a5a6;"><p>Gráfico será renderizado aqui</p></div></div>
        </div>
        <div class="categories-grid">
          <div class="category-card" *ngFor="let item of bug3dData" [ngClass]="'status-' + item.status">
            <div class="category-header"><span class="category-icon">{{ item.icon }}</span><div class="category-titles"><span class="category-name">{{ item.model }}</span><span class="category-parent">{{ item.type }}</span></div></div>
            <div class="category-stats"><div class="stat"><span class="stat-value">{{ item.count }}</span><span class="stat-label">bugs</span></div><div class="stat"><span class="stat-value">{{ item.percentage }}%</span><span class="stat-label">do total</span></div></div>
            <div class="category-progress"><div class="progress-bar" [style.width.%]="item.percentage"></div></div>
            <span class="badge" [ngClass]="'badge-' + item.status">{{ item.status }}</span>
          </div>
        </div>
        <div class="table-container">
          <div class="chart-title" style="margin-bottom: 20px;"><span class="chart-title-icon">📋</span>Dados Detalhados</div>
          <div class="table-responsive">
            <table class="table-data">
              <thead><tr><th>Modelo 3D</th><th>Tipo de Problema</th><th>Quantidade</th><th>Percentual</th><th>Status</th></tr></thead>
              <tbody><tr *ngFor="let item of bug3dData"><td><span class="category-badge">{{ item.icon }} {{ item.model }}</span></td><td>{{ item.type }}</td><td><strong>{{ item.count }}</strong></td><td>{{ item.percentage }}%</td><td><span class="badge" [ngClass]="'badge-' + item.status">{{ item.status }}</span></td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content { width: 100%; }
    .loading-spinner { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 600px; gap: 20px; }
    .spinner { width: 50px; height: 50px; border: 4px solid #ecf0f1; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .error-state { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 400px; color: #95a5a6; }
    .error-message { margin-top: 15px; color: #e74c3c; font-size: 16px; }
    .content { width: 100%; }
    .dashboard-section-header { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #ecf0f1; }
    .dashboard-section-header h2 { margin: 0 0 10px 0; color: #2c3e50; font-size: 28px; font-weight: 700; }
    .description { margin: 0; color: #7f8c8d; font-size: 15px; }
    .infografia-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-bottom: 40px; }
    .infografia-card { background: linear-gradient(135deg, #f5f7fa 0%, #f0f3f7 100%); border-radius: 12px; padding: 25px; text-align: center; border-left: 4px solid #667eea; transition: all 0.3s ease; position: relative; overflow: hidden; }
    .infografia-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%); animation: pulse 4s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    .infografia-card:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(102, 126, 234, 0.15); }
    .infografia-card.danger { border-left-color: #e74c3c; } .infografia-card.danger .infografia-value { color: #e74c3c; }
    .infografia-card.success { border-left-color: #27ae60; } .infografia-card.success .infografia-value { color: #27ae60; }
    .infografia-card.warning { border-left-color: #f39c12; } .infografia-card.warning .infografia-value { color: #f39c12; }
    .infografia-card.info { border-left-color: #3498db; } .infografia-card.info .infografia-value { color: #3498db; }
    .infografia-icon { font-size: 48px; display: block; margin-bottom: 12px; position: relative; z-index: 1; }
    .infografia-value { font-size: 36px; font-weight: 700; margin: 12px 0 8px 0; position: relative; z-index: 1; }
    .infografia-label { font-size: 13px; color: #7f8c8d; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; position: relative; z-index: 1; }
    .infografia-unit { font-size: 12px; color: #95a5a6; margin-top: 6px; position: relative; z-index: 1; }
    .chart-container { background: #f8f9fa; border-radius: 12px; padding: 30px; margin: 40px 0; border: 1px solid #ecf0f1; }
    .chart-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .chart-title-icon { font-size: 24px; }
    .chart-content { background: white; border-radius: 8px; padding: 20px; min-height: 300px; display: flex; align-items: center; justify-content: center; }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin: 40px 0; }
    .category-card { background: white; border-radius: 12px; padding: 20px; border: 2px solid #ecf0f1; transition: all 0.3s ease; position: relative; overflow: hidden; }
    .category-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); }
    .category-card.status-danger { border-top: 4px solid #e74c3c; }
    .category-card.status-success { border-top: 4px solid #27ae60; }
    .category-card.status-warning { border-top: 4px solid #f39c12; }
    .category-card.status-info { border-top: 4px solid #3498db; }
    .category-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 15px; }
    .category-icon { font-size: 32px; flex-shrink: 0; margin-top: 2px; }
    .category-titles { display: flex; flex-direction: column; gap: 4px; }
    .category-name { color: #2c3e50; font-weight: 600; font-size: 15px; line-height: 1.2; }
    .category-parent { color: #7f8c8d; font-size: 12px; font-style: italic; }
    .category-stats { display: flex; gap: 20px; margin-bottom: 15px; }
    .stat { display: flex; flex-direction: column; }
    .stat-value { font-size: 24px; font-weight: 700; color: #667eea; }
    .stat-label { font-size: 12px; color: #95a5a6; text-transform: uppercase; margin-top: 4px; }
    .category-progress { background: #ecf0f1; height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 15px; }
    .progress-bar { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.5s ease; }
    .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-success { background: rgba(39, 174, 96, 0.15); color: #27ae60; }
    .badge-warning { background: rgba(243, 156, 18, 0.15); color: #f39c12; }
    .badge-danger { background: rgba(231, 76, 60, 0.15); color: #e74c3c; }
    .badge-info { background: rgba(52, 152, 219, 0.15); color: #3498db; }
    .table-container { margin: 40px 0; }
    .table-responsive { overflow-x: auto; border-radius: 8px; }
    .table-data { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
    .table-data thead { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .table-data th { padding: 16px 20px; text-align: left; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .table-data td { padding: 14px 20px; border-bottom: 1px solid #ecf0f1; color: #2c3e50; font-size: 14px; }
    .table-data tbody tr:hover { background: rgba(102, 126, 234, 0.05); }
    .table-data tbody tr:last-child td { border-bottom: none; }
    .category-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; background: rgba(102, 126, 234, 0.1); border-radius: 6px; font-weight: 500; }
    @media (max-width: 768px) { .infografia-container { grid-template-columns: repeat(2, 1fr); } .categories-grid { grid-template-columns: 1fr; } .chart-container { padding: 20px; } }
    @media (max-width: 480px) { .dashboard-section-header h2 { font-size: 22px; } .infografia-container { grid-template-columns: 1fr; } .infografia-value { font-size: 28px; } .table-data th, .table-data td { padding: 12px 8px; font-size: 12px; } }
  `]
})
export class Bug3DComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  error: string | null = null;
  totalBugs = 0;
  modelCount = 0;
  criticalCount = 0;
  resolutionRate = 0;

  bug3dData: Bug3DData[] = [];

  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.loading = true;
    this.applyBugStats(this.dashboardService.getLocalBugStatsSnapshot());
    this.loading = false;
    this.dashboardService.getBugStats().pipe(takeUntil(this.destroy$)).subscribe({
      next: (bugs) => {
        this.applyBugStats(bugs || {});
        this.loading = false;
      },
      error: (err) => {
        if (!this.bug3dData.length) {
          this.error = String(err || 'Erro ao carregar dados');
        }
        this.loading = false;
      }
    });
  }
  private applyBugStats(bugs: Record<string, number>): void {
    const entries = Object.entries(bugs || {}).map(([key, value]) => ({ key, label: normalizeInconsistencyLabel(key), count: Number(value || 0) }));
    const total = entries.reduce((acc, entry) => acc + entry.count, 0) || 0;

    this.totalBugs = total;
    this.modelCount = entries.length;
    this.criticalCount = entries.filter((entry) => entry.count >= 10).length;
    this.bug3dData = entries.map((entry) => {
      const status: Bug3DData['status'] = entry.count >= 10 ? 'danger' : entry.count >= 5 ? 'warning' : 'info';

      return {
        model: entry.label,
        type: '',
        count: entry.count,
        percentage: total > 0 ? Math.round((entry.count / total) * 100) : 0,
        status,
        icon: '📐'
      };
    }).sort((a, b) => b.count - a.count);
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
