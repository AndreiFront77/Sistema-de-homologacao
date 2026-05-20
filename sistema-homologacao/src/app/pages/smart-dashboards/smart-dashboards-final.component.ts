import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BugCategoriaComponent } from '../dashboards/bug-categoria/bug-categoria.component';
import { BugSubcategoriaComponent } from '../dashboards/bug-subcategoria/bug-subcategoria.component';
import { BugCatalogoComponent } from '../dashboards/bug-catalogo/bug-catalogo.component';
import { Bug3DComponent } from '../dashboards/bug-3d/bug-3d.component';
import {
  BugAcabamentoComponent,
  BugOpcoesComponent,
  BugProducaoComponent,
  BugIntegracaoComponent,
  IndicadoresModeladorComponent,
  NivelComponentesComponent,
  BugsNivelComponent,
  MediaDiasNivelComponent,
  ComponentesMesComponent,
  ComponentesClienteComponent,
  ComponentesBugsClienteComponent,
  MediaDiasComponentesComponent,
  StatusHomologacaoComponent,
  TotaisGeraisComponent,
  RecordsClienteComponent,
  BugsComponenteComponent,
  HomologacaoComponenteComponent,
  DiasComponenteComponent
} from '../dashboards/all-dashboards-v2.component';

export interface DashboardOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  component: string;
}

@Component({
  selector: 'app-smart-dashboards',
  standalone: true,
  imports: [
    CommonModule,
    BugCategoriaComponent,
    BugSubcategoriaComponent,
    BugCatalogoComponent,
    Bug3DComponent,
    BugAcabamentoComponent,
    BugOpcoesComponent,
    BugProducaoComponent,
    BugIntegracaoComponent,
    IndicadoresModeladorComponent,
    NivelComponentesComponent,
    BugsNivelComponent,
    MediaDiasNivelComponent,
    ComponentesMesComponent,
    ComponentesClienteComponent,
    ComponentesBugsClienteComponent,
    MediaDiasComponentesComponent,
    StatusHomologacaoComponent,
    TotaisGeraisComponent,
    RecordsClienteComponent,
    BugsComponenteComponent,
    HomologacaoComponenteComponent,
    DiasComponenteComponent
  ],
  templateUrl: './smart-dashboards.component.html',
  styleUrls: ['./smart-dashboards.component.css']
})
export class SmartDashboardsComponent implements OnInit {
  selectedDashboard: string | null = null;

  dashboards: DashboardOption[] = [
    { id: 'bug-categoria', title: 'BUG por Categoria', description: 'Análise de bugs por categoria geral', icon: '📊', color: '#e74c3c', component: 'bug-categoria' },
    { id: 'bug-subcategoria', title: 'BUG por Subcategoria', description: 'Detalhamento de inconsistências por subcategorias', icon: '🐛', color: '#c0392b', component: 'bug-subcategoria' },
    { id: 'bug-catalogo', title: 'Bug Catálogo', description: 'Bugs em componentes do catálogo', icon: '📚', color: '#3498db', component: 'bug-catalogo' },
    { id: 'bug-3d', title: 'Bug por 3D', description: 'Inconsistências relacionadas a modelos 3D', icon: '🎯', color: '#9b59b6', component: 'bug-3d' },
    { id: 'bug-acabamento', title: 'Bug Acabamento', description: 'Bugs em processos de acabamento', icon: '🔨', color: '#e67e22', component: 'bug-acabamento' },
    { id: 'bug-opcoes-componente', title: 'Bug Opções do Componente', description: 'Inconsistências nas opções disponíveis', icon: '⚙️', color: '#16a085', component: 'bug-opcoes' },
    { id: 'bug-producao', title: 'Bug Produção', description: 'Bugs identificados em produção', icon: '🏭', color: '#d35400', component: 'bug-producao' },
    { id: 'bug-integracao-fabrica', title: 'Bug Integração Sistema Fábrica', description: 'Problemas de integração com sistemas de fábrica', icon: '🔗', color: '#2980b9', component: 'bug-integracao' },
    { id: 'indicadores-modelador', title: 'Indicadores Componentes por Modelador', description: 'Análise de componentes internos e externos por modelador', icon: '👨‍💼', color: '#27ae60', component: 'indicadores-modelador' },
    { id: 'nivel-componentes', title: 'Nível dos Componentes Homologados', description: 'Distribuição de componentes por nível', icon: '📈', color: '#f39c12', component: 'nivel-componentes' },
    { id: 'bugs-por-nivel', title: 'Bugs por Nível', description: 'Análise de bugs distribuído por nível', icon: '⚠️', color: '#c0392b', component: 'bugs-nivel' },
    { id: 'media-dias-nivel', title: 'Média Dias de Homologação por Nível', description: 'Tempo médio de homologação de cada nível', icon: '⏱️', color: '#8e44ad', component: 'media-dias-nivel' },
    { id: 'componentes-bugs-mes', title: 'Componentes e Bugs por Mês', description: 'Evolução mensal de componentes e bugs', icon: '📅', color: '#34495e', component: 'componentes-mes' },
    { id: 'componentes-cliente', title: 'Componentes por Cliente', description: 'Distribuição de componentes por cliente', icon: '🏢', color: '#1abc9c', component: 'componentes-cliente' },
    { id: 'componentes-bugs-cliente', title: 'Componentes e Bugs por Cliente', description: 'Análise combinada de componentes e bugs por cliente', icon: '🎯', color: '#2980b9', component: 'componentes-bugs-cliente' },
    { id: 'media-dias-componentes', title: 'Média de Dias/Homologação por Componente', description: 'Tempo médio de homologação por componente', icon: '📊', color: '#16a085', component: 'media-dias-componentes' },
    { id: 'status-homologacao', title: 'Status de Andamento de Homologação', description: 'Estado atual de cada homologação em progresso', icon: '✓', color: '#27ae60', component: 'status-homologacao' },
    { id: 'totais-gerais', title: 'Totais Gerais', description: 'Resumo geral de todos os indicadores', icon: '🔢', color: '#2c3e50', component: 'totais-gerais' },
    { id: 'records-cliente', title: 'RECORDS Cliente', description: 'Registros importantes por cliente', icon: '📋', color: '#d35400', component: 'records-cliente' },
    { id: 'bugs-componente', title: 'Bugs em um Componente', description: 'Detalhamento de bugs para um componente específico', icon: '🔍', color: '#e74c3c', component: 'bugs-componente' },
    { id: 'homologacao-componente', title: 'Homologação em um Componente', description: 'Histórico e status de homologação de um componente', icon: '📝', color: '#3498db', component: 'homologacao-componente' },
    { id: 'dias-homologacao-componente', title: 'Dias Úteis de Homologação em um Componente', description: 'Tempo total gasto em homologação de um componente', icon: '📆', color: '#9b59b6', component: 'dias-componente' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Smart Dashboards initialized');
  }

  selectDashboard(id: string): void {
    this.selectedDashboard = id;
    console.log('Selected dashboard:', id);
  }

  backToSelection(): void {
    this.selectedDashboard = null;
  }

  getSelectedDashboard(): DashboardOption | undefined {
    return this.dashboards.find(d => d.id === this.selectedDashboard);
  }

  goToCards(): void {
    this.router.navigate(['/landing']);
  }

  goBack(): void {
    if (this.selectedDashboard) {
      // If a dashboard is selected, go back to dashboard selection
      this.backToSelection();
    } else {
      // If on dashboard selection view, navigate to cards/landing
      this.router.navigate(['/landing']);
    }
  }
}
