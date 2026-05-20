import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HomologacaoService } from '../../services/homologacao.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <h2><img src="/logogabster.png" alt="Logo da Gabster" class="logo-img" /> Sistema de Indicadores</h2>
        </div>
        <div class="filters">
          <label>
            Cliente:
            <select #projetoSelect (change)="onProjetoChange(projetoSelect.value)">
              <option value="">Todos os clientes</option>
              <option *ngFor="let p of projetos$ | async" [value]="p">{{ p }}</option>
            </select>
          </label>
          <label class="card-filter">
            Id do card:
            <input #cardIdInput type="text" placeholder="ex: 12345" />
            <button class="btn-apply" (click)="applyCardFilter(cardIdInput.value)">Filtrar</button>
            <button class="btn-clear" (click)="clearFilters(cardIdInput)">Limpar</button>
          </label>
        </div>
        <div class="actions">
          <button class="btn-dashboard" (click)="irParaDashboard()">
            📊 Dashboard
          </button>
          <button class="btn-reset" (click)="resetData()">
            🧹 Limpar dados
          </button>
          <button class="btn-new-card" (click)="openCreateCardModal()">
            ➕ Novo card
          </button>
          <button class="btn-import" (click)="triggerFileInput()">
            📥 Importar JSON
          </button>
          <input 
            #fileInput 
            type="file" 
            accept=".json" 
            (change)="onFileSelected($event)"
            style="display: none"
          />
        </div>
      </div>

      <div class="modal-overlay" *ngIf="showCreateCardModal" (click)="closeCreateCardModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>Criar card manualmente</h3>

          <label>
            ID do card *
            <input type="text" [(ngModel)]="newCard.card_id" placeholder="Ex: 12345" />
          </label>

          <label>
            Titulo *
            <input type="text" [(ngModel)]="newCard.title" placeholder="Nome do card" />
          </label>

          <label>
            Fabrica
            <input type="text" [(ngModel)]="newCard.fabrica" placeholder="Ex: GABSTER" />
          </label>

          <label>
            Cliente
            <input type="text" [(ngModel)]="newCard.cliente" placeholder="Ex: Cliente X" />
          </label>

          <label>
            Componente
            <input type="text" [(ngModel)]="newCard.componente" placeholder="Ex: Porta" />
          </label>

          <label>
            Homologador
            <input type="text" [(ngModel)]="newCard.homologador" placeholder="Nome do responsavel" />
          </label>

          <div class="modal-row">
            <label>
              Status
              <select [(ngModel)]="newCard.status">
                <option value="MODELAGEM">MODELAGEM</option>
                <option value="A FAZER">A FAZER</option>
                <option value="CONCLUIDA">CONCLUIDA</option>
              </select>
            </label>

            <label>
              MOD
              <select [(ngModel)]="newCard.mod">
                <option value="EXT">EXT</option>
                <option value="INT">INT</option>
              </select>
            </label>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" type="button" (click)="closeCreateCardModal()">Cancelar</button>
            <button class="btn-save" type="button" (click)="saveManualCard()" [disabled]="savingManualCard">
              {{ savingManualCard ? 'Salvando...' : 'Salvar card' }}
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #000000 30%, #54db1f 100%);
      padding: 1rem 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      color: white;
    }

    .navbar-content {
      max-width: none;
      margin: 0;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
    }

    .logo-img {
      margin-left: 1rem;
      margin-right: 4rem;
      padding: 0.15rem;
      height: 25px;
      width: auto;
    }

    .logo h2 {
      margin: 0;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-import {
      background: white;
      color: #667eea;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-import:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .btn-new-card {
      background: #fff;
      color: #1d7f2a;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-new-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .btn-reset {
      background: #fff;
      color: #b42318;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-reset:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .btn-dashboard {
      background: #FFD54F;
      color: #333;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-dashboard:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .filters {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      margin-left: auto;
    }

    .filters label {
      color: white;
      font-weight: 600;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .filters select, .filters input {
      padding: 0.35rem 0.5rem;
      border-radius: 0.25rem;
      border: none;
    }

    .card-filter .btn-apply {
      margin-left: 0.5rem;
      background: #fff;
      color: #667eea;
      border: none;
      padding: 0.35rem 0.6rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }

    .card-filter .btn-clear {
      margin-left: 0.25rem;
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      padding: 0.35rem 0.6rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1200;
    }

    .modal-card {
      width: min(560px, 100%);
      background: #fff;
      color: #222;
      border-radius: 0.75rem;
      padding: 1rem;
      box-shadow: 0 18px 40px rgba(0,0,0,0.25);
      display: grid;
      gap: 0.65rem;
    }

    .modal-card h3 {
      margin: 0 0 0.25rem;
      font-size: 1.1rem;
    }

    .modal-card label {
      font-size: 0.9rem;
      display: grid;
      gap: 0.3rem;
      color: #333;
      font-weight: 600;
    }

    .modal-card input,
    .modal-card select {
      border: 1px solid #d5d8e1;
      border-radius: 0.45rem;
      padding: 0.45rem 0.55rem;
      font-size: 0.95rem;
    }

    .modal-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.65rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.55rem;
      margin-top: 0.4rem;
    }

    .btn-cancel {
      background: #f2f4f8;
      color: #333;
      border: 1px solid #d9dce5;
      border-radius: 0.45rem;
      padding: 0.45rem 0.9rem;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-save {
      background: #1d7f2a;
      color: #fff;
      border: none;
      border-radius: 0.45rem;
      padding: 0.45rem 0.9rem;
      cursor: pointer;
      font-weight: 700;
    }

    .btn-save:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 720px) {
      .modal-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NavbarComponent {
  projetos$: Observable<string[]>;
  showCreateCardModal = false;
  savingManualCard = false;
  newCard = this.createEmptyNewCard();

  constructor(
    private homologacaoService: HomologacaoService,
    private router: Router
  ) {
    this.projetos$ = this.homologacaoService.getProjetosList();
  }

  irParaDashboard(): void {
    this.router.navigate(['/smart-dashboards']);
  }

  resetData(): void {
    const confirmed = confirm('Isso vai apagar cards, indicadores e bugs locais. Continuar?');
    if (!confirmed) {
      return;
    }

    this.homologacaoService.clearAllData().subscribe({
      next: () => {
        alert('✅ Dados limpos com sucesso!');
        window.location.reload();
      },
      error: () => {
        alert('❌ Não foi possível limpar os dados.');
      }
    });
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }

  openCreateCardModal(): void {
    this.newCard = this.createEmptyNewCard();
    this.showCreateCardModal = true;
  }

  closeCreateCardModal(): void {
    if (this.savingManualCard) {
      return;
    }
    this.showCreateCardModal = false;
  }

  saveManualCard(): void {
    const cardId = String(this.newCard.card_id || '').trim();
    const title = String(this.newCard.title || '').trim();

    if (!cardId || !title) {
      alert('Preencha os campos obrigatorios: ID do card e Titulo.');
      return;
    }

    if (!/^\d+$/.test(cardId)) {
      alert('O ID do card deve conter apenas numeros.');
      return;
    }

    this.savingManualCard = true;
    this.homologacaoService.createManualCard(this.newCard).subscribe({
      next: () => {
        this.savingManualCard = false;
        this.showCreateCardModal = false;
        alert('✅ Card criado com sucesso!');
      },
      error: () => {
        this.savingManualCard = false;
        alert('❌ Nao foi possivel criar o card.');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          this.homologacaoService.importCards(jsonData);
          alert('✅ JSON importado com sucesso!');
          // Limpar o valor do input para permitir importar o mesmo arquivo novamente
          input.value = '';
        } catch (error) {
          alert('❌ Erro ao importar JSON. Verifique o arquivo.');
          input.value = '';
        }
      };
      
      reader.readAsText(file);
    }
  }
  
  onProjetoChange(value: string): void {
    this.homologacaoService.setProjeto(value ? value : null);
  }

  applyCardFilter(value: string): void {
    this.homologacaoService.setCardId(value.trim() || null);
  }

  clearFilters(input: HTMLInputElement): void {
    input.value = '';
    this.homologacaoService.resetFilters();
  }

  private createEmptyNewCard(): {
    card_id: string;
    title: string;
    fabrica: string;
    cliente: string;
    componente: string;
    homologador: string;
    status: string;
    mod: string;
  } {
    return {
      card_id: '',
      title: '',
      fabrica: '',
      cliente: '',
      componente: '',
      homologador: '',
      status: 'MODELAGEM',
      mod: 'EXT'
    };
  }
}