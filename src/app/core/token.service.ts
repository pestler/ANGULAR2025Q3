import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  set(token: string): void {
    localStorage.setItem('access_token', token);
  }

  get(): string | null {
    return localStorage.getItem('access_token');
  }

  clear(): void {
    localStorage.removeItem('access_token');
  }
}
