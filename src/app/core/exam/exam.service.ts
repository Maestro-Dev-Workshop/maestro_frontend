import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { environment }        from '../../../environments/environment';
import { Observable }         from 'rxjs';

export interface ExamQuestion {
  id: string;
  question: string;
  options?: string[];
}

@Injectable({ providedIn: 'root' })
export class ExamService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/subjects`;

  generateExam(
    subjectId: string,
    config: { preference: string; questionType: string; timeLimit?: number; }
  ): Observable<ExamQuestion[]> {
    return this.http.post<ExamQuestion[]>(
      `${this.base}/${subjectId}/exams`,
      config
    );
  }
}