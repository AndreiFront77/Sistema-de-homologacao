import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomologacaoService } from '../../services/homologacao.service';
import { HomologacaoLocal } from '../../models/card.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-container">
      <h2>Homologações Locais</h2>

      <ng-container *ngIf="homologacoes$ | async as homologacoes; else loading">
        <ng-container *ngIf="homologacoes.length > 0; else emptyState">
          <div class="homologacoes-list">
            <div class="homologacao-item" *ngFor="let homolog of homologacoes; trackBy: trackByHomologId">
              <h3>{{ homolog.card.title }}</h3>
              <p><strong>Status:</strong> {{ homolog.status }}</p>
              <p><strong>Data Início:</strong> {{ homolog.startDate | date : 'dd/MM/yyyy' }}</p>
              <p><strong>Inconsistências:</strong> {{ homolog.inconsistencies.length }}</p>
            </div>
          </div>
        </ng-container>
      </ng-container>

      <ng-template #loading>
        <p>Carregando...</p>
      </ng-template>

      <ng-template #emptyState>
        <p>Nenhuma homologação local encontrada.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .list-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .homologacoes-list {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }

    .homologacao-item {
      background: white;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .homologacao-item h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .homologacao-item p {
      margin: 0.5rem 0;
      color: #666;
    }
  `]
})
export class ListComponent implements OnInit {
  homologacoes$: Observable<HomologacaoLocal[]>;

  constructor(private homologacaoService: HomologacaoService) {
    this.homologacoes$ = this.homologacaoService.homologacoes$;
  }

  ngOnInit(): void {}

  trackByHomologId(_: number, homolog: HomologacaoLocal): string | number | undefined {
    return homolog.id ?? homolog.card.card_id;
  }
}