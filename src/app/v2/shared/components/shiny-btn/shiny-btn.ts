// shiny-btn.ts
import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';

export class ShinyBtnStyles {
  // 🌙 Dark Theme Styles (Original Gold/Brown Gradient)
  private static readonly DARK_CLASSES = 
    'bg-[radial-gradient(circle,_#FEBB25_40%,_#7C5800_100%)] text-[#190F00] ' +
    'shadow-[0_4px_6px_rgba(25,15,0,0.2)] focus:ring-[#7C5800]';

  // ☀️ Light Theme Styles (New Deep Blue/Cyan Gradient)
  private static readonly LIGHT_CLASSES = 
    'bg-[radial-gradient(circle,_#001D33_40%,_#317AC3_100%)] text-[#FFFFFF] ' +
    'shadow-[0_4px_6px_rgba(0,29,51,0.15)] focus:ring-[#317AC3]';

  // 🧱 Shared Base Button Layout Layout
  private static readonly BASE_LAYOUT = 
    'font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2';

  public static getThemeClasses(effectiveTheme: 'light' | 'dark'): string {
    const themeSpecific = effectiveTheme === 'dark' ? this.DARK_CLASSES : this.LIGHT_CLASSES;
    return `${this.BASE_LAYOUT} ${themeSpecific}`;
  }
}

// // shiny-btn-styles.ts
// export class ShinyBtnStyles {
//   // 🌙 Dark Theme Styles (Original Gold/Brown + Both Inner Shadows)
//   private static readonly DARK_CLASSES = 
//     'bg-[radial-gradient(circle,_#FEBB25_40%,_#7C5800_100%)] text-[#190F00] ' +
//     'shadow-[0_4px_6px_rgba(25,15,0,0.2),_inset_0_16px_24px_0_rgba(255,255,255,0.25),_inset_0_-16px_24px_0_rgba(255,255,255,0.25)] ' +
//     'focus:ring-[#7C5800]';

//   // ☀️ Light Theme Styles (New Deep Blue/Cyan + Both Inner Shadows)
//   private static readonly LIGHT_CLASSES = 
//     'bg-[radial-gradient(circle,_#001D33_40%,_#317AC3_100%)] text-[#FFFFFF] ' +
//     'shadow-[0_4px_6px_rgba(0,29,51,0.15),_inset_0_16px_24px_0_rgba(255,255,255,0.25),_inset_0_-16px_24px_0_rgba(255,255,255,0.25)] ' +
//     'focus:ring-[#317AC3]';

//   // 🧱 Shared Base Button Layout
//   private static readonly BASE_LAYOUT = 
//     'font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2';

//   public static getThemeClasses(effectiveTheme: 'light' | 'dark'): string {
//     const themeSpecific = effectiveTheme === 'dark' ? this.DARK_CLASSES : this.LIGHT_CLASSES;
//     return `${this.BASE_LAYOUT} ${themeSpecific}`;
//   }
// }

@Component({
  selector: 'app-shiny-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shiny-btn.html',
  styleUrl: './shiny-btn.css',
})
export class ShinyBtnComponent {
  private readonly themeService = inject(ThemeService);
  additionalClasses = input<string>('');

  // 🔄 Automatically triggers whenever themeService.effectiveTheme changes
  protected readonly btnClasses = computed(() => {
    const activeTheme = this.themeService.effectiveTheme();
    return `${ShinyBtnStyles.getThemeClasses(activeTheme)} ${this.additionalClasses()}`;
  });
}



