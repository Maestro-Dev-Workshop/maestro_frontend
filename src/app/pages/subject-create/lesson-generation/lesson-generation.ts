import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, NO_ERRORS_SCHEMA, OnDestroy, OnInit, viewChild, ViewChild } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { TopicModel } from '../../../core/models/topic.model';
import { SubjectsService } from '../../../core/services/subjects.service';
import { LessonService } from '../../../core/services/lesson.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PreferenceValidator } from '../../../shared/directives/preference-validator';
import { ExtensionConfigOverlay } from '../extension-config-overlay/extension-config-overlay';
import { max } from 'rxjs';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { SubscriptionStatus } from '../../../core/models/subscription.model';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { TutorialElement } from '../../../shared/components/tutorial-element/tutorial-element';


@Component({
  selector: 'app-lesson-generation',
  imports: [Header, CreationStepTab, FormsModule, ExtensionConfigOverlay, ThemeIconComponent, CdkDrag, CdkDropList, TutorialElement],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './lesson-generation.html',
  styleUrl: './lesson-generation.css',
})
export class LessonGeneration implements OnInit, AfterViewInit, OnDestroy {
  loading = false
  learningStyle = ''
  settingsPopup = false
  configOverlay = false
  extensionsEnabled = false
  subjectId = ''
  subjectStatus = ''
  topicOverflowing = false;
  topicsExpanded = false;
  notify = inject(NotificationService)
  subjectService = inject(SubjectsService)
  subscriptionService = inject(SubscriptionService)
  private resizeObserver?: ResizeObserver; 
  
  // Onboarding elements
  topicList = viewChild<ElementRef>('topicList')
  enableExtensionsButton = viewChild<ElementRef>('enableExtensionsButton')
  configureExtensionsButton = viewChild<ElementRef>('configureExtensionsButton')
  textInput = viewChild<ElementRef>('textInput')
  submitButton = viewChild<ElementRef>('submitButton')
  onboardingSteps = [
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
  beginner = false;
  currentOnboardingStep = -1;
  
  subjectName = '';
  topics: any = [];
  extensionSettings = {
    cells: {
      enabled: false,
      types: [],
      name: 'cells',
      displayName: 'Lesson Supplements',
    },
    exercise: {
      enabled: false,
      types: [],
      numQuestions: 3,
      name: 'exercise',
      displayName: 'Exercise',
    },
    exam: {
      enabled: false,
      types: [],
      numQuestions: 10,
      timelimit: null,
      name: 'exam',
      displayName: 'Exam',
    },
    flashcards: {
      enabled: false,
      numCards: 5,
      types: [],
      name: 'flashcards',
      displayName: 'Flashcards',
    },
    glossary: {
      enabled: false,
      name: 'glossary',
      displayName: 'Glossary',
    }
  }
  constraints = {
    excercise: {
      maxQuestions: 3
    },
    exam: {
      maxQuestions: 10
    },
    flashcards: {
      maxCards: 10
    }
  }

  constructor(
    private cdr: ChangeDetectorRef, 
    private router: Router,
  ) {
    // Extract subjectId from the route parameters
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 2]; // Assuming the last part is the subjectId
    const nav = this.router.currentNavigation();
    this.beginner = nav?.extras?.state?.['beginner'];
    this.currentOnboardingStep = this.beginner ? 0 : -1;
  }

  adjustInputHeight() {
    const ta = this.textInput()?.nativeElement;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = 240; // px
    ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
  }

  toggleTopicSelection(topic_id: any) {
    this.topics.map(
      (topic: any) => {
        if (topic.id === topic_id) {topic.selected = !topic.selected}
      }
    )
  }

  toggleSettingsPopup() {
    this.settingsPopup = !this.settingsPopup
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

  saveConfig(config: any) {
    if (this.subjectStatus === 'pending lesson generation') {
      this.notify.show('info', 'Extensions have already been configured and cannot be changed')
    } else {
      this.extensionSettings = config
    }
    this.toggleConfigOverlay()
  }

  toggleExtension(extension: string) {
    this.extensionSettings[extension as keyof typeof this.extensionSettings].enabled = !this.extensionSettings[extension as keyof typeof this.extensionSettings].enabled
    this.extensionsEnabled = Object.values(this.extensionSettings).some((ext: any) => ext.enabled);
  }

  getExtensionList() {
    return Object.values(this.extensionSettings);
  }

  getEnabledExtensionList() {
    return Object.values(this.extensionSettings).filter((ext: any) => ext.enabled);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.topics, event.previousIndex, event.currentIndex);
    this.subjectService.reorderSubjectTopics(this.subjectId, this.topics.map((topic:any) => topic.id)).subscribe()
  }

  validateSettings() {
    // Check if any topics have been selected
    const selectedTopics = this.topics.filter((topic: any) => topic.selected);
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
      if (this.extensionSettings.exercise.numQuestions <= 0 || this.extensionSettings.exercise.numQuestions > this.constraints.excercise.maxQuestions) {
        return {
          status: false,
          message: `Number of exercise questions must be between 1 and ${this.constraints.excercise.maxQuestions}.`
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

    const selectedTopicIds = this.topics.filter((topic: any) => topic.selected).map((topic: any) => topic.id);
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

  configureExtensions(extensions: any) {
    for (let ext of extensions) {
      if (ext.type == 'lesson' && ext.configuration.cell_types.length > 0) {
        this.extensionSettings.cells.enabled = true
        this.extensionSettings.cells.types = ext.configuration.cell_types
        this.extensionsEnabled = true
      }
      if (ext.type == 'exercise') {
        this.extensionSettings.exercise.enabled = true
        this.extensionSettings.exercise.numQuestions = ext.configuration.no_of_questions
        this.extensionSettings.exercise.types = ext.configuration.question_types
        this.extensionsEnabled = true
      }
      if (ext.type == 'exam') {
        this.extensionSettings.exam.enabled = true
        this.extensionSettings.exam.numQuestions = ext.configuration.no_of_questions
        this.extensionSettings.exam.types = ext.configuration.question_types
        this.extensionsEnabled = true
      }
      if (ext.type == 'flashcards') {
        this.extensionSettings.flashcards.enabled = true
        this.extensionSettings.flashcards.numCards = ext.configuration.no_of_cards
        this.extensionSettings.flashcards.types = ext.configuration.card_types
        this.extensionsEnabled = true
      }
      if (ext.type == 'glossary') {
        this.extensionSettings.glossary.enabled = true
        this.extensionsEnabled = true
      }
    }
  }

  ngOnInit() {
    this.loading = true
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
              this.constraints.excercise.maxQuestions = subscriptionData.plan.exercise_question_count || 3;
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

  getTutorialObjectPosition(step: any) {
    if (!this.onboardingSteps[step].object()) return { top: 0, left: 0, bottom: 0, right: 0 };
    const rect = this.onboardingSteps[step].object()?.nativeElement.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
    }
  }

  cycleOnboarding() {
    this.currentOnboardingStep = this.currentOnboardingStep + 1;
    this.cdr.detectChanges();
  }
}
