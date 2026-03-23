import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastType } from '../../../core/models/toast.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
})
export class Toast {
  msg: Signal<string>;
  type: Signal<ToastType | null>;
  classes = computed(() => ({
    'z-50 flex items-center space-x-3 p-4 rounded shadow-lg text-white':
      true,
    'bg-green-500': this.type() === 'success',
    'bg-red-500': this.type() === 'error',
    'bg-blue-500': this.type() === 'info',
    'bg-yellow-500': this.type() === 'warn'
  }));

  constructor(public notify: NotificationService) {
    this.msg = this.notify.message;
    this.type = this.notify.type;
  }

  close() {
    this.notify.clear();
  }
}