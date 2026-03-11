import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import {
  ApiResponse,
  PlansResponse,
  SinglePlanResponse,
  SubscriptionResponse,
  TransactionInitResponse,
  TransactionVerifyResponse,
  ManageLinkResponse,
} from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private http = inject(HttpBaseService);

  getPlans(): Observable<PlansResponse> {
    return this.http.get<PlansResponse>('subscriptions/plans');
  }

  getSinglePlan(planCode: string): Observable<SinglePlanResponse> {
    return this.http.get<SinglePlanResponse>(`subscriptions/plans/${planCode}`);
  }

  subscribe(planCode: string): Observable<TransactionInitResponse> {
    return this.http.post<TransactionInitResponse>('subscriptions', { planCode });
  }

  verifyTransaction(reference: string): Observable<TransactionVerifyResponse> {
    return this.http.post<TransactionVerifyResponse>('subscriptions/verify', { reference });
  }

  getSubscription(): Observable<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>('subscriptions');
  }

  cancel(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>('subscriptions');
  }

  manageSubscription(): Observable<ManageLinkResponse> {
    return this.http.get<ManageLinkResponse>('subscriptions/manage-link');
  }
}
