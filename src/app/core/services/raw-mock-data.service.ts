import { Injectable } from '@angular/core';
import { SmartCard, Tab, LayoutType } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RawMockDataService {
  async getTab(tabId: string): Promise<{ cards: SmartCard[] } | undefined> {
    const response = await fetch('/assets/mock-data.json');
    if (!response.ok) {
      console.error('Failed to load mock-data.json');
      return undefined;
    }

    const data: { tabs: Tab[] } = await response.json();
    const rawTab = data.tabs.find((tab) => tab.id === tabId);
    if (!rawTab) return undefined;

    return {
      cards: rawTab.cards.map((card) => this.normalizeCard(card)),
    };
  }

  private normalizeCard(card: SmartCard): SmartCard {
    return {
      ...card,
      layout: this.normalizeLayout(card.layout),
      items: [...card.items],
    };
  }

  private normalizeLayout(layout: string): LayoutType {
    if (
      layout === 'horizontalLayout' ||
      layout === 'verticalLayout' ||
      layout === 'singleDevice'
    ) {
      return layout;
    }

    return 'verticalLayout';
  }
}
