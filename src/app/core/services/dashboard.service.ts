import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, of } from 'rxjs';
import { environment } from 'environments/environment';

export interface Dashboard {
  id: string;
  title: string;
  icon: string;
  tabs?: { id: string; title: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDashboards(): Promise<Dashboard[]> {
    return firstValueFrom(
      this.http.get<Dashboard[]>(`${environment.apiUrl}/dashboards`).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Dashboard fetch failed:', error);
          return of([] as Dashboard[]);
        }),
      ),
    );
  }
}
