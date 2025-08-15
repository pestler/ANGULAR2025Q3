import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import {
  dashboardReducer,
  featureKey,
} from './store/dashboard/dashboard.reducer';
import { provideEffects } from '@ngrx/effects';
import { DashboardEffects } from './store/dashboard/dashboard.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true,
    }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideStore({
      [featureKey]: dashboardReducer,
    }),

    provideEffects([DashboardEffects]),
  ],
};
