import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideZoneChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  ...appConfig,
  providers: [provideZoneChangeDetection()],
}).catch((err) => console.error(err));
