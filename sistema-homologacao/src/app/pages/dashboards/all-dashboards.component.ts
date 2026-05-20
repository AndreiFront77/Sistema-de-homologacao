import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { Subject } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-bug-subcategoria',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs por Subcategoria</h3><p>Detalhamento detalhado de inconsistências</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class BugSubcategoriaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-bug-catalogo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs - Catálogo</h3><p>Inconsistências em componentes de catálogo</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class BugCatalogoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-bug-3d',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs - 3D</h3><p>Problemas em modelos 3D</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class Bug3DComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-bug-acabamento',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs - Acabamento</h3><p>Bugs em processos de acabamento</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class BugAcabamentoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-bug-opcoes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs - Opções do Componente</h3><p>Inconsistências em opções</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class BugOpcoesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-bug-producao',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs - Produção</h3><p>Bugs em produção</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class BugProducaoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-bug-integracao',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs - Integração Sistema Fábrica</h3><p>Problemas de integração</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class BugIntegracaoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-indicadores-modelador',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Indicadores por Modelador</h3><p>Internos e Externos</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class IndicadoresModeladorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-nivel-componentes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Nível dos Componentes Homologados</h3><p>Distribuição por nível</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class NivelComponentesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-bugs-nivel',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs por Nível</h3><p>Análise de bugs por nível</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class BugsNivelComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-media-dias-nivel',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Média Dias de Homologação por Nível</h3><p>Tempo médio por nível</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class MediaDiasNivelComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-componentes-mes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Componentes e Bugs por Mês</h3><p>Evolução mensal</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class ComponentesMesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-componentes-cliente',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Componentes por Cliente</h3><p>Distribuição por cliente</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class ComponentesClienteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-componentes-bugs-cliente',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Componentes e Bugs por Cliente</h3><p>Análise combinada</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class ComponentesBugsClienteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-media-dias-componentes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Média de Dias/Homologação por Componente</h3><p>Tempo médio por componente</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class MediaDiasComponentesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-status-homologacao',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Status de Andamento de Homologação</h3><p>Estado atual das homologações</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class StatusHomologacaoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-totais-gerais',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Totais Gerais</h3><p>Resumo geral de indicadores</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class TotaisGeraisComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-records-cliente',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Records Cliente</h3><p>Registros importantes por cliente</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class RecordsClienteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-bugs-componente',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Bugs em um Componente</h3><p>Detalhamento para componente específico</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class BugsComponenteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-homologacao-componente',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Homologação em um Componente</h3><p>Histórico de homologação</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class HomologacaoComponenteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

@Component({
  selector: 'app-dias-componente',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `<div class="dashboard-content"><h3>Dias Úteis de Homologação em um Componente</h3><p>Tempo total gasto</p></div>`,
  styles: [`.dashboard-content { padding: 20px; }`]
})
export class DiasComponenteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
