import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { LoginPageComponent } from './layout/pages/login/login-page.component';
import { authGuard } from '@core/auth.guard';
import { AboutPageComponent } from './layout/pages/about/about-page.component';
import { NotFoundPageComponent } from './layout/pages/not-found/not-found-page.component';
import { defaultDashboardGuard } from '@core/default-dashboard.guard';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  DashboardEffects,
  dashboardReducer,
  featureKey,
} from 'dashboard-data-access';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [defaultDashboardGuard],
        children: [],
      },
      {
        path: 'about',
        component: AboutPageComponent,
        data: { page: 'about' },
      },
      {
        path: ':dashboardId',
        loadComponent: () =>
          import('dashboard-feature').then((m) => m.SmartViewComponent),
        providers: [
          provideState(featureKey, dashboardReducer),
          provideEffects([DashboardEffects]),
        ],
      },
    ],
  },
  {
    path: 'not-found',
    component: NotFoundPageComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
