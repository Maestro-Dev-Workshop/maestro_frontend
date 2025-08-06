import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router }                    from '@angular/router';
import { SubjectService, Subject } from '../../../core/subject/subject.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html'
})
export class CreateSubjectComponent {
  private fb     = inject(FormBuilder);
  private subj   = inject(SubjectService);
  private router = inject(Router);

  form = this.fb.group({
    subjectName: ['', Validators.required],
    pdfs:        [null, Validators.required]
  });

  onFileChange(e: any) {
    this.form.patchValue({ pdfs: e.target.files });
  }

  onSubmit() {
    const subjectName = this.form.value.subjectName ?? '';
    const pdfs = this.form.value.pdfs;
    if (!pdfs) {
      // Handle the case where no files are selected
      console.error('No files selected');
      return;
    }
    // pdfs is guaranteed to be non-null here
    this.subj.createSubject({ subjectName, pdfs: pdfs as FileList }).subscribe(res => {
      this.router.navigate([`/subject/${res.id}/topics`]);
    }, err => {
      console.error('Error creating subject:', err);
      // Handle error (e.g., show a notification)
    });
  }
}