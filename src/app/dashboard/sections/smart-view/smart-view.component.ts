import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RawMockDataService } from 'app/core/services/raw-mock-data.service';
import { RawTab } from 'app/core/types/raw-mock.types';

@Component({
  selector: 'app-smart-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTabsModule],
  templateUrl: './smart-view.component.html',
  styleUrls: ['./smart-view.component.scss'],
})
export class SmartViewComponent {
  activeTab: 'overview' | 'lights' = 'overview';
  selectedIndex = 0;
  tab?: RawTab;

  constructor(private readonly raw: RawMockDataService) {
    this.loadTab();
  }

  async loadTab(): Promise<void> {
    this.tab = await this.raw.getTab(this.activeTab);
  }

  switchTab(index: number): void {
    this.selectedIndex = index;
    this.activeTab = index === 0 ? 'overview' : 'lights';
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
