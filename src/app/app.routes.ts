import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./dashboard/sections/smart-view/smart-view.component').then(
            (m) => m.SmartViewComponent,
          ),
        data: { page: 'overview' },
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./dashboard/sections/smart-view/smart-view.component').then(
            (m) => m.SmartViewComponent,
          ),
        data: { page: 'about' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
