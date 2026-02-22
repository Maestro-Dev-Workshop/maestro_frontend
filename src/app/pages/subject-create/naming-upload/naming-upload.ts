import {
  ChangeDetectorRef,
  Component,
  inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule, NgModel } from '@angular/forms';
import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  catchError,
  EMPTY,
  finalize,
  iif,
  of,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { SubjectNameValidator } from '../../../shared/directives/subject-name-validator';
import { SubscriptionStatus } from '../../../core/models/subscription.model';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ConfirmService } from '../../../core/services/confirm';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-naming-upload',
  imports: [
    Header,
    CreationStepTab,
    FormsModule,
    SubjectNameValidator,
    ThemeIconComponent,
  ],
  templateUrl: './naming-upload.html',
  styleUrl: './naming-upload.css',
})
export class NamingUpload implements OnInit {
  subjectName = '';
  subjectId = '';
  subject: any = null;

  files: File[] = [];
  isDragging = false;
  loading = false;
  uploadedDocs = false;

  single_file_size = 3;
  total_files_size = 10;
  max_file_count = 5;

  allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'epub'];
  acceptString = this.allowedExtensions.map((ext) => '.' + ext).join(', ');

  subjectService = inject(SubjectsService);
  notify = inject(NotificationService);
  subscriptionService = inject(SubscriptionService);
  confirmation = inject(ConfirmService);

  @ViewChild('nameCtrl') nameCtrl!: NgModel;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 2];
  }

  ngOnInit(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        const subscriptionData: SubscriptionStatus | null =
          response.subscription;

        if (subscriptionData?.plan) {
          this.single_file_size = subscriptionData.plan.single_file_size || 3;
          this.total_files_size =
            subscriptionData.plan.subject_total_files_size || 10;
          this.max_file_count = subscriptionData.plan.subject_file_count || 5;
        }

        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(
          res.error?.message || 'Failed to load subscription data.',
        );
      },
    });

    this.subjectService.getSubject(this.subjectId).subscribe({
      next: (response) => {
        this.subject = response.session;
        this.subjectName = this.subject?.name || '';

        if (
          this.subject?.status !== 'pending naming' &&
          this.subject?.status !== 'pending document upload'
        ) {
          this.uploadedDocs = true;
        }

        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(
          res.error?.message || 'Failed to load subject details.',
        );
      },
    });
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files && !this.loading) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && !this.loading) {
      this.addFiles(input.files);
    }
  }

  private addFiles(fileList: FileList) {
    if (this.uploadedDocs) {
      this.notify.showError(
        'You have already uploaded documents for this subject.',
      );
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    const largeFiles: string[] = [];

    let totalFilesCount = this.files.length;
    let totalFilesSize = this.files.reduce((acc, file) => acc + file.size, 0);

    for (const file of fileList) {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (!ext || !this.allowedExtensions.includes(ext)) {
        invalidFiles.push(file.name);
      } else if (file.size > this.single_file_size * 1024 ** 2) {
        largeFiles.push(file.name);
      } else if (totalFilesCount === this.max_file_count) {
        this.notify.showError(
          `You can upload a maximum of ${this.max_file_count} files.`,
        );
        break;
      } else if (
        totalFilesSize + file.size >
        this.total_files_size * 1024 ** 2
      ) {
        this.notify.showError(
          `Total upload size cannot exceed ${this.total_files_size}MB.`,
        );
        break;
      } else {
        validFiles.push(file);
        totalFilesCount++;
        totalFilesSize += file.size;
      }
    }

    if (invalidFiles.length) {
      this.notify.showError(
        `Unsupported file types: ${invalidFiles.join(', ')}`,
      );
    }

    if (largeFiles.length) {
      this.notify.showError(`Files too large: ${largeFiles.join(', ')}`);
    }

    if (validFiles.length) {
      this.files = [...this.files, ...validFiles];
      this.notify.showSuccess(`${validFiles.length} file(s) added.`);
    }
  }

  removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
  }

  onSubmit() {
    if (this.loading) return;

    this.loading = true;

    if (this.nameCtrl?.invalid && this.subject?.status === 'pending naming') {
      this.notify.showError('Valid subject name is required.');
      this.loading = false;
      return;
    }

    if (this.files.length === 0 && !this.uploadedDocs) {
      this.notify.showError('At least one file must be uploaded.');
      this.loading = false;
      return;
    }

    const nameSubjectIfPending$ = () =>
      iif(
        () => this.subject?.status !== 'pending naming',
        of(null),
        this.subjectService.nameSubject(this.subjectId, this.subjectName),
      );

    const ingestDocumentsIfNeeded$ = () =>
      iif(
        () => this.uploadedDocs,
        of(true),
        this.subjectService.ingestDocuments(this.subjectId, this.files),
      );

    nameSubjectIfPending$()
      .pipe(
        switchMap(() => ingestDocumentsIfNeeded$()),
        switchMap(() => this.subjectService.labelDocuments(this.subjectId)),
        tap(() => {
          this.notify.showSuccess('Topics successfully identified.');
          this.router.navigate([
            `/subject-create/${this.subjectId}/lesson-generation`,
          ]);
        }),
        catchError((res) => {
          this.notify.showError(res.error?.message || 'Something went wrong.');
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe();
  }
}
