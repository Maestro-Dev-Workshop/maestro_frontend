import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
  
// Components
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CreateSubjectComponent } from './features/subject/create-subject/create-subject.component';
import { TopicSelectionComponent } from './features/subject/topic-selection/topic-selection.component';
import { LearningStyleComponent } from './features/subject/learning-style/learning-style.component';
import { LessonViewerComponent } from './features/lesson/lesson-viewer/lesson-viewer.component';
import { ExerciseBuilderComponent } from './features/exercise/exercise-builder/exercise-builder.component';
import { ExamBuilderComponent } from './features/exam/exam-builder/exam-builder.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // 🔐 Auth
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignupComponent },

  // 🏠 Dashboard (protected)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // 📘 Subject Flow (protected)
  { path: 'subject/new', component: CreateSubjectComponent, canActivate: [AuthGuard] },
  { path: 'subject/:id/topics', component: TopicSelectionComponent, canActivate: [AuthGuard] },
  { path: 'subject/:id/style', component: LearningStyleComponent, canActivate: [AuthGuard] },
  { path: 'subject/:id/lessons', component: LessonViewerComponent, canActivate: [AuthGuard] },

  // 🧪 Exercises & 📝 Exams (protected)
  { path: 'subject/:id/exercises', component: ExerciseBuilderComponent, canActivate: [AuthGuard] },
  { path: 'subject/:id/exams', component: ExamBuilderComponent, canActivate: [AuthGuard] },

  // Fallback
  { path: '**', redirectTo: 'auth/login' }
];