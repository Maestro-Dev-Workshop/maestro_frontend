import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  OnInit,
  viewChild,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { Header } from '../../../shared/components/header/header';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { ExtensionConfigOverlay } from '../extension-config-overlay/extension-config-overlay';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import { TutorialElement } from '../../../shared/components/tutorial-element/tutorial-element';

import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { OnboardingService, OnboardingStep } from '../../../core/services/onboarding.service';

import { SubscriptionStatus } from '../../../core/models/subscription.model';
import {
  ExtensionSettings,
  ExtensionConfig,
  ExtensionConstraints,
  ValidationResult,
  GenerationTopic,
  DEFAULT_EXTENSION_CONFIG,
} from '../../../core/models/extension-settings.model';
import { ExtensionModel } from '../../../core/models/api-response.model';


@Component({
  selector: 'app-lesson-generation',
  imports: [Header, CreationStepTab, FormsModule, ExtensionConfigOverlay, ThemeIconComponent, CdkDrag, CdkDropList, TutorialElement],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './lesson-generation.html',
  styleUrl: './lesson-generation.css',
})
export class LessonGeneration implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private notify = inject(NotificationService);
  private subjectService = inject(SubjectsService);
  private subscriptionService = inject(SubscriptionService);
  private onboardingService = inject(OnboardingService);
  private resizeObserver?: ResizeObserver;

  loading = false;
  learningStyle = '';
  settingsPopup = false;
  configOverlay = false;
  extensionsEnabled = false;
  subjectId = '';
  subjectStatus = '';
  topicOverflowing = false;
  topicsExpanded = false;

  // Onboarding elements
  topicList = viewChild<ElementRef>('topicList');
  enableExtensionsButton = viewChild<ElementRef>('enableExtensionsButton');
  configureExtensionsButton = viewChild<ElementRef>('configureExtensionsButton');
  textInput = viewChild<ElementRef>('textInput');
  submitButton = viewChild<ElementRef>('submitButton');
  onboardingSteps: OnboardingStep[] = [];
  beginner = false;
  currentOnboardingStep = computed(() => this.onboardingService.currentStepIndex());
  
  subjectName = '';
  topics: GenerationTopic[] = [];
  extensionSettings: ExtensionSettings = structuredClone(DEFAULT_EXTENSION_CONFIG);;
  constraints: ExtensionConstraints = {
    exercise: {
      maxQuestions: 3
    },
    exam: {
      maxQuestions: 10
    },
    flashcards: {
      maxCards: 10
    }
  };

  constructor() {
    // Initialize onboarding steps
    this.onboardingSteps = [
      {
        title: 'Select Topics',
        text: 'Choose the specific concepts you want to focus on for this lesson.',
        object: this.topicList,
        tipPosition: 'top',
        tipAlignment: 'start',
      },
      {
        title: 'Enhance Your Lesson',
        text: 'Select additional extensions to enhance the quality of your generated lesson.',
        object: this.enableExtensionsButton,
        tipPosition: 'top',
        tipAlignment: 'start',
      },
      {
        title: 'Configure',
        text: 'Click here to customize your extensions.',
        object: this.configureExtensionsButton,
        tipPosition: 'top',
        tipAlignment: 'start',
      },
      {
        title: 'Lesson Preferences',
        text: 'Provide any specific preferences or instructions for your lesson generation.',
        object: this.textInput,
        tipPosition: 'bottom',
        tipAlignment: 'start',
      },
      {
        title: 'Generate Lesson',
        text: 'Ready? Click the send button to build your personalised lesson.',
        object: this.submitButton,
        tipPosition: 'top',
        tipAlignment: 'end',
      },
    ];

    const nav = this.router.currentNavigation();
    this.beginner = nav?.extras?.state?.['beginner'] ?? false;
    if (this.beginner) {
      this.onboardingService.startOnboarding();
    }
  }

  adjustInputHeight() {
    const ta = this.textInput()?.nativeElement;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = 240; // px
    ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
  }

  toggleTopicSelection(topicId: string) {
    this.topics = this.topics.map((topic) => {
      if (topic.id === topicId) {
        return { ...topic, selected: !topic.selected };
      }
      return topic;
    });
  }

  toggleSettingsPopup(event: MouseEvent) {
    this.settingsPopup = !this.settingsPopup
    event.stopPropagation();
  }

  closeSettingsPopup() {
    this.settingsPopup = false;
  }

  toggleConfigOverlay() {
    if (
      this.extensionSettings.cells.enabled ||
      this.extensionSettings.exercise.enabled ||
      this.extensionSettings.exam.enabled ||
      this.extensionSettings.flashcards.enabled
    ) {
      this.configOverlay = !this.configOverlay
    }
  }

  saveConfig(config: ExtensionSettings) {
    if (this.subjectStatus === 'pending_lesson_generation') {
      this.notify.show('info', 'Extensions have already been configured and cannot be changed');
    } else {
      this.extensionSettings = config;
    }
    this.toggleConfigOverlay();
  }

  toggleExtension(extension: string) {
    const key = extension as keyof ExtensionSettings;
    this.extensionSettings[key].enabled = !this.extensionSettings[key].enabled;
    this.extensionsEnabled = Object.values(this.extensionSettings).some((ext: ExtensionConfig) => ext.enabled);
  }

  getExtensionList(): ExtensionConfig[] {
    return Object.values(this.extensionSettings);
  }

  getEnabledExtensionList(): ExtensionConfig[] {
    return Object.values(this.extensionSettings).filter((ext: ExtensionConfig) => ext.enabled);
  }

  drop(event: CdkDragDrop<GenerationTopic[]>) {
    moveItemInArray(this.topics, event.previousIndex, event.currentIndex);
    this.subjectService.reorderSubjectTopics(this.subjectId, this.topics.map((topic) => topic.id)).subscribe();
  }

  validateSettings(): ValidationResult {
    // Check if any topics have been selected
    const selectedTopics = this.topics.filter((topic) => topic.selected);
    if (selectedTopics.length === 0) {
      return {
        status: false,
        message: 'Please select at least one topic.'
      };
    }

    // Check if learning style is empty
    if (!this.learningStyle || this.learningStyle.trim() === '') {
      return {
        status: false,
        message: 'Learning style cannot be empty.'
      };
    }
    if (this.learningStyle.length > 2000) {
      return {
        status: false,
        message: 'Learning style cannot exceed 2000 characters.'
      };
    }

    // Content Cell checks
    if (this.extensionSettings.cells.enabled) {
      if (this.extensionSettings.cells.types.length === 0) {
        return {
          status: false,
          message: 'Please select at least one cell type for lesson.'
        };
      }
    }

    // Exercise checks
    if (this.extensionSettings.exercise.enabled) {
      if (this.extensionSettings.exercise.numQuestions <= 0 || this.extensionSettings.exercise.numQuestions > this.constraints.exercise.maxQuestions) {
        return {
          status: false,
          message: `Number of exercise questions must be between 1 and ${this.constraints.exercise.maxQuestions}.`
        };
      }
      if (this.extensionSettings.exercise.types.length === 0) {
        return {
          status: false,
          message: 'Please select at least one question type for exercise.'
        };
      }
    }

    // Exam checks
    if (this.extensionSettings.exam.enabled) {
      if (this.extensionSettings.exam.numQuestions <= 0 || this.extensionSettings.exam.numQuestions > this.constraints.exam.maxQuestions) {
        return {
          status: false,
          message: `Number of exam questions must be between 1 and ${this.constraints.exam.maxQuestions}.`
        };
      }
      if (this.extensionSettings.exam.types.length === 0) {
        return {
          status: false,
          message: 'Please select at least one question type for exam.'
        };
      }
    }

    // Flashcards checks
    if (this.extensionSettings.flashcards.enabled) {
      if (this.extensionSettings.flashcards.numCards <= 0 || this.extensionSettings.flashcards.numCards > this.constraints.flashcards.maxCards) {
        return {
          status: false,
          message: `Number of flashcards must be between 1 and ${this.constraints.flashcards.maxCards}.`
        };
      }
      if (this.extensionSettings.flashcards.types.length === 0) {
        return {
          status: false,
          message: 'Please select at least one type for flashcards.'
        };
      }
    }

    return {
      status: true,
      message: 'Settings are valid.'
    };
  }

  go() {
    this.loading = true;
    this.settingsPopup = false
    this.configOverlay = false

    const validation = this.validateSettings();
    if (!validation.status) {
      this.notify.showError(validation.message);
      this.loading = false;
      return;
    }

    const selectedTopicIds = this.topics.filter((topic) => topic.selected).map((topic) => topic.id);
    this.subjectService.generateFullLesson(this.subjectId, selectedTopicIds, this.learningStyle, this.extensionSettings).subscribe({
      next: (response) => {
        this.notify.showSuccess("Successfully generated lesson.")
        this.router.navigateByUrl(`/lesson/${this.subjectId}`, { state: { beginner: this.beginner } })
      },
      error: (res) => {
        this.notify.showError(res.error.message || "Failed to generate lesson. Please try again later.");
        this.loading = false
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false
        this.cdr.detectChanges();
      }
    });
  }

  configureExtensions(extensions: ExtensionModel[]) {
    for (const ext of extensions) {
      if (ext.type === 'lesson' && ext.configuration?.cell_types && ext.configuration.cell_types.length > 0) {
        this.extensionSettings.cells.enabled = true;
        this.extensionSettings.cells.types = ext.configuration.cell_types;
        this.extensionsEnabled = true;
      }
      if (ext.type === 'exercise' && ext.configuration) {
        this.extensionSettings.exercise.enabled = true;
        this.extensionSettings.exercise.numQuestions = ext.configuration.no_of_questions ?? 3;
        this.extensionSettings.exercise.types = ext.configuration.question_types ?? [];
        this.extensionsEnabled = true;
      }
      if (ext.type === 'exam' && ext.configuration) {
        this.extensionSettings.exam.enabled = true;
        this.extensionSettings.exam.numQuestions = ext.configuration.no_of_questions ?? 10;
        this.extensionSettings.exam.types = ext.configuration.question_types ?? [];
        this.extensionsEnabled = true;
      }
      if (ext.type === 'flashcards' && ext.configuration) {
        this.extensionSettings.flashcards.enabled = true;
        this.extensionSettings.flashcards.numCards = ext.configuration.no_of_cards ?? 5;
        this.extensionSettings.flashcards.types = ext.configuration.card_types ?? [];
        this.extensionsEnabled = true;
      }
      if (ext.type === 'glossary') {
        this.extensionSettings.glossary.enabled = true;
        this.extensionsEnabled = true;
      }
    }
  }

  ngOnInit() {
    // Get subjectId from route params
    this.route.paramMap.subscribe((params) => {
      this.subjectId = params.get('sessionId') ?? '';
      this.loadSubjectDetails();
    });
  }

  private loadSubjectDetails() {
    this.loading = true;
    this.subjectService.getSubjectDetails(this.subjectId).subscribe({
      next: (response) => {
        this.subjectName = response.session.name || 'Untitled';
        this.subjectStatus = response.session.status || '';
        this.topics = response.topics;
        this.learningStyle = response.session.user_preference || '';
        this.configureExtensions(response.extensions)

        this.subscriptionService.getSubscription().subscribe({
          next: (response) => {
            const subscriptionData: SubscriptionStatus | null = response.subscription;
            if (subscriptionData && subscriptionData.plan) {
              this.constraints.exercise.maxQuestions = subscriptionData.plan.exercise_question_count || 3;
              this.constraints.exam.maxQuestions = subscriptionData.plan.exam_question_count || 10;
            }
          },
          error: (res) => {
            this.notify.showError(res.error.message || "Failed to load subscription data. Please try again later.");
            this.loading = false
            this.cdr.detectChanges();
          }
        })
      },
      error: (res) => {
        this.notify.showError(res.error.message || 'Failed to load subject details. Please try again later.');
        this.loading = false
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false
        this.cdr.detectChanges();
      }
    })
  }

  ngAfterViewInit() {
    this.observeResize();
  }

  observeResize() {
    if (this.topicList()?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkIfScrollable();
      });
      this.resizeObserver.observe(this.topicList()?.nativeElement);
    }
  }

  checkIfScrollable() {
    if (this.topicList()?.nativeElement && !this.topicOverflowing) {
      const element = this.topicList()?.nativeElement;
      this.topicOverflowing = element.scrollWidth > element.clientWidth;
      this.cdr.detectChanges();
    }
  }

  toggleTopicExpansion() {
    this.topicsExpanded = !this.topicsExpanded;
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  getTutorialObjectPosition(stepIndex: number) {
    const step = this.onboardingSteps[stepIndex];
    if (!step) return { top: 0, left: 0, bottom: 0, right: 0 };
    return this.onboardingService.getObjectPosition(step);
  }

  cycleOnboarding(): void {
    this.onboardingService.nextStep();
  }
}
