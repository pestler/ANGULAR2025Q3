import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { OverviewComponent } from './dashboard/sections/overview/overview.component';
import { LightsComponent } from './dashboard/sections/lights/lights.component';
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
        component: OverviewComponent,
      },
      {
        path: 'lights',
        component: LightsComponent,
      },
      {
        path: 'all',
        component: SmartViewComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
