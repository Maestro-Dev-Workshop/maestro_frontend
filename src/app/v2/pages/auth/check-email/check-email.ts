import { ChangeDetectorRef, Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { environment } from '../../../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { AuthBackground } from '../../../shared/components/auth-background/auth-background';
import { ThemeService } from '../../../../core/services/theme.service';
import { ShinyBtnComponent } from '../../../shared/components/shiny-btn/shiny-btn';

@Component({
  selector: 'app-check-email',
  imports: [AuthBackground, ShinyBtnComponent],
  templateUrl: './check-email.html',
  styleUrl: './check-email.css'
})
export class CheckEmail implements OnInit {

  private readonly themeService = inject(ThemeService);
  logoSrc = computed(() => `images/${this.themeService.effectiveTheme()}/maestro-logo.svg`);

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
        this.notify.showError(res.error.message || 'Failed to resend verification email. Please try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
