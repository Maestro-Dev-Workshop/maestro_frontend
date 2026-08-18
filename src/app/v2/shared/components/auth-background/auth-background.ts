import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  NgxParticlesModule,
  NgParticlesService
} from '@tsparticles/angular';
import { loadSlim } from '@tsparticles/slim';
import { IOptions, RecursivePartial } from '@tsparticles/engine';
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
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly particlesService = inject(NgParticlesService);
  private readonly themeService = inject(ThemeService);

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      await this.particlesService.init(async (engine) => {
        await loadSlim(engine);
      });
    }
  }

  readonly particleOptions = computed<RecursivePartial<IOptions>>(() => {
  const themeFolder = this.themeService.effectiveTheme();

  return {
    fullScreen: {
      enable: true,
    },

    fpsLimit: 60,

    particles: {
      number: {
        value: 30,
      },

      opacity: {
        value: 0.8,
      },

      size: {
        value: {
          min: 20,
          max: 40,
        },
      },

      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        outModes: {
          default: 'out',
        },
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

  // particleOptions: RecursivePartial<IOptions> = {
  //   // FIX: Prevents tsParticles from generating a separate body-level canvas layer
  //   fullScreen: { enable: true },
  //   fpsLimit: 60,
  //   particles: {
  //     number: { value: 30 }, // Raised count slightly to guarantee visibility
  //     opacity: { value: 0.8 },
  //     size: { value: { min: 20, max: 40 } },
  //     move: { 
  //       enable: true, 
  //       speed: 2,
  //       direction: 'none',
  //       outModes: { default: 'out' }
  //     },
  //     shape: {
  //       type: 'image',
  //       options: {
  //         image: [
  //           { src: '/images/dark/auth-bg-particles/particle-1.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-2.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-3.svg', width: 100, height: 100 },   
  //           { src: '/images/dark/auth-bg-particles/particle-4.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-5.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-6.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-7.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-8.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-9.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-10.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-11.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-12.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-13.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-14.svg', width: 100, height: 100 },
  //           { src: '/images/dark/auth-bg-particles/particle-15.svg', width: 100, height: 100 },

  //         ]
  //       }
  //     }
  //   }
  // };
}