import { Component, HostListener, signal } from '@angular/core';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarFooterComponent } from './sidebar-footer/sidebar-footer.component';
import { CloseSidebarOnOutsideClickDirective } from 'app/shared/directives/close-sidebar-on-outside-click.directive';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarHeaderComponent,
    SidebarMenuComponent,
    SidebarFooterComponent,
    CloseSidebarOnOutsideClickDirective,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isOpen = signal(true);
  isTablet = signal(false);
  isTabletOpen = signal(false);

  constructor() {
    this.updateLayout(window.innerWidth);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateLayout(window.innerWidth);
  }

  private updateLayout(width: number): void {
    this.isTablet.set(width <= 768);

    if (this.isTablet()) {
      this.isOpen.set(false);
      this.isTabletOpen.set(false);
    } else {
      this.isOpen.set(true);
      this.isTabletOpen.set(false);
    }
  }

  toggleSidebar(): void {
    if (this.isTablet()) {
      this.isTabletOpen.update((currentValue) => !currentValue);

      this.isOpen.set(this.isTabletOpen());
    } else {
      this.isOpen.update((currentValue) => !currentValue);
      this.isTabletOpen.set(false);
    }
  }

  closeSidebar(): void {
    this.isOpen.set(false);
    this.isTabletOpen.set(false);
  }
}
