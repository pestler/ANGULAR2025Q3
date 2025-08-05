import { Component, HostListener } from '@angular/core';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarFooterComponent } from './sidebar-footer/sidebar-footer.component';
import { CloseSidebarOnOutsideClickDirective } from 'app/shared/directives/close-sidebar-on-outside-click.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarHeaderComponent,
    SidebarMenuComponent,
    SidebarFooterComponent,
    CloseSidebarOnOutsideClickDirective,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isOpen = true;
  isTablet = false;
  isTabletOpen = false;

  constructor() {
    this.updateLayout(window.innerWidth);
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number): void {
    this.updateLayout(width);
  }

  private updateLayout(width: number): void {
    this.isTablet = width <= 768;
    if (this.isTablet) {
      this.isOpen = false;
      this.isTabletOpen = false;
    }
  }

  toggleSidebar(): void {
    if (this.isTablet) {
      this.isTabletOpen = true;
      this.isOpen = true;
    } else {
      this.isOpen = !this.isOpen;
      this.isTabletOpen = false;
    }
  }
  closeSidebar(): void {
    this.isOpen = false;
    this.isTabletOpen = false;
  }
}
