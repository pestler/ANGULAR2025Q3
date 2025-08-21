import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { LoginPageComponent } from './layout/pages/login/login-page.component';
import { authGuard } from './core/auth.guard';
import { AboutPageComponent } from './layout/pages/about/about-page.component';
import { NotFoundPageComponent } from './layout/pages/not-found/not-found-page.component';
import { defaultDashboardGuard } from './core/default-dashboard.guard';

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
          import('./dashboard/dashboard.component').then(
            (m) => m.SmartViewComponent,
          ),
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
