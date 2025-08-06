import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

import { RawMockDataService } from 'app/core/services/raw-mock-data.service';
import { CardListComponent } from 'app/shared/card/card-list/card-list.component';
import { LayoutType, SmartCard } from 'app/core/models/models';

@Component({
  selector: 'app-smart-view',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CardListComponent],
  templateUrl: './smart-view.component.html',
  styleUrls: ['./smart-view.component.scss'],
})
export class SmartViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly raw = inject(RawMockDataService);

  selectedIndex = 0;
  cards: SmartCard[] = [];

  dashboardId = '';
  tabIds: string[] = [];

  ngOnInit(): void {
    /* this.dashboardId = this.route.snapshot.paramMap.get('dashboardId') ?? '';
    const initialTabId = this.route.snapshot.paramMap.get('tabId') ?? ''; */
    this.dashboardId = this.route.snapshot.paramMap.get('dashboardId') ?? '';
    const initialTabId =
      this.route.snapshot.paramMap.get('tabId') ?? 'overview';

    this.loadTab(initialTabId);

    this.loadTab(initialTabId);
  }

  async loadTab(tabId: string): Promise<void> {
    if (!this.dashboardId || !tabId) return;

    const tab = await this.raw.getTab(this.dashboardId, tabId);
    this.cards = tab?.cards.map((card) => this.toSmartCard(card)) ?? [];

    if (tab && !this.tabIds.includes(tabId)) {
      this.tabIds.push(tabId);
    }
  }

  async switchTab(index: number): Promise<void> {
    this.selectedIndex = index;
    const tabId = this.tabIds[index];
    await this.loadTab(tabId);
  }

  private toSmartCard(card: SmartCard): SmartCard {
    return {
      id: card.id,
      title: card.title,
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
}
