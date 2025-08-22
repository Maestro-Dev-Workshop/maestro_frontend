import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
        return
      }
      if (!this.exerciseSettings.preference) {
        alert("Exercise preference cannot be empty");
        this.loading = false;
        return
      }
    }
    exerciseValidated = true
    
    // Validate exam fields
    if (this.examSettings.include) {
      if (this.examSettings.questionTypes.length == 0) {
        alert("Choose at least one question type for the exam");
        this.loading = false;
        return
      }
      if (!this.examSettings.preference) {
        alert("Exam preference cannot be empty");
        this.loading = false;
        return
      }
    }
    examValidated = true
    
    // Generate Practice Questions
    if (this.exerciseSettings.include && exerciseValidated) {
      // API call here
      console.log("Generating Exercises")
      console.log(this.exerciseSettings)
    }
    if (this.examSettings.include && examValidated) {
      // API call here
      console.log("Generating Exam")
      console.log(this.examSettings)
    }

    console.log("Practice Question Generation done")
    this.router.navigate([`/lesson/${'subject-id-here'}`])
    this.loading = false;
  }

}
