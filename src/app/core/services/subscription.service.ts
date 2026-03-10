import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { Plan, SubscriptionStatus } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  http = inject(HttpBaseService);

  getPlans(): Observable<any> {
    return this.http.get('subscriptions/plans');
  }

  getSinglePlan(planCode: string): Observable<any> {
    return this.http.get(`subscriptions/plans/${planCode}`);
  }

  subscribe(planCode: string): Observable<any> {
    return this.http.post('subscriptions', { planCode });
  }

  verifyTransaction(reference: string): Observable<any> {
    return this.http.post('subscriptions/verify', { reference });
  }

  getSubscription(): Observable<any> {
    return this.http.get('subscriptions');
  }

  cancel(): Observable<any> {
    return this.http.delete('subscriptions');
  }

  manageSubscription() : Observable<any> {
    return this.http.get('subscriptions/manage-link');
  }
}
