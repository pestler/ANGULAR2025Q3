import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from 'app/core/auth.service';
import { TokenService } from 'app/core/token.service';
import { provideRouter } from '@angular/router';
import { routes } from 'app/app.routes';
import { authInterceptor } from 'app/core/auth.interceptor';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideHttpClient(withInterceptors([authInterceptor])),
    TokenService,
    AuthService,
    provideRouter(routes),
  ],
}).catch(console.error);
