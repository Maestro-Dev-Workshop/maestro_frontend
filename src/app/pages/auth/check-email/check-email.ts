import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-check-email',
  imports: [],
  templateUrl: './check-email.html',
  styleUrl: './check-email.css'
})
export class CheckEmail {
  email: string | null = 'blaze@gmail.com';
  resendTimer = 0;
  authService = inject(AuthService)

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'];
    console.log('Got email:', this.email);
    this.startResendTimer();
  }

  startResendTimer() {
    this.resendTimer = 60; // 60 seconds
    const interval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        clearInterval(interval);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  resendVerificationEmail() {
    if (!this.email) {
      alert('Email not available.');
      return;
    }
    this.authService.resendVerificationEmail(this.email).subscribe({
      next: (response) => {
        console.log('Resend verification email successful', response);
        alert('Verification email resent! Please check your inbox.');
        this.startResendTimer();
      },
      error: (error) => {
        console.error('Resend verification email failed', error);
        alert('Failed to resend verification email, Please try again.');
      }
    });
  }
}
