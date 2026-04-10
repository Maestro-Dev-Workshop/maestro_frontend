import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

export interface BetaRegistrationPayload {
  field_of_study: string;
  university: string;
  level_of_study: string;
  study_tools: string;
  hours_per_week: number;
  confidence_level: number;
  challenges: string;
}

@Injectable({
  providedIn: 'root',
})
export class BetaRegistrationService {
  private http = inject(HttpBaseService);

  register(payload: BetaRegistrationPayload): Observable<any> {
    return this.http.post('/beta/register', payload);
  }
}
