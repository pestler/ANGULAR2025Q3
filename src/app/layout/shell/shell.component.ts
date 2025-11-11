import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '@core/auth.service';
import { DashboardService } from '@core/services/dashboard.service';
//import { AuthService } from 'app/core/auth.service';

//import { DashboardService } from 'app/core/services/dashboard.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  auth = inject(AuthService);

  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.dashboardService.load();
  }
}
