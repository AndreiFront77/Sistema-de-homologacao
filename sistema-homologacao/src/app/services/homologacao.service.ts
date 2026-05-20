import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BusinessmapCard, HomologacaoLocal } from '../models/card.model';
import { Indicador, IndicadorService } from './indicador.service';
import { getApiBaseUrl } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class HomologacaoService {
  private readonly apiUrl = getApiBaseUrl();
  private cardsSubject = new BehaviorSubject<BusinessmapCard[]>([]);
  public cards$ = this.cardsSubject.asObservable();

  private filtersSubject = new BehaviorSubject<{ projeto?: string | null; cardId?: string | null }>({ projeto: null, cardId: null });
  public filters$ = this.filtersSubject.asObservable();

  private homologacoesSubject = new BehaviorSubject<HomologacaoLocal[]>([]);
  public homologacoes$ = this.homologacoesSubject.asObservable();

  constructor(private http: HttpClient, private indicadorService: IndicadorService) {
    this.loadCachedState();
    this.refreshCardsFromBackend().subscribe();
  }

  importCards(jsonData: any): void {
    if (jsonData.data && Array.isArray(jsonData.data)) {
      const incomingCards = jsonData.data as BusinessmapCard[];
      // Import cards to backend; always attempt to refresh local state.
      this.http.post<{ ok: boolean; processed: number }>(`${this.apiUrl}/cards/import`, { cards: incomingCards }).pipe(
        switchMap(() => this.refreshCardsFromBackend()),
        catchError(() => {
          const normalizedCards = incomingCards.map((card) => this.normalizeCard(card));
          this.persistCards(normalizedCards);
          return of(normalizedCards);
        })
      ).subscribe();

      // If the JSON also contains indicadores, import them via IndicadorService
      const indicadoresPayload = jsonData.indicadores || jsonData.indicators || jsonData.indicador;
      if (Array.isArray(indicadoresPayload) && indicadoresPayload.length > 0) {
        // Normalize and import batch; errors are handled inside IndicadorService
        this.indicadorService.importBatch(indicadoresPayload as Indicador[]).subscribe();
      }
    }
  }

  clearAllData(): Observable<{ ok: boolean; message: string }> {
    return this.http.post<{ ok: boolean; message: string }>(`${this.apiUrl}/reset-data`, {}).pipe(
      tap(() => {
        localStorage.removeItem('cards');
        localStorage.removeItem('homologacoes');
        this.cardsSubject.next([]);
        this.homologacoesSubject.next([]);
        this.resetFilters();
      })
    );
  }

  createManualCard(card: {
    card_id: string | number;
    title: string;
    fabrica?: string;
    cliente?: string;
    componente?: string;
    homologador?: string;
    status?: string;
    mod?: string;
    nivel?: number;
    mes?: string;
    ano?: number;
  }): Observable<BusinessmapCard> {
    const nowIso = new Date().toISOString();
    const payload = {
      card_id: String(card.card_id).trim(),
      title: String(card.title ?? '').trim() || `Card ${String(card.card_id).trim()}`,
      column_name: String(card.status ?? 'MODELAGEM'),
      type_name: String(card.fabrica ?? card.cliente ?? '').trim().toUpperCase(),
      description: '',
      priority: 0,
      size: 0,
      is_blocked: 0,
      finished_subtask_count: 0,
      unfinished_subtask_count: 0,
      owner_user_id: null,
      color: '',
      fabrica: String(card.fabrica ?? '').trim(),
      cliente: String(card.cliente ?? '').trim(),
      componente: String(card.componente ?? '').trim(),
      homologador: String(card.homologador ?? '').trim(),
      status: String(card.status ?? 'MODELAGEM').trim() || 'MODELAGEM',
      mod: String(card.mod ?? 'EXT').trim() || 'EXT',
      nivel: Number(card.nivel ?? 1),
      mes: String(card.mes ?? 'JANEIRO').trim() || 'JANEIRO',
      ano: Number(card.ano ?? new Date().getFullYear()),
      created_at: nowIso,
      updated_at: nowIso
    };

    return this.http.post<{ ok: boolean; card: BusinessmapCard }>(`${this.apiUrl}/cards`, payload).pipe(
      switchMap(() => this.refreshCardsFromBackend()),
      map((cards) => cards.find((item) => String(item.card_id) === payload.card_id) ?? this.normalizeCard(payload as unknown as BusinessmapCard)),
      catchError(() => {
        const fallbackCard = this.normalizeCard(payload as unknown as BusinessmapCard);
        const merged = this.mergeCards(this.cardsSubject.value, [fallbackCard]);
        this.persistCards(merged);
        return of(fallbackCard);
      })
    );
  }

  refreshCardsFromBackend(): Observable<BusinessmapCard[]> {
    return this.http.get<{ ok: boolean; total: number; cards: BusinessmapCard[] }>(`${this.apiUrl}/cards`).pipe(
      map(response => Array.isArray(response?.cards) ? response.cards : []),
      map(cards => cards.map(card => this.normalizeCard(card))),
      tap(cards => this.persistCards(cards)),
      catchError(() => {
        const cachedCards = this.getCachedCards();
        this.cardsSubject.next(cachedCards);
        return of(cachedCards);
      })
    );
  }

  getRecentes(): Observable<BusinessmapCard[]> {
    return this.cardsSubject.pipe(
      map(cards => {
        return [...cards]
          .sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )
            .slice(0, 4);
      }),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );
  }

  getProjetos(): Observable<{ nome: string; cards: BusinessmapCard[] }[]> {
    return this.agruparPorFabricaObservable(this.cardsSubject.asObservable());
  }

  getProjetosFiltrados(): Observable<{ nome: string; cards: BusinessmapCard[] }[]> {
    return combineLatest([this.cardsSubject.asObservable(), this.filters$]).pipe(
      map(([cards, filters]) => {
        let filtered = cards;
        if (filters.cardId && String(filters.cardId).trim() !== '') {
          const needle = String(filters.cardId).trim().toLowerCase();
          filtered = filtered.filter(c => String(c.card_id ?? '').toLowerCase().includes(needle));
        }
        if (filters.projeto) {
          const p = String(filters.projeto);
          filtered = filtered.filter(c => this.resolveFactoryGroupName(c) === p);
        }
        return this.agruparPorFabrica(filtered);
      }),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );
  }

  getProjetosList(): Observable<string[]> {
    return this.cardsSubject.pipe(
      map(cards => Array.from(new Set(cards.map(c => this.resolveFactoryGroupName(c)))).sort()),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }

  getCardById(cardId: string): Observable<BusinessmapCard | null> {
    return this.cardsSubject.pipe(
      map(cards => cards.find(card => String(card.card_id) === String(cardId)) ?? null),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );
  }

  private agruparPorFabrica(cards: BusinessmapCard[]): { nome: string; cards: BusinessmapCard[] }[] {
    const mapa = new Map<string, BusinessmapCard[]>();

    cards.forEach(card => {
      const fabrica = this.resolveFactoryGroupName(card);
      if (!mapa.has(fabrica)) {
        mapa.set(fabrica, []);
      }
      mapa.get(fabrica)!.push(card);
    });

    return Array.from(mapa, ([nome, cards]) => ({ nome, cards }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  private agruparPorFabricaObservable(cards$: Observable<BusinessmapCard[]>): Observable<{ nome: string; cards: BusinessmapCard[] }[]> {
    return cards$.pipe(
      map(cards => this.agruparPorFabrica(cards)),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );
  }

  setProjeto(projeto: string | null): void {
    const cur = this.filtersSubject.value;
    this.filtersSubject.next({ ...cur, projeto });
  }

  setCardId(cardId: string | null): void {
    const cur = this.filtersSubject.value;
    this.filtersSubject.next({ ...cur, cardId });
  }

  resetFilters(): void {
    this.filtersSubject.next({ projeto: null, cardId: null });
  }

  private extrairProjeto(title: string): string {
    const match = title.match(/^([^-]+)/);
    return match ? match[1].trim() : 'Sem Projeto';
  }

  private resolveFactoryGroupName(card: BusinessmapCard): string {
    const directFactory = String(card?.['fabrica'] ?? '').trim();
    if (directFactory) {
      return directFactory.toUpperCase();
    }

    const fallbackClient = String(card?.['cliente'] ?? '').trim();
    if (fallbackClient) {
      return fallbackClient.toUpperCase();
    }

    return String(this.extrairProjeto(card?.title || '') || 'SEM FABRICA').trim().toUpperCase();
  }

  private mergeCards(existingCards: BusinessmapCard[], incomingCards: BusinessmapCard[]): BusinessmapCard[] {
    const merged = new Map<string, BusinessmapCard>();

    [...existingCards, ...incomingCards].forEach(card => {
      merged.set(this.getCardKey(card), card);
    });

    return Array.from(merged.values());
  }

  private getCardKey(card: BusinessmapCard): string {
    const cardId = String(card?.card_id ?? '').trim();
    if (cardId) {
      return `card:${cardId}`;
    }

    const title = this.normalizeKeyPart(card?.title);
    const column = this.normalizeKeyPart(card?.column_name);
    const type = this.normalizeKeyPart(card?.type_name);
    const fallback = `${title}|${column}|${type}`;
    return fallback !== '||' ? fallback : `card:fallback:${this.normalizeKeyPart(card?.created_at)}`;
  }

  private normalizeKeyPart(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
  }

  private normalizeCard(card: BusinessmapCard): BusinessmapCard {
    const cardId = Number(card.card_id);
    const status = String(card['status'] ?? card.column_name ?? 'MODELAGEM');

    return {
      ...card,
      card_id: cardId,
      title: String(card.title ?? '').trim() || `Card ${cardId}`,
      column_name: String(card.column_name ?? '').trim() || status,
      type_name: String(card.type_name ?? '').trim() || String(card['fabrica'] ?? card['cliente'] ?? ''),
      description: String(card.description ?? ''),
      created_at: String(card.created_at ?? ''),
      updated_at: String(card.updated_at ?? ''),
      priority: Number(card.priority ?? 0),
      size: Number(card.size ?? 0),
      is_blocked: Number(card.is_blocked ?? 0),
      finished_subtask_count: Number(card.finished_subtask_count ?? 0),
      unfinished_subtask_count: Number(card.unfinished_subtask_count ?? 0),
      owner_user_id: card.owner_user_id ?? null,
      color: String(card.color ?? '')
    };
  }

  private persistCards(cards: BusinessmapCard[]): void {
    const normalized = cards.map(card => this.normalizeCard(card));
    this.cardsSubject.next(normalized);
    localStorage.setItem('cards', JSON.stringify(normalized));
  }

  private getCachedCards(): BusinessmapCard[] {
    const cards = localStorage.getItem('cards');
    if (!cards) {
      return [];
    }

    try {
      const parsedCards = JSON.parse(cards);
      if (Array.isArray(parsedCards)) {
        return parsedCards.map((card: BusinessmapCard) => this.normalizeCard(card));
      }
    } catch {
      return [];
    }

    return [];
  }

  private loadCachedState(): void {
    const cachedCards = this.getCachedCards();
    if (cachedCards.length > 0) {
      this.cardsSubject.next(cachedCards);
    }

    const homologacoes = localStorage.getItem('homologacoes');
    if (!homologacoes) {
      return;
    }

    try {
      const parsedHomologacoes = JSON.parse(homologacoes);
      if (Array.isArray(parsedHomologacoes)) {
        this.homologacoesSubject.next(parsedHomologacoes);
      }
    } catch {
      this.homologacoesSubject.next([]);
    }
  }

  /**
   * Atualiza um card com dados de uma homologação (indicador)
   * Sincroniza os dados do cadastro para o card
   */
  updateCardWithIndicador(cardId: string, indicador: Indicador): void {
    const currentCards = this.cardsSubject.value;
    const cardIndex = currentCards.findIndex(card => String(card.card_id) === String(cardId));
    
    if (cardIndex === -1) {
      return;
    }

    const updatedCard: BusinessmapCard = {
      ...currentCards[cardIndex],
      cliente: String(indicador.cliente ?? ''),
      componente: String(indicador.componente ?? ''),
      nivel: Number(indicador.nivel ?? 1),
      mod: String(indicador.mod ?? 'EXT'),
      homologador: String(indicador.homologador ?? ''),
      status: String(indicador.status ?? 'MODELAGEM'),
      column_name: String(indicador.status ?? currentCards[cardIndex].column_name ?? 'MODELAGEM'),
      mes: String(indicador.mes ?? 'JANEIRO'),
      ano: Number(indicador.ano ?? new Date().getFullYear()),
      somatorio_bugs: Number(indicador.somatorio_bugs ?? 0),
      bugs: { ...(indicador.bugs || {}) },
      observacoes: String(indicador.observacoes ?? ''),
      updated_at: new Date().toISOString()
    };

    const updatedCards = [...currentCards];
    updatedCards[cardIndex] = updatedCard;
    
    this.persistCards(updatedCards);
  }

  /**
   * Adiciona ou atualiza uma homologação local
   * Mantém o histórico de homologações para cada card
   */
  addOrUpdateHomologacao(card: BusinessmapCard, indicador: Indicador): void {
    const currentHomologacoes = this.homologacoesSubject.value;
    const existingIndex = currentHomologacoes.findIndex(
      h => String(h.card.card_id) === String(card.card_id)
    );

    const homologacao: HomologacaoLocal = {
      id: String(card.card_id),
      card,
      startDate: new Date(indicador.data_inicio || new Date()),
      status: indicador.status as any || 'Pendente',
      inconsistencies: [],
      lastModified: new Date()
    };

    let updatedHomologacoes: HomologacaoLocal[];
    if (existingIndex === -1) {
      updatedHomologacoes = [...currentHomologacoes, homologacao];
    } else {
      updatedHomologacoes = [...currentHomologacoes];
      updatedHomologacoes[existingIndex] = homologacao;
    }

    this.homologacoesSubject.next(updatedHomologacoes);
    this.saveToLocalStorage('homologacoes', updatedHomologacoes);
  }

  private saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
