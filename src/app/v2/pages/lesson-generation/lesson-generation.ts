import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
  viewChild,
  computed,
  signal,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { Header } from '../../shared/components/header/header';
import { FileUploadOverlay } from './file-upload-overlay/file-upload-overlay';
import { ExtensionConfigOverlay } from './extension-config-overlay/extension-config-overlay';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';

import { SubjectsService } from '../../../core/services/subjects.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { OnboardingStep, OnboardingService } from '../../../core/services/onboarding.service';

import {
  ExtensionSettings,
  ExtensionConfig,
  ValidationResult,
  GenerationTopic,
  DEFAULT_EXTENSION_CONFIG,
} from '../../../core/models/extension-settings.model';
import { ExtensionModel } from '../../../core/models/api-response.model';
import { SubjectStatus, SubscriptionStatus } from '../../../core/models';
import { CreditService } from '../../../core/services/credit.service';

@Component({
  selector: 'app-lesson-generation',
  imports: [
    Header, 
    FileUploadOverlay, 
    ExtensionConfigOverlay, 
    ThemeIconComponent, 
    CdkDrag, 
    CdkDropList, 
    FormsModule, 
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './lesson-generation.html',
  styleUrl: './lesson-generation.css',
})
export class LessonGeneration implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private notify = inject(NotificationService);
  private subjectService = inject(SubjectsService);
  private subscriptionService = inject(SubscriptionService);
  private creditService = inject(CreditService)
  private onboardingService = inject(OnboardingService);
  private readonly destroyRef = inject(DestroyRef);

  filesOverlay = false;
  configOverlay = false;
  showPromptSuggestions = false;
  overchargeExplanationPopup = signal(false);
  showTopics = signal(true)
  loading = signal(false);
  isMobile = signal(false)

  learningStyle = '';
  subjectId = '';
  subjectStatus = '';
  word_count : number | null = 0;
  words_soft_limit : number | null = 0;
  costSettings : any = {};
  overcharge_rate = 0
  currentCosts = {
    total: {
      value: 0,
      overcharge: 0
    },
    lesson: {
      value: 0,
      overcharge: 0
    },
    cells: {
      value: 0,
      overcharge: 0
    },
    exercise: {
      value: 0,
      overcharge: 0
    },
    exam: {
      value: 0,
      overcharge: 0
    },
    flashcards: {
      value: 0,
      overcharge: 0
    },
    glossary: {
      value: 0,
      overcharge: 0
    },
  }

  topicList = viewChild<ElementRef>('topicList');
  textInput = viewChild<ElementRef>('textInput');
  submitButton = viewChild<ElementRef>('submitButton');

  // Onboarding elements
  onboardingSteps: OnboardingStep[] = [];
  beginner = false;
  currentOnboardingStep = computed(() => this.onboardingService.currentStepIndex());
  
  subjectName = '';
  topics: GenerationTopic[] = [];
  extensionSettings: ExtensionSettings = structuredClone(DEFAULT_EXTENSION_CONFIG);

  promptSuggestions = [
    {
      title: "🧑‍🎓 Beginner-Friendly",
      content: "Explain concepts as if I'm completely new to the topic. Use simple language, real-world examples, and avoid unnecessary jargon.",
    },
    {
      title: "⏱️ Exam Preparation",
      content: "Focus on the key concepts most likely to appear in exams. Include summaries, memory aids, and practice questions after each topic.",
    },
    {
      title: "🔍 Deep Understanding",
      content: "Go beyond definitions and explain the reasoning behind concepts. Show why things work, not just what they are.",
    },
    {
      title: "👁️ Visual Learner",
      content: "Teach using descriptions of diagrams, charts, comparisons, and visual analogies wherever possible.",
    },
    {
      title: "🛠️ Practical Applications",
      content: "Relate every concept to real-world scenarios, industry use cases, or everyday examples to make learning more practical.",
    },
  ]

  constructor() {
    // Initialize onboarding steps
    this.onboardingSteps = [
      // {
      //   title: 'Select Topics',
      //   text: 'Choose the specific concepts you want to focus on for this lesson.',
      //   object: this.topicList,
      //   tipPosition: 'top',
      //   tipAlignment: 'start',
      // },
      // {
      //   title: 'Enhance Your Lesson',
      //   text: 'Select additional extensions to enhance the quality of your generated lesson.',
      //   object: this.enableExtensionsButton,
      //   tipPosition: 'top',
      //   tipAlignment: 'start',
      // },
      // {
      //   title: 'Configure',
      //   text: 'Click here to customize your extensions.',
      //   object: this.configureExtensionsButton,
      //   tipPosition: 'top',
      //   tipAlignment: 'start',
      // },
      // {
      //   title: 'Lesson Preferences',
      //   text: 'Provide any specific preferences or instructions for your lesson generation.',
      //   object: this.textInput,
      //   tipPosition: 'bottom',
      //   tipAlignment: 'start',
      // },
      // {
      //   title: 'Generate Lesson',
      //   text: 'Ready? Click the send button to build your personalised lesson.',
      //   object: this.submitButton,
      //   tipPosition: 'top',
      //   tipAlignment: 'end',
      // },
    ];

    const nav = this.router.currentNavigation();
    this.beginner = nav?.extras?.state?.['beginner'] ?? false;
    if (this.beginner) {
      this.onboardingService.startOnboarding();
    }
  }

  private setupResponsiveListener(): void {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    // Set initial value safely on the client
    this.isMobile.set(mediaQuery.matches);
    if (this.isMobile()) {
      this.showTopics.set(false)
    }

    
    const handler = (e: MediaQueryListEvent) => {
      this.isMobile.set(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    
    // Clean up event listener when component unmounts to prevent memory leaks
    this.destroyRef.onDestroy(() => {
      mediaQuery.removeEventListener('change', handler);
    });
  }

  adjustInputHeight() {
    const ta = this.textInput()?.nativeElement;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = 240; // px
    ta.style.height = Math.min(ta.scrollHeight + 4, max) + 'px';
  }

  toggleTopicSelection(topicId: string) {
    this.topics = this.topics.map((topic) => {
      if (topic.id === topicId) {
        return { ...topic, selected: !topic.selected };
      }
      return topic;
    });
    this.computeCreditCosts()
  }

  drop(event: CdkDragDrop<GenerationTopic[]>) {
    moveItemInArray(this.topics, event.previousIndex, event.currentIndex);
    this.subjectService.reorderSubjectTopics(this.subjectId, this.topics.map((topic) => topic.id)).subscribe();
  }

  togglePromptSuggestions() {
    this.showPromptSuggestions = !this.showPromptSuggestions;
  }

  toggleTopicView() {
    this.showTopics.set(!this.showTopics())
  }

  toggleConfigOverlay() {
    this.configOverlay = !this.configOverlay;
  }

  saveConfig(config: ExtensionSettings) {
    if (this.subjectStatus === 'pending_lesson_generation') {
      this.notify.show('info', 'Extensions have already been configured and cannot be changed');
    } else {
      this.extensionSettings = config;
    }
    this.computeCreditCosts()
    this.toggleConfigOverlay();
  }

  addPrompt(prompt: string) {
    this.learningStyle = prompt
    this.adjustInputHeight()
    if (this.isMobile()) this.togglePromptSuggestions()
  }

  computeCreditCosts() {
    // Reset Costs
    this.overcharge_rate = 0
    this.currentCosts = {
      total: {
        value: 0,
        overcharge: 0
      },
      lesson: {
        value: 0,
        overcharge: 0
      },
      cells: {
        value: 0,
        overcharge: 0
      },
      exercise: {
        value: 0,
        overcharge: 0
      },
      exam: {
        value: 0,
        overcharge: 0
      },
      flashcards: {
        value: 0,
        overcharge: 0
      },
      glossary: {
        value: 0,
        overcharge: 0
      },
    }

    if ((this.word_count && this.words_soft_limit) && (this.word_count > this.words_soft_limit)) {
      this.overcharge_rate = this.costSettings.overcharge.rate * (this.word_count - this.words_soft_limit)
    }

    // Lesson Cost
    this.currentCosts.lesson.value = this.costSettings.lesson.cells.text * this.selectedTopics.length
    // this.currentCosts.lesson.overcharge = Math.ceil(this.overcharge_rate * this.selectedTopics.length) // Overcharge fee for each extension
    this.currentCosts.lesson.overcharge = this.overcharge_rate * this.selectedTopics.length // Overcharge fee for each extension

    // Cells Cost
    if (this.extensionSettings.cells.enabled) {
      for (let type of this.extensionSettings.cells.types) {
        this.currentCosts.cells.value += this.costSettings.lesson.cells[type] * this.selectedTopics.length
      }
      // this.currentCosts.cells.overcharge = Math.ceil(this.overcharge_rate * this.selectedTopics.length)
      this.currentCosts.cells.overcharge = this.overcharge_rate * this.selectedTopics.length
    }

    // Exercise Cost
    if (this.extensionSettings.exercise.enabled) {
      this.currentCosts.exercise.value = this.costSettings.exercise.per_amount * this.extensionSettings.exercise.amount * this.selectedTopics.length
      // this.currentCosts.exercise.overcharge = Math.ceil(this.overcharge_rate * this.selectedTopics.length)
      this.currentCosts.exercise.overcharge = this.overcharge_rate * this.selectedTopics.length
    }

    // Exam Cost
    if (this.extensionSettings.exam.enabled) {
      this.currentCosts.exam.value = this.costSettings.exam.per_amount * this.extensionSettings.exam.amount
      // this.currentCosts.exam.overcharge = Math.ceil(this.overcharge_rate * this.selectedTopics.length)
      this.currentCosts.exam.overcharge = this.overcharge_rate * this.selectedTopics.length
    }

    // Flashcards Cost
    if (this.extensionSettings.flashcards.enabled) {
      this.currentCosts.flashcards.value = this.costSettings.flashcards.per_amount * this.extensionSettings.flashcards.amount * this.selectedTopics.length
      // this.currentCosts.flashcards.overcharge = Math.ceil(this.overcharge_rate * this.selectedTopics.length)
      this.currentCosts.flashcards.overcharge = this.overcharge_rate * this.selectedTopics.length
    }

    // Glossary Cost
    if (this.extensionSettings.glossary.enabled) {
      this.currentCosts.glossary.value = this.costSettings.glossary.cost * this.selectedTopics.length
      // this.currentCosts.glossary.overcharge = Math.ceil(this.overcharge_rate * this.selectedTopics.length)
      this.currentCosts.glossary.overcharge = this.overcharge_rate * this.selectedTopics.length
    }

    this.currentCosts.total.value = 0
      + this.currentCosts.lesson.value
      + this.currentCosts.cells.value
      + this.currentCosts.exercise.value
      + this.currentCosts.exam.value
      + this.currentCosts.flashcards.value
      + this.currentCosts.glossary.value

    this.currentCosts.total.overcharge = 0
      + this.currentCosts.lesson.overcharge
      + this.currentCosts.cells.overcharge
      + this.currentCosts.exercise.overcharge
      + this.currentCosts.exam.overcharge
      + this.currentCosts.flashcards.overcharge
      + this.currentCosts.glossary.overcharge
  }

  getCost(name: keyof typeof this.currentCosts) {
    return this.currentCosts[name]
  }

  validateSettings(): ValidationResult {
    // Check if any topics have been selected
    if (this.selectedTopics.length === 0) {
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
      if (this.extensionSettings.exercise.amount <= 0 || this.extensionSettings.exercise.amount > this.extensionSettings.exercise.upperLimit) {
        return {
          status: false,
          message: `Number of exercise questions must be between 1 and ${this.extensionSettings.exercise.upperLimit}.`
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
      if (this.extensionSettings.exam.amount <= 0 || this.extensionSettings.exam.amount > this.extensionSettings.exam.upperLimit) {
        return {
          status: false,
          message: `Number of exam questions must be between 1 and ${this.extensionSettings.exam.upperLimit}.`
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
      if (this.extensionSettings.flashcards.amount <= 0 || this.extensionSettings.flashcards.amount > this.extensionSettings.flashcards.upperLimit) {
        return {
          status: false,
          message: `Number of flashcards must be between 1 and ${this.extensionSettings.flashcards.upperLimit}.`
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
    this.loading.set(true);

    const validation = this.validateSettings();
    if (!validation.status) {
      this.notify.showError(validation.message);
      this.loading.set(false);
      return;
    }

    const selectedTopicIds = this.topics.filter((topic) => topic.selected).map((topic) => topic.id);
    this.subjectService.generateFullLesson(this.subjectId, selectedTopicIds, this.learningStyle, this.extensionSettings).subscribe({
      next: (response) => {
        this.notify.showSuccess("Successfully generated lesson.")
        this.router.navigateByUrl(`/v2/lesson/${this.subjectId}`, { state: { beginner: this.beginner } })
      },
      error: (res) => {
        this.notify.showError(res.error.message || "Failed to generate lesson. Please try again later.");
        this.loading.set(false)
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading.set(false)
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    // Get subjectId from route params
    this.route.paramMap.subscribe((params) => {
      this.subjectId = params.get('sessionId') ?? '';
      this.loadSubjectDetails();
    });
    this.setupResponsiveListener();
  }

  configureLoadedExtensions(extensions: ExtensionModel[]) {
    for (const ext of extensions) {
      if (ext.type === 'lesson' && ext.configuration?.cell_types && ext.configuration.cell_types.length > 1) {
        this.extensionSettings.cells.enabled = true;
        this.extensionSettings.cells.types = ext.configuration.cell_types.filter((type) => type !== 'text');
      }
      if (ext.type === 'exercise' && ext.configuration) {
        this.extensionSettings.exercise.enabled = true;
        this.extensionSettings.exercise.amount = ext.configuration.no_of_questions ?? 3;
        this.extensionSettings.exercise.types = ext.configuration.question_types ?? [];
      }
      if (ext.type === 'exam' && ext.configuration) {
        this.extensionSettings.exam.enabled = true;
        this.extensionSettings.exam.amount = ext.configuration.no_of_questions ?? 10;
        this.extensionSettings.exam.types = ext.configuration.question_types ?? [];
      }
      if (ext.type === 'flashcards' && ext.configuration) {
        this.extensionSettings.flashcards.enabled = true;
        this.extensionSettings.flashcards.amount = ext.configuration.no_of_cards ?? 5;
        this.extensionSettings.flashcards.types = ext.configuration.card_types ?? [];
      }
      if (ext.type === 'glossary') {
        this.extensionSettings.glossary.enabled = true;
      }
    }
  }

  private loadSubjectDetails() {
    this.loading.set(true);
    this.subjectService.getSubjectDetails(this.subjectId).subscribe({
      next: (response) => {
        this.subjectName = response.session.name || 'Untitled';
        this.subjectStatus = response.session.status || '';
        if ((this.subjectStatus == SubjectStatus.PENDING_DOCUMENT_UPLOAD) || (this.subjectStatus == SubjectStatus.PENDING_TOPIC_LABELLING)) {
          this.filesOverlay = true;
        }
        this.topics = response.topics;
        this.learningStyle = response.session.user_preference || '';
        this.word_count = response.session.word_count;
        this.configureLoadedExtensions(response.extensions)

        this.subscriptionService.getSubscription().subscribe({
          next: (response) => {
            const subscriptionData: SubscriptionStatus | null = response.subscription;
            if (subscriptionData && subscriptionData.plan) {
              // Update allowed cells
              this.words_soft_limit = subscriptionData.plan.word_soft_limit;
            }
          },
          error: (res) => {
            this.notify.showError(res.error.message || "Failed to load subscription data. Please try again later.");
            this.loading.set(false)
            this.cdr.detectChanges();
          }
        })
      },
      error: (res) => {
        this.notify.showError(res.error.message || 'Failed to load subject details. Please try again later.');
        this.loading.set(false)
        this.cdr.detectChanges();
      },
      complete: () => {
        this.creditService.getCostSettings().subscribe({
          next: (response) => {
            this.costSettings = response.settings
            this.computeCreditCosts()
            this.loading.set(false)
            this.cdr.detectChanges();
          }
        })
      }
    })
  }

  closeFileOverlay() {
    window.location.reload();
  }

  getTutorialObjectPosition(stepIndex: number) {
    const step = this.onboardingSteps[stepIndex];
    if (!step) return { top: 0, left: 0, bottom: 0, right: 0 };
    return this.onboardingService.getObjectPosition(step);
  }

  cycleOnboarding(): void {
    this.onboardingService.nextStep();
  }

  saveLessonName() {
    if (!this.subjectName || this.subjectName.trim() === '') {
      this.notify.showError('Subject name cannot be empty.');
      return;
    }
    if (this.subjectName.length > 30) {
      this.notify.showError('Subject name cannot exceed 40 characters.');
      return;
    }

    this.subjectService.nameSubject(this.subjectId, this.subjectName).subscribe({
      next: (response) => {
        this.notify.showSuccess('Subject name updated successfully.');
      },
      error: (res) => {
        this.notify.showError(res.error.message || 'Failed to update subject name. Please try again later.');
      }
    });
  }

  get selectedTopics() {
    return this.topics.filter((topic) => topic.selected);
  }

  get selectedExtensions() {
    return Object.values(this.extensionSettings).filter((ext: ExtensionConfig) => ext.enabled);
  }

  get extensionList() {
    return Object.values(this.extensionSettings);
  }

  getOptionLabel(extension: ExtensionConfig, value: string): string {
    const option = extension.options?.find((opt) => opt.value === value);
    return option ? option.label : value;
  }

  toggleOverchargeExplanation() {
    this.overchargeExplanationPopup.set(!this.overchargeExplanationPopup())
  }
}
