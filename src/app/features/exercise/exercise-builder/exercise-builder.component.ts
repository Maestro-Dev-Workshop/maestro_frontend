import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute }             from '@angular/router';
import { ExerciseService, Exercise } from '../../../core/exercise/exercise.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-exercise-builder',
  templateUrl: './exercise-builder.component.html'
})
export class ExerciseBuilderComponent implements OnInit {
  form: ReturnType<FormBuilder['group']>;
  exercises: Exercise[] = [];
  private fb      = inject(FormBuilder);
  private route   = inject(ActivatedRoute);
  private exSvc   = inject(ExerciseService);

  constructor() {
    this.form = this.fb.group({
      preference:   ['Balanced', Validators.required],
      questionType: ['multiple_choice', Validators.required]
    });
  }

  ngOnInit() {}

  onGenerate() {
    if (this.form.invalid) return;
    const id = this.route.snapshot.params['id'];
    this.exSvc.generateExercises(id, this.form.value)
      .subscribe(list => this.exercises = list);
  }
}