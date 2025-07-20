import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

export enum SidebarSection {
  Overview = 'Overview',
  Lights = 'Lights',
}

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
  items: SidebarItem[] = [
    {
      label: SidebarSection.Overview,
      route: '/overview',
      icon: 'icon-overview',
    },
    { label: SidebarSection.Lights, route: '/lights', icon: 'icon-lights' },
  ];
}
