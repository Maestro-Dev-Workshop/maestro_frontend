import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { environment }        from '../../../environments/environment';
import { Observable }         from 'rxjs';

export interface Exercise {
  question: string;
  options?: string[];
}

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/subjects`;

  generateExercises(
    subjectId: string,
    config: { preference: string; questionType: string; }
  ): Observable<Exercise[]> {
    return this.http.post<Exercise[]>(
      `${this.base}/${subjectId}/exercises`,
      config
    );
  }
}