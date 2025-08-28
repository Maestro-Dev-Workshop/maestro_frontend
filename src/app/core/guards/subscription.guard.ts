import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';
import { map } from 'rxjs';
import { SubscriptionService } from '../services/subscription.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionGuard implements CanActivate {
  constructor(
    private subSvc: SubscriptionService,
    private router: Router
  ) {}

  canActivate() {
    return this.subSvc.getStatus().pipe(
      map(st => {
        if (!st.isActive) {
          this.router.navigate(['/dashboard/subscription']);
          return false;
        }
        return true;
      })
    );
  }
}