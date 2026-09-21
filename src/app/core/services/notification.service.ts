import { Injectable, signal } from '@angular/core';

export type NoticeType = 'success' | 'error' | 'info' | 'warn';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  message = signal<string>('');
  type = signal<NoticeType | null>(null);
  showToast = signal<boolean>(false)
  private _timer?: number;

  show(type: NoticeType, msg: string, ms = 4000) {
    this.type.set(type);
    this.message.set(msg);
    this.showToast.set(true)
    clearTimeout(this._timer);
    this._timer = window.setTimeout(() => this.clear(), ms + 600) as any;
    window.setTimeout(() => this.showToast.set(false), ms)
  }

  showError(msg: string, ms = 5000) { this.show('error', msg, ms); }
  showSuccess(msg: string, ms = 4000) { this.show('success', msg, ms); }
  showInfo(msg: string, ms = 4000) { this.show('info', msg, ms); }
  showWarning(msg: string, ms = 4000) { this.show('warn', msg, ms); }
  clear() { 
    this.showToast.set(false); 
    window.setTimeout(() => this.message.set(''), 300); 
    window.setTimeout(() => this.type.set(null), 300); 
  }
}