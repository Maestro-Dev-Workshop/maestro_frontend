import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { environment }        from '../../../environments/environment';
import { Observable }         from 'rxjs';

export interface Lesson {
  topic: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/subjects`;

  getLessons(subjectId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.base}/${subjectId}/lessons`);
  }
}