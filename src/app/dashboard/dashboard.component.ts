import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { CardListComponent } from 'app/shared/card/card-list/card-list.component';
import * as DashboardActions from '../store/dashboard/dashboard.actions';
import * as DashboardSelectors from '../store/dashboard/dashboard.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Tab, LayoutType } from 'app/core/models/models';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SelectCardLayoutComponent } from 'app/shared/dialogs/select-card-layout/select-card-layout.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { FullDashboard } from 'app/core/models/dashboard.state.model';
import { ConfirmationDialogComponent } from 'app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface CanDeactivateComponent {
  canDeactivate: () => boolean;
}

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class SmartViewComponent implements CanDeactivateComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly isEditMode = signal(false);
  editingTabId = signal<string | null>(null);

  dashboardTitleControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
  ]);
  tabTitleControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
  ]);

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
  private originalDashboard$ = this.store.select(
    DashboardSelectors.selectOriginalDashboard,
  );
  readonly currentTitle = toSignal(
    this.store.select(DashboardSelectors.selectDashboardTitle),
  );

  readonly tabs = toSignal(
    this.store.select(DashboardSelectors.selectDashboardTabs),
    { initialValue: [] },
  );
  readonly isLoading = toSignal(
    this.store.select(DashboardSelectors.selectIsLoading),
  );
  readonly error = toSignal(this.store.select(DashboardSelectors.selectError));

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

  readonly currentTabTitle = computed(() => {
    const currentTab = this.tabs().find((t) => t.id === this.validTabId());
    return currentTab?.title ?? '';
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

    effect(() => {
      this.dashboardTitleControl.setValue(this.currentTitle() ?? '', {
        emitEvent: false,
      });
    });

    effect(() => {
      const availableTabs = this.tabs();
      const currentTabId = this.activeTabId();
      if (availableTabs.length > 0 && !currentTabId) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { tabId: availableTabs[0].id },
          queryParamsHandling: 'merge',
        });
      }
    });
    effect(
      () => {
        const active = this.activeTabId();
        const valid = this.validTabId();

        if (valid && active !== valid) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { tabId: valid },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }
      },
      { allowSignalWrites: true },
    );

    this.dashboardTitleControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((newTitle) => {
        if (this.dashboardTitleControl.valid && newTitle !== null) {
          this.store.dispatch(
            DashboardActions.updateDashboardTitle({ title: newTitle }),
          );
        }
      });

    this.tabTitleControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((newTitle) => {
        const tabId = this.editingTabId();
        if (tabId && this.tabTitleControl.valid && newTitle) {
          this.store.dispatch(
            DashboardActions.updateTabTitle({ tabId, newTitle }),
          );
        }
      });
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
    this.store.dispatch(DashboardActions.enterEditMode());

    if (this.tabs().length === 0) {
      this.store.dispatch(DashboardActions.addTab({ title: 'Main' }));
    }
  }

  saveChanges(): void {
    const currentId = this.dashboardId();

    this.dashboard$.pipe(take(1)).subscribe((dashboardState) => {
      if (currentId && dashboardState) {
        this.store.dispatch(
          DashboardActions.saveDashboard({
            dashboardId: currentId,
            payload: { tabs: dashboardState.tabs },
          }),
        );
      } else {
        console.error('Save failed: could not get dashboard ID or state.');
      }
    });

    this.isEditMode.set(false);
  }

  discardChanges(): void {
    this.store.dispatch(DashboardActions.discardChanges());
    this.isEditMode.set(false);
  }

  deleteDashboard(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Dashboard',
        message:
          'Are you sure you want to permanently delete this dashboard? This action cannot be undone.',
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const currentId = this.dashboardId();
        if (currentId) {
          this.store.dispatch(
            DashboardActions.deleteDashboard({ dashboardId: currentId }),
          );
        }
      }
    });
  }

  switchTab(index: number): Promise<boolean> {
    const tabId = this.tabIds()[index];
    if (tabId) {
      return this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tabId },
        queryParamsHandling: 'merge',
      });
    }
    return Promise.resolve(false);
  }

  addTab(): void {
    const title = prompt('Enter a title for the new tab:');
    if (title) {
      this.store.dispatch(DashboardActions.addTab({ title }));
    }
  }

  removeTab(tabId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Tab',
        message: 'Are you sure you want to delete this tab and all its cards?',
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.store.dispatch(DashboardActions.removeTab({ tabId }));
      }
    });
  }

  startEditTab(tab: Tab): void {
    this.editingTabId.set(tab.id);
    this.tabTitleControl.setValue(tab.title);
  }

  stopEditTab(): void {
    this.editingTabId.set(null);
  }

  addCard(): void {
    const dialogRef = this.dialog.open(SelectCardLayoutComponent, {
      width: '650px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: LayoutType | null) => {
      if (result) {
        const currentTabId = this.validTabId();
        if (currentTabId) {
          this.store.dispatch(
            DashboardActions.addCard({
              tabId: currentTabId,
              layout: result,
            }),
          );
        }
      }
    });
  }

  canDeactivate(): boolean {
    if (!this.isEditMode()) {
      return true;
    }
    let originalData: FullDashboard | null = null;
    let currentData: FullDashboard | null = null;
    this.originalDashboard$.pipe(take(1)).subscribe((d) => (originalData = d));
    this.dashboard$.pipe(take(1)).subscribe((d) => (currentData = d));

    if (JSON.stringify(originalData) === JSON.stringify(currentData)) {
      return true;
    }
    return confirm(
      'You have unsaved changes. Are you sure you want to leave? All changes will be lost.',
    );
  }

  reorderTab(tabId: string, direction: 'left' | 'right'): void {
    this.store.dispatch(DashboardActions.reorderTab({ tabId, direction }));
  }
}
