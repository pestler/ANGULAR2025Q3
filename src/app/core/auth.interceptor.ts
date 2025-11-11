import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService).get();
  const auth = inject(AuthService);

  let modified = req;

  if (token) {
    modified = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  if (req.url.startsWith('/')) {
    modified = modified.clone({ url: `/api${req.url}` });
  }

  return next(modified).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        inject(TokenService).clear();
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
