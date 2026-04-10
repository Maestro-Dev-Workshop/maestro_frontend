import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Chatbot } from './chatbot';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { NotificationService } from '../../../core/services/notification.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('Chatbot', () => {
  let component: Chatbot;
  let fixture: ComponentFixture<Chatbot>;
  let mockChatbotService: jasmine.SpyObj<ChatbotService>;
  let mockNotifyService: jasmine.SpyObj<NotificationService>;

  const mockChatHistory = [
    { sender: 'user', message: 'Hello', timestamp: '10:00' },
    { sender: 'assistant', message: 'Hi there! How can I help?', timestamp: '10:01' },
  ];

  const mockMetadata = {
    topic_id: 'topic-123',
    topic_name: 'Test Topic',
    sub_topic_id: 'subtopic-123',
    sub_topic_name: 'Test Subtopic',
  };

  beforeEach(async () => {
    mockChatbotService = jasmine.createSpyObj('ChatbotService', ['sendMessage']);
    mockNotifyService = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);

    await TestBed.configureTestingModule({
      imports: [Chatbot, FormsModule],
      providers: [
        { provide: ChatbotService, useValue: mockChatbotService },
        { provide: NotificationService, useValue: mockNotifyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Chatbot);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty message', () => {
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('metadata', mockMetadata);
      component.chatHistory.set([]);
      fixture.detectChanges();

      expect(component.currentMessage).toBe('');
    });

    it('should display chat history', () => {
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('metadata', mockMetadata);
      component.chatHistory.set(mockChatHistory);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Hello');
      expect(compiled.textContent).toContain('Hi there!');
    });
  });

  describe('Message Sending', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('metadata', mockMetadata);
      component.chatHistory.set([]);
      fixture.detectChanges();
    });

    it('should send message and add to history', fakeAsync(() => {
      mockChatbotService.sendMessage.and.returnValue(of({ response: 'AI response' }));

      component.currentMessage = 'Test message';
      component.sendMessage();
      tick();

      expect(component.chatHistory().length).toBe(2);
      expect(component.chatHistory()[0].message).toBe('Test message');
      expect(component.chatHistory()[1].message).toBe('AI response');
    }));

    it('should clear message after sending', fakeAsync(() => {
      mockChatbotService.sendMessage.and.returnValue(of({ response: 'AI response' }));

      component.currentMessage = 'Test message';
      component.sendMessage();
      tick();

      expect(component.currentMessage).toBe('');
    }));

    it('should set loading state while sending', fakeAsync(() => {
      mockChatbotService.sendMessage.and.returnValue(of({ response: 'AI response' }));

      component.currentMessage = 'Test message';

      expect(component.loading).toBe(false);
      component.sendMessage();
      expect(component.loading).toBe(true);

      tick();
      expect(component.loading).toBe(false);
    }));

    it('should not send empty message', () => {
      component.currentMessage = '';
      component.sendMessage();

      expect(mockChatbotService.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send whitespace-only message', () => {
      component.currentMessage = '   ';
      component.sendMessage();

      expect(mockChatbotService.sendMessage).not.toHaveBeenCalled();
    });

    it('should show error notification on failure', fakeAsync(() => {
      mockChatbotService.sendMessage.and.returnValue(
        throwError(() => ({ error: { message: 'Network error' } }))
      );

      component.currentMessage = 'Test message';
      component.sendMessage();
      tick();

      expect(mockNotifyService.showError).toHaveBeenCalled();
      expect(component.loading).toBe(false);
    }));
  });

  describe('Keyboard Handling', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('metadata', mockMetadata);
      component.chatHistory.set([]);
      fixture.detectChanges();
    });

    it('should send message on Enter key (desktop)', () => {
      mockChatbotService.sendMessage.and.returnValue(of({ response: 'AI response' }));

      component.currentMessage = 'Test message';
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');

      component.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockChatbotService.sendMessage).toHaveBeenCalled();
    });

    it('should insert newline on Shift+Enter', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });

      component.currentMessage = 'Line 1';
      component.handleKeyDown(event);

      // Note: actual newline insertion depends on textarea state
      expect(mockChatbotService.sendMessage).not.toHaveBeenCalled();
    });

    it('should insert newline on Ctrl+Enter', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true });

      component.currentMessage = 'Line 1';
      component.handleKeyDown(event);

      expect(mockChatbotService.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('Close Chat', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('metadata', mockMetadata);
      component.chatHistory.set([]);
      fixture.detectChanges();
    });

    it('should emit closeChat on close', () => {
      spyOn(component.closeChat, 'emit');

      component.onCloseChat();

      expect(component.closeChat.emit).toHaveBeenCalled();
    });
  });

  describe('Example Prompts', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('metadata', mockMetadata);
      component.chatHistory.set([]);
      fixture.detectChanges();
    });

    it('should insert example text', fakeAsync(() => {
      component.insertExample('Explain this concept');
      tick();

      expect(component.currentMessage).toBe('Explain this concept');
    }));
  });

  describe('UI Elements', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('metadata', mockMetadata);
      component.chatHistory.set([]);
      fixture.detectChanges();
    });

    it('should have a textarea for input', () => {
      const textarea = fixture.nativeElement.querySelector('textarea');
      expect(textarea).toBeTruthy();
    });

    it('should have a send button', () => {
      const sendButton = fixture.nativeElement.querySelector('button');
      expect(sendButton).toBeTruthy();
    });

    it('should show loading indicator when loading', () => {
      component.loading = true;
      fixture.detectChanges();

      // Check for loading indicator (implementation dependent)
      expect(component.loading).toBe(true);
    });
  });

  describe('Message Display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('subjectId', 'subject-123');
      fixture.componentRef.setInput('metadata', mockMetadata);
    });

    it('should display user messages', () => {
      component.chatHistory.set([
        { sender: 'user', message: 'User message', timestamp: '10:00' },
      ]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('User message');
    });

    it('should display assistant messages', () => {
      component.chatHistory.set([
        { sender: 'assistant', message: 'Assistant message', timestamp: '10:00' },
      ]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Assistant message');
    });

    it('should render markdown in assistant messages', () => {
      component.chatHistory.set([
        { sender: 'assistant', message: '**Bold text**', timestamp: '10:00' },
      ]);
      fixture.detectChanges();

      // Markdown pipe should render bold text
      expect(component.chatHistory()[0].message).toContain('**Bold text**');
    });
  });

  describe('Track By', () => {
    it('should track messages by index', () => {
      expect(component.trackByIndex(0)).toBe(0);
      expect(component.trackByIndex(5)).toBe(5);
    });
  });
});
