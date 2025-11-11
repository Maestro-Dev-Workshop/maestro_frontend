import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  http = inject(HttpBaseService);

  getAllSubjects(): Observable<any> {
    return this.http.get('session/list');
  }

  createSubject(): Observable<any> {
    return this.http.post('session/create', {});
  }

  nameSubject(sessionId: string, name: string): Observable<any> {
    return this.http.put(`session/${sessionId}/name`, { name });
  }

  getSubject(sessionId: string): Observable<any> {
    return this.http.get(`session/${sessionId}/get`);
  }

  ingestDocuments(sessionId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post(`session/${sessionId}/docs/ingest`, formData);
  }

  labelDocuments(sessionId: string): Observable<any> {
    return this.http.post(`session/${sessionId}/docs/label`, {});
  }

  selectTopics(sessionId: string, topicIds: string[]): Observable<any> {
    return this.http.post(`session/${sessionId}/select-topics`, { topics: topicIds });
  }

  generateLesson(sessionId: string, prefs: string): Observable<any> {
    return this.http.post(`session/${sessionId}/generate-lesson`, { lesson_preference: prefs });
  }

  generateExercise(sessionId: string, prefs: string, questionTypes: string[], numQuestions: number): Observable<any> {
    return this.http.post(`session/${sessionId}/generate-exercises`, { exercise_preference: prefs, question_types: questionTypes, no_of_questions: numQuestions });
  }

  generateExam(sessionId: string, prefs: string, questionTypes: string[], numQuestions: number, timeLimit: boolean = false): Observable<any> {
    return this.http.post(`session/${sessionId}/generate-exam`, { exam_preference: prefs, question_types: questionTypes, no_of_questions: numQuestions, use_time_limit: timeLimit });
  }

  updateSessionStatus(sessionId: string, status: string): Observable<any> {
    return this.http.put(`session/${sessionId}/update-status`, { status });
  }

  updateSessionProgress(sessionId: string, progress: number): Observable<any> {
    return this.http.put(`session/${sessionId}/update-progress`, { update_tick: progress });
  }

  deleteSubject(sessionId: string): Observable<any> {
    return this.http.delete(`session/${sessionId}/delete`);
  }
}