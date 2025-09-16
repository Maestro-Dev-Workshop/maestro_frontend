import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { UserModel } from '../models/user.model';
import { LoginResponse } from '../models/auth-payload.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  refreshToken(): Observable<any> {
      throw new Error('Method not implemented.');
  }
  http = inject(HttpBaseService);

  signup(data: { first_name: string, last_name: string, email: string, password: string }): Observable<any> {
    return this.http.post('auth/sign-up', data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('auth/login', credentials);
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // logout(): Observable<any> {
  //   const response = this.http.post('auth/logout', { refreshToken: localStorage.getItem('refreshToken') });
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   return response
  // }
  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private storeTokens(res: LoginResponse): void{
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
  }
}
