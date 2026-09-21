import { ChangeDetectorRef, Component, inject, ViewChild, computed } from '@angular/core';
import { AuthBackground } from '../../../shared/components/auth-background/auth-background';
import { ShinyBtnComponent } from '../../../shared/components/shiny-btn/shiny-btn';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { environment } from '../../../../../environments/environment';
import { PasswordValidator } from '../../../shared/directives/password-validator';
import { MatchValidatorDirective } from '../../../shared/directives/match-validator.directive';

declare var google: any;


@Component({
  selector: 'app-signup',
  imports: [AuthBackground, ShinyBtnComponent,  FormsModule, PasswordValidator, MatchValidatorDirective],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  private readonly themeService = inject(ThemeService);
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  passwordType: 'password' | 'text' = 'password';
  confirmPassword = '';
  confirmPasswordType: 'password' | 'text' = 'password';
  loading = false;

  authService = inject(AuthService);
  notify = inject(NotificationService); // <-- Inject notification service
  logoSrc = computed(() => `images/${this.themeService.effectiveTheme()}/maestro-logo.svg`);
  
  @ViewChild('firstNameCtrl') firstNameCtrl!: NgModel;
  @ViewChild('lastNameCtrl') lastNameCtrl!: NgModel
  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;
  @ViewChild('confirmPasswordCtrl') confirmPasswordCtrl!: NgModel;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  togglePasswordVisibility(targetField: 'passwordType' | 'confirmPasswordType') {
    if (this[targetField] === 'password') {
      this[targetField] = 'text';
    } else {
      this[targetField] = 'password';
    }
  }

  
  onSubmit() {
    this.loading = true;
    const errors: string[] = [];

    if (this.firstNameCtrl.invalid) errors.push('First name is required.');
    if (this.lastNameCtrl.invalid) errors.push('Last name is required.');
    if (this.emailCtrl.invalid) errors.push('A valid email is required.');
    if (this.passwordCtrl.invalid)
      errors.push(
        'Password must be at least 8 characters long and include letters & numbers.',
      );

    if (this.confirmPasswordCtrl.invalid || this.password !== this.confirmPassword) {
      errors.push('Passwords do not match.');
    }

    if (errors.length > 0) {
      this.notify.showError(errors.join('\n'));
      this.loading = false;
      return;
    }

    this.authService
      .signup({
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email.toLowerCase(),
        password: this.password,
      })
      .subscribe({
        next: () => {
          if (environment.type?.toLowerCase() == 'prod') {
            this.notify.showSuccess(
              'Verification email sent. Please check your inbox.',
            );
            this.router.navigateByUrl('/v2/check-email', {
              state: { email: this.email.toLowerCase() },
            });
          } else {
            this.notify.showSuccess(
              'Signup successful. Redirecting to login...',
            );
            this.router.navigateByUrl('/v2/login');
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
          this.router.navigateByUrl('/v2/lessons');
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