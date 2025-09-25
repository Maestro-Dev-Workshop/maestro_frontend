import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home
  { path: '', loadComponent: () => import('./pages/home/home/home').then(m => m.Home) },

  // Auth
  { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup').then(m => m.Signup) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.Login) },
  { path: 'verify-email', loadComponent: () => import('./pages/auth/verify-email/verify-email').then(m => m.VerifyEmail) },
  { path: 'check-email', loadComponent: () => import('./pages/auth/check-email/check-email').then(m => m.CheckEmail) },

  // Dashboard
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/subjects/subjects').then(m => m.Subjects) },
  { path: 'dashboard/subscription', loadComponent: () => import('./pages/dashboard/subscription/subscription').then(m => m.Subscription) },

  // Subject Creation (stepper flow, could be nested later if you want)
  { path: 'subject-create/naming-upload', loadComponent: () => import('./pages/subject-create/naming-upload/naming-upload').then(m => m.NamingUpload) },
  { path: 'subject-create/:sessionId/topic-preferences', loadComponent: () => import('./pages/subject-create/topic-preferences/topic-preferences').then(m => m.TopicPreferences) },
  { path: 'subject-create/:sessionId/question-settings', loadComponent: () => import('./pages/subject-create/question-settings/question-settings').then(m => m.QuestionSettings) },

  // Lesson
  { path: 'lesson/:subjectId', loadComponent: () => import('./pages/lesson/lesson-page/lesson-page').then(m => m.LessonPage) },

  // Not Found
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) },
];
