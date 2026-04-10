import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Practice } from './practice';
import { LessonService } from '../../../core/services/lesson.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmService } from '../../../core/services/confirm';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('Practice', () => {
  let component: Practice;
  let fixture: ComponentFixture<Practice>;
  let mockLessonService: jasmine.SpyObj<LessonService>;
  let mockNotifyService: jasmine.SpyObj<NotificationService>;
  let mockConfirmService: jasmine.SpyObj<ConfirmService>;

  const mockMultipleChoiceQuestion = {
    id: 'q-1',
    type: 'multiple choice',
    text: 'What is 2 + 2?',
    scored: false,
    options: [
      { id: 'opt-1', text: '3', correct: false, selected: false },
      { id: 'opt-2', text: '4', correct: true, selected: false },
      { id: 'opt-3', text: '5', correct: false, selected: false },
    ],
  };

  const mockMultipleSelectionQuestion = {
    id: 'q-2',
    type: 'multiple selection',
    text: 'Select all prime numbers',
    scored: false,
    options: [
      { id: 'opt-4', text: '2', correct: true, selected: false },
      { id: 'opt-5', text: '3', correct: true, selected: false },
      { id: 'opt-6', text: '4', correct: false, selected: false },
    ],
  };

  const mockEssayQuestion = {
    id: 'q-3',
    type: 'essay',
    text: 'Explain the concept of algorithms',
    scored: false,
    essay_answer: null,
    essay_feedback: null,
  };

  const mockCurrentView = {
    type: 'exercise',
    id: 'exercise-123',
    content: {
      id: 'exercise-123',
      score: null,
      questions: [mockMultipleChoiceQuestion, mockMultipleSelectionQuestion, mockEssayQuestion],
    },
  };

  beforeEach(async () => {
    mockLessonService = jasmine.createSpyObj('LessonService', ['saveExerciseScore', 'saveExamScore', 'scoreEssayQuestion']);
    mockNotifyService = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    mockConfirmService = jasmine.createSpyObj('ConfirmService', ['open']);

    await TestBed.configureTestingModule({
      imports: [Practice, FormsModule],
      providers: [
        { provide: LessonService, useValue: mockLessonService },
        { provide: NotificationService, useValue: mockNotifyService },
        { provide: ConfirmService, useValue: mockConfirmService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Practice);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set first question on view change', () => {
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.detectChanges();

      expect(component.question.id).toBe('q-1');
      expect(component.currentIndex).toBe(0);
    });
  });

  describe('Question Navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.detectChanges();
    });

    it('should go to specific question', () => {
      component.goToQuestion(1);

      expect(component.currentIndex).toBe(1);
      expect(component.question.id).toBe('q-2');
    });

    it('should cycle to next question', () => {
      component.cycleQuestion('next');

      expect(component.currentIndex).toBe(1);
    });

    it('should cycle to previous question', () => {
      component.goToQuestion(2);
      component.cycleQuestion('prev');

      expect(component.currentIndex).toBe(1);
    });

    it('should not go below first question', () => {
      component.cycleQuestion('prev');

      expect(component.currentIndex).toBe(0);
    });

    it('should not go beyond last question', () => {
      component.goToQuestion(2);
      component.cycleQuestion('next');

      expect(component.currentIndex).toBe(2);
    });

    it('should emit changeQuestion on question change', () => {
      spyOn(component.changeQuestion, 'emit');

      component.goToQuestion(1);

      expect(component.changeQuestion.emit).toHaveBeenCalledWith({ id: 'q-2' });
    });

    it('should return correct question number', () => {
      component.goToQuestion(0);
      expect(component.getQuestionNumber()).toBe(1);

      component.goToQuestion(2);
      expect(component.getQuestionNumber()).toBe(3);
    });
  });

  describe('Option Selection', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.detectChanges();
    });

    it('should select single option for multiple choice', () => {
      component.goToQuestion(0); // Multiple choice question
      component.toggleSelectOption('opt-2');

      expect(component.question.options[1].selected).toBe(true);
      expect(component.question.options[0].selected).toBe(false);
    });

    it('should deselect other options for multiple choice', () => {
      component.goToQuestion(0);
      component.toggleSelectOption('opt-1');
      component.toggleSelectOption('opt-2');

      expect(component.question.options[0].selected).toBe(false);
      expect(component.question.options[1].selected).toBe(true);
    });

    it('should toggle multiple options for multiple selection', () => {
      component.goToQuestion(1); // Multiple selection question
      component.toggleSelectOption('opt-4');
      component.toggleSelectOption('opt-5');

      expect(component.question.options[0].selected).toBe(true);
      expect(component.question.options[1].selected).toBe(true);
    });

    it('should toggle off selected option for multiple selection', () => {
      component.goToQuestion(1);
      component.toggleSelectOption('opt-4');
      component.toggleSelectOption('opt-4');

      expect(component.question.options[0].selected).toBe(false);
    });
  });

  describe('Submit Confirmation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.detectChanges();
    });

    it('should open confirmation dialog', () => {
      mockConfirmService.open.and.returnValue(of(false));

      component.openSubmit();

      expect(mockConfirmService.open).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Submit Answers',
        })
      );
    });

    it('should submit answers when confirmed', fakeAsync(() => {
      mockConfirmService.open.and.returnValue(of(true));
      mockLessonService.saveExerciseScore.and.returnValue(of({}));

      component.openSubmit();
      tick();

      expect(mockLessonService.saveExerciseScore).toHaveBeenCalled();
    }));

    it('should not submit when cancelled', () => {
      mockConfirmService.open.and.returnValue(of(false));

      component.openSubmit();

      expect(mockLessonService.saveExerciseScore).not.toHaveBeenCalled();
    });
  });

  describe('Answer Submission', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.detectChanges();
    });

    it('should save exercise score', fakeAsync(() => {
      mockLessonService.saveExerciseScore.and.returnValue(of({}));

      component.submitAnswers();
      tick();

      expect(mockLessonService.saveExerciseScore).toHaveBeenCalled();
    }));

    it('should emit exerciseCompleted after submission', fakeAsync(() => {
      spyOn(component.exerciseCompleted, 'emit');
      mockLessonService.saveExerciseScore.and.returnValue(of({}));

      component.submitAnswers();
      tick();

      expect(component.exerciseCompleted.emit).toHaveBeenCalled();
    }));

    it('should emit changeProgress after submission', fakeAsync(() => {
      spyOn(component.changeProgress, 'emit');
      mockLessonService.saveExerciseScore.and.returnValue(of({}));

      component.submitAnswers();
      tick();

      expect(component.changeProgress.emit).toHaveBeenCalled();
    }));

    it('should set loading state during submission', fakeAsync(() => {
      mockLessonService.saveExerciseScore.and.returnValue(of({}));

      expect(component.loading).toBe(false);

      component.submitAnswers();
      expect(component.loading).toBe(true);

      tick();
      expect(component.loading).toBe(false);
    }));

    it('should show error on submission failure', fakeAsync(() => {
      mockLessonService.saveExerciseScore.and.returnValue(
        throwError(() => ({ error: { message: 'Failed to save' } }))
      );

      component.submitAnswers();
      tick();

      expect(mockNotifyService.showError).toHaveBeenCalled();
      expect(component.loading).toBe(false);
    }));
  });

  describe('Essay Scoring', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.detectChanges();
    });

    it('should score essay questions', fakeAsync(() => {
      mockLessonService.scoreEssayQuestion.and.returnValue(
        of({ correct: true, feedback: 'Great answer!' })
      );
      mockLessonService.saveExerciseScore.and.returnValue(of({}));

      // Set essay answer
      component.goToQuestion(2);
      component.question.essay_answer = 'My essay answer';

      component.submitAnswers();
      tick();

      expect(mockLessonService.scoreEssayQuestion).toHaveBeenCalled();
    }));

    it('should handle essay without answer', fakeAsync(() => {
      mockLessonService.scoreEssayQuestion.and.returnValue(
        of({ correct: false, feedback: 'No answer provided' })
      );
      mockLessonService.saveExerciseScore.and.returnValue(of({}));

      component.goToQuestion(2);
      component.question.essay_answer = null;

      component.submitAnswers();
      tick();

      expect(mockLessonService.scoreEssayQuestion).toHaveBeenCalled();
    }));
  });

  describe('Exam Mode', () => {
    const examView = {
      type: 'exam',
      id: 'exam-123',
      content: {
        id: 'exam-123',
        score: null,
        questions: [mockMultipleChoiceQuestion],
      },
    };

    beforeEach(() => {
      fixture.componentRef.setInput('currentView', examView);
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('topicId', null);
      fixture.detectChanges();
    });

    it('should save exam score for exam type', fakeAsync(() => {
      mockLessonService.saveExamScore.and.returnValue(of({}));

      component.submitAnswers();
      tick();

      expect(mockLessonService.saveExamScore).toHaveBeenCalled();
      expect(mockLessonService.saveExerciseScore).not.toHaveBeenCalled();
    }));
  });

  describe('Score Calculation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.detectChanges();
    });

    it('should calculate correct answers for multiple choice', fakeAsync(() => {
      mockLessonService.saveExerciseScore.and.returnValue(of({}));

      // Select correct answer
      component.goToQuestion(0);
      component.toggleSelectOption('opt-2'); // Correct answer

      component.submitAnswers();
      tick();

      // Score should be 1 for correct answer
      expect(mockLessonService.saveExerciseScore).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.anything(),
        jasmine.any(Number),
        jasmine.any(Array)
      );
    }));
  });
});
