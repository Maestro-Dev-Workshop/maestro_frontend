import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from './cookie.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private cookies = inject(CookieService);

  signup(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.http.post('/api/auth/signup', data);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>('/api/auth/login', credentials)
      .pipe(tap(res => this.cookies.set('auth_token', res.token)));
  }

  logout() {
    this.cookies.delete('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.cookies.get('auth_token');
  }
}