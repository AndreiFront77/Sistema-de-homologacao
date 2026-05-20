import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-infografico',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="infografia-container">
      <!-- Card 1: Total de Bugs -->
      <div class="infografia-card danger">
        <span class="infografia-icon">🐛</span>
        <div class="infografia-value">{{ totalBugs }}</div>
        <div class="infografia-label">Total de Bugs</div>
        <div class="infografia-unit">Este período</div>
      </div>

      <!-- Card 2: Taxa de Resolução -->
      <div class="infografia-card success">
        <span class="infografia-icon">✓</span>
        <div class="infografia-value">{{ resolutionRate }}%</div>
        <div class="infografia-label">Taxa de Resolução</div>
        <div class="infografia-unit">Bugs resolvidos</div>
      </div>

      <!-- Card 3: Bugs Críticos -->
      <div class="infografia-card warning">
        <span class="infografia-icon">⚠️</span>
        <div class="infografia-value">{{ criticalBugs }}</div>
        <div class="infografia-label">Bugs Críticos</div>
        <div class="infografia-unit">Requerem atenção</div>
      </div>

      <!-- Card 4: Tempo Médio -->
      <div class="infografia-card info">
        <span class="infografia-icon">⏱️</span>
        <div class="infografia-value">{{ averageTime }}</div>
        <div class="infografia-label">Tempo Médio</div>
        <div class="infografia-unit">De resolução</div>
      </div>
    </div>

    <!-- Gráfico Principal -->
    <div class="chart-container">
      <h3 class="chart-title">
        <span class="chart-title-icon">📊</span>
        Distribuição por Categoria
      </h3>
      <div class="chart-placeholder">
        <!-- Aqui virá o gráfico do chart.js -->
        <p style="color: #95a5a6; text-align: center; padding: 60px 20px;">
          Gráfico será carregado aqui
        </p>
      </div>
    </div>

    <!-- Tabela de Dados -->
    <div class="table-responsive" *ngIf="tableData && tableData.length > 0">
      <div class="chart-title">
        <span class="chart-title-icon">📋</span>
        Dados Detalhados
      </div>
      <table class="table-data">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Percentual</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of tableData">
            <td>{{ item.category }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.percentage }}%</td>
            <td>
              <span class="badge" [ngClass]="'badge-' + item.status">
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class DashboardInfograficoComponent implements OnInit {
  totalBugs = 825;
  resolutionRate = 68;
  criticalBugs = 23;
  averageTime = '14d';

  tableData = [
    { category: 'Integração Sistema Fábrica', count: 129, percentage: 16, status: 'danger' },
    { category: 'Orçamento', count: 115, percentage: 14, status: 'warning' },
    { category: '3D - Etiquetagem', count: 87, percentage: 11, status: 'info' },
    { category: '3D - Medidas', count: 86, percentage: 10, status: 'info' },
    { category: 'Opções Componente', count: 82, percentage: 10, status: 'success' }
  ];

  ngOnInit(): void {
    console.log('Dashboard Infográfico initialized');
  }
}
