import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { CardListComponent } from 'app/shared/card/card-list/card-list.component';
import * as DashboardActions from '../store/dashboard/dashboard.actions';
import * as DashboardSelectors from '../store/dashboard/dashboard.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    CardListComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class SmartViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  readonly isEditMode = signal(false);

  readonly dashboardId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('dashboardId') ?? '')),
    { initialValue: '' },
  );
  readonly activeTabId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('tabId') ?? '')),
    { initialValue: '' },
  );
  readonly dashboard$ = this.store.select(
    DashboardSelectors.selectCurrentDashboard,
  );

  readonly tabs = toSignal(
    this.store.select(DashboardSelectors.selectDashboardTabs),
    { initialValue: [] },
  );
  readonly isLoading = toSignal(
    this.store.select(DashboardSelectors.selectIsLoading),
  );

  readonly tabIds = computed(() => this.tabs().map((t) => t.id));

  readonly validTabId = computed(() => {
    const requested = this.activeTabId();
    const available = this.tabIds();
    return available.includes(requested) ? requested : (available[0] ?? '');
  });

  readonly selectedIndex = computed(() => {
    const validId = this.validTabId();
    return validId ? this.tabIds().indexOf(validId) : 0;
  });

  readonly cards = computed(() => {
    const currentTab = this.tabs().find((t) => t.id === this.validTabId());
    return currentTab?.cards ?? [];
  });

  constructor() {
    effect(() => {
      const id = this.dashboardId();
      if (id) {
        this.store.dispatch(
          DashboardActions.loadDashboard({ dashboardId: id }),
        );
      }
    });
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
    this.store.dispatch(DashboardActions.enterEditMode());
  }

  saveChanges(): void {
    this.store.dispatch(DashboardActions.saveDashboard());
    this.isEditMode.set(false);
  }

  discardChanges(): void {
    this.store.dispatch(DashboardActions.discardChanges());
    this.isEditMode.set(false);
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

  addTab(): void {
    const title = prompt('Enter a title for the new tab:');
    if (title) {
      this.store.dispatch(DashboardActions.addTab({ title }));
    }
  }

  removeTab(tabId: string): void {
    if (
      confirm('Are you sure you want to delete this tab and all its cards?')
    ) {
      this.store.dispatch(DashboardActions.removeTab({ tabId }));
    }
  }
}
