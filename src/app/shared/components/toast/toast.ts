import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastType } from '../../../core/models/toast.model';
import { ThemeIconComponent } from '../theme-icon/theme-icon';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, ThemeIconComponent],
  templateUrl: './toast.html',
})
export class Toast {
  msg: Signal<string>;
  type: Signal<ToastType | null>;
  showToast: Signal<boolean>
  classes = computed(() => ({
    'border-tertiary text-on-tertiary-container': this.type() === 'success',
    'border-error text-on-error-container': this.type() === 'error',
    'border-primary text-primary': this.type() === 'info',
    // 'bg-yellow-500': this.type() === 'warn'
  }));
  icon = computed(() => `notification-${this.type()}-icon`)

  constructor(public notify: NotificationService) {
    this.msg = this.notify.message;
    this.type = this.notify.type;
    this.showToast = this.notify.showToast;
  }

  close() {
    this.notify.clear();
  }
}