import { ChangeDetectorRef, Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule, NgModel } from '@angular/forms';
import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service'; // <-- Add this import
import { catchError, EMPTY, finalize, iif, of, switchMap, takeWhile, tap } from 'rxjs';
import { SubjectNameValidator } from '../../../shared/directives/subject-name-validator';
import { SubscriptionStatus } from '../../../core/models/subscription.model';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ConfirmService } from '../../../core/services/confirm';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-naming-upload',
  imports: [Header, CreationStepTab, FormsModule, SubjectNameValidator, ThemeIconComponent],
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
  single_file_size = 3; // in MB
  total_files_size = 10; // in MB
  max_file_count = 5;
  subjectService = inject(SubjectsService);
  notify = inject(NotificationService);
  subscriptionService = inject(SubscriptionService);
  confirmation = inject(ConfirmService);
  allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'epub'];
  acceptString = this.allowedExtensions.map(ext => '.' + ext).join(', ')

  @ViewChild('nameCtrl') nameCtrl!: NgModel;

  constructor(private router: Router, private cdr: ChangeDetectorRef,private zone: NgZone,) {
    // Extract subjectId from the route parameters
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 2]; // Assuming the last part is the subjectId
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
    if (this.uploadedDocs){
      this.notify.showError("You have already uploaded documents for this subject. You cannot upload more.");
    } else {
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      const largeFiles: string[] = [];

      let totalFilesCount = this.files.length;
      let totalFilesSize = this.files.reduce((acc, file) => acc + file.size, 0);
    
      for (const file of fileList) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        
        // Type validity check
        if (!ext || !this.allowedExtensions.includes(ext)) {
          invalidFiles.push(file.name);
        // Size check
        } else if (file.size > this.single_file_size * (1024 ** 2)) { // 20MB cap for now
          largeFiles.push(file.name);
        // Count check
        } else if (totalFilesCount == this.max_file_count) {
          this.notify.showError(`You can upload a maximum of ${this.max_file_count} files per subject for your current plan.`);
          break;
        // Total size check
        } else if (totalFilesSize + file.size > this.total_files_size *(1024 ** 2)) { // 50MB total cap
          this.notify.showError(`Total upload size cannot exceed ${this.total_files_size}MB per subject for your current plan.`);
          break;
        // All checks passed
        } else {
          validFiles.push(file);
          totalFilesCount++;
          totalFilesSize += file.size;
        }
      };
    
      if (invalidFiles.length) {
        this.notify.showError(`Unsupported file types: ${invalidFiles.join(', ')}`);
      }
      if (largeFiles.length) {
        this.notify.showError(`Files too large for your current plan: ${largeFiles.join(", ")}`);
      }
      if (validFiles.length) {
        this.files = [...this.files, ...validFiles];
        this.notify.showSuccess(`${validFiles.length} file(s) added.`);
      }
    }
  }  

  removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
  }

  formatFileSize(file: File) {
    let size: any = file.size;
    let end = null;
    if (size >= (1024 ** 2)) {
      size /= (1024 ** 2);
      size = size.toFixed(3);
      end = 'MB';
    } else if (size >= 1024) {
      size /= 1024;
      size = size.toFixed(3);
      end = 'KB';
    } else {
      end = 'B';
    }
    return `${size} ${end}`;
  }

  ngOnInit(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        const subscriptionData: SubscriptionStatus | null = response.subscription;
        if (subscriptionData && subscriptionData.plan) {
          this.single_file_size = subscriptionData.plan.single_file_size || 3;
          this.total_files_size = subscriptionData.plan.subject_total_files_size || 10;
          this.max_file_count = subscriptionData.plan.subject_file_count || 5;
        }
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.message || "Failed to load subscription data. Please try again later.");
        this.cdr.detectChanges();
      }
    })

    // Fetch details of the subject if needed
    this.subjectService.getSubject(this.subjectId).subscribe({
      next: (response) => {
        this.subject = response.session;
        this.subjectName = this.subject.name || '';
        if (this.subject.status !== 'pending naming' && this.subject.status !== 'pending document upload') {
          this.uploadedDocs = true;
        }
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.message || 'Failed to load subject details. Please try again later.');
      }
    });
  }

  onSubmit() {
    this.loading = true;
  
    if (this.nameCtrl.invalid && this.subject.status === 'pending naming') {
      this.notify.showError('Valid subject name is required');
      this.loading = false;
      return;
    }
  
    if (this.files.length === 0 && !this.uploadedDocs) {
      this.notify.showError('At least one file must be uploaded');
      this.loading = false;
      return;
    }

    // Helper observable: only name the subject if its status requires it
    const nameSubjectIfPending$ = () =>
    iif(
      () => this.subject.status !== 'pending naming',
      of(null), // Already named, skip
      this.subjectService.nameSubject(this.subjectId, this.subjectName).pipe(
        tap(() => {
          this.subject.status = 'pending document upload';
        })
      )
    );

    // Helper observable: ingest documents if not already uploaded
    const ingestDocumentsIfNeeded$ = () =>
    iif(
      () => this.uploadedDocs,
      of(true), // Documents already uploaded, skip
      this.subjectService.ingestDocuments(this.subjectId, this.files).pipe(
        switchMap((res: any) => {
          if (res.warning) {
            // Fix lowDocs and docsCount mapping
            const lowDocs = res.documents
              .filter((doc: any) => doc.belowThreshold)
              .map((doc: any) => `"${doc.document.name}${doc.document.extension}"`);
            const docsCount = res.documents
              .filter((doc: any) => doc.belowThreshold)
              .map((doc: any) => doc.avgPageWordCount);

            // Show confirmation modal and return Observable<boolean>
            return this.confirmation.open({
              title: "Low Content Threshold Warning!",
              message: `Not enough text content was detected in the following documents: ${lowDocs.join(", ")}.
              There is a possibility the parser failed to read the documents properly. Do you still wish to proceed?`,
              okText: "Proceed",
              cancelText: "Go back"
            });
          } else {
            return of(true); // No warning, proceed
          }
        })
      )
    );

    // Helper observable: label documents
    const labelDocuments$ = () =>
    this.subjectService.labelDocuments(this.subjectId).pipe(
      tap(() => {
        this.notify.showSuccess("Topics successfully identified.");
        this.router.navigate([`/subject-create/${this.subjectId}/lesson-generation`]);
      })
    );

    // Main execution flow
    nameSubjectIfPending$().pipe(
    switchMap(() => ingestDocumentsIfNeeded$()),
    // Stop the chain if the result is false (user canceled warning)
    takeWhile(result => result === true),
    switchMap(() => { 
      this.notify.showSuccess("Successfully ingested documents. Identifying topics...");
      return labelDocuments$()
    }),
    catchError((res) => {
      this.notify.showError(res.error.message || 'Something went wrong. Please try again later.');
      return EMPTY;
    }),
    finalize(() => {
      this.loading = false;
      this.cdr.detectChanges();
    })
    ).subscribe();
  }
}
