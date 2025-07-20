import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="shell-layout">
      <app-sidebar />
      <main class="shell-content">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {}
