import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewChild,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';

import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Chatbot } from '../chatbot/chatbot';
import { Subtopic } from '../subtopic/subtopic';
import { Practice } from '../practice/practice';
import { Glossary } from '../glossary/glossary';
import { Flashcards } from '../flashcards/flashcards';
import { TutorialElement } from '../../../shared/components/tutorial-element/tutorial-element';

import { SubjectsService } from '../../../core/services/subjects.service';
import { LessonService } from '../../../core/services/lesson.service';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { NotificationService } from '../../../core/services/notification.service';
import { OnboardingService, OnboardingStep } from '../../../core/services/onboarding.service';

import { ChatMetadata } from '../../../core/models/chat-metadata.model';
import { ChatMessage } from '../../../core/models/chat-message.model';
import {
  SubjectContent,
  LessonTopic,
  LessonSubtopic,
  LessonViewState,
  ViewChangeEvent,
  SubtopicChangeEvent,
  QuestionChangeEvent,
} from '../../../core/models/lesson-content.model';
import {
  SubjectResponse,
  TopicListResponse,
  TopicContentResponse,
  ExerciseResponse,
  FlashcardResponse,
  ExamResponse,
  GlossaryResponse,
} from '../../../core/models/api-response.model';

@Component({
  selector: 'app-lesson-page',
  imports: [Header, Sidebar, Chatbot, Subtopic, Practice, Glossary, Flashcards, TutorialElement],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.css',
})
export class LessonPage implements OnInit {
  // Injected services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subjectService = inject(SubjectsService);
  private lessonService = inject(LessonService);
  private chatbotService = inject(ChatbotService);
  private notify = inject(NotificationService);
  private onboardingService = inject(OnboardingService);

  // Route params
  subjectId = signal('');

  // State as signals (reduces manual change detection)
  subjectContent = signal<SubjectContent>({
    subject_name: '',
    topics: [],
    exam: null,
    glossary: [],
  });
  currentView = signal<LessonViewState>({
    type: 'subtopic',
    id: '',
    content: null,
  });
  chatHistory = signal<ChatMessage[]>([]);
  chatOpen = signal(false);
  sidebarOpen = signal(false);
  subjectLoading = signal(true);
  chatMetadata = signal<ChatMetadata>({});

  @ViewChild('contentContainer') private contentContainer!: ElementRef<HTMLDivElement>;

  // Onboarding
  chatPopupButton = viewChild<ElementRef>('chatPopupButton');
  onboardingSteps: OnboardingStep[] = [];
  currentOnboardingStep = computed(() => this.onboardingService.currentStepIndex());

  constructor() {
    const nav = this.router.currentNavigation();
    const isBeginner = nav?.extras?.state?.['beginner'] ?? false;

    // Initialize onboarding steps after chatPopupButton is available
    this.onboardingSteps = [
      {
        title: 'Need Help?',
        text: 'Ask the chatbot about the lesson content or get feedback on practice questions.',
        object: this.chatPopupButton,
        tipPosition: 'top',
        tipAlignment: 'end',
      },
    ];

    if (isBeginner) {
      this.onboardingService.startOnboarding();
    }
  }

  ngOnInit(): void {
    // Get subjectId from route params
    this.route.paramMap.subscribe((params) => {
      const id = params.get('subjectId');
      if (id) {
        this.subjectId.set(id);
        this.loadLessonData();
      }
    });
  }

  private loadLessonData(): void {
    const subjectId = this.subjectId();

    // Fetch chat history
    this.chatbotService.getChatHistory(subjectId).subscribe({
      next: (response) => {
        this.chatHistory.set(response.history);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to load chat history.');
      },
    });

    // Load subject content
    this.subjectService
      .getSubject(subjectId)
      .pipe(
        map((res: SubjectResponse) => res.session || null),
        switchMap((subject) => {
          if (!subject) throw new Error('Subject not found');

          this.subjectContent.set({
            subject_name: subject.name,
            topics: [],
            exam: null,
            glossary: [],
          });

          return this.lessonService.getAllTopics(subjectId);
        }),
        switchMap((res: TopicListResponse) => {
          const topicsResponse = res.topics || [];
          const topics: LessonTopic[] = topicsResponse
            .filter((topic) => topic.selected)
            .map((topic) => ({
              expanded: false,
              id: topic.id,
              title: topic.title,
              completed: topic.completed,
              selected: topic.selected,
              subtopics: [],
              exercise: null,
              flashcards: [],
            }));

          this.subjectContent.update((content) => ({ ...content, topics }));

          const topicRequests = topics.map((topic: LessonTopic) =>
            forkJoin({
              subtopics: this.lessonService.getAllSubtopics(topic.id).pipe(map((r: TopicContentResponse) => r.subtopics || [])),
              exercise: this.lessonService.getExercise(topic.id).pipe(map((r: ExerciseResponse) => r.exercise || null)),
              flashcards: this.lessonService.getFlashcards(topic.id).pipe(map((r: FlashcardResponse) => r.flashcards || [])),
            }).pipe(
              map((res) => {
                topic.subtopics = res.subtopics as LessonSubtopic[];
                topic.exercise = res.exercise;
                topic.flashcards = res.flashcards;
                return topic;
              })
            )
          );

          return forkJoin(topicRequests);
        }),
        switchMap(() =>
          this.lessonService.getExam(subjectId).pipe(
            map((res: ExamResponse) => {
              this.subjectContent.update((content) => ({
                ...content,
                exam: res.exam || null,
              }));
              return res.exam;
            })
          )
        ),
        switchMap(() =>
          this.lessonService.getGlossary(subjectId).pipe(
            map((res: GlossaryResponse) => {
              this.subjectContent.update((content) => ({
                ...content,
                glossary: res.glossary || [],
              }));
              return res.glossary;
            })
          )
        )
      )
      .subscribe({
        next: () => {
          this.setInitialView();
          this.subjectLoading.set(false);
        },
        error: (res) => {
          this.notify.showError(res.error?.message || 'Failed to load lesson content.');
          this.subjectLoading.set(false);
        },
      });
  }

  private setInitialView(): void {
    const content = this.subjectContent();

    for (const topic of content.topics) {
      if (!topic.completed) {
        const unreadSubtopic = topic.subtopics.find((st) => !st.read);
        if (unreadSubtopic) {
          this.updateCurrentView({ id: unreadSubtopic.id, type: 'subtopic' });
          return;
        } else if (topic.exercise && topic.exercise.score === null) {
          this.updateCurrentView({ id: topic.exercise.id, type: 'exercise' });
          return;
        }
      }
    }

    if (content.exam && content.exam.score === null) {
      this.updateCurrentView({ id: content.exam.id, type: 'exam' });
    } else if (content.topics[0]?.subtopics.length > 0) {
      this.updateCurrentView({ id: content.topics[0].subtopics[0].id, type: 'subtopic' });
    }
  }

  updateCurrentView(event: ViewChangeEvent): void {
    const content = this.subjectContent();
    let viewContent: LessonViewState['content'] = null;

    switch (event.type) {
      case 'subtopic':
        viewContent =
          content.topics.flatMap((topic) => topic.subtopics).find((st) => st.id === event.id) || null;
        break;
      case 'exercise':
        viewContent =
          content.topics.map((topic) => topic.exercise).find((ex) => ex?.id === event.id) || null;
        break;
      case 'exam':
        viewContent = content.exam;
        break;
      case 'glossary':
        viewContent = content.glossary;
        break;
      case 'flashcards':
        viewContent = content.topics.find((topic) => topic.id === event.id)?.flashcards || [];
        break;
    }

    this.currentView.set({
      id: event.id,
      type: event.type,
      content: viewContent,
    });

    if (event.type === 'subtopic') {
      this.updateChatMetadata();
      this.markSubtopicAsRead(event.id);
    } else if (this.chatOpen() && (this.currentView().content as { score?: number })?.score == null) {
      this.chatOpen.set(false);
    }

    this.scrollToTop();
  }

  private markSubtopicAsRead(subtopicId: string): void {
    const topicData = this.getTopicDataFromSubtopic();
    if (!topicData.id) return;

    this.lessonService.markSubtopicAsRead(topicData.id, subtopicId).subscribe({
      next: () => {
        this.subjectContent.update((content) => {
          const topics = content.topics.map((topic) => {
            if (topic.id === topicData.id) {
              return {
                ...topic,
                subtopics: topic.subtopics.map((st) => (st.id === subtopicId ? { ...st, read: true } : st)),
              };
            }
            return topic;
          });
          return { ...content, topics };
        });
        this.updateProgress();
        this.checkForTopicCompleteness(topicData.id!);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to mark subtopic as read.');
      },
    });
  }

  updateProgress(): void {
    const content = this.subjectContent();
    let total = 0;
    let completed = 0;

    content.topics.forEach((topic) => {
      if (topic.subtopics?.length) {
        total += topic.subtopics.length;
        completed += topic.subtopics.filter((st) => st.read).length;
      }
      if (topic.exercise) {
        total += 1;
        if (topic.exercise.score != null) completed += 1;
      }
    });

    if (content.exam) {
      total += 1;
      if (content.exam.score != null) completed += 1;
    }

    const fraction = total > 0 ? completed / total : 0;
    this.subjectService.updateSessionProgress(this.subjectId(), fraction).subscribe({
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to update progress.');
      },
    });
  }

  getTopicDataFromSubtopic(): { id?: string; title?: string } {
    const content = this.subjectContent();
    const currentId = this.currentView().id;
    const topic = content.topics?.find((t) => t.subtopics.some((st) => st.id === currentId));
    return { id: topic?.id, title: topic?.title };
  }

  getTopicDataFromExercise(): { id: string | null; title: string | null } {
    const content = this.subjectContent();
    const currentId = this.currentView().id;
  
    const topic = content.topics?.find((t) => t.exercise?.id === currentId);
  
    return {
      id: topic?.id ?? null,
      title: topic?.title ?? null,
    };
  }

  checkForTopicCompleteness(topicId: string | null): void {
    this.subjectContent.update((content) => {
      const topics = content.topics.map((topic) => {
        if (topic.id !== topicId) return topic;

        const allSubtopicsRead = topic.subtopics?.every((st) => st.read) ?? false;
        const hasExerciseScore = topic.exercise ? topic.exercise.score !== null : true;

        return { ...topic, completed: allSubtopicsRead && hasExerciseScore };
      });
      return { ...content, topics };
    });
  }

  getSubtopicPosition(): string[] {
    const content = this.subjectContent();
    const topicData = this.getTopicDataFromSubtopic();
    const topic = content.topics?.find((t) => t.id === topicData.id);
    if (!topic) return [];

    const currentId = this.currentView().id;
    const subtopicIndex = topic.subtopics.findIndex((s) => s.id === currentId);
    const pos: string[] = [];

    if (subtopicIndex === 0) pos.push('top');
    if (subtopicIndex === topic.subtopics.length - 1 && !topic.exercise) pos.push('bottom');

    return pos;
  }

  changeSubtopic(event: SubtopicChangeEvent): void {
    const content = this.subjectContent();
    const topic = content.topics?.find((t) => t.id === event.id);
    if (!topic) return;

    const currentId = this.currentView().id;
    const currentIndex = topic.subtopics.findIndex((s) => s.id === currentId);
    if (currentIndex === -1) return;

    let newIndex = currentIndex + (event.direction === 'next' ? 1 : -1);
    newIndex = Math.max(0, newIndex);

    if (newIndex >= topic.subtopics.length) {
      if (topic.exercise) {
        this.updateCurrentView({ id: topic.exercise.id, type: 'exercise' });
        return;
      }
      newIndex = topic.subtopics.length - 1;
    }

    this.updateCurrentView({ id: topic.subtopics[newIndex].id, type: 'subtopic' });
  }

  updateChatMetadata(questionEvent?: QuestionChangeEvent): void {
    const viewType = this.currentView().type;

    if (viewType === 'subtopic') {
      const topicData = this.getTopicDataFromSubtopic();
      const current = this.currentView().content;

      this.chatMetadata.set({
        topic_id: topicData.id,
        topic_name: topicData.title,
        sub_topic_id: this.currentView().id,
        sub_topic_name: current && !Array.isArray(current) && 'title' in current
          ? current.title
          : null,
        exercise_id: null,
        exam_id: null,
        question_id: null,
      });
    } else if (viewType === 'exercise') {
      const topicData = this.getTopicDataFromExercise();
      this.chatMetadata.set({
        topic_id: topicData.id,
        topic_name: topicData.title,
        sub_topic_id: null,
        sub_topic_name: null,
        exercise_id: '<masked-exercise-id>',
        exam_id: null,
        question_id: questionEvent?.id ?? null,
      });
    } else if (viewType === 'exam') {
      this.chatMetadata.set({
        topic_id: null,
        topic_name: null,
        sub_topic_id: null,
        sub_topic_name: null,
        exercise_id: null,
        exam_id: '<masked-exam-id>',
        question_id: questionEvent?.id ?? null,
      });
    }
  }

  toggleChatPopup(): void {
    this.chatOpen.update((open) => !open);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  scrollToTop(): void {
    this.contentContainer?.nativeElement?.scrollTo({ top: 0 });
  }

  scrollToPosition(pos: number): void {
    const el = this.contentContainer?.nativeElement;
    if (!el) return;
    el.scrollTo({
      top: pos - el.getBoundingClientRect().top + el.scrollTop,
      behavior: 'smooth',
    });
  }

  reorderTopics(topicIds: string[]): void {
    this.subjectService.reorderSubjectTopics(this.subjectId(), topicIds).subscribe();
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

  get isExerciseOrExam(): boolean {
    return this.currentView().type === 'exercise' || this.currentView().type === 'exam';
  }
  
  get questionsCount(): number {
    if (this.isExerciseOrExam) {
      const content = this.currentView().content;
      if (content && 'questions' in content) {
        return content.questions.length;
      }
    }
    return 0;
  }
  
  get score(): number | null {
    if (this.isExerciseOrExam) {
      const content = this.currentView().content;
      if (content && 'score' in content) {
        return content.score || null;
      }
    }
    return null;
  }
}
