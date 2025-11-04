import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-check-email',
  imports: [],
  templateUrl: './check-email.html',
  styleUrl: './check-email.css'
})
export class CheckEmail {
  email: string | null = '';
  resendTimer = 0;
  loading = false;
  authService = inject(AuthService)
  notify = inject(NotificationService);

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'];
    console.log('Got email:', this.email);
    this.startResendTimer();
  }

  startResendTimer() {
    this.resendTimer = 10; // 60 seconds
    const interval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        clearInterval(interval);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  resendVerificationEmail() {
    this.loading = true;
    if (!this.email) {
      this.notify.showError('Email not available.');
      this.loading = false;
      return;
    }
    this.authService.resendVerificationEmail(this.email || '').subscribe({
      next: (response) => {
        console.log('Resend verification email successful', response);
        this.notify.showSuccess('Verification email resent! Please check your inbox.');
        this.startResendTimer();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        console.error('Resend verification email failed', res);
        this.notify.showError(res.error.message || 'Failed to resend verification email. Please try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
