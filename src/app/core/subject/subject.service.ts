import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { environment }        from '../../../environments/environment';
import { Observable }         from 'rxjs';

export interface Subject {
  id: string;
  name: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/subjects`;

  // 1. Fetch all user’s subjects
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.base);
  }

  // 2. Create subject and upload PDFs
  createSubject(payload: { subjectName: string; pdfs: FileList; }): Observable<Subject> {
    const form = new FormData();
    form.append('name', payload.subjectName);
    Array.from(payload.pdfs).forEach((f, i) =>
      form.append('pdfs', f, f.name)
    );
    return this.http.post<Subject>(this.base, form);
  }

  // 3. Get extracted topics for a subject
  getTopics(subjectId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/${subjectId}/topics`);
  }

  // 4. Save selected topics + learning style
  saveSelection(subjectId: string, topics: string[], style: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${subjectId}/selection`, {
      topics,
      style
    });
  }
}