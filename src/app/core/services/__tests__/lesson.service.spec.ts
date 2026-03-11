import { TestBed } from '@angular/core/testing';
import { LessonService } from '../lesson.service';
import { HttpBaseService } from '../http-base.service';
import { of } from 'rxjs';

describe('LessonService', () => {
  let service: LessonService;
  let mockHttpService: jasmine.SpyObj<HttpBaseService>;

  const mockTopic = {
    id: 'topic-123',
    title: 'Test Topic',
    subtopics: [],
  };

  const mockExercise = {
    id: 'exercise-123',
    questions: [],
  };

  beforeEach(() => {
    mockHttpService = jasmine.createSpyObj('HttpBaseService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        LessonService,
        { provide: HttpBaseService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(LessonService);
  });

  describe('getAllTopics', () => {
    it('should call GET subjects/:id/topics', () => {
      const mockResponse = { topics: [mockTopic] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getAllTopics('subject-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subjects/subject-123/topics');
    });
  });

  describe('getAllSubtopics', () => {
    it('should call GET topics/:id', () => {
      const mockResponse = { subtopics: [{ id: 'st-1', title: 'Subtopic 1' }] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getAllSubtopics('topic-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('topics/topic-123');
    });
  });

  describe('getExercise', () => {
    it('should call GET topics/:id/exercise', () => {
      const mockResponse = { exercise: mockExercise };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getExercise('topic-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('topics/topic-123/exercise');
    });
  });

  describe('getExam', () => {
    it('should call GET subjects/:id/exam', () => {
      const mockResponse = { exam: { id: 'exam-123', questions: [] } };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getExam('subject-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subjects/subject-123/exam');
    });
  });

  describe('scoreEssayQuestion', () => {
    it('should call POST chatbot/questions/evaluate with question data', () => {
      const mockResponse = { correct: true, feedback: 'Good answer!' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.scoreEssayQuestion('subject-123', 'question-123', 'My answer').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('chatbot/questions/evaluate', {
        session_id: 'subject-123',
        question_id: 'question-123',
        answer: 'My answer',
      });
    });

    it('should handle null answer', () => {
      const mockResponse = { correct: false, feedback: 'No answer provided' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.scoreEssayQuestion('subject-123', 'question-123', null).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('chatbot/questions/evaluate', {
        session_id: 'subject-123',
        question_id: 'question-123',
        answer: null,
      });
    });
  });

  describe('markSubtopicAsRead', () => {
    it('should call PUT topics/:id/read with subtopic_id', () => {
      const mockResponse = { message: 'Marked as read' };
      mockHttpService.put.and.returnValue(of(mockResponse));

      service.markSubtopicAsRead('topic-123', 'subtopic-456').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.put).toHaveBeenCalledWith('topics/topic-123/read', { subtopic_id: 'subtopic-456' });
    });
  });

  describe('saveExerciseScore', () => {
    it('should call PUT topics/:id/exercise/score with score data', () => {
      const mockResponse = { message: 'Score saved' };
      mockHttpService.put.and.returnValue(of(mockResponse));

      const questionData = [
        { id: 'q1', correct: true },
        { id: 'q2', correct: false },
      ];

      service.saveExerciseScore('topic-123', 'exercise-123', 80, questionData).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.put).toHaveBeenCalledWith('topics/topic-123/exercise/score', {
        exercise_id: 'exercise-123',
        score: 80,
        question_data: questionData,
      });
    });

    it('should handle undefined values', () => {
      const mockResponse = { message: 'Score saved' };
      mockHttpService.put.and.returnValue(of(mockResponse));

      service.saveExerciseScore(undefined, undefined, undefined, undefined).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.put).toHaveBeenCalledWith('topics/undefined/exercise/score', {
        exercise_id: undefined,
        score: undefined,
        question_data: undefined,
      });
    });
  });

  describe('saveExamScore', () => {
    it('should call PUT subjects/:id/exam/score with score data', () => {
      const mockResponse = { message: 'Score saved' };
      mockHttpService.put.and.returnValue(of(mockResponse));

      const questionData = [
        { id: 'q1', correct: true },
        { id: 'q2', correct: true },
      ];

      service.saveExamScore('subject-123', 'exam-123', 100, questionData).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.put).toHaveBeenCalledWith('subjects/subject-123/exam/score', {
        exam_id: 'exam-123',
        score: 100,
        question_data: questionData,
      });
    });
  });

  describe('getGlossary', () => {
    it('should call GET subjects/:id/glossary', () => {
      const mockResponse = { glossary: [{ term: 'API', definition: 'Interface' }] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getGlossary('subject-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subjects/subject-123/glossary');
    });
  });

  describe('getFlashcards', () => {
    it('should call GET topics/:id/flashcards', () => {
      const mockResponse = { flashcards: [{ front: 'Q', back: 'A' }] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getFlashcards('topic-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('topics/topic-123/flashcards');
    });
  });

  describe('executeCodeBlock', () => {
    it('should call POST topics/code/execute with code and language', () => {
      const mockResponse = { result: { stdout: 'Hello', stderr: '', exit_code: 0 } };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.executeCodeBlock('print("Hello")', 'python').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('topics/code/execute', {
        code: 'print("Hello")',
        language: 'python',
      });
    });

    it('should handle different languages', () => {
      const mockResponse = { result: { stdout: '5', stderr: '', exit_code: 0 } };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.executeCodeBlock('console.log(2+3)', 'javascript').subscribe();

      expect(mockHttpService.post).toHaveBeenCalledWith('topics/code/execute', {
        code: 'console.log(2+3)',
        language: 'javascript',
      });
    });
  });
});
