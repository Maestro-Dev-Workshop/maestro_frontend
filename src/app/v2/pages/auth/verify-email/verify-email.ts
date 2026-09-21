import { Component, computed, inject  } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthBackground } from '../../../shared/components/auth-background/auth-background';

@Component({
  selector: 'app-verify-email',
  imports: [AuthBackground],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  private readonly themeService = inject(ThemeService);
  logoSrc = computed(() => `images/${this.themeService.effectiveTheme()}/maestro-logo.svg`);
}
