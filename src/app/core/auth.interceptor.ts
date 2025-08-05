import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService).get();
  const auth = inject(AuthService);
  const router = inject(Router);

  const url = req.url.startsWith('/') ? `/api${req.url}` : req.url;

  const modified = token
    ? req.clone({ url, setHeaders: { Authorization: `Bearer ${token}` } })
    : req.clone({ url });

  return next(modified).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        inject(TokenService).clear();
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
