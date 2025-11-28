import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectsService } from '../../../core/services/subjects.service';
import { forkJoin, Observable } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service'; // <-- Add this import
import { PreferenceValidator } from '../../../shared/directives/preference-validator';
import { SubscriptionService } from '../../../core/services/subscription.service';

class ExerciseSettings {
  include: boolean = false
  questionTypes: Array<string> = []
  preference: string = ''
  numQuestions: number = 3
}
class ExamSettings {
  include: boolean = false
  questionTypes: Array<string> = []
  preference: string = ''
  timeLimit: any = null
  numQuestions: number = 10
}

@Component({
  selector: 'app-question-settings',
  imports: [Header, CreationStepTab, FormsModule, PreferenceValidator],
  templateUrl: './question-settings.html',
  styleUrl: './question-settings.css'
})
export class QuestionSettings implements OnInit {
  exerciseSettings = new ExerciseSettings();
  examSettings = new ExamSettings();
  loading = false;
  subjectId = '';
  maxExerciseQuestions = 3;
  maxExamQuestions = 10;
  subjectService = inject(SubjectsService)
  notify = inject(NotificationService);
  subscriptionService = inject(SubscriptionService)

  @ViewChild('exercisePreferenceCtrl') exercisePreferenceCtrl!: NgModel;
  // @ViewChild('exerciseCountCtrl') exerciseCountCtrl!: NgModel;
  @ViewChild('examPreferenceCtrl') examPreferenceCtrl!: NgModel;
  // @ViewChild('examCountCtrl') examCountCtrl!: NgModel;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Extract subjectId from the route parameters
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 2]; // Assuming the last part is the subjectId
  }

  ngOnInit(): void {
    this.loading = true;
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.maxExerciseQuestions = response.subscription.plan.exercise_question_count || 3;
        this.maxExamQuestions = response.subscription.plan.exam_question_count || 10;
      },
      error: (err) => {
        this.notify.showError("Failed to fetch subscription data. Using default limits.");
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    })
  }

  toggleExerciseType(event: any) {
    if (event.target.checked) {
      this.exerciseSettings.questionTypes.push(event.target.value);
    } else {
      this.exerciseSettings.questionTypes = this.exerciseSettings.questionTypes.filter((qt) => qt !== event.target.value);
    }
  }

  toggleExamType(event: any) {
    if (event.target.checked) {
      this.examSettings.questionTypes.push(event.target.value);
    } else {
      this.examSettings.questionTypes = this.examSettings.questionTypes.filter((qt) => qt !== event.target.value);
    }
  }

  onSubmit() {
    this.loading = true;
    let exerciseValidated = false;
    let examValidated = false;
  
    // Validate exercise fields
    if (this.exerciseSettings.include) {
      if (this.exerciseSettings.questionTypes.length == 0) {
        this.notify.showError("Choose at least one question type for the exercises");
        this.loading = false;
        return;
      }
      if (this.exercisePreferenceCtrl.invalid) {
        this.notify.showError("Exercise preference cannot exceed 1000 characters");
        this.loading = false;
        return;
      }
      if (this.exerciseSettings.numQuestions < 1 || this.exerciseSettings.numQuestions > this.maxExerciseQuestions || this.exerciseSettings.numQuestions == null) {
        this.notify.showError(`Number of exercise questions must be between 1 and ${this.maxExerciseQuestions}`);
        this.loading = false;
        return;
      }
      if (this.exerciseSettings.preference.trim() === '') {
        this.exerciseSettings.preference = 'User did not provide any specific preferences.';
      }
    }
    exerciseValidated = true;
  
    // Validate exam fields
    if (this.examSettings.include) {
      if (this.examSettings.questionTypes.length == 0) {
        this.notify.showError("Choose at least one question type for the exam");
        this.loading = false;
        return;
      }
      if (this.examPreferenceCtrl.invalid) {
        this.notify.showError("Exam preference cannot exceed 1000 characters");
        this.loading = false;
        return;
      }
      if (this.examSettings.numQuestions < 1 || this.examSettings.numQuestions > this.maxExamQuestions || this.examSettings.numQuestions == null) {
        this.notify.showError(`Number of exam questions must be between 1 and ${this.maxExamQuestions}`);
        this.loading = false;
        return;
      }
      if (this.examSettings.preference.trim() === '') {
        this.examSettings.preference = 'User did not provide any specific preferences.';
      }
    }
    examValidated = true;
  
    // Collect all requests to run in parallel
    const requests: Observable<any>[] = [];
  
    if (this.exerciseSettings.include && exerciseValidated) {
      requests.push(
        this.subjectService.generateExercise(
          this.subjectId,
          this.exerciseSettings.preference,
          this.exerciseSettings.questionTypes,
          this.exerciseSettings.numQuestions
        )
      );
    }
  
    if (this.examSettings.include && examValidated) {
      requests.push(
        this.subjectService.generateExam(
          this.subjectId,
          this.examSettings.preference,
          this.examSettings.questionTypes,
          this.examSettings.numQuestions,
        )
      );
    }
  
    // If there are requests, wait for them to finish before updating status
    if (requests.length > 0) {
      forkJoin(requests).subscribe({
        next: (responses) => {
          this.notify.showSuccess("Sucessfully generated practice questions.")
          this.subjectService.updateSessionStatus(this.subjectId, "In Progress").subscribe({
            next: () => {
              this.router.navigate([`/lesson/${this.subjectId}`]);
            },
            error: (err) => {
              this.notify.showError("Failed to update session status.");
              this.router.navigate([`/lesson/${this.subjectId}`]);
            },
            complete: () => (this.loading = false),
          });
        },
        error: (res) => {
          this.notify.showError(res.error.message || "Failed to generate practice questions. Please try again later.");
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // If no requests to generate, just update status directly
      this.subjectService.updateSessionStatus(this.subjectId, "In Progress").subscribe({
        next: () => {
          console.log("Session status updated (no generation needed)");
          this.router.navigate([`/lesson/${this.subjectId}`]);
        },
        error: (res) => {
          this.notify.showError(res.error.message || "Failed to update session status.");
          this.router.navigate([`/lesson/${this.subjectId}`]);
        },
        complete: () => (this.loading = false),
      });
    }
  }

}
