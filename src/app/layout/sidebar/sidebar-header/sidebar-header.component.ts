import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss'],
})
export class SidebarHeaderComponent {
  @Input() isClosed = false;
  @Input() isTablet = false;
}
