import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectModel } from '../models/subjects.model';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private baseUrl = '/api/subjects';

  constructor(private http: HttpClient) {}

  createSubject(data: Partial<SubjectModel>): Observable<SubjectModel> {
    return this.http.post<SubjectModel>(this.baseUrl, data);
  }

  listSubjects(): Observable<SubjectModel[]> {
    return this.http.get<SubjectModel[]>(this.baseUrl);
  }

  updateSubject(id: string, data: Partial<SubjectModel>): Observable<SubjectModel> {
    return this.http.put<SubjectModel>(`${this.baseUrl}/${id}`, data);
  }

  deleteSubject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}