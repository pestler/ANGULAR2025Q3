import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmartCard, Tab, LayoutType } from '../models/models';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';

interface DashboardResponse {
  tabs: Tab[];
}

@Injectable({ providedIn: 'root' })
export class RawMockDataService {
  private readonly http = inject(HttpClient);
  private readonly dashboardsUrl = `${environment.apiUrl}/dashboards`;

  private readonly dashboardCache = new Map<
    string,
    Promise<DashboardResponse>
  >();

  private readonly layoutMap: Record<string, LayoutType> = {
    horizontalLayout: 'horizontalLayout',
    verticalLayout: 'verticalLayout',
    singleDevice: 'singleDevice',
  };

  private getDashboardData(dashboardId: string): Promise<DashboardResponse> {
    if (this.dashboardCache.has(dashboardId)) {
      return this.dashboardCache.get(dashboardId)!;
    }

    const requestPromise = firstValueFrom(
      this.http.get<DashboardResponse>(`${this.dashboardsUrl}/${dashboardId}`),
    ).catch((error) => {
      this.dashboardCache.delete(dashboardId);

      return Promise.reject(error);
    });

    this.dashboardCache.set(dashboardId, requestPromise);
    return requestPromise;
  }

  async getTabs(dashboardId: string): Promise<Tab[]> {
    try {
      const response = await this.getDashboardData(dashboardId);
      return response.tabs;
    } catch (error) {
      console.error(
        `Failed to load tabs for dashboard "${dashboardId}"`,
        error,
      );
      return [];
    }
  }

  async getTab(
    dashboardId: string,
    tabId: string,
  ): Promise<{ cards: SmartCard[] } | undefined> {
    try {
      const response = await this.getDashboardData(dashboardId);
      const rawTab = response.tabs.find((tab) => tab.id === tabId);

      if (!rawTab) {
        console.warn(`Tab "${tabId}" not found in dashboard "${dashboardId}"`);
        return undefined;
      }

      return {
        cards: rawTab.cards.map((card) => this.normalizeCard(card)),
      };
    } catch (error) {
      console.error('Failed to load dashboard tab data', error);
      return undefined;
    }
  }

  private normalizeCard(card: SmartCard): SmartCard {
    return {
      ...card,
      layout: this.normalizeLayout(card.layout),
      items: [...card.items],
    };
  }

  private normalizeLayout(layout: string): LayoutType {
    return this.layoutMap[layout] ?? 'verticalLayout';
  }
}
