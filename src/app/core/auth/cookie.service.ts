import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieService {
  set(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value};expires=${expires};path=/;Secure;SameSite=Strict`;
  }

  get(name: string): string | null {
    return document.cookie
      .split('; ')
      .map(row => row.split('='))
      .find(([key]) => key === name)?.[1] || null;
  }

  delete(name: string) {
    this.set(name, '', -1);
  }
}