import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private http = inject(HttpBaseService);

  getCostSettings(): Observable<any> {
    return this.http.get<any>('credit/settings')
  }

  getBalance(): Observable<any> {
    return this.http.get<any>('credit/balance')
  }

  getHistory(): Observable<any> {
    return this.http.get<any>('credit/history')
  }
}
