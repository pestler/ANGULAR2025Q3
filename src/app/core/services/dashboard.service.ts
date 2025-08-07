import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Dashboard } from '../models/dashboard.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  readonly dashboards = signal<Dashboard[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private loaded = false;

  readonly dashboardMap = computed(() =>
    Object.fromEntries(this.dashboards().map((d) => [d.id, d])),
  );

  readonly allDashboardIds = computed(() => this.dashboards().map((d) => d.id));

  hasDashboard = (id: string): boolean => id in this.dashboardMap();

  getDashboard = (id: string): Dashboard | null =>
    this.dashboardMap()[id] ?? null;

  async load(): Promise<void> {
    if (this.loaded) return;

    this.loading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<Dashboard[]>(`${environment.apiUrl}/dashboards`),
      );
      this.dashboards.set(data);
      this.error.set(null);
      this.loaded = true;
    } catch (err: unknown) {
      const message =
        err instanceof HttpErrorResponse ? err.message : 'Unknown error';
      console.error('Dashboard fetch failed:', err);
      this.dashboards.set([]);
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
