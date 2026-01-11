import { ThemeService } from '../../core/services/theme.service';

export function themedIcon(
  theme: ThemeService,
  iconName: string
): string {
  const mode = theme.getTheme() === 'dark'
    ? 'dark'
    : theme.getTheme() === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : 'light';

  return `assets/images/${mode}/${iconName}.svg`;
}
