import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DashboardService } from './services/dashboard.service';

export const defaultDashboardGuard: CanActivateFn = async () => {
  const dashboardService = inject(DashboardService);
  const router = inject(Router);

  await dashboardService.load();

  const firstDashboardId = dashboardService.allDashboardIds()[0];

  if (firstDashboardId) {
    router.navigate(['/dashboard', firstDashboardId]);
    return false;
  }

  return true;
};
