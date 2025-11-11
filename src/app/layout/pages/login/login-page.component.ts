import { Component, inject } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from 'app/core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  form = new FormGroup({
    userName: new FormControl('Morales', Validators.required),
    password: new FormControl('id', Validators.required),
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const { userName, password } = this.form.value;

    this.auth.login(userName!, password!).subscribe({
      next: () => this.router.navigate(['/dashboard/overview']),
      error: (err) => {
        const msg =
          err.status === 401
            ? 'Invalid login or password.'
            : 'Unknown error occurred.';
        this.snack.open(msg, 'Close', { duration: 3000 });
      },
    });
  }
}
