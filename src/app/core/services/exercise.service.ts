import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnswerModel } from '../models/answer.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private apiUrl = `${environment.apiUrl}/exercises`;

  constructor(private http: HttpClient) {}

  getPastAnswers(id: string): Observable<AnswerModel[]> {
    return this.http.get<AnswerModel[]>(`${this.apiUrl}/${id}/answers`);
  }

  submitAnswers(id: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/submit`, payload);
  }
}