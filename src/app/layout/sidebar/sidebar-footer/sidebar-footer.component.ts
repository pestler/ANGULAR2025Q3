import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from 'app/core/auth.service';

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.scss'],
  imports: [MatIconModule, RouterLink],
})
export class SidebarFooterComponent {
  // eslint-disable-next-line no-unused-vars
  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
