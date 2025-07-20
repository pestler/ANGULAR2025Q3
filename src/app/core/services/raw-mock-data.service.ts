import { Injectable } from '@angular/core';
import { RawTab } from '../types/raw-mock.types';

@Injectable({ providedIn: 'root' })
export class RawMockDataService {
  async getTab(tabId: string): Promise<RawTab | undefined> {
    const response = await fetch('assets/mock-data.json');
    if (!response.ok) {
      console.error('Failed to load mock-data.json');
      return undefined;
    }

    const data: { tabs: RawTab[] } = await response.json();
    return data.tabs.find((tab) => tab.id === tabId);
  }
}
