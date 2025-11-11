import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env';
import { Dashboard } from '../models/dashboard.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  readonly dashboards = signal<Dashboard[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private loadPromise: Promise<void> | null = null;

  readonly dashboardMap = computed(() =>
    Object.fromEntries(this.dashboards().map((d) => [d.id, d])),
  );

  readonly allDashboardIds = computed(() => this.dashboards().map((d) => d.id));

  hasDashboard = (id: string): boolean => id in this.dashboardMap();
  getDashboard = (id: string): Dashboard | null =>
    this.dashboardMap()[id] ?? null;

  public updateLocalDashboardTitle(id: string, newTitle: string): void {
    this.dashboards.update((currentDashboards) => {
      return currentDashboards.map((dashboard) => {
        if (dashboard.id === id) {
          return { ...dashboard, title: newTitle };
        }

        return dashboard;
      });
    });
  }

  async load(forceReload = false): Promise<void> {
    if (forceReload) {
      this.loadPromise = null;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async (): Promise<void> => {
      this.loading.set(true);
      this.error.set(null);

      try {
        const data = await firstValueFrom(
          this.http.get<Dashboard[]>(`${environment.apiUrl}/dashboards`),
        );
        this.dashboards.set(data);
      } catch (err: unknown) {
        let message = 'An unknown error occurred';
        if (err instanceof HttpErrorResponse) {
          message =
            typeof err.error === 'string'
              ? err.error
              : (err.error?.message ?? err.message);
        }
        console.error('Dashboard fetch failed:', err);
        this.dashboards.set([]);
        this.error.set(message);
      } finally {
        this.loading.set(false);
      }
    })();

    return this.loadPromise;
  }
}
