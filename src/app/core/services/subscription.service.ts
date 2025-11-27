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

  getSinglePlan(planCode: string): Observable<any> {
    return this.http.get(`subscription/plans/${planCode}`);
  }

  subscribe(planCode: string): Observable<any> {
    return this.http.post('subscription/initialize-transaction', { planCode });
  }

  verifyTransaction(reference: string): Observable<any> {
    return this.http.post('subscription/verify-transaction', { reference });
  }

  getSubscription(): Observable<any> {
    return this.http.get('subscription/get');
  }

  cancel(): Observable<any> {
    return this.http.post('subscription/cancel', {});
  }

  manageSubscription() : Observable<any> {
    return this.http.get('subscription/generate-manage-link');
  }
}