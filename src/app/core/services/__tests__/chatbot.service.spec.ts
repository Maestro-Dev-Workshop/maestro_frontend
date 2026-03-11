import { TestBed } from '@angular/core/testing';
import { ChatbotService } from '../chatbot.service';
import { HttpBaseService } from '../http-base.service';
import { of } from 'rxjs';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let mockHttpService: jasmine.SpyObj<HttpBaseService>;

  const mockChatHistory = [
    { sender: 'user', message: 'Hello', timestamp: '10:00' },
    { sender: 'assistant', message: 'Hi there!', timestamp: '10:01' },
  ];

  const mockMetadata = {
    topic_id: 'topic-123',
    topic_name: 'Test Topic',
    sub_topic_id: 'subtopic-123',
    sub_topic_name: 'Test Subtopic',
  };

  beforeEach(() => {
    mockHttpService = jasmine.createSpyObj('HttpBaseService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ChatbotService,
        { provide: HttpBaseService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(ChatbotService);
  });

  describe('sendMessage', () => {
    it('should call POST chatbot/:id/messages with message and metadata', () => {
      const mockResponse = { response: 'AI response text' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.sendMessage('subject-123', 'What is an algorithm?', mockMetadata).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('chatbot/subject-123/messages', {
        message: 'What is an algorithm?',
        metadata: mockMetadata,
      });
    });

    it('should handle long messages', () => {
      const longMessage = 'A'.repeat(1000);
      const mockResponse = { response: 'Response' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.sendMessage('subject-123', longMessage, mockMetadata).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('chatbot/subject-123/messages', {
        message: longMessage,
        metadata: mockMetadata,
      });
    });

    it('should handle different metadata', () => {
      const differentMetadata = {
        topic_id: 'topic-456',
        topic_name: 'Different Topic',
        sub_topic_id: 'subtopic-789',
        sub_topic_name: 'Different Subtopic',
      };
      const mockResponse = { response: 'Response' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.sendMessage('subject-123', 'Question', differentMetadata).subscribe();

      expect(mockHttpService.post).toHaveBeenCalledWith('chatbot/subject-123/messages', {
        message: 'Question',
        metadata: differentMetadata,
      });
    });
  });

  describe('getChatHistory', () => {
    it('should call GET chatbot/:id/history', () => {
      const mockResponse = { history: mockChatHistory };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getChatHistory('subject-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('chatbot/subject-123/history');
    });

    it('should handle empty history', () => {
      const mockResponse = { history: [] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getChatHistory('subject-123').subscribe((result) => {
        expect(result.history.length).toBe(0);
      });
    });

    it('should return history for different subjects', () => {
      const mockResponse = { history: mockChatHistory };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getChatHistory('subject-456').subscribe();

      expect(mockHttpService.get).toHaveBeenCalledWith('chatbot/subject-456/history');
    });
  });
});
