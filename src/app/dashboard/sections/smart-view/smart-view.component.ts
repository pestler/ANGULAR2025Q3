import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

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
  selectedIndex = 0;
  cards: SmartCard[] = [];

  readonly tabs: ('overview' | 'lights')[] = ['overview', 'lights'];

  constructor(private readonly raw: RawMockDataService) { }
  ngOnInit(): void {
    this.loadTab();
  }

  async loadTab(): Promise<void> {
    const tabId = this.tabs[this.selectedIndex];
    const tab = await this.raw.getTab(tabId);
    this.cards = tab?.cards.map((card) => this.toSmartCard(card)) ?? [];
  }

  switchTab(index: number): void {
    this.selectedIndex = index;
    this.loadTab();
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
