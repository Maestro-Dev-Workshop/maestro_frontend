import { TestBed } from '@angular/core/testing';
import { SubjectsService } from '../subjects.service';
import { HttpBaseService } from '../http-base.service';
import { of } from 'rxjs';

describe('SubjectsService', () => {
  let service: SubjectsService;
  let mockHttpService: jasmine.SpyObj<HttpBaseService>;

  const mockSubject = {
    id: 'subject-123',
    name: 'Test Subject',
    status: 'in_progress',
    progress: 50,
  };

  beforeEach(() => {
    mockHttpService = jasmine.createSpyObj('HttpBaseService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        SubjectsService,
        { provide: HttpBaseService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(SubjectsService);
  });

  describe('getAllSubjects', () => {
    it('should call GET subjects', () => {
      const mockResponse = { sessions: [mockSubject] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getAllSubjects().subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subjects');
    });
  });

  describe('createSubject', () => {
    it('should call POST subjects', () => {
      const mockResponse = { session: mockSubject };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.createSubject().subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('subjects', {});
    });
  });

  describe('nameSubject', () => {
    it('should call PUT subjects/:id with name', () => {
      const mockResponse = { session: { ...mockSubject, name: 'New Name' } };
      mockHttpService.put.and.returnValue(of(mockResponse));

      service.nameSubject('subject-123', 'New Name').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.put).toHaveBeenCalledWith('subjects/subject-123', { name: 'New Name' });
    });
  });

  describe('getSubject', () => {
    it('should call GET subjects/:id', () => {
      const mockResponse = { session: mockSubject };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getSubject('subject-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subjects/subject-123');
    });
  });

  describe('getSubjectDetails', () => {
    it('should call GET subjects/:id/full', () => {
      const mockResponse = { session: mockSubject, topics: [] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getSubjectDetails('subject-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subjects/subject-123/full');
    });
  });

  describe('getAllSubjectsDetails', () => {
    it('should call GET subjects/full', () => {
      const mockResponse = { sessions: [{ ...mockSubject, topics: [] }] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getAllSubjectsDetails().subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subjects/full');
    });
  });

  describe('ingestDocuments', () => {
    it('should call POST subjects/:id/documents/ingest with FormData', () => {
      const mockResponse = { documents: [{ id: 'doc-1', name: 'test.pdf' }] };
      mockHttpService.post.and.returnValue(of(mockResponse));

      const file1 = new File(['content1'], 'test1.pdf', { type: 'application/pdf' });
      const file2 = new File(['content2'], 'test2.pdf', { type: 'application/pdf' });

      service.ingestDocuments('subject-123', [file1, file2]).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'subjects/subject-123/documents/ingest',
        jasmine.any(FormData)
      );
    });
  });

  describe('labelDocuments', () => {
    it('should call POST subjects/:id/documents/label', () => {
      const mockResponse = { labeled_topics: ['Topic 1', 'Topic 2'] };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.labelDocuments('subject-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('subjects/subject-123/documents/label', {});
    });
  });

  describe('generateFullLesson', () => {
    it('should call POST subjects/:id/generate with topics and settings', () => {
      const mockResponse = { message: 'Generation started' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      const topics = ['Topic 1', 'Topic 2'];
      const userPreference = 'Brief explanations';
      const extensionSettings = { flashcards: true, diagrams: false };

      service.generateFullLesson('subject-123', topics, userPreference, extensionSettings).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('subjects/subject-123/generate', {
        topics,
        user_preference: userPreference,
        extension_settings: extensionSettings,
      });
    });
  });

  describe('updateSessionStatus', () => {
    it('should call PUT subjects/:id/status', () => {
      const mockResponse = { message: 'Status updated' };
      mockHttpService.put.and.returnValue(of(mockResponse));

      service.updateSessionStatus('subject-123', 'completed').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.put).toHaveBeenCalledWith('subjects/subject-123/status', { status: 'completed' });
    });
  });

  describe('updateSessionProgress', () => {
    it('should call PUT subjects/:id/progress', () => {
      const mockResponse = { progress: 75 };
      mockHttpService.put.and.returnValue(of(mockResponse));

      service.updateSessionProgress('subject-123', 75).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.put).toHaveBeenCalledWith('subjects/subject-123/progress', { update_tick: 75 });
    });
  });

  describe('deleteSubject', () => {
    it('should call DELETE subjects/:id', () => {
      const mockResponse = { message: 'Subject deleted' };
      mockHttpService.delete.and.returnValue(of(mockResponse));

      service.deleteSubject('subject-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.delete).toHaveBeenCalledWith('subjects/subject-123');
    });
  });

  describe('reorderSubjectTopics', () => {
    it('should call PUT subjects/:id/topics/reorder with topic IDs', () => {
      const mockResponse = { message: 'Topics reordered' };
      mockHttpService.put.and.returnValue(of(mockResponse));

      const topicIds = ['topic-2', 'topic-1', 'topic-3'];

      service.reorderSubjectTopics('subject-123', topicIds).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.put).toHaveBeenCalledWith('subjects/subject-123/topics/reorder', { topics: topicIds });
    });
  });

  describe('submitFeedback', () => {
    it('should call POST subjects/:id/feedback with rating and comment', () => {
      const mockResponse = { message: 'Feedback submitted' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.submitFeedback('subject-123', 5, 'Great lesson!').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('subjects/subject-123/feedback', {
        rating: 5,
        comment: 'Great lesson!',
      });
    });
  });
});
