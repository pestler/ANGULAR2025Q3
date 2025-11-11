import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly key = 'auth_token';
  private tokenSignal = signal<string | null>(this.getFromStorage());

  private getFromStorage(): string | null {
    return localStorage.getItem(this.key);
  }

  set(token: string): void {
    localStorage.setItem(this.key, token);
    this.tokenSignal.set(token);
  }

  get(): string | null {
    return this.tokenSignal();
  }

  clear(): void {
    localStorage.removeItem(this.key);
    this.tokenSignal.set(null);
  }

  isAuthenticated = computed(() => !!this.tokenSignal());
}
