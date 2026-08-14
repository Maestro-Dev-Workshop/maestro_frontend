import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  NgxParticlesModule,
  NgParticlesService
} from '@tsparticles/angular';
import { loadSlim } from '@tsparticles/slim';
import { IOptions, RecursivePartial } from '@tsparticles/engine';

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

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      await this.particlesService.init(async (engine) => {
        await loadSlim(engine);
      });
    }
  }

  particleOptions: RecursivePartial<IOptions> = {
    // FIX: Prevents tsParticles from generating a separate body-level canvas layer
    fullScreen: { enable: true },
    fpsLimit: 60,
    particles: {
      number: { value: 30 }, // Raised count slightly to guarantee visibility
      opacity: { value: 0.8 },
      size: { value: { min: 20, max: 40 } },
      move: { 
        enable: true, 
        speed: 2,
        direction: 'none',
        outModes: { default: 'out' }
      },
      shape: {
        type: 'image',
        options: {
          image: [
            { src: '/images/auth-bg-particles/particle-1.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-2.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-3.svg', width: 100, height: 100 },   
            { src: '/images/auth-bg-particles/particle-4.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-5.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-6.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-8.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-9.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-10.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-11.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-12.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-13.svg', width: 100, height: 100 },
            { src: '/images/auth-bg-particles/particle-14.svg', width: 100, height: 100 },
          ]
        }
      },
      color: { value: '#317AC3' }
    }
  };
}