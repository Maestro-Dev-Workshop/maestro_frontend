import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectModel } from '../../../core/models/subject.model';
import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { SubscriptionStatus } from '../../../core/models/subscription.model';
import { ConfirmService } from '../../../core/services/confirm';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [Header, CommonModule, FormsModule, ThemeIconComponent],
  templateUrl: './subjects.html',
  styleUrls: ['./subjects.css'],
})
export class Subjects implements OnInit, OnDestroy {
  loadingSubjects = true;
  loadingAction = false;
  subjects: any[] = [];
  subjectService = inject(SubjectsService);
  subscriptionService = inject(SubscriptionService);
  notify = inject(NotificationService);
  confirmation = inject(ConfirmService);
  rightClickSubject: SubjectModel | null = null;
  showDeleteConfirmation = false;
  FEEDBACK_BANNER_KEY = 'maestro-feedback-banner-dismissed';
  showFeedbackBanner = true;
  subscriptionData: SubscriptionStatus | null = null;
  popup = { x: 0, y: 0 };

  // Rating modal state
  showRateModal = false;
  rating = 0;
  ratingFeedback = '';
  ratingDescriptions = [
    'Confusing/Inaccurate',
    'Hard to Follow',
    'Okay but not Helpful',
    'Clear and Helpful',
    'Excellent',
  ];

  // Circle constants (r = 15)
  readonly CIRCLE_RADIUS = 17;
  readonly CIRCLE_CIRCUMFERENCE = 2 * Math.PI * this.CIRCLE_RADIUS; // ~94.248

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.subscriptionData = response.subscription;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(
          res.error?.displayMessage ||
            'Failed to load subscription data. Please try again later.'
        );
        this.cdr.detectChanges();
      },
    });

    this.showFeedbackBanner = true;
    const dismissed = sessionStorage.getItem(
      'maestro-feedback-banner-dismissed'
    );
    this.showFeedbackBanner = dismissed !== 'true';

    this.subjectService.getAllSubjectsDetails().subscribe({
      next: (response: any) => {
        // Map backend response into SubjectModel and preserve optional UI fields
        this.subjects = (response.sessions || []).map((s: any) => ({
          id: s.session.id,
          name: s.session.name ?? '',
          created_at: s.session.created_at ? new Date(s.created_at) : new Date(),
          status: s.session.status ?? 'pending naming',
          // Normalize completion to 0..100 (handles 0..1 or 0..100)
          completion: this.normalizeCompletion(s.session.completion),
          // preserve any UI-only fields if present (tags, pinned, topicCount)
          topics: s.topics.filter((t: any) => t.selected),
          extensions: s.extensions.filter((e: any) => e.type !== 'lesson'),
        }));
        this.loadingSubjects = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(
          res.error?.displayMessage ||
            'Failed to load subjects. Please try again later.'
        );
        this.loadingSubjects = false;
        this.cdr.detectChanges();
      },
    });

    // Close contextual popup on global click
    window.addEventListener('click', this.globalClickHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.globalClickHandler);
  }

  openFeedback() {
  sessionStorage.setItem('maestro-feedback-banner-dismissed', 'true');
  this.showFeedbackBanner = false;

  // navigate or open modal
  this.router.navigate(['/feedback']);
}


  closeFeedbackBanner() {
    sessionStorage.setItem('maestro-feedback-banner-dismissed', 'true');
    this.showFeedbackBanner = false;
  }

  globalClickHandler = () => {
    if (this.rightClickSubject) {
      this.rightClickSubject = null;
      this.cdr.detectChanges();
    }
  };

  trackById(index: number, item: SubjectModel) {
    return item.id;
  }

  getExtensionsString(subject: any) {
    return subject.extensions.map(((ext: any) => ext.type)).join(', ');
  }

  /**
   * Normalize completion value to 0..100.
   * Accepts:
   *  - undefined/null -> 0
   *  - 0..1 (fraction) -> multiply by 100
   *  - 0..100 (percentage) -> clamp
   */
  normalizeCompletion(value: any): number {
    if (value === null || value === undefined) return 0;
    const n = Number(value);
    if (isNaN(n)) return 0;
    if (n >= 0 && n <= 1) return Math.round(n * 100);
    return Math.round(Math.max(0, Math.min(100, n)));
  }

  displayCompletion(value?: number): number {
    return this.normalizeCompletion(value);
  }

  getStatusColours(status: string | undefined): string {
    if (!status) return 'text-red-600 bg-red-50';
    const s = status.toLocaleLowerCase();
    if (s === 'completed') return 'text-green-600 bg-green-50';
    if (s === 'in progress') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  }

  createNewSubject() {
    this.loadingAction = true;

    if (
      (this.subscriptionData?.subjects_created_this_month ?? 0) >=
      (this.subscriptionData?.plan?.monthly_subject_creations ?? Infinity)
    ) {
      this.notify.showError(
        'You have reached the monthly subject creation limit for your current subscription plan.'
      );
      this.loadingAction = false;
      this.cdr.detectChanges();
      return;
    }
    if (
      this.subjects.length >=
      (this.subscriptionData?.plan?.subject_capacity ?? Infinity)
    ) {
      this.notify.showError(
        'You have reached the total subject limit for your current subscription plan.'
      );
      this.loadingAction = false;
      this.cdr.detectChanges();
      return;
    }

    this.subjectService.createSubject().subscribe({
      next: (response: any) => {
        const newSubjectId = response.session.id;
        this.router.navigate([`/subject-create/${newSubjectId}/naming-upload`]);
        this.loadingAction = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(
          res.error?.displayMessage ||
            'Failed to create a new subject. Please try again later.'
        );
        this.loadingAction = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubjectRightClick(event: MouseEvent, subject: any) {
    if (this.loadingAction) return;
    event.preventDefault();
    event.stopPropagation();
    if (this.rightClickSubject?.id === subject.id) {
      this.rightClickSubject = null;
      return;
    } else {
      this.rightClickSubject = subject;

      // position popup with overflow checks for mobile/tablet
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

      this.popup.x = x;
      this.popup.y = y;
      this.cdr.detectChanges();
    }
  }

  openDelete() {
    this.confirmation
      .open({
        title: 'Delete Subject',
        message: `Are you sure you want to delete the subject "${this.rightClickSubject?.name}"? This action cannot be undone.`,
        okText: 'Delete',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteSubject();
        } else {
          this.rightClickSubject = null;
        }
      });
  }

  openDeleteFromIcon(event: MouseEvent, subject: SubjectModel) {
    event.stopPropagation();
    this.rightClickSubject = subject;
    this.openDelete();
  }

  deleteSubject() {
    if (!this.rightClickSubject) return;
    this.subjectService.deleteSubject(this.rightClickSubject.id).subscribe({
      next: () => {
        this.notify.showSuccess('Subject deleted successfully.');
        this.subjects = this.subjects.filter(
          (s) => s.id !== this.rightClickSubject?.id
        );
        this.rightClickSubject = null;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(
          res.error?.displayMessage ||
            'Failed to delete subject. Please try again later.'
        );
        this.rightClickSubject = null;
        this.cdr.detectChanges();
      },
    });
  }

  navigateSubject(subject: SubjectModel) {
    if (this.loadingAction) return;
    
    if (this.rightClickSubject) {
      this.rightClickSubject = null;
      return;
    }
    
    this.loadingAction = true;
    const status = subject.status?.toLowerCase();
    if (
      status === 'pending naming' ||
      status === 'pending document upload' ||
      status === 'pending topic labelling'
    ) {
      this.router.navigate([`/subject-create/${subject.id}/naming-upload`]);
    } else if (
      status === 'pending topic selection' ||
      status === 'pending extension configuration' ||
      status === 'pending lesson generation'
    ) {
      this.router.navigate([`/subject-create/${subject.id}/lesson-generation`]);
    } else {
      this.router.navigate([`/lesson/${subject.id}`]);
    }
    this.loadingAction = false;
  }

  continueSubject(event: MouseEvent, subject: SubjectModel) {
    event.stopPropagation();
    this.navigateSubject(subject);
  }

  togglePin(event: MouseEvent, subject: SubjectModel) {
    event.stopPropagation();
    (subject as any).pinned = !(subject as any).pinned;
    this.cdr.detectChanges();
  }

  openMoreMenu(event: MouseEvent, subject: SubjectModel) {
    event.stopPropagation();
    this.notify.showInfo(`More options for "${subject.name || 'Untitled'}"`);
  }

  // Rating modal methods
  openRateModal() {
    this.showRateModal = true;
    this.rating = 0;
    this.ratingFeedback = '';
    // keep rightClickSubject so submitRating knows which subject
    this.cdr.detectChanges();
  }

  closeRateModal() {
    this.showRateModal = false;
    this.rightClickSubject = null;
    this.cdr.detectChanges();
  }

  setRating(value: number) {
    this.rating = value;
    this.cdr.detectChanges();
  }

  get ratingDescription(): string {
    if (this.rating <= 0) return this.ratingDescriptions[0];
    return this.ratingDescriptions[Math.max(0, this.rating - 1)];
  }

  submitRating() {
    if (!this.rightClickSubject) {
      this.notify.showError('No subject selected for rating.');
      this.closeRateModal();
      return;
    }

    if (!this.rating || this.rating < 1) {
      this.notify.showError('Select a valid rating.');
      this.closeRateModal();
      return;
    }

    const payload = {
      subjectId: this.rightClickSubject.id,
      rating: this.rating,
      feedback: this.ratingFeedback,
    };

    const rateCall = (this.subjectService as any).rateSubject
      ? (this.subjectService as any).rateSubject(payload)
      : this.subjectService.submitFeedback?.(
          this.rightClickSubject.id,
          payload.rating,
          payload.feedback
        ) ?? null;

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
      error: (res: any) => {
        this.notify.showError(
          res?.error?.displayMessage ||
            'Failed to submit feedback. Please try again later.'
        );
        this.cdr.detectChanges();
      },
    });
  }

  // Tags helper: show up to 4 tags then +N
  getDisplayTags(subject: SubjectModel): string[] {
    const tags = (subject as any).tags ?? [];
    const max = 4;
    if (tags.length <= max) return tags;
    const visible = tags.slice(0, max);
    visible.push(`+${tags.length - max}`);
    return visible;
  }

  /**
   * Circular progress helpers
   * stroke-dasharray = circumference
   * stroke-dashoffset = circumference * (1 - completion/100)
   * Accepts completion as 0..100 (normalized by normalizeCompletion)
   */
  getCircleDashOffset(completion?: number): number {
    const c = this.normalizeCompletion(completion);
    return this.CIRCLE_CIRCUMFERENCE * (1 - c / 100);
  }
}
