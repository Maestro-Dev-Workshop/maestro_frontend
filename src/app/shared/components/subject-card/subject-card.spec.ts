import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectCard, SubjectCardData } from './subject-card';
import { SubjectStatus } from '../../../core/models/subject-status.model';

describe('SubjectCard', () => {
  let component: SubjectCard;
  let fixture: ComponentFixture<SubjectCard>;

  const mockSubject: SubjectCardData = {
    id: 'subject-123',
    name: 'Test Subject',
    status: SubjectStatus.IN_PROGRESS,
    completion: 50,
    topics: [{ id: 'topic-1', title: 'Topic 1' }],
    extensions: [{ id: 'ext-1', type: 'quiz' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectCard);
    component = fixture.componentInstance;
  });

  describe('Rendering', () => {
    it('should create', () => {
      fixture.componentRef.setInput('subject', mockSubject);
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should display subject name', () => {
      fixture.componentRef.setInput('subject', mockSubject);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Test Subject');
    });

    it('should show "Untitled" for empty name', () => {
      fixture.componentRef.setInput('subject', { ...mockSubject, name: '' });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Untitled');
    });

    it('should display completion percentage', () => {
      fixture.componentRef.setInput('subject', mockSubject);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('50%');
    });

    it('should show correct number of topics', () => {
      fixture.componentRef.setInput('subject', mockSubject);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('1 topic');
    });

    it('should show "NA" for zero topics', () => {
      fixture.componentRef.setInput('subject', { ...mockSubject, topics: [] });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('NA');
    });

    it('should display extension tags (max 2 + overflow)', () => {
      const subjectWithManyExtensions = {
        ...mockSubject,
        extensions: [
          { id: '1', type: 'quiz' },
          { id: '2', type: 'flashcards' },
          { id: '3', type: 'exam' },
          { id: '4', type: 'glossary' },
        ],
      };
      fixture.componentRef.setInput('subject', subjectWithManyExtensions);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('+2');
    });
  });

  describe('Computed Values', () => {
    it('should return yellow border for pending status', () => {
      fixture.componentRef.setInput('subject', {
        ...mockSubject,
        status: SubjectStatus.PENDING_NAMING,
      });
      fixture.detectChanges();

      expect(component.borderColor()).toBe('#EAAA08');
    });

    it('should return blue border for in-progress status', () => {
      fixture.componentRef.setInput('subject', {
        ...mockSubject,
        status: SubjectStatus.IN_PROGRESS,
      });
      fixture.detectChanges();

      expect(component.borderColor()).toBe('var(--text-primary-hover)');
    });

    it('should return green border for completed status', () => {
      fixture.componentRef.setInput('subject', {
        ...mockSubject,
        status: SubjectStatus.COMPLETED,
      });
      fixture.detectChanges();

      expect(component.borderColor()).toBe('#45AD40');
    });

    it('should calculate progress offset correctly', () => {
      fixture.componentRef.setInput('subject', mockSubject);
      fixture.detectChanges();

      // 50% completion = 87.96 - (87.96 * 50 / 100) = 43.98
      expect(component.progressOffset()).toBeCloseTo(43.98, 1);
    });

    it('should show "Continue" button for in-progress', () => {
      fixture.componentRef.setInput('subject', {
        ...mockSubject,
        status: SubjectStatus.IN_PROGRESS,
      });
      fixture.detectChanges();

      expect(component.buttonText()).toBe('Continue');
    });

    it('should show "Completed" button for completed', () => {
      fixture.componentRef.setInput('subject', {
        ...mockSubject,
        status: SubjectStatus.COMPLETED,
      });
      fixture.detectChanges();

      expect(component.buttonText()).toBe('Completed');
    });

    it('should show "Resume Setup" button for pending', () => {
      fixture.componentRef.setInput('subject', {
        ...mockSubject,
        status: SubjectStatus.PENDING_NAMING,
      });
      fixture.detectChanges();

      expect(component.buttonText()).toBe('Resume Setup');
    });
  });

  describe('Events', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('subject', mockSubject);
      fixture.detectChanges();
    });

    it('should emit cardClick on card click', () => {
      spyOn(component.cardClick, 'emit');

      const card = fixture.nativeElement.querySelector('[role="button"]');
      card.click();

      expect(component.cardClick.emit).toHaveBeenCalledWith(mockSubject);
    });

    it('should emit contextMenu on right-click', () => {
      spyOn(component.contextMenu, 'emit');

      const card = fixture.nativeElement.querySelector('[role="button"]');
      const event = new MouseEvent('contextmenu', { bubbles: true });
      card.dispatchEvent(event);

      expect(component.contextMenu.emit).toHaveBeenCalled();
    });

    it('should emit continueClick on button click', () => {
      spyOn(component.continueClick, 'emit');

      const button = fixture.nativeElement.querySelector('button[title="Continue"]');
      const event = new MouseEvent('click', { bubbles: true });
      button.dispatchEvent(event);

      expect(component.continueClick.emit).toHaveBeenCalled();
    });

    it('should not emit when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      spyOn(component.cardClick, 'emit');

      const card = fixture.nativeElement.querySelector('[role="button"]');
      card.click();

      expect(component.cardClick.emit).not.toHaveBeenCalled();
    });
  });
});
