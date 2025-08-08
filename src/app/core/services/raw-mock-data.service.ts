import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmartCard, Tab, LayoutType } from '../models/models';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class RawMockDataService {
  private readonly http = inject(HttpClient);
  private readonly dashboardsUrl = `${environment.apiUrl}/dashboards`;

  async getTab(
    dashboardId: string,
    tabId: string,
  ): Promise<{ cards: SmartCard[] } | undefined> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ tabs: Tab[] }>(`${this.dashboardsUrl}/${dashboardId}`),
      );

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
    switch (layout) {
      case 'horizontalLayout':
      case 'verticalLayout':
      case 'singleDevice':
        return layout;
      default:
        return 'verticalLayout';
    }
  }
  async getTabs(dashboardId: string): Promise<Tab[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ tabs: Tab[] }>(`${this.dashboardsUrl}/${dashboardId}`),
      );
      return response.tabs;
    } catch (error) {
      console.error(
        `Failed to load tabs for dashboard "${dashboardId}"`,
        error,
      );
      return [];
    }
  }
}
