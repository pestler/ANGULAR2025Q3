import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawMockDataService } from 'app/core/services/raw-mock-data.service';
import { RawTab } from 'app/core/types/raw-mock.types';

@Component({
  selector: 'app-lights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss'],
})
export class LightsComponent {
  tab?: RawTab;

  constructor(private readonly raw: RawMockDataService) {
    this.loadTab();
  }

  async loadTab(): Promise<void> {
    this.tab = await this.raw.getTab('lights');
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
