import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { getApiBaseUrl } from './api-base';

export interface Indicador {
  id?: number;
  card_id: string;
  fabrica: string;
  cliente?: string;
  componente?: string;
  nivel?: number;
  mod?: string;
  homologador?: string;
  status?: string;
  mes?: string;
  ano?: number;
  data_inicio?: string;
  data_conclusao?: string;
  dias_uteis?: number;
  somatorio_bugs?: number;
  observacoes?: string;
  bugs?: Record<string, number>;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardSummary {
  mes: string;
  ano: number;
  total: number;
  concluidos: number;
  media_bugs: number;
  total_bugs: number;
}

@Injectable({
  providedIn: 'root'
})
export class IndicadorService {
  private apiUrl = getApiBaseUrl();
  private readonly storageKey = 'sistema-homologacao.indicadores';
  private indicadoresSubject = new BehaviorSubject<Indicador[]>([]);
  public indicadores$ = this.indicadoresSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadIndicadores();
  }

  // ===== INDICADORES =====

  createIndicador(indicador: Indicador): Observable<{ ok: boolean; indicador: Indicador }> {
    const payload = this.normalizeIndicador(indicador);

    return this.http.post<{ ok: boolean; indicador: Indicador }>(
      `${this.apiUrl}/indicadores`,
      payload
    ).pipe(
      map((response) => ({
        ok: Boolean(response?.ok ?? true),
        indicador: this.normalizeIndicador(response?.indicador ?? payload)
      })),
      tap((response) => this.upsertLocalIndicador(response.indicador)),
      catchError((error) => {
        console.warn('Backend indisponível; salvando indicador localmente.', error);
        const saved = this.upsertLocalIndicador(payload);
        return of({ ok: true, indicador: saved });
      })
    );
  }

  getIndicadores(): Observable<{ ok: boolean; total: number; indicadores: Indicador[] }> {
    return this.http.get<{ ok: boolean; total: number; indicadores: Indicador[] }>(
      `${this.apiUrl}/indicadores`
    ).pipe(
      map((response) => {
        const indicadores = this.sortIndicadores(response?.indicadores ?? []);
        this.saveIndicadoresLocal(indicadores);
        return {
          ok: Boolean(response?.ok ?? true),
          total: typeof response?.total === 'number' ? response.total : indicadores.length,
          indicadores
        };
      }),
      catchError((error) => {
        console.warn('Falha ao buscar indicadores no backend; usando cache local.', error);
        const indicadores = this.getLocalIndicadores();
        return of({ ok: true, total: indicadores.length, indicadores });
      })
    );
  }

  loadIndicadores(): void {
    this.getIndicadores().subscribe(
      (response) => {
        if (response.ok) {
          this.indicadoresSubject.next(response.indicadores);
        }
      },
      (error) => {
        console.error('Erro ao carregar indicadores:', error);
      }
    );
  }

  getIndicadorById(id: number): Observable<{ ok: boolean; indicador: Indicador }> {
    return this.http.get<{ ok: boolean; indicador: Indicador }>(
      `${this.apiUrl}/indicadores/${id}`
    );
  }

  getIndicadoresByCardId(cardId: string): Observable<{ ok: boolean; total: number; indicadores: Indicador[] }> {
    return this.getIndicadores().pipe(
      map((response) => {
        const indicadores = this.sortIndicadores(
          (response.indicadores || []).filter(indicador => String(indicador.card_id) === String(cardId))
        );

        return {
          ok: true,
          total: indicadores.length,
          indicadores
        };
      })
    );
  }

  updateIndicador(id: number, updates: Partial<Indicador>): Observable<{ ok: boolean; indicador: Indicador }> {
    return this.http.put<{ ok: boolean; indicador: Indicador }>(
      `${this.apiUrl}/indicadores/${id}`,
      updates
    ).pipe(
      tap(() => this.loadIndicadores())
    );
  }

  deleteIndicador(id: number): Observable<{ ok: boolean; message: string }> {
    return this.http.delete<{ ok: boolean; message: string }>(
      `${this.apiUrl}/indicadores/${id}`
    ).pipe(
      tap(() => this.loadIndicadores())
    );
  }

  // ===== DASHBOARD =====

  getDashboardSummary(): Observable<{ ok: boolean; summary: DashboardSummary[] }> {
    return this.http.get<{ ok: boolean; summary: DashboardSummary[] }>(
      `${this.apiUrl}/dashboard/summary`
    );
  }

  getIndicadoresByMesAno(
    mes: string,
    ano: number
  ): Observable<{
    ok: boolean;
    total: number;
    concluidos: number;
    pendentes: number;
    somaBugs: number;
    indicadores: Indicador[];
  }> {
    return this.http.get<{
      ok: boolean;
      total: number;
      concluidos: number;
      pendentes: number;
      somaBugs: number;
      indicadores: Indicador[];
    }>(`${this.apiUrl}/dashboard/mes/${mes}/${ano}`);
  }

  // ===== CARDS =====

  getCards(): Observable<{ ok: boolean; total: number; cards: any[] }> {
    return this.http.get<{ ok: boolean; total: number; cards: any[] }>(
      `${this.apiUrl}/cards`
    );
  }

  importCards(cards: any[]): Observable<{ ok: boolean; processed: number }> {
    return this.http.post<{ ok: boolean; processed: number }>(
      `${this.apiUrl}/cards/import`,
      { cards }
    );
  }

  /** Import batch of indicadores. Tries backend, falls back to local upsert on error. */
  importBatch(indicadores: Indicador[]): Observable<{ ok: boolean; processed: number }> {
    const payload = { source: 'homologacao.import', indicadores: indicadores.map(i => this.normalizeIndicador(i)) };

    return this.http.post<{ ok: boolean; processed: number }>(
      `${this.apiUrl}/indicadores/batch`,
      payload
    ).pipe(
      tap((res) => {
        // On success, refresh local cache
        this.loadIndicadores();
      }),
      catchError((err) => {
        console.warn('Batch indicadores import failed, saving locally.', err);
        // Upsert each indicador locally
        (payload.indicadores || []).forEach(ind => this.upsertLocalIndicador(ind));
        return of({ ok: true, processed: (payload.indicadores || []).length });
      })
    );
  }

  getCardById(cardId: string): Observable<{ ok: boolean; card: any }> {
    return this.http.get<{ ok: boolean; card: any }>(
      `${this.apiUrl}/cards/${cardId}`
    );
  }

  private normalizeIndicador(indicador?: Indicador | null): Indicador {
    const now = new Date().toISOString();

    return {
      ...indicador,
      card_id: String(indicador?.card_id ?? ''),
      fabrica: String(indicador?.fabrica ?? ''),
      cliente: indicador?.cliente ?? '',
      componente: indicador?.componente ?? '',
      nivel: Number(indicador?.nivel ?? 1),
      mod: String(indicador?.mod ?? 'EXT'),
      homologador: indicador?.homologador ?? '',
      status: String(indicador?.status ?? 'MODELAGEM'),
      mes: String(indicador?.mes ?? 'JANEIRO'),
      ano: Number(indicador?.ano ?? new Date().getFullYear()),
      data_inicio: indicador?.data_inicio,
      data_conclusao: indicador?.data_conclusao,
      dias_uteis: indicador?.dias_uteis,
      somatorio_bugs: Number(indicador?.somatorio_bugs ?? 0),
      observacoes: indicador?.observacoes ?? '',
      bugs: indicador?.bugs ?? {},
      created_at: indicador?.created_at ?? now,
      updated_at: indicador?.updated_at ?? indicador?.created_at ?? now
    };
  }

  private sortIndicadores(indicadores: Indicador[]): Indicador[] {
    return [...indicadores].sort((a, b) => {
      const left = new Date(b.updated_at || b.created_at || 0).getTime();
      const right = new Date(a.updated_at || a.created_at || 0).getTime();
      return left - right;
    });
  }

  private getLocalIndicadores(): Indicador[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return this.sortIndicadores(parsed.map((indicador) => this.normalizeIndicador(indicador)));
    } catch {
      return [];
    }
  }

  private saveIndicadoresLocal(indicadores: Indicador[]): void {
    const normalized = this.sortIndicadores(indicadores.map((indicador) => this.normalizeIndicador(indicador)));
    localStorage.setItem(this.storageKey, JSON.stringify(normalized));
    this.indicadoresSubject.next(normalized);
  }

  private upsertLocalIndicador(indicador: Indicador): Indicador {
    const normalized = this.normalizeIndicador(indicador);
    const current = this.getLocalIndicadores();
    const index = normalized.id != null
      ? current.findIndex(item => String(item.id) === String(normalized.id))
      : -1;

    const next = index >= 0
      ? current.map((item, currentIndex) => currentIndex === index ? normalized : item)
      : [normalized, ...current];

    this.saveIndicadoresLocal(next);
    return normalized;
  }
}
