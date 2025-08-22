import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private baseUrl = '/api/subscriptions';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/plans`);
  }

  subscribe(planId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/subscribe`, { planId });
  }

  getStatus(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/status`);
  }
}