import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule, NgModel } from '@angular/forms';
import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service'; // <-- Add this import
import { catchError, EMPTY, finalize, iif, of, switchMap, tap } from 'rxjs';
import { SubjectNameValidator } from '../../../shared/directives/subject-name-validator';

@Component({
  selector: 'app-naming-upload',
  imports: [Header, CreationStepTab, FormsModule, SubjectNameValidator],
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
  subjectService = inject(SubjectsService);
  notify = inject(NotificationService); // <-- Inject notification service
  allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'epub'];
  acceptString = this.allowedExtensions.map(ext => '.' + ext).join(', ')

  @ViewChild('nameCtrl') nameCtrl!: NgModel;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
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
        } else if (file.size > 20 * (1024 ** 2)) { // 20MB cap for now
          largeFiles.push(file.name);
        // Count check
        } else if (totalFilesCount == 15) {
          this.notify.showError("You can upload a maximum of 15 files per subject.");
          break;
        // Total size check
        } else if (totalFilesSize + file.size > 50 *(1024 ** 2)) { // 50MB total cap
          this.notify.showError("Total upload size cannot exceed 50MB per subject.");
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
        this.notify.showError(`Files too large: ${largeFiles.join(", ")}`);
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
    // Fetch details of the subject if needed
    this.subjectService.getSubject(this.subjectId).subscribe({
      next: (response) => {
        console.log(response);
        this.subject = response.session;
        this.subjectName = this.subject.name || '';
        if (this.subject.status !== 'pending naming' && this.subject.status !== 'pending document upload') {
          this.uploadedDocs = true;
        }
        this.cdr.detectChanges();
      },
      error: (res) => {
        console.error('Error fetching subject details:', res);
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
  
    console.log('Subject Name:', this.subjectName);
    console.log('Files:', this.files);
    console.log('Stage 0' + this.loading);
  
    // 👉 Decide whether to name subject or skip directly
    iif(
      () => this.subject.status === 'pending naming',
      // ✅ Case 1: Subject needs naming → call nameSubject first
      this.subjectService.nameSubject(this.subjectId, this.subjectName).pipe(
        tap((response) => {
          console.log('Stage 1 (naming)', this.loading, response);
          this.subject.status = 'pending document upload'; // Update status locally
        })
      ),
      // ✅ Case 2: Skip naming → just emit a dummy observable so chain continues
      of({ session: { id: this.subjectId } })
    ).pipe(
      switchMap(() =>
        iif(
          () => this.uploadedDocs,
          // ✅ Skip ingest → label only
          this.subjectService.labelDocuments(this.subjectId).pipe(
            tap((labelResponse) => {
              console.log('Stage 2 (skipped ingest)', this.loading, labelResponse);
              this.notify.showSuccess("Topics successfully identified.");
              this.router.navigate([`/subject-create/${this.subjectId}/topic-preferences`]);
            })
          ),
          // ✅ Ingest then label
          this.subjectService.ingestDocuments(this.subjectId, this.files).pipe(
            tap(() => {
              console.log('Stage 2 (ingest)', this.loading);
              this.subject.status = 'pending topic labelling'; // Update status locally
              this.uploadedDocs = true; // Prevent further uploads
              this.notify.showSuccess('Successfully ingested documents. Identifying topics...');
            }),
            switchMap(() =>
              this.subjectService.labelDocuments(this.subjectId).pipe(
                tap((labelResponse) => {
                  console.log('Stage 3 (label)', this.loading, labelResponse);
                  this.notify.showSuccess("Topics successfully identified.");
                  this.router.navigate([`/subject-create/${this.subjectId}/topic-preferences`]);
                })
              )
            )
          )
        )
      ),
      catchError((res) => {
        console.error('Error in subject creation flow:', res);
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
