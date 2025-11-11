import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-card-layout',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './select-card-layout.component.html',
  styleUrls: ['./select-card-layout.component.scss'],
})
export class SelectCardLayoutComponent {}
