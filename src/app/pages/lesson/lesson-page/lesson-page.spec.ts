import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LessonPage } from './lesson-page';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SubjectsService } from '../../../core/services/subjects.service';
import { LessonService } from '../../../core/services/lesson.service';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { NotificationService } from '../../../core/services/notification.service';
import { OnboardingService } from '../../../core/services/onboarding.service';

describe('LessonPage', () => {
  let component: LessonPage;
  let fixture: ComponentFixture<LessonPage>;
  let mockSubjectService: jasmine.SpyObj<SubjectsService>;
  let mockLessonService: jasmine.SpyObj<LessonService>;
  let mockChatbotService: jasmine.SpyObj<ChatbotService>;
  let mockNotifyService: jasmine.SpyObj<NotificationService>;
  let mockOnboardingService: jasmine.SpyObj<OnboardingService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockSubject = {
    id: 'subject-123',
    name: 'Test Subject',
    status: 'in_progress',
  };

  const mockTopics = [
    {
      id: 'topic-1',
      title: 'Topic 1',
      selected: true,
      completed: false,
    },
  ];

  const mockSubtopics = [
    { id: 'subtopic-1', title: 'Subtopic 1', read: false },
    { id: 'subtopic-2', title: 'Subtopic 2', read: false },
  ];

  const mockExercise = {
    id: 'exercise-1',
    score: null,
    questions: [],
  };

  const mockFlashcards = [
    { id: 'fc-1', front: 'Q1', back: 'A1' },
  ];

  const mockExam = {
    id: 'exam-1',
    score: null,
    questions: [],
  };

  const mockGlossary = [
    { term: 'Algorithm', definition: 'A step-by-step procedure' },
  ];

  beforeEach(async () => {
    mockSubjectService = jasmine.createSpyObj('SubjectsService', ['getSubject', 'updateSessionProgress', 'reorderSubjectTopics']);
    mockLessonService = jasmine.createSpyObj('LessonService', ['getAllTopics', 'getAllSubtopics', 'getExercise', 'getFlashcards', 'getExam', 'getGlossary', 'markSubtopicAsRead']);
    mockChatbotService = jasmine.createSpyObj('ChatbotService', ['getChatHistory']);
    mockNotifyService = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    mockOnboardingService = jasmine.createSpyObj('OnboardingService', ['currentStepIndex', 'startOnboarding', 'nextStep', 'getObjectPosition']);
    mockOnboardingService.currentStepIndex.and.returnValue(-1);
    mockOnboardingService.getObjectPosition.and.returnValue({ top: 0, left: 0, bottom: 0, right: 0 });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    (mockRouter as any).currentNavigation = jasmine.createSpy('currentNavigation').and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [LessonPage],
      providers: [
        { provide: SubjectsService, useValue: mockSubjectService },
        { provide: LessonService, useValue: mockLessonService },
        { provide: ChatbotService, useValue: mockChatbotService },
        { provide: NotificationService, useValue: mockNotifyService },
        { provide: OnboardingService, useValue: mockOnboardingService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ subjectId: 'subject-123' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonPage);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load lesson data on init', fakeAsync(() => {
      mockSubjectService.getSubject.and.returnValue(of({ session: mockSubject }));
      mockLessonService.getAllTopics.and.returnValue(of({ topics: mockTopics }));
      mockLessonService.getAllSubtopics.and.returnValue(of({ subtopics: mockSubtopics }));
      mockLessonService.getExercise.and.returnValue(of({ exercise: mockExercise }));
      mockLessonService.getFlashcards.and.returnValue(of({ flashcards: mockFlashcards }));
      mockLessonService.getExam.and.returnValue(of({ exam: mockExam }));
      mockLessonService.getGlossary.and.returnValue(of({ glossary: mockGlossary }));
      mockChatbotService.getChatHistory.and.returnValue(of({ history: [] }));

      fixture.detectChanges();
      tick();

      expect(component.subjectId()).toBe('subject-123');
      expect(component.subjectLoading()).toBe(false);
    }));

    it('should show error on failed load', fakeAsync(() => {
      mockSubjectService.getSubject.and.returnValue(
        throwError(() => ({ error: { message: 'Failed to load' } }))
      );
      mockChatbotService.getChatHistory.and.returnValue(of({ history: [] }));

      fixture.detectChanges();
      tick();

      expect(mockNotifyService.showError).toHaveBeenCalled();
    }));
  });

  describe('View Navigation', () => {
    beforeEach(fakeAsync(() => {
      mockSubjectService.getSubject.and.returnValue(of({ session: mockSubject }));
      mockLessonService.getAllTopics.and.returnValue(of({ topics: mockTopics }));
      mockLessonService.getAllSubtopics.and.returnValue(of({ subtopics: mockSubtopics }));
      mockLessonService.getExercise.and.returnValue(of({ exercise: mockExercise }));
      mockLessonService.getFlashcards.and.returnValue(of({ flashcards: mockFlashcards }));
      mockLessonService.getExam.and.returnValue(of({ exam: mockExam }));
      mockLessonService.getGlossary.and.returnValue(of({ glossary: mockGlossary }));
      mockChatbotService.getChatHistory.and.returnValue(of({ history: [] }));
      mockLessonService.markSubtopicAsRead.and.returnValue(of({}));
      mockSubjectService.updateSessionProgress.and.returnValue(of({}));

      fixture.detectChanges();
      tick();
    }));

    it('should set initial view to first unread subtopic', () => {
      expect(component.currentView().type).toBe('subtopic');
    });

    it('should update current view', () => {
      component.updateCurrentView({ id: 'subtopic-2', type: 'subtopic' });

      expect(component.currentView().id).toBe('subtopic-2');
      expect(component.currentView().type).toBe('subtopic');
    });

    it('should switch to exercise view', () => {
      component.updateCurrentView({ id: 'exercise-1', type: 'exercise' });

      expect(component.currentView().type).toBe('exercise');
    });

    it('should switch to exam view', () => {
      component.updateCurrentView({ id: 'exam-1', type: 'exam' });

      expect(component.currentView().type).toBe('exam');
    });

    it('should switch to glossary view', () => {
      component.updateCurrentView({ id: 'glossary', type: 'glossary' });

      expect(component.currentView().type).toBe('glossary');
    });

    it('should switch to flashcards view', () => {
      component.updateCurrentView({ id: 'topic-1', type: 'flashcards' });

      expect(component.currentView().type).toBe('flashcards');
    });
  });

  describe('Subtopic Navigation', () => {
    beforeEach(fakeAsync(() => {
      mockSubjectService.getSubject.and.returnValue(of({ session: mockSubject }));
      mockLessonService.getAllTopics.and.returnValue(of({ topics: mockTopics }));
      mockLessonService.getAllSubtopics.and.returnValue(of({ subtopics: mockSubtopics }));
      mockLessonService.getExercise.and.returnValue(of({ exercise: mockExercise }));
      mockLessonService.getFlashcards.and.returnValue(of({ flashcards: mockFlashcards }));
      mockLessonService.getExam.and.returnValue(of({ exam: mockExam }));
      mockLessonService.getGlossary.and.returnValue(of({ glossary: mockGlossary }));
      mockChatbotService.getChatHistory.and.returnValue(of({ history: [] }));
      mockLessonService.markSubtopicAsRead.and.returnValue(of({}));
      mockSubjectService.updateSessionProgress.and.returnValue(of({}));

      fixture.detectChanges();
      tick();
    }));

    it('should cycle to next subtopic', () => {
      component.updateCurrentView({ id: 'subtopic-1', type: 'subtopic' });
      component.changeSubtopic({ id: 'topic-1', direction: 'next' });

      expect(component.currentView().id).toBe('subtopic-2');
    });

    it('should cycle to previous subtopic', () => {
      component.updateCurrentView({ id: 'subtopic-2', type: 'subtopic' });
      component.changeSubtopic({ id: 'topic-1', direction: 'prev' });

      expect(component.currentView().id).toBe('subtopic-1');
    });

    it('should mark subtopic as read when viewed', fakeAsync(() => {
      component.updateCurrentView({ id: 'subtopic-1', type: 'subtopic' });
      tick();

      expect(mockLessonService.markSubtopicAsRead).toHaveBeenCalled();
    }));
  });

  describe('Chat', () => {
    beforeEach(fakeAsync(() => {
      mockSubjectService.getSubject.and.returnValue(of({ session: mockSubject }));
      mockLessonService.getAllTopics.and.returnValue(of({ topics: mockTopics }));
      mockLessonService.getAllSubtopics.and.returnValue(of({ subtopics: mockSubtopics }));
      mockLessonService.getExercise.and.returnValue(of({ exercise: mockExercise }));
      mockLessonService.getFlashcards.and.returnValue(of({ flashcards: mockFlashcards }));
      mockLessonService.getExam.and.returnValue(of({ exam: mockExam }));
      mockLessonService.getGlossary.and.returnValue(of({ glossary: mockGlossary }));
      mockChatbotService.getChatHistory.and.returnValue(
        of({ history: [{ sender: 'user', message: 'Hello' }] })
      );
      mockLessonService.markSubtopicAsRead.and.returnValue(of({}));
      mockSubjectService.updateSessionProgress.and.returnValue(of({}));

      fixture.detectChanges();
      tick();
    }));

    it('should load chat history', () => {
      expect(component.chatHistory().length).toBe(1);
    });

    it('should toggle chat popup', () => {
      expect(component.chatOpen()).toBe(false);

      component.toggleChatPopup();
      expect(component.chatOpen()).toBe(true);

      component.toggleChatPopup();
      expect(component.chatOpen()).toBe(false);
    });

    it('should update chat metadata when viewing subtopic', fakeAsync(() => {
      component.updateCurrentView({ id: 'subtopic-1', type: 'subtopic' });
      tick();

      const metadata = component.chatMetadata();
      expect(metadata.sub_topic_id).toBe('subtopic-1');
    }));
  });

  describe('Sidebar', () => {
    it('should toggle sidebar', () => {
      expect(component.sidebarOpen()).toBe(false);

      component.toggleSidebar();
      expect(component.sidebarOpen()).toBe(true);

      component.toggleSidebar();
      expect(component.sidebarOpen()).toBe(false);
    });
  });

  describe('Progress', () => {
    beforeEach(fakeAsync(() => {
      mockSubjectService.getSubject.and.returnValue(of({ session: mockSubject }));
      mockLessonService.getAllTopics.and.returnValue(of({ topics: mockTopics }));
      mockLessonService.getAllSubtopics.and.returnValue(of({ subtopics: mockSubtopics }));
      mockLessonService.getExercise.and.returnValue(of({ exercise: mockExercise }));
      mockLessonService.getFlashcards.and.returnValue(of({ flashcards: mockFlashcards }));
      mockLessonService.getExam.and.returnValue(of({ exam: mockExam }));
      mockLessonService.getGlossary.and.returnValue(of({ glossary: mockGlossary }));
      mockChatbotService.getChatHistory.and.returnValue(of({ history: [] }));
      mockLessonService.markSubtopicAsRead.and.returnValue(of({}));
      mockSubjectService.updateSessionProgress.and.returnValue(of({}));

      fixture.detectChanges();
      tick();
    }));

    it('should update progress when subtopic marked as read', fakeAsync(() => {
      component.updateCurrentView({ id: 'subtopic-1', type: 'subtopic' });
      tick();

      expect(mockSubjectService.updateSessionProgress).toHaveBeenCalled();
    }));
  });

  describe('Topic Reordering', () => {
    beforeEach(fakeAsync(() => {
      mockSubjectService.getSubject.and.returnValue(of({ session: mockSubject }));
      mockLessonService.getAllTopics.and.returnValue(of({ topics: mockTopics }));
      mockLessonService.getAllSubtopics.and.returnValue(of({ subtopics: mockSubtopics }));
      mockLessonService.getExercise.and.returnValue(of({ exercise: mockExercise }));
      mockLessonService.getFlashcards.and.returnValue(of({ flashcards: mockFlashcards }));
      mockLessonService.getExam.and.returnValue(of({ exam: mockExam }));
      mockLessonService.getGlossary.and.returnValue(of({ glossary: mockGlossary }));
      mockChatbotService.getChatHistory.and.returnValue(of({ history: [] }));
      mockLessonService.markSubtopicAsRead.and.returnValue(of({}));
      mockSubjectService.updateSessionProgress.and.returnValue(of({}));
      mockSubjectService.reorderSubjectTopics.and.returnValue(of({}));

      fixture.detectChanges();
      tick();
    }));

    it('should reorder topics', () => {
      component.reorderTopics([{ id: 'topic-1' }]);

      expect(mockSubjectService.reorderSubjectTopics).toHaveBeenCalled();
    });
  });

  describe('Onboarding', () => {
    it('should cycle onboarding steps', () => {
      component.cycleOnboarding();

      expect(mockOnboardingService.nextStep).toHaveBeenCalled();
    });
  });

  describe('Utilities', () => {
    it('should capitalize first letter', () => {
      expect(component.capitalizeFirstLetter('hello')).toBe('Hello');
      expect(component.capitalizeFirstLetter('WORLD')).toBe('World');
    });
  });
});
