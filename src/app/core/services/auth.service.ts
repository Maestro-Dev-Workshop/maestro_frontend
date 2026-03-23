import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { LoginResponse } from '../models/auth-payload.model';
import { ApiResponse, RefreshTokenResponseData, SignupResponseData } from '../models/api-response.model';

export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupApiResponse extends ApiResponse {
  user: SignupResponseData;
}

export interface LoginApiResponse extends ApiResponse {
  user?: LoginResponse['user'];
  accessToken?: string;
  refreshToken?: string;
  verifyRedirect: boolean;
}

export interface RefreshTokenApiResponse extends ApiResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpBaseService);

  signup(data: SignupPayload): Observable<SignupApiResponse> {
    return this.http.post<SignupApiResponse>('auth/sign-up', data);
  }

  login(credentials: LoginPayload): Observable<LoginApiResponse> {
    return this.http.post<LoginApiResponse>('auth/login', credentials);
  }

  googleAuth(token: string): Observable<LoginApiResponse> {
    return this.http.post<LoginApiResponse>('auth/google', { token });
  }

  refreshAccessToken(): Observable<RefreshTokenApiResponse> {
    return this.http.post<RefreshTokenApiResponse>('auth/refresh-token', {});
  }

  verifyEmail(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('auth/verify-email', { token });
  }

  resendVerificationEmail(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('auth/resend-verification', { email });
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('auth/forgot-password', { email });
  }

  resetPassword(reset_token: string, new_password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('auth/reset-password', { reset_token, new_password });
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
