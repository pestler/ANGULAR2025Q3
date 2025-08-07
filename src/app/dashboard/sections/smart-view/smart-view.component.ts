import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'app/core/services/dashboard.service';
import { RawMockDataService } from 'app/core/services/raw-mock-data.service';
import { SmartCard } from 'app/core/models/models';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { CardListComponent } from 'app/shared/card/card-list/card-list.component';

@Component({
  selector: 'app-smart-view',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CardListComponent],
  templateUrl: './smart-view.component.html',
  styleUrls: ['./smart-view.component.scss'],
})
export class SmartViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);
  private readonly raw = inject(RawMockDataService);

  readonly dashboardId = signal('');
  readonly tabId = signal('');
  readonly cards = signal<SmartCard[]>([]);

  constructor() {
    const params = this.route.snapshot.paramMap;
    this.dashboardId.set(params.get('dashboardId') ?? '');
    this.tabId.set(params.get('tabId') ?? '');

    effect(() => {
      const tabId = this.validTabId();
      this.loadTab(tabId);
    });

    this.init();
  }

  readonly tabIds = computed(() => {
    const dashboard = this.dashboardService.getDashboard(this.dashboardId());
    return dashboard?.tabs?.map((t) => t.id) ?? [];
  });

  readonly validTabId = computed(() => {
    const requested = this.tabId();
    const available = this.tabIds();
    return available.includes(requested) ? requested : (available[0] ?? '');
  });

  readonly selectedIndex = computed(() =>
    this.tabIds().indexOf(this.validTabId()),
  );

  readonly selectedTab = computed(() => {
    const dashboard = this.dashboardService.getDashboard(this.dashboardId());
    return dashboard?.tabs?.find((t) => t.id === this.validTabId()) ?? null;
  });

  async init(): Promise<void> {
    await this.dashboardService.load();

    const dashboard = this.dashboardService.getDashboard(this.dashboardId());
    if (!dashboard || !dashboard.tabs?.length) {
      console.warn(
        `Dashboard '${this.dashboardId()}' not found or has no tabs`,
      );
      this.cards.set([]);
      return;
    }

    const tabId = this.validTabId();
    const tab = await this.raw.getTab(this.dashboardId(), tabId);
    this.cards.set(tab?.cards ?? []);
  }

  private async loadTab(tabId: string): Promise<void> {
    const tab = await this.raw.getTab(this.dashboardId(), tabId);
    this.cards.set(tab?.cards ?? []);
  }

  async switchTab(index: number): Promise<void> {
    const tabId = this.tabIds()[index];
    this.tabId.set(tabId);
  }
}
