import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeManagerService } from '@core/services/theme-manager.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <button
      mat-icon-button
      (click)="toggleTheme()"
      [attr.aria-label]="
        isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'
      "
    >
      @if (isDarkMode()) {
        <mat-icon>light_mode</mat-icon>
      } @else {
        <mat-icon>dark_mode</mat-icon>
      }
    </button>
  `,
})
export class ThemeSwitcherComponent {
  private themeManager = inject(ThemeManagerService);

  isDarkMode = this.themeManager.isDarkMode;

  toggleTheme(): void {
    this.themeManager.toggleTheme();
  }
}
