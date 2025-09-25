import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule } from '@angular/forms';
import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service'; // <-- Add this import

@Component({
  selector: 'app-naming-upload',
  imports: [Header, CreationStepTab, FormsModule],
  templateUrl: './naming-upload.html',
  styleUrl: './naming-upload.css',
})
export class NamingUpload {
  subjectName = '';
  files: File[] = [];
  isDragging = false;
  loading = false;
  subjectService = inject(SubjectsService);
  notify = inject(NotificationService); // <-- Inject notification service

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

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
    const allowedExtensions = ['pdf', 'doc', 'docx', 'pptx'];
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    const largeFiles: string[] = [];
  
    Array.from(fileList).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
  
      if (!ext || !allowedExtensions.includes(ext)) {
        invalidFiles.push(file.name);
      } else if (file.size > 20_000_000) { // 20MB cap for now
        largeFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });
  
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

  removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
  }

  formatFileSize(file: File) {
    let size: any = file.size;
    let end = null;
    if (size >= 1_000_000) {
      size /= 1_000_000;
      size = size.toFixed(3);
      end = 'MB';
    } else if (size >= 1_000) {
      size /= 1_000;
      size = size.toFixed(3);
      end = 'KB';
    } else {
      end = 'B';
    }
    return `${size} ${end}`;
  }

  onSubmit() {
    this.loading = true;
    if (this.subjectName.trim() === '') {
      this.notify.showError('Subject name is required');
      this.loading = false;
      return;
    }
    if (this.files.length === 0) {
      this.notify.showError('At least one file must be uploaded');
      this.loading = false;
      return;
    }

    // Here you would typically send the data to the backend
    console.log('Subject Name:', this.subjectName);
    console.log('Files:', this.files);
    console.log('Stage 0' + this.loading);

    // Create subject
    this.subjectService.createSubject(this.subjectName).subscribe({
      next: (response) => {
        console.log('Stage 1' + this.loading);
        console.log(response);
        const sessionId = response.session.id;

        // Ingest documents
        this.subjectService.ingestDocuments(sessionId, this.files).subscribe({
          next: (ingestResponse) => {
            console.log(ingestResponse);
            console.log('Stage 2' + this.loading);
            this.notify.showSuccess('Sucessfully ingested documents. Identifying topics...');

            // Label documents with topics
            this.subjectService.labelDocuments(sessionId).subscribe({
              next: (labelResponse) => {
                console.log('Stage 3' + this.loading);
                console.log(labelResponse);
                this.notify.showSuccess("Topics sucessfully identified.")
                this.router.navigate([
                  `/subject-create/${sessionId}/topic-preferences`,
                ]);
                this.loading = false;
              },

              error: (err) => {
                this.loading = false;
                console.error('Error labeling documents:', err);
                this.notify.showError(
                  'Failed to label documents. Please try again later.'
                );
                this.loading = false;
                this.cdr.detectChanges();
              }
            });
          },

          error: (err) => {
            this.loading = false;
            console.error('Error ingesting documents:', err);
            this.notify.showError(
              'Failed to upload documents. Please try again later.'
            );
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },

      error: (err) => {
        this.loading = false;
        console.error('Error creating subject:', err);
        this.notify.showError(
          'Failed to create subject. Please try again later.'
        );
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
