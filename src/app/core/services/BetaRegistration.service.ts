import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

export interface BetaRegistrationPayload {
  field_of_study: string;
  institution: string;
  education_level: string;
  study_tools: string;
  weekly_study_hours: number;
  confidence_level: number;
  hopes_for_maestro: string;
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
