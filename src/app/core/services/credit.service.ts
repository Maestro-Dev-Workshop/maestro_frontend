import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { CreditBalanceResponse, CreditCostSettingsResponse, CreditHistoryResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private http = inject(HttpBaseService);

  getCostSettings(): Observable<CreditCostSettingsResponse> {
    return this.http.get<CreditCostSettingsResponse>('credit/settings')
  }

  getBalance(): Observable<CreditBalanceResponse> {
    return this.http.get<CreditBalanceResponse>('credit/balance')
  }

  getHistory(): Observable<CreditHistoryResponse> {
    return this.http.get<CreditHistoryResponse>('credit/history')
  }
}
