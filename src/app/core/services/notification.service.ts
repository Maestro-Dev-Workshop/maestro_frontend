import { Injectable, signal } from '@angular/core';

export type NoticeType = 'success' | 'error' | 'info' | 'warn';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  message = signal<string | null>(null);
  type = signal<NoticeType | null>(null);
  private _timer?: number;

  show(type: NoticeType, msg: string, ms = 4000) {
    this.type.set(type);
    this.message.set(msg);
    clearTimeout(this._timer);
    this._timer = window.setTimeout(() => this.clear(), ms) as any;
  }

  showError(msg: string, ms = 5000) { this.show('error', msg, ms); }
  showSuccess(msg: string, ms = 4000) { this.show('success', msg, ms); }
  showInfo(msg: string, ms = 4000) { this.show('info', msg, ms); }
  showWarning(msg: string, ms = 4000) { this.show('warn', msg, ms); }
  clear() { this.message.set(null); this.type.set(null); }
}