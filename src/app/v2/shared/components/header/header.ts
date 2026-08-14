import { Component, inject, signal } from '@angular/core';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [ThemeIconComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  initials = signal<string>("EE")
  themeService = inject(ThemeService)
  currentTheme = this.themeService.getTheme()

  toggleTheme() {
    if (this.currentTheme === 'dark') {
      this.themeService.setTheme('light');
    } else {
      this.themeService.setTheme('dark');
    }
    this.currentTheme = this.themeService.getTheme();
  }
}
