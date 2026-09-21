import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { CreditBalanceResponse, CreditCostSettingsResponse, CreditHistoryResponse, CreditPacksResponse, TransactionInitResponse } from '../models';

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

  getPacks(): Observable<CreditPacksResponse> {
    return this.http.get<CreditPacksResponse>('credit/packs')
  }

  purchasePack(packId: string, referralCode: string | null): Observable<TransactionInitResponse> {
    return this.http.post<TransactionInitResponse>('credit/purchase', { packId, referralCode });
  }

  verifyTransaction(reference: string): Observable<any> {
    return this.http.post<any>('credit/verify', { reference });
  }
}
