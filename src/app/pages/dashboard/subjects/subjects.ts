import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  viewChild,
  ElementRef,
  signal,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Header } from '../../../shared/components/header/header';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import { TutorialElement } from '../../../shared/components/tutorial-element/tutorial-element';
import { SubjectCard, SubjectCardData } from '../../../shared/components/subject-card/subject-card';
import { RatingModal } from '../../../shared/components/rating-modal/rating-modal';
import { ContextMenu, ContextMenuItem } from '../../../shared/components/context-menu/context-menu';

import { SubjectModel } from '../../../core/models/subject.model';
import { SubjectStatus } from '../../../core/models/subject-status.model';
import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { SubscriptionStatus } from '../../../core/models/subscription.model';
import { ConfirmService } from '../../../core/services/confirm';
import { OnboardingService, OnboardingStep } from '../../../core/services/onboarding.service';
import { SubjectResponse, ExtensionModel } from '../../../core/models/api-response.model';
import { TopicModel } from '../../../core/models/topic.model';

/** Dashboard subject data with computed fields */
interface DashboardSubject {
  id: string;
  name: string;
  created_at: Date;
  status: SubjectStatus;
  completion: number;
  topics: TopicModel[];
  extensions: ExtensionModel[];
  pinned?: boolean;
  tags?: string[];
}

/** Response from getAllSubjectsDetails */
interface SubjectsListResponse {
  sessions: Array<{
    session: {
      id: string;
      name: string;
      created_at: string;
      status: SubjectStatus;
      completion: number;
    };
    topics: TopicModel[];
    extensions: ExtensionModel[];
  }>;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    Header,
    CommonModule,
    FormsModule,
    ThemeIconComponent,
    TutorialElement,
    SubjectCard,
    RatingModal,
    ContextMenu,
  ],
  templateUrl: './subjects.html',
  styleUrls: ['./subjects.css'],
})
export class Subjects implements OnInit, OnDestroy {
  private router = inject(Router);
  private subjectService = inject(SubjectsService);
  private subscriptionService = inject(SubscriptionService);
  private notify = inject(NotificationService);
  private confirmation = inject(ConfirmService);
  private onboardingService = inject(OnboardingService);

  // Expose SubjectStatus enum for template usage
  readonly SubjectStatus = SubjectStatus;

  // State as signals
  loadingSubjects = signal(true);
  loadingAction = signal(false);
  subjects = signal<DashboardSubject[]>([]);
  subscriptionData = signal<SubscriptionStatus | null>(null);
  rightClickSubject = signal<DashboardSubject | null>(null);
  showFeedbackBanner = signal(true);
  popup = signal({ x: 0, y: 0 });

  // Rating modal state
  showRateModal = signal(false);

  // Context menu items
  readonly contextMenuItems: ContextMenuItem[] = [
    { id: 'delete', label: 'Delete', icon: 'delete-subject-icon' },
    { id: 'rate', label: 'Rate', icon: 'rate-icon' },
  ];

  // Circle constants
  readonly CIRCLE_RADIUS = 17;
  readonly CIRCLE_CIRCUMFERENCE = 2 * Math.PI * this.CIRCLE_RADIUS;

  // Onboarding
  createButton = viewChild<ElementRef>('createSubjectButton');
  onboardingSteps: OnboardingStep[] = [];
  currentOnboardingStep = computed(() => this.onboardingService.currentStepIndex());

  private globalClickHandler = () => {
    if (this.rightClickSubject()) {
      this.rightClickSubject.set(null);
    }
  };

  constructor() {
    this.onboardingSteps = [
      {
        title: 'New Subject',
        text: 'Click here to create a new subject and start your learning journey.',
        object: this.createButton,
        tipPosition: 'bottom',
        tipAlignment: 'start',
      },
    ];
  }

  ngOnInit(): void {
    this.loadSubscriptionData();
    this.loadSubjects();
    this.checkFeedbackBanner();
    window.addEventListener('click', this.globalClickHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.globalClickHandler);
  }

  private loadSubscriptionData(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.subscriptionData.set(response.subscription);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to load subscription data.');
      },
    });
  }

  private loadSubjects(): void {
    this.subjectService.getAllSubjectsDetails().subscribe({
      next: (response: SubjectsListResponse) => {
        const mapped: DashboardSubject[] = (response.sessions || []).map((s) => ({
          id: s.session.id,
          name: s.session.name ?? '',
          created_at: s.session.created_at ? new Date(s.session.created_at) : new Date(),
          status: s.session.status ?? SubjectStatus.PENDING_NAMING,
          completion: this.normalizeCompletion(s.session.completion),
          topics: s.topics.filter((t) => t.selected),
          extensions: s.extensions.filter((e) => e.type !== 'lesson'),
        }));
        this.subjects.set(mapped);

        if (mapped.length === 0) {
          this.onboardingService.startOnboarding();
        }
        this.loadingSubjects.set(false);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to load subjects.');
        this.loadingSubjects.set(false);
      },
    });
  }

  private checkFeedbackBanner(): void {
    const dismissed = sessionStorage.getItem('maestro-feedback-banner-dismissed');
    this.showFeedbackBanner.set(dismissed !== 'true');
  }

  openFeedback(): void {
    sessionStorage.setItem('maestro-feedback-banner-dismissed', 'true');
    this.showFeedbackBanner.set(false);
    this.router.navigate(['/feedback']);
  }

  closeFeedbackBanner(): void {
    sessionStorage.setItem('maestro-feedback-banner-dismissed', 'true');
    this.showFeedbackBanner.set(false);
  }

  trackById(index: number, item: SubjectModel): string {
    return item.id;
  }

  getExtensionsString(subject: DashboardSubject): string {
    return subject.extensions.map((ext) => ext.type).join(', ');
  }

  normalizeCompletion(value: number | null | undefined): number {
    if (value === null || value === undefined) return 0;
    const n = Number(value);
    if (isNaN(n)) return 0;
    if (n >= 0 && n <= 1) return Math.round(n * 100);
    return Math.round(Math.max(0, Math.min(100, n)));
  }

  displayCompletion(value?: number): number {
    return this.normalizeCompletion(value);
  }

  getStatusColours(status: SubjectStatus | string | undefined): string {
    if (!status) return 'text-red-600 bg-red-50';
    if (status === SubjectStatus.COMPLETED) return 'text-green-600 bg-green-50';
    if (status === SubjectStatus.IN_PROGRESS) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  }

  createNewSubject(): void {
    this.loadingAction.set(true);
    const subscription = this.subscriptionData();

    if (
      (subscription?.subjects_created_this_month ?? 0) >=
      (subscription?.plan?.monthly_subject_creations ?? Infinity)
    ) {
      this.notify.showError('You have reached the monthly subject creation limit.');
      this.loadingAction.set(false);
      return;
    }

    if (this.subjects().length >= (subscription?.plan?.subject_capacity ?? Infinity)) {
      this.notify.showError('You have reached the total subject limit.');
      this.loadingAction.set(false);
      return;
    }

    this.subjectService.createSubject().subscribe({
      next: (response: SubjectResponse) => {
        const newSubjectId = response.session.id;
        const isBeginner = this.subjects().length === 0;
        this.router.navigateByUrl(`/subject-create/${newSubjectId}/naming-upload`, {
          state: { beginner: isBeginner },
        });
        this.loadingAction.set(false);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to create a new subject.');
        this.loadingAction.set(false);
      },
    });
  }

  onSubjectRightClick(event: MouseEvent, subject: DashboardSubject): void {
    if (this.loadingAction()) return;
    event.preventDefault();
    event.stopPropagation();

    if (this.rightClickSubject()?.id === subject.id) {
      this.rightClickSubject.set(null);
      return;
    }

    this.rightClickSubject.set(subject);

    const padding = 8;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    let x = event.clientX;
    let y = event.clientY;

    const estimatedWidth = 200;
    const estimatedHeight = 120;
    if (x + estimatedWidth + padding > viewportW) {
      x = Math.max(padding, viewportW - estimatedWidth - padding);
    }
    if (y + estimatedHeight + padding > viewportH) {
      y = Math.max(padding, viewportH - estimatedHeight - padding);
    }

    this.popup.set({ x, y });
  }

  openDelete(): void {
    const subject = this.rightClickSubject();
    this.confirmation
      .open({
        title: 'Delete Subject',
        message: `Are you sure you want to delete "${subject?.name}"? This action cannot be undone.`,
        okText: 'Delete',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteSubject();
        } else {
          this.rightClickSubject.set(null);
        }
      });
  }

  openDeleteFromIcon(event: MouseEvent, subject: SubjectModel): void {
    event.stopPropagation();
    this.rightClickSubject.set(subject);
    this.openDelete();
  }

  deleteSubject(): void {
    const subject = this.rightClickSubject();
    if (!subject) return;

    this.subjectService.deleteSubject(subject.id).subscribe({
      next: () => {
        this.notify.showSuccess('Subject deleted successfully.');
        this.subjects.update((list) => list.filter((s) => s.id !== subject.id));
        this.rightClickSubject.set(null);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to delete subject.');
        this.rightClickSubject.set(null);
      },
    });
  }

  navigateSubject(subject: DashboardSubject | SubjectModel): void {
    if (this.loadingAction()) return;

    if (this.rightClickSubject()) {
      this.rightClickSubject.set(null);
      return;
    }

    this.loadingAction.set(true);
    const status = subject.status;

    if (
      status === SubjectStatus.PENDING_NAMING ||
      status === SubjectStatus.PENDING_DOCUMENT_UPLOAD ||
      status === SubjectStatus.PENDING_TOPIC_LABELLING
    ) {
      this.router.navigate([`/subject-create/${subject.id}/naming-upload`]);
    } else if (
      status === SubjectStatus.PENDING_TOPIC_SELECTION ||
      status === SubjectStatus.PENDING_EXTENSION_CONFIG ||
      status === SubjectStatus.PENDING_LESSON_GENERATION
    ) {
      this.router.navigate([`/subject-create/${subject.id}/lesson-generation`]);
    } else {
      this.router.navigate([`/lesson/${subject.id}`]);
    }
    this.loadingAction.set(false);
  }

  continueSubject(event: MouseEvent, subject: SubjectModel): void {
    event.stopPropagation();
    this.navigateSubject(subject);
  }

  togglePin(event: MouseEvent, subject: SubjectModel): void {
    event.stopPropagation();
    this.subjects.update((list) =>
      list.map((s) => (s.id === subject.id ? { ...s, pinned: !s.pinned } : s))
    );
  }

  openMoreMenu(event: MouseEvent, subject: SubjectModel): void {
    event.stopPropagation();
    this.notify.showInfo(`More options for "${subject.name || 'Untitled'}"`);
  }

  // Rating modal methods
  openRateModal(): void {
    this.showRateModal.set(true);
  }

  closeRateModal(): void {
    this.showRateModal.set(false);
    this.rightClickSubject.set(null);
  }

  onRatingSubmit(data: { rating: number; feedback: string }): void {
    const subject = this.rightClickSubject();
    if (!subject) {
      this.notify.showError('No subject selected for rating.');
      this.closeRateModal();
      return;
    }

    if (data.rating < 1) {
      this.notify.showError('Select a valid rating.');
      this.closeRateModal();
      return;
    }

    const payload = {
      subjectId: subject.id,
      rating: data.rating,
      feedback: data.feedback,
    };

    const rateCall =
      (this.subjectService as any).rateSubject?.(payload) ??
      (this.subjectService as any).submitFeedback?.(subject.id, payload.rating, payload.feedback);

    if (!rateCall) {
      this.notify.showSuccess('Thanks for your feedback.');
      this.closeRateModal();
      return;
    }

    rateCall.subscribe({
      next: () => {
        this.notify.showSuccess('Thanks for your feedback.');
        this.closeRateModal();
      },
      error: (res: { error?: { message?: string } }) => {
        this.notify.showError(res?.error?.message || 'Failed to submit feedback.');
      },
    });
  }

  // Context menu handler
  onContextMenuItemClick(itemId: string): void {
    if (itemId === 'delete') {
      this.openDelete();
    } else if (itemId === 'rate') {
      this.openRateModal();
    }
    // Note: don't reset rightClickSubject here - delete/rate modal needs it
  }

  // Subject card event handlers
  onSubjectCardClick(subject: SubjectCardData): void {
    this.navigateSubject(subject as SubjectModel);
  }

  onSubjectCardContextMenu(event: { event: MouseEvent; subject: SubjectCardData }): void {
    this.onSubjectRightClick(event.event, event.subject);
  }

  onSubjectCardContinue(event: { event: MouseEvent; subject: SubjectCardData }): void {
    this.continueSubject(event.event, event.subject as SubjectModel);
  }

  getDisplayTags(subject: SubjectModel): string[] {
    const tags = (subject as any).tags ?? [];
    const max = 4;
    if (tags.length <= max) return tags;
    const visible = tags.slice(0, max);
    visible.push(`+${tags.length - max}`);
    return visible;
  }

  getCircleDashOffset(completion?: number): number {
    const c = this.normalizeCompletion(completion);
    return this.CIRCLE_CIRCUMFERENCE * (1 - c / 100);
  }

  // Onboarding helpers (delegated to service)
  getTutorialObjectPosition(stepIndex: number) {
    const step = this.onboardingSteps[stepIndex];
    if (!step) return { top: 0, left: 0, bottom: 0, right: 0 };
    return this.onboardingService.getObjectPosition(step);
  }

  cycleOnboarding(): void {
    this.onboardingService.nextStep();
  }
}
