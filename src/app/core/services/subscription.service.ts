import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { Plan, SubscriptionStatus } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  http = inject(HttpBaseService);

  getPlans(): Observable<any[]> {
    return this.http.get('subscription/plans');
  }

  subscribe(planId: string): Observable<any> {
    return this.http.post('subscription/subscribe', { planId });
  }

  getStatus(): Observable<any> {
    return this.http.get('subscription/status');
  }

  cancel() : Observable<any> {
    return this.http.post('subscription/cancel', {});
  }
}