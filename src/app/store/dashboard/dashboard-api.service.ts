/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FullDashboard } from 'app/core/models/dashboard.state.model';
import { Device } from 'app/core/models/models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getDashboard(dashboardId: string): Observable<FullDashboard> {
    return this.http.get<FullDashboard>(
      `${this.apiUrl}/dashboards/${dashboardId}`,
    );
  }

  saveDashboard(dashboard: FullDashboard): Observable<any> {
    return this.http.put(`${this.apiUrl}/dashboards/${dashboard.id}`, {
      tabs: dashboard.tabs,
    });
  }

  toggleDeviceState(deviceId: string, state: boolean): Observable<Device> {
    return this.http.patch<Device>(`${this.apiUrl}/devices/${deviceId}`, {
      state,
    });
  }
}
