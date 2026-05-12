import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiBase = getApiBaseUrl();

  constructor(private http: HttpClient) {}

  /**
   * Exportar indicadores em CSV
   */
  exportCSV(): Observable<Blob> {
    return this.http.get(`${this.apiBase}/export/csv`, {
      responseType: 'blob'
    });
  }

  /**
   * Exportar indicadores em JSON
   */
  exportJSON(): Observable<any> {
    return this.http.get(`${this.apiBase}/export/json`);
  }

  /**
   * Download de arquivo
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Download de JSON
   */
  downloadJSON(data: any, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this.downloadFile(blob, filename);
  }
}
