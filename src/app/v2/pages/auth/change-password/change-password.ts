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
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {

  private readonly themeService = inject(ThemeService);
 
  password = '';
  passwordType: 'password' | 'text' = 'password';
  confirmPassword = '';
  confirmPasswordType: 'password' | 'text' = 'password';
  loading = false;

  authService = inject(AuthService);
  notify = inject(NotificationService); // <-- Inject notification service
  logoSrc = computed(() => `images/${this.themeService.effectiveTheme()}/maestro-logo.svg`);
  
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
    .resetPassword(this.password, this.confirmPassword)
    .subscribe({
      next: () => {
        this.notify.showSuccess('Password changed successfully. Redirecting to login...');
        this.router.navigateByUrl('/v2/login');
      },
      error: (res: any) => {
        this.loading = false;
        this.notify.showError(
          res.error?.message || 'Password change failed. Please try again.',
        );
        this.cdr.detectChanges();
      },
    });
  }

}