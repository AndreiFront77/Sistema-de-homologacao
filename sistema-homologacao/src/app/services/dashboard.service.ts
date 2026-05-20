import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { getApiBaseUrl } from './api-base';
import { IndicadorService } from './indicador.service';
import { HomologacaoService } from './homologacao.service';
import {
  buildBugTotalsFromIndicadores,
  buildClientStatsFromIndicadores,
  buildMonthlyStatsFromIndicadores,
  buildStatusStatsFromIndicadores
} from './inconsistency-catalog';

export interface DashboardStats {
  monthly: any[];
  status: any[];
  clients: any[];
  bugs: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiBase = getApiBaseUrl();
  private readonly cacheKey = 'dashboard-stats-cache';
  private dashboardStatsSubject = new BehaviorSubject<DashboardStats | null>(null);
  public dashboardStats$ = this.dashboardStatsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private indicadorService: IndicadorService,
    private homologacaoService: HomologacaoService
  ) {}

  /**
   * Carregar estatísticas completas do dashboard
   */
  loadDashboardStats(): Observable<DashboardStats> {
    return combineLatest([
      this.indicadorService.getIndicadores(),
      this.homologacaoService.cards$
    ]).pipe(
      map(([indicadoresResponse, cards]) => this.buildDashboardStats(indicadoresResponse.indicadores || [], cards || [])),
      tap((stats) => this.cacheDashboardStats(stats)),
      catchError(() => {
        const cached = this.getCachedDashboardStats();
        if (cached) {
          return of(cached);
        }

        return of(this.buildDashboardStats([], []));
      })
    );
  }

  getCachedDashboardStats(): DashboardStats | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) {
        return null;
      }

      return JSON.parse(cached) as DashboardStats;
    } catch {
      return null;
    }
  }

  /**
   * Obter estatísticas de status
   */
  getStatusStats(): Observable<any[]> {
    return combineLatest([this.indicadorService.getIndicadores(), this.homologacaoService.cards$]).pipe(
      map(([response, cards]) => buildStatusStatsFromIndicadores(((response.indicadores || []).length > 0 ? response.indicadores || [] : cards || []) as any[])),
      catchError(this.handleError)
    );
  }

  /**
   * Obter estatísticas de clientes
   */
  getClientStats(): Observable<any[]> {
    return combineLatest([this.indicadorService.getIndicadores(), this.homologacaoService.cards$]).pipe(
      map(([response, cards]) => buildClientStatsFromIndicadores(((response.indicadores || []).length > 0 ? response.indicadores || [] : cards || []) as any[])),
      catchError(this.handleError)
    );
  }

  /**
   * Obter estatísticas de bugs por categoria
   */
  getBugStats(): Observable<any> {
    return combineLatest([this.indicadorService.getIndicadores(), this.homologacaoService.cards$]).pipe(
      map(([response, cards]) => buildBugTotalsFromIndicadores(((response.indicadores || []).length > 0 ? response.indicadores || [] : cards || []) as any[])),
      catchError(this.handleError)
    );
  }

  getLocalBugStatsSnapshot(): Record<string, number> {
    try {
      const indicadores = JSON.parse(localStorage.getItem('sistema-homologacao.indicadores') || '[]');
      const cards = JSON.parse(localStorage.getItem('cards') || '[]');
      const sourceItems = Array.isArray(indicadores) && indicadores.length > 0 ? indicadores : cards;
      const detailedBugStats = buildBugTotalsFromIndicadores(sourceItems as any[]);
      if (Object.keys(detailedBugStats).length > 0) {
        return detailedBugStats;
      }

      const totalFromSummaries = (sourceItems || []).reduce((acc: number, item: any) => acc + Number(item?.somatorio_bugs || 0), 0);
      return totalFromSummaries > 0 ? { sem_detalhamento: totalFromSummaries } : {};
    } catch {
      return {};
    }
  }

  /**
   * Obter resumo mensal
   */
  getMonthlySummary(): Observable<any[]> {
    return combineLatest([this.indicadorService.getIndicadores(), this.homologacaoService.cards$]).pipe(
      map(([response, cards]) => buildMonthlyStatsFromIndicadores(((response.indicadores || []).length > 0 ? response.indicadores || [] : cards || []) as any[])),
      catchError(this.handleError)
    );
  }

  /**
   * Preparação para receber indicadores via webhook/API
   * Endpoint para integração futura com outros sistemas
   */
  receiveIndicadoresFromExternal(source: string, indicadores: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/indicadores/batch`, {
      source,
      timestamp: new Date().toISOString(),
      indicadores
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Dashboard API error:', error);
    return throwError(() => new Error(error.message || 'Erro ao carregar dashboard'));
  }

  private cacheDashboardStats(stats: DashboardStats): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(stats));
      this.dashboardStatsSubject.next(stats);
    } catch {
      // Cache local é opcional; a resposta ainda foi carregada com sucesso.
    }
  }

  private buildDashboardStats(indicadores: any[], cards: any[] = []): DashboardStats {
    const sourceItems = indicadores.length > 0 ? indicadores : cards;
    const monthly = buildMonthlyStatsFromIndicadores(sourceItems as any[]);
    const status = buildStatusStatsFromIndicadores(sourceItems as any[]);
    const clients = buildClientStatsFromIndicadores(sourceItems as any[]);
    const bugs = buildBugTotalsFromIndicadores(sourceItems as any[]);

    return {
      monthly,
      status,
      clients,
      bugs
    };
  }
}
