import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from 'app/core/services/dashboard.service';
import { RawMockDataService } from 'app/core/services/raw-mock-data.service';
import { SmartCard, Tab } from 'app/core/models/models';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { CardListComponent } from 'app/shared/card/card-list/card-list.component';
import { map } from 'rxjs';

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

  readonly dashboardId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('dashboardId') ?? '')),
    { initialValue: '' },
  );

  readonly tabId = signal('');
  readonly tabs = signal<Tab[]>([]);
  readonly cards = signal<SmartCard[]>([]);

  readonly tabIds = computed(() => this.tabs().map((t) => t.id));

  readonly validTabId = computed(() => {
    const requested = this.tabId();
    const available = this.tabIds();
    const valid = available.includes(requested)
      ? requested
      : (available[0] ?? '');
    return valid;
  });

  readonly selectedIndex = computed(() =>
    this.tabIds().indexOf(this.validTabId()),
  );

  readonly selectedTab = computed(
    () => this.tabs().find((t) => t.id === this.validTabId()) ?? null,
  );

  constructor() {
    effect(() => {
      this.loadDashboard();
    });

    effect(() => {
      const tabs = this.tabs();
      if (!tabs.length) return;

      const tabId = this.validTabId();
      this.loadTab(tabId);
    });
  }

  private lastLoadedTabId = '';

  private async loadDashboard(): Promise<void> {
    const id = this.dashboardId();

    await this.dashboardService.load();

    const dashboard = this.dashboardService.getDashboard(id);
    if (!dashboard) {
      this.tabs.set([]);
      this.cards.set([]);
      return;
    }

    const tabs = await this.raw.getTabs(id);

    this.tabs.set(tabs);
  }

  private async loadTab(tabId: string): Promise<void> {
    if (!tabId) {
      console.warn('Empty tabId, skipping load');
      this.cards.set([]);
      return;
    }

    if (tabId === this.lastLoadedTabId) {
      return;
    }

    this.lastLoadedTabId = tabId;

    const tab = await this.raw.getTab(this.dashboardId(), tabId);

    if (!tab) {
      console.warn(`Tab '${tabId}' not found`);
      this.cards.set([]);
      return;
    }
    this.cards.set(tab.cards);
  }

  async switchTab(index: number): Promise<void> {
    const tabId = this.tabIds()[index];
    this.tabId.set(tabId);

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tabId },
      queryParamsHandling: 'merge',
    });
  }
}
