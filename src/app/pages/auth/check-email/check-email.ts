import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { environment } from '../../../../environments/environment';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-check-email',
  imports: [],
  templateUrl: './check-email.html',
  styleUrl: './check-email.css'
})
export class CheckEmail implements OnInit {
  email: string | null = '';
  resendTimer = 0;
  loading = false;
  authService = inject(AuthService);
  notify = inject(NotificationService);
  socket!: Socket;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'];
    this.startResendTimer();
  }

  ngOnInit(): void {
    this.socket = io(environment.apiUrl.slice(0, -4), {
      withCredentials: true
    });

    if (this.email) {
      this.socket.emit("join-email-room", this.email);
    }
  
    this.socket.on("email-verified", () => {
      this.notify.showSuccess("Email verified! Redirecting to login.");
      this.router.navigateByUrl('/login');
    });
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
    this.loading = true;
    if (!this.email) {
      this.notify.showError('Email not available.');
      this.loading = false;
      return;
    }
    this.authService.resendVerificationEmail(this.email || '').subscribe({
      next: (response) => {
        this.notify.showSuccess('Verification email resent! Please check your inbox.');
        this.startResendTimer();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.displayMessage || 'Failed to resend verification email. Please try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
