import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:3004';

  resolve(path: string): string {
    if (!path.startsWith('/')) {
      throw new Error(`API path must start with '/': received '${path}'`);
    }
    return `${this.baseUrl}/api${path}`;
  }
}
