import { Routes } from '@angular/router';
import { OverviewPage } from './pages/overview/overview.component';
import { NotPageComponent } from './pages/not-page/not-page.component';

export const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
    title: 'System Overview',
  },
  {
    path: '**',
    component: NotPageComponent,
    title: 'Page Not Found',
  },
];
