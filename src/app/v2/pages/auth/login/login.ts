import { ChangeDetectorRef, Component, inject, ViewChild, computed } from '@angular/core';
import { AuthBackground } from '../../../shared/components/auth-background/auth-background';
import { ShinyBtnComponent } from '../../../shared/components/shiny-btn/shiny-btn';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { environment } from '../../../../../environments/environment';

declare var google: any;


@Component({
  selector: 'app-login',
  imports: [AuthBackground, ShinyBtnComponent,  FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly themeService = inject(ThemeService);

  email = '';
  password = '';
  passwordVisible = 'password';
  loading = false;
  authService = inject(AuthService);
  notify = inject(NotificationService); // <-- Inject notification service
  logoSrc = computed(() => `images/${this.themeService.effectiveTheme()}/maestro-logo.svg`);
  
  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  togglePasswordVisibility() {
    if (this.passwordVisible === 'password') {
      this.passwordVisible = 'text';
    } else {
      this.passwordVisible = 'password';
    }
  }

  onSubmit() {
    this.loading = true;
    if (this.emailCtrl.invalid || this.passwordCtrl.invalid) {
      this.notify.showError('Valid email and password required');
      this.loading = false;
    } else {
      this.authService
        .login({ email: this.email.toLowerCase(), password: this.password })
        .subscribe({
          next: (response) => {
            if (response.verifyRedirect) {
              this.notify.showInfo(
                'Please verify your email to continue. We have sent you a new verification link.',
              );
              this.loading = false;
              this.router.navigateByUrl('/check-email', {
                state: { email: this.email.toLowerCase() },
              });
            } else {
              localStorage.setItem('accessToken', response.accessToken || '');
              localStorage.setItem('refreshToken', response.refreshToken || '');
              const user = response.user;
              localStorage.setItem('userEmail', user?.email || '');
              sessionStorage.setItem('maestro_from_auth', 'true');
              this.loading = false;
              this.router.navigateByUrl('/dashboard');
            }
          },
          error: (error) => {
            this.notify.showError(
              error?.error?.message || 'An error occurred during login. Please try again.',
            );
            this.loading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  ngAfterViewInit() {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: this.handleGoogleResponse.bind(this),
      });
  
      google.accounts.id.renderButton(
        document.getElementById('google-login-btn'),
        {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          width: 320,
        },
      );
    }
  
    handleGoogleResponse(response: any) {
      const idToken = response.credential;
      this.loading = true;
  
      this.authService.googleAuth(idToken).subscribe({
        next: (res) => {
          localStorage.setItem('accessToken', res.accessToken || '');
          localStorage.setItem('refreshToken', res.refreshToken || '');
          localStorage.setItem('userEmail', res.user?.email || '');
          sessionStorage.setItem('maestro_from_auth', 'true');
  
          this.loading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          this.loading = false;
          this.notify.showError(
            err.error?.message || 'Google login failed. Please try again.',
          );
          this.cdr.detectChanges();
        },
      });
    }
}



