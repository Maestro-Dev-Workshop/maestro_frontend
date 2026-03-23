import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { SubscriptionService } from '../services/subscription.service';

export const subscriptionGuard: CanActivateFn = () => {
  const subscriptionService = inject(SubscriptionService);
  const router = inject(Router);

  return subscriptionService.getSubscription().pipe(
    map((response) => {
      const subscription = response.subscription;
      if (subscription?.status === 'active') {
        return true;
      }
      router.navigate(['/dashboard/subscription']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/dashboard/subscription']);
      return of(false);
    })
  );
};