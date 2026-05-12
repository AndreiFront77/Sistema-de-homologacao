import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HomologacaoService } from '../../services/homologacao.service';
import { BusinessmapCard } from '../../models/card.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="container">
      <!-- Card Recentes -->
      <section class="section">
        <h3 class="section-title">📌 Recentes</h3>
        <div class="cards-grid">
          <ng-container *ngIf="recentes$ | async as recentes; else loadingRecentes">
            <ng-container *ngIf="recentes.length > 0; else emptyRecentes">
              <div class="card" *ngFor="let card of recentes" (click)="abrirCard(card)">
                <div class="card-header">
                  <h4>{{ card.title }}</h4>
                  <span class="badge">{{ formatCardStatus(card) }}</span>
                </div>
                <p class="card-component">
                  <strong>Componente:</strong> {{ card['componente'] || 'Não informado' }}
                </p>
                <p class="card-id">
                  <strong>Cliente:</strong> {{ card['cliente'] || 'Não informado' }} | <strong>ID:</strong> {{ card.card_id }}
                </p>
                <p class="card-meta">
                  <strong>Inconsistências:</strong> {{ getCardInconsistencias(card) }}
                </p>
                <p class="card-date">
                  Atualizado: {{ card.updated_at | date : 'dd/MM/yyyy HH:mm' }}
                </p>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #loadingRecentes>
            <p class="empty-state">Carregando cards...</p>
          </ng-template>
          <ng-template #emptyRecentes>
            <p class="empty-state">Nenhum card recente. Importe um JSON para começar!</p>
          </ng-template>
        </div>
      </section>

      <!-- Fabricas -->
      <section class="section">
        <h3 class="section-title">👥 Clientes</h3>
        <ng-container *ngIf="projetos$ | async as fabricas; else loadingProjetos">
          <ng-container *ngIf="fabricas.length > 0; else emptyProjetos">
            <div class="projeto" *ngFor="let fabrica of fabricas">
              <h4 class="projeto-title">{{ fabrica.nome }} ({{ fabrica.cards.length }})</h4>
              <div class="cards-grid">
                <div class="card" *ngFor="let card of fabrica.cards" (click)="abrirCard(card)">
                  <div class="card-header">
                    <h5>{{ card.title }}</h5>
                    <span class="badge">{{ formatCardStatus(card) }}</span>
                  </div>
                  <p class="card-component">
                    <strong>Componente:</strong> {{ card['componente'] || 'Não informado' }}
                  </p>
                  <p class="card-id">
                    <strong>Cliente:</strong> {{ card['cliente'] || 'Não informado' }} | <strong>ID:</strong> {{ card.card_id }}
                  </p>
                  <p class="card-meta">
                    <strong>Inconsistências:</strong> {{ getCardInconsistencias(card) }}
                  </p>
                  <p class="card-date">
                    Atualizado: {{ card.updated_at | date : 'dd/MM/yyyy HH:mm' }}
                  </p>
                </div>
              </div>
            </div>
          </ng-container>
        </ng-container>
        <ng-template #loadingProjetos>
          <p class="empty-state">Carregando projetos...</p>
        </ng-template>
        <ng-template #emptyProjetos>
          <p class="empty-state">Nenhum projeto. Importe um JSON para começar!</p>
        </ng-template>
      </section>
    </main>
  `,
  styles: [`
  
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      color: #333;
      border-bottom: 3px solid #000000;
      padding-bottom: 0.5rem;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 0.75rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      border-color: #667eea;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 0.5rem;
    }

    .card-header h4, .card-header h5 {
      margin: 0;
      flex: 1;
      font-size: 1rem;
      color: #333;
    }

    .badge {
      background: #54db1f;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      white-space: nowrap;
      margin-left: 0.5rem;
    }

    .card-component {
      font-size: 0.875rem;
      color: #222;
      margin: 0.4rem 0;
      font-weight: 500;
    }

    .card-meta {
      font-size: 0.875rem;
      color: #666;
      margin: 0.5rem 0;
    }

    .card-id {
      font-size: 0.875rem;
      color: #764ba2;
      margin: 0.5rem 0;
      font-weight: 600;
    }

    .card-date {
      font-size: 0.75rem;
      color: #999;
      margin: 0;
    }

    .projeto {
      margin-bottom: 2.5rem;
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 0.75rem;
    }

    .projeto-title {
      font-size: 1.25rem;
      margin: 0 0 1rem 0;
      color: #764ba2;
    }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 2rem;
      font-style: italic;
    }
  `]
})
export class LandingComponent implements OnInit {
  recentes$: Observable<BusinessmapCard[]>;
  projetos$: Observable<{ nome: string; cards: BusinessmapCard[] }[]>;
  
  constructor(
    private homologacaoService: HomologacaoService,
    private router: Router
  ) {
    this.recentes$ = this.homologacaoService.getRecentes();
    this.projetos$ = this.homologacaoService.getProjetosFiltrados();
  }

  ngOnInit(): void {
    // Carregar dados ao iniciar
  }

  abrirCard(card: BusinessmapCard): void {
    this.router.navigate(['/cards', card.card_id]);
  }

  formatCardStatus(card: BusinessmapCard): string {
    const rawStatus = String(card['status'] ?? card.column_name ?? 'EM_MODELAGEM')
      .trim()
      .toUpperCase();

    const statusMap: Record<string, string> = {
      MODELAGEM: 'Em modelagem',
      EM_MODELAGEM: 'Em modelagem',
      'EM MODELAGEM': 'Em modelagem',
      HOMOLOGACAO: 'Em homologação',
      HOMOLOGAÇÃO: 'Em homologação',
      EM_HOMOLOGACAO: 'Em homologação',
      'EM HOMOLOGACAO': 'Em homologação',
      'EM HOMOLOGAÇÃO': 'Em homologação',
      CONCLUIDA: 'Concluído',
      CONCLUÍDA: 'Concluído',
      CONCLUIDO: 'Concluído',
      CONCLUÍDO: 'Concluído'
    };

    return statusMap[rawStatus] || 'Em modelagem';
  }

  getCardInconsistencias(card: BusinessmapCard): number {
    return Number(card['somatorio_bugs'] ?? 0);
  }
}