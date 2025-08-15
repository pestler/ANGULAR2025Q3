import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from 'app/core/services/dashboard.service';
import { RawMockDataService } from 'app/core/services/raw-mock-data.service';
import { SmartCard, Tab } from 'app/core/models/models';
import { MatTabsModule } from '@angular/material/tabs';
import { CardListComponent } from 'app/shared/card/card-list/card-list.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTabsModule, CardListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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

  readonly tabId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('tabId') ?? '')),
    { initialValue: '' },
  );

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

  readonly selectedIndex = computed(() => {
    const validId = this.validTabId();

    return validId ? this.tabIds().indexOf(validId) : 0;
  });

  private lastLoadedTabId = '';

  constructor() {
    effect(() => {
      const id = this.dashboardId();
      if (id) {
        this.loadDashboard(id);
      }
    });

    effect(() => {
      const dId = this.dashboardId();
      const tId = this.validTabId();

      if (dId && tId) {
        this.loadTab(dId, tId);
      } else {
        this.cards.set([]);
      }
    });
  }

  private async loadDashboard(id: string): Promise<void> {
    await this.dashboardService.load();
    const dashboard = this.dashboardService.getDashboard(id);
    if (!dashboard) {
      this.tabs.set([]);
      return;
    }
    const tabs = await this.raw.getTabs(id);
    this.tabs.set(tabs);
  }

  private async loadTab(dashboardId: string, tabId: string): Promise<void> {
    if (!tabId) {
      this.cards.set([]);
      return;
    }

    if (tabId === this.lastLoadedTabId) {
      return;
    }
    this.lastLoadedTabId = tabId;

    const tab = await this.raw.getTab(dashboardId, tabId);

    if (this.validTabId() === tabId) {
      this.cards.set(tab?.cards ?? []);
    }
  }

  async switchTab(index: number): Promise<void> {
    const tabId = this.tabIds()[index];
    if (tabId) {
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tabId },
        queryParamsHandling: 'merge',
      });
    }
  }
}
