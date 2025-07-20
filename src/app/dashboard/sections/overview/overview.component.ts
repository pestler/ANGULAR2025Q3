import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawMockDataService } from 'app/core/services/raw-mock-data.service';
import { RawTab } from 'app/core/types/raw-mock.types';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  tab?: RawTab;

  constructor(private readonly raw: RawMockDataService) {
    this.loadTab();
  }

  async loadTab(): Promise<void> {
    this.tab = await this.raw.getTab('overview');
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
