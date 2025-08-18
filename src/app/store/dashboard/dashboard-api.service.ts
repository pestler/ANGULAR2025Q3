/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  FullDashboard,
  NewDashboardPayload,
} from 'app/core/models/dashboard.state.model';
import { Device, SmartItem } from 'app/core/models/models';
import { ApiService } from 'app/core/api.service';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private readonly apiUrl = '';

  getDashboard(dashboardId: string): Observable<FullDashboard> {
    const url = this.api.resolve(`/dashboards/${dashboardId}`);
    return this.http.get<FullDashboard>(url);
  }

  saveDashboard(dashboard: FullDashboard): Observable<any> {
    const url = this.api.resolve(`/dashboards/${dashboard.id}`);
    return this.http.put(url, {
      tabs: dashboard.tabs,
    });
  }

  toggleDeviceState(deviceId: string, state: boolean): Observable<Device> {
    const url = this.api.resolve(`/devices/${deviceId}`);
    return this.http.patch<Device>(url, {
      state,
    });
  }

  createDashboard(payload: NewDashboardPayload): Observable<any> {
    const url = this.api.resolve(`/dashboards`);
    return this.http.post(url, payload);
  }

  deleteDashboard(dashboardId: string): Observable<void> {
    const url = this.api.resolve(`/dashboards/${dashboardId}`);
    return this.http.delete<void>(url);
  }

  getAvailableEntities(): Observable<SmartItem[]> {
    const url = this.api.resolve(`/devices`);
    return this.http.get<SmartItem[]>(url);
  }
}
