import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '@core/auth.service';
import { DashboardService } from '@core/services/dashboard.service';
import { CreateDashboardDialogComponent } from 'shared-ui';

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.scss'],

  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class SidebarFooterComponent {
  @Input() isClosed = false;
  @Input() isTablet = false;

  public auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private dashboardService = inject(DashboardService);

  logout(): void {
    this.auth.logout();
  }

  openCreateDashboardDialog(): void {
    this.dialog.open(CreateDashboardDialogComponent, {
      width: '450px',
      data: {
        existingIds: this.dashboardService.allDashboardIds(),
      },
    });
  }
}
