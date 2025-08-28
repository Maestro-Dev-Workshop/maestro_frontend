import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectModel } from '../../../core/models/subject.model';
import { SubjectsService } from '../../../core/services/subjects.service';

@Component({
  selector: 'app-subjects',
  imports: [Header, RouterLink, CommonModule],
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
  subjects: SubjectModel[] = [];
  subjectService = inject(SubjectsService)

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (response) => {
        console.log(response)
        this.subjects = response.sessions;
        console.log(this.subjects)
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching subjects:', err);
        alert("Failed to load subjects. Please try again later.");
      }
    });
  }

  navigateSubject(subject: SubjectModel) {
    if (subject.status === 'pending document upload' || subject.status === 'pending topic labelling') {
      this.router.navigate(['/subject-create/naming-upload'])
    } else if (subject.status === 'pending topic selection' || subject.status === 'pending lesson generation') {
      this.router.navigate([`/subject-create/${subject.id}/topic-preferences`])
    } else if (subject.status === 'pending practice question generation') {
      this.router.navigate([`/subject-create/${subject.id}/question-settings`])
    } else {
      this.router.navigate([`/lesson/${subject.id}`])
    }
  }
}
