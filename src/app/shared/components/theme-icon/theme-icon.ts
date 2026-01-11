import { Component, Input, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-icon',
  standalone: true,
  template: `
    <img
      [src]="iconPath()"
      [class]="className"
      alt=""
    />
  `,
})
export class ThemeIconComponent {

  @Input({ required: true }) name!: string;
  @Input() className = '';

  private themeService = inject(ThemeService);

  iconPath = computed(() => {
    const theme = this.themeService.theme();

    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;

    return `/images/${resolvedTheme}/${this.name}.svg`;
  });
}
