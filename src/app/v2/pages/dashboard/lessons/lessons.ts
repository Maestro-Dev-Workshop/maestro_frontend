import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { RatingModal } from '../../../../shared/components/rating-modal/rating-modal';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmService } from '../../../../core/services/confirm';

@Component({
  selector: 'app-lessons',
  imports: [
    CommonModule,
    Header,
    DashboardSidebar,
    ThemeIconComponent,
    RatingModal,
  ],
  templateUrl: './lessons.html',
  styleUrl: './lessons.css',
})
export class Lessons {
  private router = inject(Router);
  private notify = inject(NotificationService);
  private confirmation = inject(ConfirmService);

  lessons = signal([
    {
      id: 1,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 2,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 3,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 4,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 5,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 6,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 7,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 8,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 9,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
    {
      id: 10,
      title: 'The Design of Everyday Things',
      tags: ['Design', 'Development'],
      completion: 72,
    },
  ]);

  showRateModal = signal(false);
  selectedLesson = signal<any | null>(null);

  createNewLesson(): void {
    this.router.navigate(['/v2/lessons/new']);
  }


  deleteLesson(lesson: any): void {
    this.confirmation
      .open({
        title: 'Delete Lesson',
        message: `Are you sure you want to delete "${lesson.title}"? This action cannot be undone.`,
        okText: 'Delete',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          // Call API to delete here
          this.notify.showSuccess('Lesson deleted successfully.');
          this.lessons.update((list) => list.filter((l) => l.id !== lesson.id));
        }
      });
  }

  // Heart Icon: Opens Rating Modal
  openRateModal(lesson: any): void {
    this.selectedLesson.set(lesson);
    this.showRateModal.set(true);
  }

  // Continue Button: Navigate to the lesson page
  goToLesson(lesson: any): void {
    // Route is /v2/lesson/:subjectId
    this.router.navigate(['/v2/lesson', lesson.id]);
  }

  closeRateModal(): void {
    this.showRateModal.set(false);
    this.selectedLesson.set(null);
  }

  onRatingSubmit(data: { rating: number; feedback: string }): void {
    const lesson = this.selectedLesson();
    if (!lesson) return;

    this.notify.showSuccess('Thanks for your feedback.');
    this.closeRateModal();
  }
}
