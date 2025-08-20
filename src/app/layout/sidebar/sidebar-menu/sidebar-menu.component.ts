import { CommonModule } from '@angular/common';
import { Component, inject, computed, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from 'app/core/services/dashboard.service';

import { MatIconModule } from '@angular/material/icon';

export interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
  dashboardId: string;
}

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent {
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);
  @Input() isClosed = false;
  @Input() isTablet = false;

  /*   readonly currentDashboardId = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const segments = event.urlAfterRedirects.split('/');
        return segments[2] || null;
      }),
    ),
  ); */

  readonly items = computed(() =>
    this.dashboardService.dashboards().map((d) => ({
      route: `/dashboard/${d.id}`,
      icon: d.icon,
      label: d.title,
      dashboardId: d.id,
    })),
  );

  /* readonly activeItem = computed(
    () =>
      this.items().find(
        (item) => item.dashboardId === this.currentDashboardId(),
      ) ?? null,
  ); */
}
