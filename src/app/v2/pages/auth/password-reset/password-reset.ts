import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthBackground } from '../../../shared/components/auth-background/auth-background';  
import { ShinyBtnComponent } from '../../../shared/components/shiny-btn/shiny-btn';
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

  logoSrc = computed(
    () => `images/${this.themeService.effectiveTheme()}/maestro-logo.svg`
  );

  onSubmit(): void {
    this.loading = true;

    // Your password reset logic goes here

    // Example:
    // this.authService.resetPassword(this.email).subscribe({
    //   next: () => {
    //     this.loading = false;
    //   },
    //   error: () => {
    //     this.loading = false;
    //   }
    // });
  }
}

