import { bootstrapApplication } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { ThemeService } from './app/core/services/theme.service';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

function initializeGoogleAnalytics(measurementId: string) {
  if (!measurementId) return;

  // Load the gtag.js script dynamically
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize the dataLayer and gtag function
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  // Configure Google Analytics (automatically sends the initial page_view)
  gtag('js', new Date());
  gtag('config', measurementId);
}

// Initialize GA only in production
initializeGoogleAnalytics(environment.gaMeasurementId);

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    {
      provide: 'THEME_INIT',
      useFactory: () => {
        const themeService = inject(ThemeService);
        themeService.init();
      },
    },
  ],
}).catch(err => console.error(err));
