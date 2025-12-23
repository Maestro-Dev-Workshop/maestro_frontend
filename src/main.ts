import { bootstrapApplication } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { ThemeService } from './app/core/services/theme.service';
import { appConfig } from './app/app.config';
import { App } from './app/app';

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
