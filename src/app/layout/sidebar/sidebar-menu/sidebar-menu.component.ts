import { Component, inject, signal, computed } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DashboardService } from 'app/core/services/dashboard.service';
import { filter } from 'rxjs/operators';

export interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
  dashboardId: string;
}

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent {
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);

  readonly currentDashboardId = signal<string | null>(null);

  readonly items = computed(() =>
    this.dashboardService.dashboards().map((d) => ({
      label: d.title,
      route: `/dashboard/${d.id}`,
      icon: `icon-${d.icon}`,
      dashboardId: d.id,
    })),
  );

  readonly activeItem = computed(
    () =>
      this.items().find(
        (item) => item.dashboardId === this.currentDashboardId(),
      ) ?? null,
  );

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const segments = this.router.url.split('/');
        const dashboardId = segments[2] || null;
        this.currentDashboardId.set(dashboardId);
      });
  }
}
