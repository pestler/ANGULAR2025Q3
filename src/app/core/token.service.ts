import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private tokenSignal = signal<string | null>(null);

  set(token: string): void {
    this.tokenSignal.set(token);
  }

  get(): string | null {
    return this.tokenSignal();
  }

  clear(): void {
    this.tokenSignal.set(null);
  }

  isAuthenticated = computed(() => !!this.tokenSignal());
}
