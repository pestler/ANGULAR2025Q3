import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { apiRoutes } from '../shared/api/api-routes';

export interface Profile {
  fullName: string;
  initials: string;
}

export class AuthService {
  private http = inject(HttpClient);
  private token = inject(TokenService);
  private router = inject(Router);

  private state = new BehaviorSubject<Profile | null>(null);
  readonly profile$ = this.state.asObservable();

  isAuthenticated(): boolean {
    return this.state.value !== null;
  }

  init(): void {
    const token = this.token.get();
    if (!token) return;

    this.http
      .get<Profile>(apiRoutes.auth.profile)
      .pipe(
        catchError(() => {
          this.token.clear();
          this.router.navigate(['/login']);
          return of(null);
        }),
      )
      .subscribe((profile) => {
        if (profile) this.state.next(profile);
      });
  }

  login(userName: string, password: string): Observable<Profile> {
    return this.http
      .post<{ token: string }>(apiRoutes.auth.login, { userName, password })
      .pipe(
        tap((res) => console.log('Token:', res.token)),
        switchMap((res) => {
          this.token.set(res.token);
          return this.http.get<Profile>(apiRoutes.auth.profile);
        }),
        tap((profile) => {
          console.log('Profile:', profile);
          this.state.next(profile);
        }),
      );
  }

  logout(): void {
    this.token.clear();
    this.state.next(null);
    this.router.navigate(['/login']);
  }
}
