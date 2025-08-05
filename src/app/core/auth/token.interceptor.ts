import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { CookieService } from './cookie.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private cookies: CookieService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.cookies.get('auth_token');
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(req);
  }
}