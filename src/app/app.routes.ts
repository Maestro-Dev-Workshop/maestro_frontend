import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Home
  { path: '', loadComponent: () => import('./pages/home/home/home').then(m => m.Home) },
  { path: 'privacy-policy', loadComponent: () => import('./pages/home/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy) },
  { path: 'terms-of-service', loadComponent: () => import('./pages/home/terms-of-service/terms-of-service').then(m => m.TermsOfService) },

  // Auth
  { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup').then(m => m.Signup) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.Login) },
  { path: 'verify-email', loadComponent: () => import('./pages/auth/verify-email/verify-email').then(m => m.VerifyEmail) },
  { path: 'check-email', loadComponent: () => import('./pages/auth/check-email/check-email').then(m => m.CheckEmail) },

  // Dashboard (protected)
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/subjects/subjects').then(m => m.Subjects), canActivate: [authGuard] },
  { path: 'dashboard/subscription', loadComponent: () => import('./pages/dashboard/subscription/subscription').then(m => m.Subscription), canActivate: [authGuard] },
  { path: 'dashboard/verify-payment', loadComponent: () => import('./pages/dashboard/verify-payment/verify-payment').then(m => m.VerifyPayment), canActivate: [authGuard] },
  
  // Subject Creation (protected)
  { path: 'subject-create/:sessionId/naming-upload', loadComponent: () => import('./pages/subject-create/naming-upload/naming-upload').then(m => m.NamingUpload), canActivate: [authGuard] },
  { path: 'subject-create/:sessionId/lesson-generation', loadComponent: () => import('./pages/subject-create/lesson-generation/lesson-generation').then(m => m.LessonGeneration), canActivate: [authGuard] },
  
  // Lesson (protected)
  { path: 'lesson/:subjectId', loadComponent: () => import('./pages/lesson/lesson-page/lesson-page').then(m => m.LessonPage), canActivate: [authGuard] },
  

  // UI Overhaul Pages (All paths and imports are prefixed with `v2/`)
  // Auth
  { path: 'v2/signup', loadComponent: () => import('./v2/pages/auth/signup/signup').then(m => m.Signup) },
  { path: 'v2/login', loadComponent: () => import('./v2/pages/auth/login/login').then(m => m.Login) },
  { path: 'v2/verify-email', loadComponent: () => import('./v2/pages/auth/verify-email/verify-email').then(m => m.VerifyEmail) },
  { path: 'v2/check-email', loadComponent: () => import('./v2/pages/auth/check-email/check-email').then(m => m.CheckEmail) },
  { path: 'v2/password-reset', loadComponent: () => import('./v2/pages/auth/password-reset/password-reset').then(m => m.PasswordReset) },
  { path: 'v2/', loadComponent: () => import('./v2/pages/auth/password-reset/password-reset').then(m => m.PasswordReset) },
  
  
  // Dashboard Pages
  { path: 'v2/lessons', loadComponent: () => import('./v2/pages/dashboard/lessons/lessons').then(m => m.Lessons), canActivate: [authGuard] },
  { path: 'v2/store', loadComponent: () => import('./v2/pages/dashboard/store/store').then(m => m.Store), canActivate: [authGuard] },
  { path: 'v2/usage-stats', loadComponent: () => import('./v2/pages/dashboard/usage-stats/usage-stats').then(m => m.UsageStats), canActivate: [authGuard] },
  { path: 'v2/settings', loadComponent: () => import('./v2/pages/dashboard/settings/settings').then(m => m.Settings), canActivate: [authGuard] },
  { path: 'v2/verify-payment', loadComponent: () => import('./v2/pages/dashboard/verify-payment/verify-payment').then(m => m.VerifyPayment), canActivate: [authGuard] },
  
  // Lesson Generation Page
  { path: 'v2/lesson-generation/:sessionId', loadComponent: () => import('./v2/pages/lesson-generation/lesson-generation').then(m => m.LessonGeneration), canActivate: [authGuard] },

  // Lesson Page
  { path: 'v2/lesson/:subjectId', loadComponent: () => import('./v2/pages/lesson/lesson-page/lesson-page').then(m => m.LessonPage), canActivate: [authGuard] },
  
  // view btn component
  { path: 'v2/view-btn', loadComponent: () => import('./v2/shared/components/shiny-btn/shiny-btn').then(m => m.ShinyBtnComponent) },
  // Not Found
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) },

];
