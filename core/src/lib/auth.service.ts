import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { Profile } from './models/profile.model';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface LoginPayload {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private api = inject(ApiService);
  private router = inject(Router);

  profile = signal<Profile | null>(null);
  isAuthenticated = this.tokenService.isAuthenticated;

  init(): void {
    const token = this.tokenService.get();
    if (!token) return;

    this.http.get<Profile>(this.api.resolve('/user/profile')).subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => this.logout(),
    });
  }

  login(userName: string, password: string): Observable<Profile> {
    const payload: LoginPayload = { userName, password };

    return this.http
      .post<LoginResponse>(this.api.resolve('/user/login'), payload)
      .pipe(
        tap((res) => this.tokenService.set(res.token)),
        switchMap(() =>
          this.http.get<Profile>(this.api.resolve('/user/profile')),
        ),
        tap((profile) => this.profile.set(profile)),
      );
  }

  logout(): void {
    this.tokenService.clear();
    this.profile.set(null);
    this.router.navigate(['/login']);
  }
}
