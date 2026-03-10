import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { LoginResponse } from '../models/auth-payload.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpBaseService);

  signup(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post('auth/sign-up', data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('auth/login', credentials);
  }

  googleAuth(token: string) {
    return this.http.post<any>('auth/google', { token });
  }

  refreshAccessToken(): Observable<any> {
    return this.http.post('auth/refresh-token', {});
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post('auth/verify-email', { token });
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post('auth/resend-verification', { email });
  }

  logout(): void {
    sessionStorage.removeItem('maestro-feedback-banner-dismissed');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
  }

  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  storeTokens(res: LoginResponse): void {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
  }
}
