/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import * as DashboardActions from './dashboard.actions';
import * as DashboardSelectors from './dashboard.selectors';
import { DashboardApiService } from './dashboard-api.service';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardApiService = inject(DashboardApiService);
  private store = inject(Store);

  constructor() {}

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboard),
      switchMap((action) =>
        this.dashboardApiService.getDashboard(action.dashboardId).pipe(
          map((dashboard) =>
            DashboardActions.loadDashboardSuccess({ dashboard }),
          ),
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
      switchMap(([action, dashboard]) => {
        if (!dashboard) {
          return of({ type: '[Dashboard] Save Error: No Dashboard in State' });
        }
        return this.dashboardApiService.saveDashboard(dashboard).pipe(
          map(() => DashboardActions.exitEditMode()),
          catchError(() =>
            of({ type: '[Dashboard API] Save Dashboard Failed' }),
          ),
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

            catchError((error) =>
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
}
