import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

export const ROUTES = {
  dashboard: {
    overview: '/dashboard/overview' as const,
    about: '/dashboard/about' as const,
  },
  login: '/login' as const,
  notFound: '/not-found' as const,
};

export interface SidebarItem {
  label: 'Overview' | 'About';
  route: (typeof ROUTES.dashboard)[keyof typeof ROUTES.dashboard];
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

  readonly items: SidebarItem[] = [
    {
      label: 'Overview',
      route: ROUTES.dashboard.overview,
      icon: 'icon-overview',
    },
    { label: 'About', route: ROUTES.dashboard.about, icon: 'icon-about' },
  ];

  get currentRoute(): string {
    return this.router.url.split('?')[0].split('#')[0];
  }
}
