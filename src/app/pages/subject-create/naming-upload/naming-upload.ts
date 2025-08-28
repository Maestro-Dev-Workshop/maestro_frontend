import { Component, inject } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule } from '@angular/forms';
import { SubjectsService } from '../../../core/services/subjects.service';

@Component({
  selector: 'app-naming-upload',
  imports: [Header, CreationStepTab, FormsModule],
  templateUrl: './naming-upload.html',
  styleUrl: './naming-upload.css'
})
export class NamingUpload {
  subjectName = '';
  files: File[] = [];
  isDragging = false;
  loading = false;
  subjectService = inject(SubjectsService)

  constructor(private router: Router) {}

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
    this.files = [...this.files, ...Array.from(fileList)];
  }

  removeFile(file: File) {
    this.files = this.files.filter(f => f !== file);
  }

  formatFileSize(file: File) {
    let size: any = file.size
    let end = null
    if (size >= 1_000_000) {
      size /= 1_000_000
      size = size.toFixed(3)
      end = 'MB'
    } else if (size >= 1_000) {
      size /= 1_000
      size = size.toFixed(3)
      end = 'KB'
    } else {
      end = 'B'
    }
    return `${size} ${end}`
  }

  onSubmit() {
    this.loading = true;
    if (this.subjectName.trim() === '') {
      alert('Subject name is required');
      this.loading = false;
      return;
    }
    if (this.files.length === 0) {
      alert('At least one file must be uploaded');
      this.loading = false;
      return;
    }

    // Here you would typically send the data to the backend
    console.log('Subject Name:', this.subjectName);
    console.log('Files:', this.files);
    console.log('Stage 0' + this.loading)
    
    // Create subject
    this.subjectService.createSubject(this.subjectName).subscribe({
      next: (response) => {
        console.log('Stage 1' + this.loading)
        console.log(response)
        const sessionId = response.session.id;
        
        // Ingest documents
        this.subjectService.ingestDocuments(sessionId, this.files).subscribe({
          next: (ingestResponse) => {
            console.log(ingestResponse)
            console.log('Stage 2' + this.loading)
            
            // Label documents with topics
            this.subjectService.labelDocuments(sessionId).subscribe({
              next: (labelResponse) => {
                console.log('Stage 3' + this.loading)
                console.log(labelResponse)
                this.router.navigate([`/subject-create/${sessionId}/topic-preferences`]);
                this.loading = false;
              },
              
              error: (err) => {
                console.error('Error labeling documents:', err);
                alert("Failed to label documents. Please try again later.");
                this.loading = false;
              }
            });
          },

          error: (err) => {
            console.error('Error ingesting documents:', err);
            alert("Failed to upload documents. Please try again later.");
            this.loading = false;
          }
        });
      },

      error: (err) => {
        console.error('Error creating subject:', err);
        alert("Failed to create subject. Please try again later.");
        this.loading = false;
      }
    });
  }
}
