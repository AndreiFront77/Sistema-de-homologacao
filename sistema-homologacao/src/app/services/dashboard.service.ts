import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { getApiBaseUrl } from './api-base';

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

  constructor(private http: HttpClient) {}

  /**
   * Carregar estatísticas completas do dashboard
   */
  loadDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiBase}/dashboard/analytics`).pipe(
      map((response: any) => response),
      tap((stats) => this.cacheDashboardStats(stats)),
      catchError(this.handleError)
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
    return this.http.get<any>(`${this.apiBase}/dashboard/status-stats`).pipe(
      map((response: any) => response.status || []),
      catchError(this.handleError)
    );
  }

  /**
   * Obter estatísticas de clientes
   */
  getClientStats(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBase}/dashboard/client-stats`).pipe(
      map((response: any) => response.clients || []),
      catchError(this.handleError)
    );
  }

  /**
   * Obter estatísticas de bugs por categoria
   */
  getBugStats(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/dashboard/bugs-stats`).pipe(
      map((response: any) => response.bugs || {}),
      catchError(this.handleError)
    );
  }

  /**
   * Obter resumo mensal
   */
  getMonthlySummary(): Observable<any[]> {
    return this.http.get<any>(`${this.apiBase}/dashboard/summary`).pipe(
      map((response: any) => response.summary || []),
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
}
