import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectsService } from '../../../core/services/subjects.service';
import { forkJoin, Observable } from 'rxjs';

class ExerciseSettings {
  include: boolean = false
  questionTypes: Array<string> = []
  preference: string = ''
}
class ExamSettings {
  include: boolean = false
  questionTypes: Array<string> = []
  preference: string = ''
  timeLimit: any = null
}

@Component({
  selector: 'app-question-settings',
  imports: [Header, CreationStepTab, FormsModule],
  templateUrl: './question-settings.html',
  styleUrl: './question-settings.css'
})
export class QuestionSettings {
  exerciseSettings = new ExerciseSettings();
  examSettings = new ExamSettings();
  loading = false;
  subjectId = '';
  subjectService = inject(SubjectsService)

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Extract subjectId from the route parameters
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 2]; // Assuming the last part is the subjectId
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
        alert("Choose at least one question type for the exercises");
        this.loading = false;
        return;
      }
      if (!this.exerciseSettings.preference) {
        alert("Exercise preference cannot be empty");
        this.loading = false;
        return;
      }
    }
    exerciseValidated = true;
  
    // Validate exam fields
    if (this.examSettings.include) {
      if (this.examSettings.questionTypes.length == 0) {
        alert("Choose at least one question type for the exam");
        this.loading = false;
        return;
      }
      if (!this.examSettings.preference) {
        alert("Exam preference cannot be empty");
        this.loading = false;
        return;
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
          this.exerciseSettings.questionTypes
        )
      );
    }
  
    if (this.examSettings.include && examValidated) {
      requests.push(
        this.subjectService.generateExam(
          this.subjectId,
          this.examSettings.preference,
          this.examSettings.questionTypes
        )
      );
    }
  
    // If there are requests, wait for them to finish before updating status
    if (requests.length > 0) {
      forkJoin(requests).subscribe({
        next: (responses) => {
          console.log("Generation responses:", responses);
          this.subjectService.updateSessionStatus(this.subjectId, "In Progress").subscribe({
            next: () => {
              console.log("Session status updated");
              this.router.navigate([`/lesson/${this.subjectId}`]);
            },
            error: (err) => {
              console.error("Failed to update session status", err);
              this.router.navigate([`/lesson/${this.subjectId}`]);
            },
            complete: () => (this.loading = false),
          });
        },
        error: (err) => {
          console.error("Error during generation:", err);
          this.loading = false;
        }
      });
    } else {
      // If no requests to generate, just update status directly
      this.subjectService.updateSessionStatus(this.subjectId, "In Progress").subscribe({
        next: () => {
          console.log("Session status updated (no generation needed)");
          this.router.navigate([`/lesson/${this.subjectId}`]);
        },
        error: (err) => {
          console.error("Failed to update session status", err);
          this.router.navigate([`/lesson/${this.subjectId}`]);
        },
        complete: () => (this.loading = false),
      });
    }
  }

}
