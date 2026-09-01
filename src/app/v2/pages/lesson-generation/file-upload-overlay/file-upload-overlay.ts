import { Component, computed, effect, ElementRef, inject, input, OnInit, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize, iif, of, switchMap, tap } from 'rxjs';

import { BaseOverlay } from '../../../shared/components/base-overlay/base-overlay';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

import { DocumentIngestResponse, DocumentModel, IngestedDocument, SubjectModel, SubjectStatus, SubscriptionStatus } from '../../../../core/models';

import { SubjectsService } from '../../../../core/services/subjects.service';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmService } from '../../../../core/services/confirm';
import { StandardBtn } from '../../../shared/components/standard-btn/standard-btn';

@Component({
  selector: 'app-file-upload-overlay',
  imports: [BaseOverlay, FormsModule, ThemeIconComponent, StandardBtn],
  templateUrl: './file-upload-overlay.html',
  styleUrl: './file-upload-overlay.css',
})
export class FileUploadOverlay implements OnInit {
  subjectId = '';
  subject: SubjectModel | null = null;

  files: File[] = [];
  isDragging = false;
  storedDocs = signal<DocumentModel[]>([]);
  uploadedDocs = signal(false);
  loading = signal(false);
  close = output<void>();

  total_files_size = 10;
  max_file_count = 5;

  allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'epub'];
  acceptString = this.allowedExtensions.map((ext) => '.' + ext).join(', ');

  private route = inject(ActivatedRoute);
  private subjectService = inject(SubjectsService);
  private notify = inject(NotificationService);
  private subscriptionService = inject(SubscriptionService);
  private confirmation = inject(ConfirmService);

  ngOnInit(): void {
    // Get subjectId from route params
    this.route.paramMap.subscribe((params) => {
      this.subjectId = params.get('sessionId') ?? '';
    });

    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        const subscriptionData: SubscriptionStatus | null =
          response.subscription;

        if (subscriptionData?.plan) {
          this.total_files_size = subscriptionData.plan.lesson_cummulative_file_size || 100;
          this.max_file_count = subscriptionData.plan.lesson_file_count || 5;
        }
      },
      error: (res) => {
        this.notify.showError(
          res.error?.message || 'Failed to load subscription data.',
        );
      },
    });

    this.subjectService.getSubjectDetails(this.subjectId).subscribe({
      next: (response) => {
        this.subject = response.session;
        this.storedDocs.set(response.documents);
        if (this.subject.status !== SubjectStatus.PENDING_DOCUMENT_UPLOAD) {
          this.uploadedDocs.set(true);
          if (this.subject.status !== SubjectStatus.PENDING_TOPIC_LABELLING) {
            this.closeOverlay();
          }
        }
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

    if (event.dataTransfer?.files && !this.loading()) {
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

    if (input.files && !this.loading()) {
      this.addFiles(input.files);
    }
  }

  private addFiles(fileList: FileList) {
    if (this.uploadedDocs()) {
      this.notify.showError(
        'You have already uploaded documents for this subject.',
      );
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    const largeFiles: string[] = [];
    const duplicateFiles: string[] = [];

    let totalFilesCount = this.files.length;
    let totalFilesSize = this.files.reduce((acc, file) => acc + file.size, 0);

    for (const file of fileList) {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (!ext || !this.allowedExtensions.includes(ext)) {
        invalidFiles.push(file.name);
      } else if (this.files.some((f) => f.name === file.name)) {
        duplicateFiles.push(file.name);
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
        `Unsupported file type(s): ${invalidFiles.join(', ')}`,
      );
    }

    if (duplicateFiles.length) {
      this.notify.showError(`Duplicate file(s) found: ${duplicateFiles.join(', ')}`);
    }

    if (largeFiles.length) {
      this.notify.showError(`File(s) too large: ${largeFiles.join(', ')}`);
    }

    if (validFiles.length) {
      this.files = [...this.files, ...validFiles];
      this.notify.showSuccess(`${validFiles.length} file(s) added.`);
    }
  }

  removeFile(file: File | DocumentModel) {
    this.files = this.files.filter((f) => f !== file);
  }

  formatFileSize(file: File | DocumentModel): string {
    let size = file.size;
    let formattedSize: string;
    let unit: string;

    if (size >= (1024 ** 2)) {
      formattedSize = (size / (1024 ** 2)).toFixed(3);
      unit = 'MB';
    } else if (size >= 1024) {
      formattedSize = (size / 1024).toFixed(3);
      unit = 'KB';
    } else {
      formattedSize = String(size);
      unit = 'B';
    }
    return `${formattedSize} ${unit}`;
  }

  getFileExtension(file: File) {
    return file.name.split('.').pop()?.toLowerCase() || '';
  }

  onSubmit() {
    if (this.loading()) return;
    this.loading.set(true);

    if (this.files.length === 0 && !this.uploadedDocs()) {
      this.notify.showError('At least one file must be uploaded.');
      this.loading.set(false);
      return;
    }

    const ingestDocumentsIfNeeded$ = () =>
    iif(
      () => this.uploadedDocs(),
      of(true), // Documents already uploaded, skip
      this.subjectService.ingestDocuments(this.subjectId, this.files).pipe(
        switchMap((res: DocumentIngestResponse) => {
          if (res.warning) {
            // Show confirmation modal and return Observable<boolean>
            return this.confirmation.open({
              title: "Word Count Limit Exceeded!",
              message: `The total word count of all uploaded documents exceed your subscription plan's soft limit by ${res.word_excess} words.
              If you choose to proceed with lesson generation, overcharge fees will be incurred on base lesson and all extensions. Do you wish to continue?`,
              okText: "Proceed",
              cancelText: "Go back"
            });
          } else {
            return of(true); // No warning, proceed
          }
        })
      )
    );

    ingestDocumentsIfNeeded$()
      .pipe(
        switchMap(() => this.subjectService.labelDocuments(this.subjectId)),
        tap({
          next: () => {
            this.notify.showSuccess('Topics successfully identified.');
          },
          complete: () => {
            this.closeOverlay();
          },
        }),
        catchError((res) => {
          this.notify.showError(res.error?.message || 'Something went wrong.');
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe();
  }

  closeOverlay() {
    if (this.loading()) return;
    this.close.emit();
  }

  get documents() {
    return this.uploadedDocs() ? this.storedDocs() : this.files;
  }
}
