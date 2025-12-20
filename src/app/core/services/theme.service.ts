import { Injectable, OnInit } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageKey = 'maestro-theme';

  init() {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
    const mode: ThemeMode = saved ?? 'system';
    this.applyTheme(mode);
  }

  setTheme(mode: ThemeMode) {
    localStorage.setItem(this.storageKey, mode);
    this.applyTheme(mode);
  }

  getTheme(): ThemeMode {
    return (localStorage.getItem(this.storageKey) as ThemeMode) ?? 'system';
  }

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  private applyTheme(mode: ThemeMode) {
    const root = document.documentElement;

    root.classList.remove('dark');

    if (mode === 'dark') {
      root.classList.add('dark');
    } 
    else if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      }
    }
  }
}
