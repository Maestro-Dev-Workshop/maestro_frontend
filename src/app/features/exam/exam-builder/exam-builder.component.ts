import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute }           from '@angular/router';
import { ExamService, ExamQuestion } from '../../../core/exam/exam.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-exam-builder',
  templateUrl: './exam-builder.component.html'
})
export class ExamBuilderComponent implements OnInit {
  form: ReturnType<FormBuilder['group']>;
  questions: ExamQuestion[] = [];
  private fb    = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private svc   = inject(ExamService);

  constructor() {
    this.form = this.fb.group({
      preference:   ['Standard', Validators.required],
      questionType: ['multiple_choice', Validators.required],
      timeLimit:    [null]
    });
  }

  ngOnInit() {}

  onGenerate() {
    if (this.form.invalid) return;
    const id = this.route.snapshot.params['id'];
    this.svc.generateExam(id, this.form.value)
      .subscribe(list => this.questions = list);
  }
}