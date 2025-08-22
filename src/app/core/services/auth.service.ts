import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.baseUrl}/login`, credentials);
  }

  signup(data: { name?: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, data);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/verify-email`, {
      params: { token },
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}