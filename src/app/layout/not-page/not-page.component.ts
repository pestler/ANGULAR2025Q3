import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-page.component.html',
  styleUrl: './not-page.component.scss',
})
export class NotPageComponent {}
