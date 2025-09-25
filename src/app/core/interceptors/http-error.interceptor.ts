import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  return next(req).pipe({
    error: (err: HttpErrorResponse) => {
      const msg =
        err.error?.message ||
        err.statusText ||
        'An unexpected error occurred.';
      notify.showError(msg);
      throw err;
    }
  } as any);
};