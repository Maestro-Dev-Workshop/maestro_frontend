import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import {
  ApiResponse,
  SubjectListResponse,
  SubjectResponse,
  SubjectDetailsResponse,
  DocumentIngestResponse,
  DocumentLabelResponse,
  UpdateProgressResponse,
  FeedbackResponse,
  ExtensionSettingsPayload,
} from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private http = inject(HttpBaseService);

  getAllSubjects(): Observable<SubjectListResponse> {
    return this.http.get<SubjectListResponse>('subjects');
  }

  createSubject(): Observable<SubjectResponse> {
    return this.http.post<SubjectResponse>('subjects', {});
  }

  nameSubject(subjectId: string, name: string): Observable<SubjectResponse> {
    return this.http.put<SubjectResponse>(`subjects/${subjectId}`, { name });
  }

  getSubject(subjectId: string): Observable<SubjectResponse> {
    return this.http.get<SubjectResponse>(`subjects/${subjectId}`);
  }

  getSubjectDetails(subjectId: string): Observable<SubjectDetailsResponse> {
    return this.http.get<SubjectDetailsResponse>(`subjects/${subjectId}/full`);
  }

  getAllSubjectsDetails(): Observable<SubjectListResponse> {
    return this.http.get<SubjectListResponse>('subjects/full');
  }

  ingestDocuments(subjectId: string, files: File[]): Observable<DocumentIngestResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post<DocumentIngestResponse>(`subjects/${subjectId}/documents/ingest`, formData);
  }

  labelDocuments(subjectId: string): Observable<DocumentLabelResponse> {
    return this.http.post<DocumentLabelResponse>(`subjects/${subjectId}/documents/label`, {});
  }

  generateFullLesson(
    subjectId: string,
    topics: string[],
    user_preference: string,
    extension_settings: ExtensionSettingsPayload
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`subjects/${subjectId}/generate`, {
      topics,
      user_preference,
      extension_settings,
    });
  }

  updateSessionStatus(subjectId: string, status: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`subjects/${subjectId}/status`, { status });
  }

  updateSessionProgress(subjectId: string, progress: number): Observable<UpdateProgressResponse> {
    return this.http.put<UpdateProgressResponse>(`subjects/${subjectId}/progress`, { update_tick: progress });
  }

  deleteSubject(subjectId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`subjects/${subjectId}`);
  }

  reorderSubjectTopics(subjectId: string, topics: string[]): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`subjects/${subjectId}/topics/reorder`, { topics });
  }

  submitFeedback(subjectId: string, rating: number, comment: string): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`subjects/${subjectId}/feedback`, { rating, comment });
  }
}
