// analytics.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  // Future events can be added here for better maintainability and consistency across the app
  // static EVENTS = {
  //   SESSION_CREATED: 'session_created',
  //   LESSON_STARTED: 'lesson_started',
  //   EXERCISE_COMPLETED: 'exercise_completed',
  // } as const;

  private isEnabled =
    environment.type === 'prod' && !!environment.gaMeasurementId;

  trackEvent(eventName: string, params: Record<string, any> = {}) {
    if (!this.isEnabled || !(window as any).gtag) return;

    (window as any).gtag('event', eventName, params);
  }

  trackPageView(path: string) {
    if (!this.isEnabled || !(window as any).gtag) return;

    (window as any).gtag('config', environment.gaMeasurementId, {
      page_path: path,
    });
  }
}


/* 
How to use service in component:
constructor(private analytics: AnalyticsService) {}

startLesson(topic: string) {
  this.analytics.trackEvent('lesson_started', {
    topic,
    sessionId,
    userId,
    ...
  });
}
*/