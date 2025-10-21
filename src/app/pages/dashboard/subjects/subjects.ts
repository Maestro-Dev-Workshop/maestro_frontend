import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectModel } from '../../../core/models/subject.model';
import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-subjects',
  imports: [Header, CommonModule],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css'
})
export class Subjects implements OnInit {
  old_subjects: SubjectModel[] = [
    {
      "id": "sj2nd-2dkap-uamds",
      "name": "Mathematics",
      "created_at": new Date("2023-10-01T12:00:00Z"),
      "status": "In Progress",
      "completion": 30,
    },
    {
      "id": "sj2nd-2dkap-uamds",
      "name": "Science",
      "created_at": new Date("2023-10-01T12:00:00Z"),
      "status": "Completed",
      "completion": 100,
    },
    {
      "id": "sj2nd-2dkap-uamds",
      "name": "History",
      "created_at": new Date("2023-10-01T12:00:00Z"),
      "status": "Not Started",
      "completion": 0,
    },
    {
      "id": "sj2nd-2dkap-uamds",
      "name": "Literature",
      "created_at": new Date("2023-10-01T12:00:00Z"),
      "status": "In Progress",
      "completion": 50,
    }
  ];
  loadingSubjects = true;
  loadingCreate = false;
  subjects: SubjectModel[] = [];
  subjectService = inject(SubjectsService)
  notify = inject(NotificationService);

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (response) => {
        console.log(response)
        this.subjects = response.sessions;
        console.log(this.subjects)
        this.loadingSubjects = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        console.error('Error fetching subjects:', res);
        this.notify.showError(res.error.message || "Failed to load subjects. Please try again later.");
        this.loadingSubjects = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColours(status: string): string {
    if (status.toLocaleLowerCase() == "completed") {
      return "text-green-600 bg-green-50";
    } else if (status.toLocaleLowerCase() == "in progress") {
      return "text-yellow-600 bg-yellow-50";
    } else {
      return "text-red-600 bg-red-50";
    }
  }

  createNewSubject() {
    this.loadingCreate = true;
    this.subjectService.createSubject().subscribe({
      next: (response) => {
        const newSubjectId = response.session.id;
        this.router.navigate([`/subject-create/${newSubjectId}/naming-upload`]);
        this.loadingCreate = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        console.error('Error creating subject:', res);
        this.notify.showError(res.error.message || "Failed to create a new subject. Please try again later.");
        this.loadingCreate = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigateSubject(subject: SubjectModel) {
    if (subject.status === 'pending naming' || subject.status === 'pending document upload' || subject.status === 'pending topic labelling') {
      this.router.navigate([`/subject-create/${subject.id}/naming-upload`])
    } else if (subject.status === 'pending topic selection' || subject.status === 'pending lesson generation') {
      this.router.navigate([`/subject-create/${subject.id}/topic-preferences`])
    } else if (subject.status === 'pending practice question generation') {
      this.router.navigate([`/subject-create/${subject.id}/question-settings`])
    } else {
      this.router.navigate([`/lesson/${subject.id}`])
    }
  }
}
