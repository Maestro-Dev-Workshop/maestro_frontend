import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageKey = 'maestro-theme';

  // 🔹 Reactive theme state
  readonly theme = signal<ThemeMode>('system');

  init() {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
    const mode: ThemeMode = saved ?? 'system';

    this.theme.set(mode);
    this.applyTheme(mode);
  }

  setTheme(mode: ThemeMode) {
    localStorage.setItem(this.storageKey, mode);
    this.theme.set(mode);          // 🔹 notify listeners
    this.applyTheme(mode);
  }

  getTheme(): ThemeMode {
    return this.theme();
  }

  toggleTheme() {
    const current = this.theme();
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
