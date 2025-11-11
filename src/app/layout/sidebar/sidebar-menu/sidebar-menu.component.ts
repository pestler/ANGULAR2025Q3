import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

const sidebarSections = ['Overview', 'About'] as const;
type SidebarSection = (typeof sidebarSections)[number];

export interface SidebarItem {
  label: SidebarSection;
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

  readonly items: SidebarItem[] = sidebarSections.map((label) => ({
    label,
    route: `/${label.toLowerCase()}`,
    icon: `icon-${label.toLowerCase()}`,
  }));

  get currentRoute(): string {
    return this.router.url.split('?')[0].split('#')[0];
  }
}
