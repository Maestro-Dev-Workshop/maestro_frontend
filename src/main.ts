import { bootstrapApplication } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { ThemeService } from './app/core/services/theme.service';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './app/core/services/analytics.service';
import { provideAnimations } from '@angular/platform-browser/animations';

function trackPageViews(router: Router, analytics: AnalyticsService) {
  router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      analytics.trackPageView(event.urlAfterRedirects);
    });
}

function initializeGoogleAnalytics(measurementId: string) {
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

  // Configure Google Analytics
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false,
  });
}

// Initialize GA only in production
if (environment.type == 'prod' && environment.gaMeasurementId) {
  initializeGoogleAnalytics(environment.gaMeasurementId);
}

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
    {
      provide: 'GA_TRACKING',
      useFactory: () => {
        if (environment.type === 'prod' && environment.gaMeasurementId) {
          const router = inject(Router);
          const analytics = inject(AnalyticsService);
          trackPageViews(router, analytics);
        }
      },
    },
    provideAnimations()
  ],
}).catch(err => console.error(err));
