import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router }    from '@angular/router';
import { SubjectService }            from '../../../core/subject/subject.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-topic-selection',
  templateUrl: './topic-selection.component.html'
})
export class TopicSelectionComponent implements OnInit {
  form: any;
  topics: string[] = [];

  private fb     = inject(FormBuilder);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private subj   = inject(SubjectService);

  ngOnInit() {
    this.form = this.fb.group({ selected: [[]], style: [''] });
    const id = this.route.snapshot.params['id'];
    this.subj.getTopics(id).subscribe(t => this.topics = t);
  }

  onNext() {
    const id = this.route.snapshot.params['id'];
    const { selected, style } = this.form.value;
    this.subj.saveSelection(id, selected, style).subscribe(() => {
      this.router.navigate([`/subject/${id}/lessons`]);
    });
  }
}