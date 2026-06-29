import {
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from '../../../shared/directives/password-validator';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { environment } from '../../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-signup',
  imports: [FormsModule, PasswordValidator],
  templateUrl: './signup.html',
})
export class Signup implements AfterViewInit {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  passwordVisible = 'password';
  loading = false;

  private gaMeasurementId = environment.gaMeasurementId;

  authService = inject(AuthService);
  notify = inject(NotificationService);

  @ViewChild('firstnameCtrl') firstnameCtrl!: NgModel;
  @ViewChild('lastnameCtrl') lastnameCtrl!: NgModel;
  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  // 👁️ Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible =
      this.passwordVisible === 'password' ? 'text' : 'password';
  }

/**
   * 🛠️ Fetches tracking IDs from the global window context
   * This specific syntax bypasses the TS2304 "Cannot find name 'gtag'" error
   */
  private getGa4Ids(callback: (clientId: string | null, sessionId: string | null) => void) {
    if (!this.gaMeasurementId) {
      callback(null, null);
      return;
    }

    // Cast the global scope to 'any' to bypass strict compile-time checks
    const globalWindow = window as any;

    if (globalWindow && typeof globalWindow.gtag === 'function') {
      try {
        globalWindow.gtag('get', this.gaMeasurementId, 'client_id', (clientId: string) => {
          globalWindow.gtag('get', this.gaMeasurementId, 'session_id', (sessionId: string) => {
            callback(clientId, sessionId);
          });
        });
        return;
      } catch (e) {
        console.error('Failed to fetch GA4 IDs:', e);
      }
    }
    callback(null, null);
  }

  // 📨 Normal email/password signup
  onSubmit() {
    this.loading = true;
    const errors: string[] = [];

    if (this.firstnameCtrl.invalid) errors.push('First name is required.');
    if (this.lastnameCtrl.invalid) errors.push('Last name is required.');
    if (this.emailCtrl.invalid) errors.push('A valid email is required.');
    if (this.passwordCtrl.invalid)
      errors.push(
        'Password must be at least 8 characters long and include letters & numbers.',
      );

    if (errors.length > 0) {
      this.notify.showError(errors.join('\n'));
      this.loading = false;
      return;
    }

    // Capture IDs before calling the registration API
    this.getGa4Ids((clientId, sessionId) => {
      this.authService
        .signup({
          first_name: this.firstname,
          last_name: this.lastname,
          email: this.email.toLowerCase(),
          password: this.password,
          ga_client_id: clientId,   // Pass to Express backend
          ga_session_id: sessionId, // Pass to Express backend
        })
        .subscribe({
          next: () => {
            if (environment.type?.toLowerCase() == 'prod') {
              this.notify.showSuccess(
                'Verification email sent. Please check your inbox.',
              );
              this.router.navigateByUrl('/check-email', {
                state: { email: this.email.toLowerCase() },
              });
            } else {
              this.notify.showSuccess(
                'Signup successful. Redirecting to login...',
              );
              this.router.navigateByUrl('/login');
            }
          },
          error: (res: any) => {
            this.loading = false;
            this.notify.showError(
              res.error?.message || 'Signup failed. Please try again.',
            );
            this.cdr.detectChanges();
          },
        });
      });
    }

  // 🔐 Google Auth Init
  ngAfterViewInit(): void {
    const btn = document.getElementById('google-signup-btn');
    if (!btn) return;

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleResponse(response),
    });

    google.accounts.id.renderButton(btn, {
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'continue_with',
    });
  }

  // 🔐 Google Auth Handler
  handleGoogleResponse(response: any) {
    this.loading = true;

    this.getGa4Ids((clientId, sessionId) => {
    this.authService
    .googleAuth({
      credential: response.credential,
      ga_client_id: clientId,   // Pass to Express backend
      ga_session_id: sessionId, // Pass to Express backend
    })
    .subscribe({
      next: (res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('userEmail', res.user.email);
        sessionStorage.setItem('maestro_from_auth', 'true');

        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err: any) => {
        this.loading = false;
        this.notify.showError(err.error?.message || 'Google signup failed.');
        this.cdr.detectChanges();
      },
    });
    });
  }
}
