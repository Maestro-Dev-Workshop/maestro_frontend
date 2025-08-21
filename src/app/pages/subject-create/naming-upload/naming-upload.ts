import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
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
    if (input.files) {
      this.addFiles(input.files);
    }
  }

  private addFiles(fileList: FileList) {
    this.files = [...this.files, ...Array.from(fileList)];
  }

  removeFile(file: File) {
    this.files = this.files.filter(f => f !== file);
  }

  onSubmit() {
    if (this.subjectName.trim() === '') {
      alert('Subject name is required');
      return;
    }
    if (this.files.length === 0) {
      alert('At least one file must be uploaded');
      return;
    }

    // Here you would typically send the data to the backend
    console.log('Subject Name:', this.subjectName);
    console.log('Files:', this.files);

    // Navigate to the next step or show success message
    this.router.navigate(['/subject-create/topic-preferences']);
  }
}
