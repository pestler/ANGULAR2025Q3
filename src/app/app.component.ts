import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@core/auth.service';
import { ThemeManagerService } from '@core/services/theme-manager.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeSwitcherComponent } from 'shared-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, ThemeSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private themeManager = inject(ThemeManagerService);

  ngOnInit(): void {
    this.auth.init();
    this.themeManager.loadTheme();
  }
}
