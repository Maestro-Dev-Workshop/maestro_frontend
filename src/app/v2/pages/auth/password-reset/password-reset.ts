import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthBackground } from '../../../shared/components/auth-background/auth-background';  
import { ShinyBtnComponent } from '../../../shared/components/shiny-btn/shiny-btn';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-password-reset',
  imports: [FormsModule, AuthBackground, ShinyBtnComponent],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.css',
})
export class PasswordReset {
  private readonly themeService = inject(ThemeService);
  
  email = '';
  loading = false;

  authService = inject(AuthService);
  notify = inject(NotificationService);
  logoSrc = computed(
    () => `images/${this.themeService.effectiveTheme()}/maestro-logo.svg`
  );

  onSubmit() {
    const errors: string[] = [];

    if (!this.email || !this.email.includes('@')) {
      errors.push('Please enter a valid email address.');
    }

    if (errors.length > 0) {
      this.notify.showError(errors.join('\n'));
      this.loading = false;
      return;
    }

    this.loading = true;
    this.authService
    .forgotPassword(this.email)
    .subscribe({
      next: () => {
        this.notify.showSuccess('Password reset link sent successfully.');
        this.loading = false;
      },
      error: (res: any) => {
        this.loading = false;
        this.notify.showError(
          res.error?.message || 'Failed to send password reset link. Please try again.',
        );
      },
    });
  }
}

