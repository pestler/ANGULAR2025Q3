import { Injectable } from '@angular/core';
import { environment } from '@env';
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  resolve(path: string, prefix = '/api'): string {
    if (!path.startsWith('/')) {
      throw new Error(`API path must start with '/': received '${path}'`);
    }
    return `${this.baseUrl}${prefix}${path}`;
  }
}
