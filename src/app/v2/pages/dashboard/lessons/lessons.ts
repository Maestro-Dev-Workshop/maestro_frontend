import { Component, inject, signal, OnInit, viewChild, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { Header } from '../../../shared/components/header/header';
import { StandardBtn } from '../../../shared/components/standard-btn/standard-btn';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { RatingModal } from '../../../../shared/components/rating-modal/rating-modal';
import { TutorialElement } from '../../../../shared/components/tutorial-element/tutorial-element';

import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmService } from '../../../../core/services/confirm';
import { SubjectsService } from '../../../../core/services/subjects.service';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { OnboardingService, OnboardingStep } from '../../../../core/services/onboarding.service';

import { SubjectStatus } from '../../../../core/models/subject-status.model';

@Component({
  selector: 'app-lessons',
  imports: [
    CommonModule,
    Header,
    DashboardSidebar,
    ThemeIconComponent,
    RatingModal,
    StandardBtn,
    TutorialElement
  ],
  templateUrl: './lessons.html',
  styleUrl: './lessons.css',
})
export class Lessons implements OnInit {
  private router = inject(Router);
  private notify = inject(NotificationService);
  private confirmation = inject(ConfirmService);
  private subjectsService = inject(SubjectsService);
  private subscriptionService = inject(SubscriptionService);
  private onboardingService = inject(OnboardingService)

  loadingLessons = signal(true);
  loadingAction = signal(false);
  lessons = signal<any[]>([]);
  subscriptionData = signal<any | null>(null);

  showRateModal = signal(false);
  selectedLesson = signal<any | null>(null);

  // Onboarding
  createButton = viewChild<ElementRef>('createLessonButton');
  onboardingFlow = 'lessons_page.first_lesson_creation'
  onboardingSteps: OnboardingStep[] = [];
  currentOnboardingStepIndex = signal(-1);
  currentOnboardingStep = computed(() =>
    this.onboardingSteps[this.currentOnboardingStepIndex()],
  );

  constructor() {
    this.onboardingSteps = [
      {
        title: 'Step Title',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.',
        object: this.createButton,
        tipPosition: 'bottom',
        tipAlignment: 'start',
        stepName: 'create_button'
      },
    ];
  }

  ngOnInit() {
    this.loadSubscriptionData();
    this.loadLessons();
    this.loadOnboardingStatus();
  }

  private loadSubscriptionData() {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.subscriptionData.set(response.subscription);
      },
      error: (res) => {
        this.notify.showError(
          res.error?.message || 'Failed to load subscription data.',
        );
      },
    });
  }

  private loadLessons() {
    this.loadingLessons.set(true);
    this.subjectsService.getAllSubjectsDetails().subscribe({
      next: (response: any) => {
        const mapped = (response.sessions || []).map((s: any) => ({
          id: s.session.id,
          title: s.session.name ?? '',
          completion: this.normalizeCompletion(s.session.completion),
          tags: s.extensions.map((ext: any) => ext.type == 'lesson' 
            ? (ext.configuration.cell_types.length > 1 ? 'Content Cells' : '')
            : ext.type).filter((tag: string) => tag),
          status: s.session.status ?? SubjectStatus.PENDING_NAMING,
        }));
        this.lessons.set(mapped);
        this.loadingLessons.set(false);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to load lessons.');
        this.loadingLessons.set(false);
      },
    });
  }

  private loadOnboardingStatus() {
    this.onboardingService.checkOnboardingStatus(this.onboardingFlow).subscribe({
      next: (response) => {
        if (!response.completed) {
          this.currentOnboardingStepIndex.set(response.current_step)
        }
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to load onboarding status.')
      }
    })
  }

  normalizeCompletion(value: any): number {
    if (value === null || value === undefined) return 0;
    const n = Number(value);
    if (isNaN(n)) return 0;
    if (n >= 0 && n <= 1) return Math.round(n * 100);
    return Math.round(Math.max(0, Math.min(100, n)));
  }

  createNewLesson(): void {
    this.loadingAction.set(true);
    this.subjectsService.createSubject().subscribe({
      next: (response: any) => {
        const newSubjectId = response.session.id;
        this.router.navigateByUrl(`/v2/lesson-generation/${newSubjectId}`);
        this.loadingAction.set(false);
      },
      error: (res) => {
        this.notify.showError(
          res.error?.message || 'Failed to create a new subject.',
        );
        this.loadingAction.set(false);
      },
    });
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
          this.subjectsService.deleteSubject(lesson.id).subscribe({
            next: () => {
              this.notify.showSuccess('Lesson deleted successfully.');
              this.lessons.update((list) =>
                list.filter((l) => l.id !== lesson.id),
              );
            },
            error: (res) =>
              this.notify.showError(
                res.error?.message || 'Failed to delete lesson.',
              ),
          });
        }
      });
  }

  goToLesson(lesson: any): void {
    if (this.loadingAction()) return;
    this.loadingAction.set(true);
    const status = lesson.status;
    if (
      status === SubjectStatus.PENDING_NAMING ||
      status === SubjectStatus.PENDING_DOCUMENT_UPLOAD ||
      status === SubjectStatus.PENDING_TOPIC_LABELLING
    ) {
      this.router.navigate([`/v2/lesson-generation/${lesson.id}`]);
    } else if (
      status === SubjectStatus.PENDING_TOPIC_SELECTION ||
      status === SubjectStatus.PENDING_EXTENSION_CONFIG ||
      status === SubjectStatus.PENDING_LESSON_GENERATION
    ) {
      this.router.navigate([`/v2/lesson-generation/${lesson.id}`]);
    } else {
      this.router.navigate([`/v2/lesson/${lesson.id}`]);
    }
    this.loadingAction.set(false);
  }

  openRateModal(lesson: any): void {
    this.selectedLesson.set(lesson);
    this.showRateModal.set(true);
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

  // Onboarding helpers
  getTutorialObjectPosition() {
    if (!this.currentOnboardingStep()) return { top: 0, left: 0, bottom: 0, right: 0 };
    return this.onboardingService.getObjectPosition(this.currentOnboardingStep());
  }

  cycleOnboarding(): void {
    this.onboardingService.updateOnboardingStatus(this.onboardingFlow, this.currentOnboardingStep().stepName).subscribe({
      next: (response) => {},
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to update onboarding status.')
      }
    })
    this.currentOnboardingStepIndex.update((num) => num + 1)
  }
}
