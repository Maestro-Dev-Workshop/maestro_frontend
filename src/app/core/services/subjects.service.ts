import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  http = inject(HttpBaseService);

  getAllSubjects(): Observable<any> {
    return this.http.get('subjects');
  }

  createSubject(): Observable<any> {
    return this.http.post('subjects', {});
  }

  nameSubject(subjectId: string, name: string): Observable<any> {
    return this.http.put(`subjects/${subjectId}`, { name });
  }

  getSubject(subjectId: string): Observable<any> {
    return this.http.get(`subjects/${subjectId}`);
  }

  getSubjectDetails(subjectId: string): Observable<any> {
    return this.http.get(`subjects/${subjectId}/full`);
  }

  getAllSubjectsDetails(): Observable<any> {
    return this.http.get('subjects/full');
  }

  ingestDocuments(subjectId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post(`subjects/${subjectId}/documents/ingest`, formData);
  }

  labelDocuments(subjectId: string): Observable<any> {
    return this.http.post(`subjects/${subjectId}/documents/label`, {});
  }

  generateFullLesson(subjectId: string, topics: string[], user_preference: string, extension_settings: any): Observable<any> {
    return this.http.post(`subjects/${subjectId}/generate`, { topics, user_preference, extension_settings });
  }

  updateSessionStatus(subjectId: string, status: string): Observable<any> {
    return this.http.put(`subjects/${subjectId}/status`, { status });
  }

  updateSessionProgress(subjectId: string, progress: number): Observable<any> {
    return this.http.put(`subjects/${subjectId}/progress`, { update_tick: progress });
  }

  deleteSubject(subjectId: string): Observable<any> {
    return this.http.delete(`subjects/${subjectId}`);
  }

  reorderSubjectTopics(subjectId: string, topics: string[]): Observable<any> {
    return this.http.put(`subjects/${subjectId}/topics/reorder`, { topics })
  }

  submitFeedback(subjectId: string, rating: number, comment: string): Observable<any> {
    return this.http.post(`subjects/${subjectId}/feedback`, {
      session_id: subjectId,
      rating,
      comment });
  }




  // ------------------------------------------------------------------
  // Deprecated methods for lesson/exercise/exam generation flow
  // ------------------------------------------------------------------

  selectTopics(subjectId: string, topicIds: string[]): Observable<any> {
    return this.http.post(`subjects/${subjectId}/select-topics`, { topics: topicIds });
  }

  generateLesson(subjectId: string, prefs: string): Observable<any> {
    return this.http.post(`subjects/${subjectId}/generate-lesson`, { lesson_preference: prefs });
  }

  generateExercise(subjectId: string, prefs: string, questionTypes: string[], numQuestions: number): Observable<any> {
    return this.http.post(`subjects/${subjectId}/generate-exercises`, { exercise_preference: prefs, question_types: questionTypes, no_of_questions: numQuestions });
  }

  generateExam(subjectId: string, prefs: string, questionTypes: string[], numQuestions: number, timeLimit: boolean = false): Observable<any> {
    return this.http.post(`subjects/${subjectId}/generate-exam`, { exam_preference: prefs, question_types: questionTypes, no_of_questions: numQuestions, use_time_limit: timeLimit });
  }
}
