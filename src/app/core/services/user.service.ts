import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = '/api/users';
  private currentUser$ = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: HttpClient) {}

  fetchProfile(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/me`);
  }

  updateProfile(data: Partial<UserModel>): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/me`, data);
  }

  setCurrentUser(user: UserModel): void {
    this.currentUser$.next(user);
  }

  getCurrentUser(): Observable<UserModel | null> {
    return this.currentUser$.asObservable();
  }
}