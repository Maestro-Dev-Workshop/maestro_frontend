import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service'; // <-- Add this import

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  passwordVisible = "password";
  loading = false;
  authService = inject(AuthService);
  notify = inject(NotificationService); // <-- Inject notification service

  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  togglePasswordVisibility() {
    if (this.passwordVisible === "password") {
      this.passwordVisible = "text"
    } else {
      this.passwordVisible = "password"
    }
  }

  onSubmit() {
    this.loading = true;
    if (this.emailCtrl.invalid || this.passwordCtrl.invalid) {
      this.notify.showError("Valid email and password required");
      this.loading = false;
    } else {
      this.authService.login({ email: this.email.toLowerCase(), password: this.password }).subscribe({
        next: (response) => {
          if (response.verifyRedirect) {
            this.notify.showInfo('Please verify your email to continue. We have sent you a new verification link.');
            this.loading = false;
            this.router.navigateByUrl('/check-email', { state: { email: this.email.toLowerCase() } });
          } else {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            const user = response.user;
            localStorage.setItem('userEmail', user.email);
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          }
        },
        error: (res) => {
          this.notify.showError(res.error.message || 'Login failed. Please try again.');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
