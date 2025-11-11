import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss'],
})
export class SidebarHeaderComponent {
  @Input() isClosed = false;
  @Input() isTablet = false;
  @Output() toggle = new EventEmitter<void>();
  toggleSidebar(): void {
    this.toggle.emit();
  }
}
