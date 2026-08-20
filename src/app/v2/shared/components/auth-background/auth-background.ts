import { Component, OnInit, inject, PLATFORM_ID, DestroyRef, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxParticlesModule, NgParticlesService } from '@tsparticles/angular';
import { loadSlim } from '@tsparticles/slim';
import { IOptions, RecursivePartial, Container } from '@tsparticles/engine';
import { computed } from '@angular/core'; 
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-auth-background',
  standalone: true,
  imports: [NgxParticlesModule],
  templateUrl: './auth-background.html',
  styleUrl: './auth-background.css',
})
export class AuthBackground implements OnInit {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly particlesService = inject(NgParticlesService);
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  // 1. Keep track of the active tsParticles instance container
  private particlesContainer?: Container;

  // 2. Responsive signal to dynamically update configuration 
  readonly isMobile = signal(false);

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      this.setupResponsiveListener();

      await this.particlesService.init(async (engine) => {
        await loadSlim(engine);
      });
    }
  }

  // 3. Capture the initialized container instance from the template HTML
  // Bind this method to your HTML template: (particlesLoaded)="onParticlesLoaded($event)"
  onParticlesLoaded(container: any): void {
    this.particlesContainer = container;
  }

  private setupResponsiveListener(): void {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    // Set initial value safely on the client
    this.isMobile.set(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      this.isMobile.set(e.matches);
      
      // 4. Force tsParticles to re-render immediately using its built-in method
      if (this.particlesContainer) {
        this.particlesContainer.refresh();
      }
    };

    mediaQuery.addEventListener('change', handler);
    
    // Clean up event listener when component unmounts to prevent memory leaks
    this.destroyRef.onDestroy(() => {
      mediaQuery.removeEventListener('change', handler);
    });
  }

  readonly particleOptions = computed<RecursivePartial<IOptions>>(() => {
    const themeFolder = this.themeService.effectiveTheme();
    
    // Reacts dynamically whenever this.isMobile() changes value
    let particleCount = this.isMobile() ? 15 : 30;

    return {
      fullScreen: { enable: true },
      fpsLimit: 60,
      particles: {
        number: {
          value: particleCount,
          density: { enable: false },
        },
        opacity: { value: 0.8 },
        size: { value: { min: 20, max: 40 } },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          outModes: { default: 'out' },
        },
        shape: {
          type: 'image',
          options: {
            image: Array.from({ length: 15 }, (_, index) => ({
              src: `/images/${themeFolder}/auth-bg-particles/particle-${index + 1}.svg`,
              width: 100,
              height: 100,
            })),
          },
        },
      },
    };
  });
}
