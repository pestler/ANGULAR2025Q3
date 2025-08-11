import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DashboardService } from 'app/core/services/dashboard.service';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

export interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
  dashboardId: string;
}

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent {
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);
  constructor() {}

  readonly currentDashboardId = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const segments = event.urlAfterRedirects.split('/');
        return segments[2] || null;
      }),
    ),
  );

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
}
