import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { SmartViewComponent } from './dashboard/sections/smart-view/smart-view.component';

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
        component: SmartViewComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
