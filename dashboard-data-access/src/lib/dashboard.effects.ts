import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { DashboardService } from '@core/services/dashboard.service';
import * as DashboardActions from './dashboard.actions';
import { DashboardApiService } from './dashboard-api.service';

import * as DashboardSelectors from './dashboard.selectors';
import { FullDashboard } from '@core/models/dashboard.state.model';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardApiService = inject(DashboardApiService);
  private store = inject(Store);
  private router = inject(Router);
  private dashboardListService = inject(DashboardService);

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboard),
      switchMap((action) =>
        this.dashboardApiService.getDashboard(action.dashboardId).pipe(
          map((dashboardData) => {
            const dashboardInfo = this.dashboardListService.getDashboard(
              action.dashboardId,
            );

            const fullDashboard: FullDashboard = {
              id: dashboardInfo?.id ?? action.dashboardId,
              title: dashboardInfo?.title ?? 'Dashboard',
              icon: dashboardInfo?.icon ?? 'default-icon',
              tabs: dashboardData.tabs,
            };

            return DashboardActions.loadDashboardSuccess({
              dashboard: fullDashboard,
            });
          }),
          catchError((error) =>
            of(DashboardActions.loadDashboardFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  saveDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.saveDashboard),

      withLatestFrom(
        this.store.select(DashboardSelectors.selectCurrentDashboard),
      ),

      switchMap(([, dashboard]) => {
        if (!dashboard || !dashboard.id) {
          console.error(
            'Save failed: dashboard is null or has no ID in the store.',
            dashboard,
          );

          return of({
            type: '[Dashboard] Save Error: No Dashboard or ID in Store State',
          });
        }

        return this.dashboardApiService.saveDashboard(dashboard).pipe(
          map(() => DashboardActions.exitEditMode()),
          catchError((error) => {
            console.error('Save failed on API call:', error);

            return of({ type: '[Dashboard API] Save Dashboard Failed' });
          }),
        );
      }),
    ),
  );

  toggleDeviceState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.toggleDeviceState),
      switchMap((action) =>
        this.dashboardApiService
          .toggleDeviceState(action.deviceId, action.state)
          .pipe(
            map((updatedDevice) =>
              DashboardActions.toggleDeviceStateSuccess({ updatedDevice }),
            ),
            catchError(() =>
              of(
                DashboardActions.toggleDeviceStateFailure({
                  deviceId: action.deviceId,
                  previousState: !action.state,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  deleteDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.deleteDashboard),
      switchMap(({ dashboardId }) =>
        this.dashboardApiService.deleteDashboard(dashboardId).pipe(
          map(() => DashboardActions.deleteDashboardSuccess()),
          catchError((error) =>
            of(DashboardActions.deleteDashboardFailure({ error })),
          ),
        ),
      ),
    ),
  );

  reloadListAndNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          DashboardActions.deleteDashboardSuccess,
          DashboardActions.createDashboardSuccess,
        ),
        tap(async (action) => {
          await this.dashboardListService.load(true);

          let navigateToId: string | undefined;

          if (action.type === DashboardActions.createDashboardSuccess.type) {
            navigateToId = (
              action as ReturnType<
                typeof DashboardActions.createDashboardSuccess
              >
            ).newDashboard.id;
          } else {
            navigateToId = this.dashboardListService.allDashboardIds()[0];
          }

          if (navigateToId) {
            this.router.navigate(['/dashboard', navigateToId]);
          } else {
            this.router.navigate(['/']);
          }
        }),
      ),
    { dispatch: false },
  );

  updateSidebarOnTitleChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.updateDashboardTitle),
        withLatestFrom(
          this.store.select(DashboardSelectors.selectCurrentDashboard),
        ),
        tap(([action, dashboard]) => {
          if (dashboard && dashboard.id) {
            this.dashboardListService.updateLocalDashboardTitle(
              dashboard.id,
              action.title,
            );
          }
        }),
      ),
    { dispatch: false },
  );

  createDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.createDashboard),
      switchMap(({ payload }) =>
        this.dashboardApiService.createDashboard(payload).pipe(
          map((newDashboard) =>
            DashboardActions.createDashboardSuccess({ newDashboard }),
          ),
          catchError((error) =>
            of(
              DashboardActions.createDashboardFailure({ error: error.message }),
            ),
          ),
        ),
      ),
    ),
  );

  createSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.createDashboardSuccess),
        tap(async ({ newDashboard }) => {
          await this.dashboardListService.load(true);

          this.router.navigate(['/dashboard', newDashboard.id]);
        }),
      ),
    { dispatch: false },
  );
}
