import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// (todo check if this is needed or how to handle it properly)
export const redirectInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const contentType = error.headers.get("content-type");

      if (contentType && contentType.includes('text/html')) {
        window.location.href = error.url!;

        return EMPTY;
      }

      return throwError(() => error.error);
    })
  );
}
