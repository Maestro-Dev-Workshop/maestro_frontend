import { Component, Input, computed, inject, input } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-icon',
  standalone: true,
  template: `
    <img
      [src]="iconPath()"
      [class]="className()"
      alt=""
    />
  `,
})
export class ThemeIconComponent {

  name = input.required<string>();
  className = input<string>('');
  invert = input<boolean>(false);

  private themeService = inject(ThemeService);

  iconPath = computed(() => {
    const theme = this.themeService.theme();

    let resolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;
    
      if (this.invert()) {
        resolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      }

    return `/images/${resolvedTheme}/${this.name()}.svg`;
  });
}
