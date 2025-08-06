import { Component, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { DashboardService } from 'app/core/services/dashboard.service';
import { filter } from 'rxjs/operators';

export interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
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
  private readonly route = inject(ActivatedRoute);
  private readonly dashboardService = inject(DashboardService);

  readonly items = signal<SidebarItem[]>([]);
  readonly activeItem = signal<SidebarItem | null>(null);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveItem(this.router.url);
      });
  }

  ngOnInit(): void {
    this.dashboardService.getDashboards().then((dashboards) => {
      const sidebarItems = dashboards.map((d) => {
        const defaultTab = d.tabs?.find((t) => t.id !== 'usage') ??
          d.tabs?.[0] ?? { id: 'overview' };

        return {
          label: d.title,
          route: `/dashboard/${d.id}/${defaultTab.id}`,
          icon: `icon-${d.icon}`,
        };
      });

      this.items.set(sidebarItems);
      this.updateActiveItem(this.router.url); // initial selection
    });
  }

  private updateActiveItem(url: string): void {
    const segments = url.split('/');
    const dashboardId = segments[2]; // /dashboard/:dashboardId/:tabId

    const match = this.items().find((item) =>
      item.route.includes(`/${dashboardId}/`),
    );
    this.activeItem.set(match ?? null);
  }
}
