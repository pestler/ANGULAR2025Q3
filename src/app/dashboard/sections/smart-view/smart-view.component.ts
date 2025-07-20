import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawMockDataService } from 'app/core/services/raw-mock-data.service';
import { RawTab } from 'app/core/types/raw-mock.types';

@Component({
  selector: 'app-smart-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './smart-view.component.html',
  styleUrls: ['./smart-view.component.scss'],
})
export class SmartViewComponent {
  activeTab: 'overview' | 'lights' = 'overview';
  tab?: RawTab;

  constructor(private readonly raw: RawMockDataService) {
    this.loadTab();
  }

  async loadTab(): Promise<void> {
    this.tab = await this.raw.getTab(this.activeTab);
  }

  switchTab(tabId: 'overview' | 'lights'): void {
    this.activeTab = tabId;
    this.loadTab();
  }

  layoutClasses(layout: string): string {
    switch (layout) {
      case 'horizontalLayout':
        return 'card-horizontal';
      case 'verticalLayout':
        return 'card-vertical';
      case 'singleDevice':
        return 'card-single';
      default:
        return 'card-vertical';
    }
  }
}
