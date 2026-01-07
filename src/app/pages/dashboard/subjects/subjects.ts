import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectModel } from '../../../core/models/subject.model';
import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { SubscriptionStatus } from '../../../core/models/subscription.model';
import { ConfirmService } from '../../../core/services/confirm';

@Component({
  selector: 'app-subjects',
  imports: [Header, CommonModule],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css'
})
export class Subjects implements OnInit {
  // old_subjects: SubjectModel[] = [
  //   {
  //     "id": "sj2nd-2dkap-uamds",
  //     "name": "Mathematics",
  //     "created_at": new Date("2023-10-01T12:00:00Z"),
  //     "status": "In Progress",
  //     "completion": 30,
  //   },
  //   {
  //     "id": "sj2nd-2dkap-uamds",
  //     "name": "Science",
  //     "created_at": new Date("2023-10-01T12:00:00Z"),
  //     "status": "Completed",
  //     "completion": 100,
  //   },
  //   {
  //     "id": "sj2nd-2dkap-uamds",
  //     "name": "History",
  //     "created_at": new Date("2023-10-01T12:00:00Z"),
  //     "status": "Not Started",
  //     "completion": 0,
  //   },
  //   {
  //     "id": "sj2nd-2dkap-uamds",
  //     "name": "Literature",
  //     "created_at": new Date("2023-10-01T12:00:00Z"),
  //     "status": "In Progress",
  //     "completion": 50,
  //   }
  // ];
  loadingSubjects = true;
  loadingCreate = false;
  subjects: SubjectModel[] = [];
  subjectService = inject(SubjectsService)
  subscriptionService = inject(SubscriptionService)
  notify = inject(NotificationService);
  confirmation = inject(ConfirmService);
  rightClickSubject : SubjectModel | null = null;
  showDeleteConfirmation = false;
  subscriptionData: SubscriptionStatus | null = null;
  popup = {
    x: 0,
    y: 0,
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.subscriptionData = response.subscription;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.displayMessage || "Failed to load subscription data. Please try again later.");
        this.cdr.detectChanges();
      }
    })

    this.subjectService.getAllSubjects().subscribe({
      next: (response) => {
        this.subjects = response.sessions;
        console.log(this.subjects)
        this.loadingSubjects = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.displayMessage || "Failed to load subjects. Please try again later.");
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

    // Check subscription limits
    if (
      (this.subscriptionData?.subjects_created_this_month ?? 0) >=
      (this.subscriptionData?.plan?.monthly_subject_creations ?? Infinity)
    ) {
      this.notify.showError("You have reached the monthly subject creation limit for your current subscription plan.");
      this.loadingCreate = false;
      this.cdr.detectChanges();
      return;
    }
    if (
      this.subjects.length >= 
      (this.subscriptionData?.plan?.subject_capacity ?? Infinity)
    ) {
      this.notify.showError("You have reached the total subject limit for your current subscription plan.");
      this.loadingCreate = false;
      this.cdr.detectChanges();
      return;
    }

    this.subjectService.createSubject().subscribe({
      next: (response) => {
        const newSubjectId = response.session.id;
        this.router.navigate([`/subject-create/${newSubjectId}/naming-upload`]);
        this.loadingCreate = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.displayMessage || "Failed to create a new subject. Please try again later.");
        this.loadingCreate = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubjectRightClick(event: MouseEvent, subject: SubjectModel) {
    event.preventDefault();
    if (this.rightClickSubject?.id === subject.id) {
      this.rightClickSubject = null;
      return;
    } else {
      this.rightClickSubject = subject;
      this.popup.x = event.clientX;
      this.popup.y = event.clientY;
    }
  }

  openDelete() { 
    this.confirmation.open({
      title: "Delete Subject",
      message: `Are you sure you want to delete the subject "${this.rightClickSubject?.name}"? This action cannot be undone.`,
      okText: "Delete",
      cancelText: "Cancel"
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.deleteSubject();
      } else {
        this.rightClickSubject = null;
      }
    });
  }
  
  deleteSubject() {
    if (!this.rightClickSubject) {
      return;
    }
    this.subjectService.deleteSubject(this.rightClickSubject.id).subscribe({
      next: (response) => {
        this.notify.showSuccess("Subject deleted successfully.");
        this.subjects = this.subjects.filter(subj => subj.id !== this.rightClickSubject?.id);
        this.rightClickSubject = null;
        this.showDeleteConfirmation = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.displayMessage || "Failed to delete subject. Please try again later.");
        this.rightClickSubject = null;
        this.showDeleteConfirmation = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigateSubject(subject: SubjectModel) {
    if (this.rightClickSubject) {
      this.rightClickSubject = null;
      return;
    }
    if (subject.status === 'pending naming' || subject.status === 'pending document upload' || subject.status === 'pending topic labelling') {
      this.router.navigate([`/subject-create/${subject.id}/naming-upload`])
    } else if (subject.status === 'pending topic selection' || subject.status === 'pending extension configuration' || subject.status === 'pending lesson generation') {
      this.router.navigate([`/subject-create/${subject.id}/lesson-generation`])
    } else {
      this.router.navigate([`/lesson/${subject.id}`])
    }
    // if (subject.status === 'pending naming' || subject.status === 'pending document upload' || subject.status === 'pending topic labelling') {
    //   this.router.navigate([`/subject-create/${subject.id}/naming-upload`])
    // } else if (subject.status === 'pending topic selection' || subject.status === 'pending lesson generation') {
    //   this.router.navigate([`/subject-create/${subject.id}/topic-preferences`])
    // } else if (subject.status === 'pending practice question generation') {
    //   this.router.navigate([`/subject-create/${subject.id}/question-settings`])
    // } else {
    //   this.router.navigate([`/lesson/${subject.id}`])
    // }
  }
}
