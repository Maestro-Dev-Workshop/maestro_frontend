import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Flashcards } from './flashcards';

describe('Flashcards', () => {
  let component: Flashcards;
  let fixture: ComponentFixture<Flashcards>;

  const mockCards = [
    { id: 'fc-1', front: 'What is a variable?', back: 'A named storage location', hint: 'Think of a container' },
    { id: 'fc-2', front: 'What is a function?', back: 'A reusable block of code', hint: 'Performs a task' },
    { id: 'fc-3', front: 'What is a loop?', back: 'Repeated execution of code', hint: 'Goes around' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flashcards],
    }).compileComponents();

    fixture = TestBed.createComponent(Flashcards);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.componentRef.setInput('cards', mockCards);
      fixture.detectChanges();

      expect(component.currentIndex).toBe(0);
      expect(component.showAnswer).toBe(false);
      expect(component.showHint).toBe(false);
    });

    it('should reset state when cards input changes', () => {
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.componentRef.setInput('cards', mockCards);
      fixture.detectChanges();

      component.currentIndex = 2;
      component.showAnswer = true;
      component.showHint = true;

      fixture.componentRef.setInput('cards', [...mockCards]);
      fixture.detectChanges();

      expect(component.currentIndex).toBe(0);
      expect(component.showAnswer).toBe(false);
      expect(component.showHint).toBe(false);
    });
  });

  describe('Card Navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.componentRef.setInput('cards', mockCards);
      fixture.detectChanges();
    });

    it('should set animation class for next card', () => {
      component.nextCard();

      expect(component.currentAnim).toBe('move-left-start');
    });

    it('should set animation class for previous card', () => {
      component.currentIndex = 2;
      component.previousCard();

      expect(component.currentAnim).toBe('move-right-start');
    });

    it('should not go beyond last card', () => {
      component.currentIndex = 2;
      const initialAnim = component.currentAnim;
      component.nextCard();

      expect(component.currentAnim).toBe(initialAnim);
    });

    it('should not go before first card', () => {
      component.currentIndex = 0;
      const initialAnim = component.currentAnim;
      component.previousCard();

      expect(component.currentAnim).toBe(initialAnim);
    });
  });

  describe('Animation Actions', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.componentRef.setInput('cards', mockCards);
      fixture.detectChanges();
    });

    it('should toggle answer on flip-start animation end', () => {
      component.showAnswer = false;
      component.animationAction('flip-start');

      expect(component.showAnswer).toBe(true);
      expect(component.currentAnim).toBe('flip-end');
    });

    it('should clear animation on flip-end', () => {
      component.animationAction('flip-end');

      expect(component.currentAnim).toBe('');
    });

    it('should increment index on move-left-start animation end', () => {
      component.currentIndex = 0;
      component.showAnswer = true;
      component.showHint = true;

      component.animationAction('move-left-start');

      expect(component.currentIndex).toBe(1);
      expect(component.showAnswer).toBe(false);
      expect(component.showHint).toBe(false);
      expect(component.currentAnim).toBe('move-left-end');
    });

    it('should clear animation on move-left-end', () => {
      component.animationAction('move-left-end');

      expect(component.currentAnim).toBe('');
    });

    it('should decrement index on move-right-start animation end', () => {
      component.currentIndex = 2;
      component.showAnswer = true;
      component.showHint = true;

      component.animationAction('move-right-start');

      expect(component.currentIndex).toBe(1);
      expect(component.showAnswer).toBe(false);
      expect(component.showHint).toBe(false);
      expect(component.currentAnim).toBe('move-right-end');
    });

    it('should clear animation on move-right-end', () => {
      component.animationAction('move-right-end');

      expect(component.currentAnim).toBe('');
    });
  });

  describe('Card Flip', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.componentRef.setInput('cards', mockCards);
      fixture.detectChanges();
    });

    it('should set flip animation on toggleAnswer', () => {
      component.toggleAnswer();

      expect(component.currentAnim).toBe('flip-start');
    });
  });

  describe('Hint Toggle', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.componentRef.setInput('cards', mockCards);
      fixture.detectChanges();
    });

    it('should toggle hint visibility', () => {
      expect(component.showHint).toBe(false);

      component.toggleHint();
      expect(component.showHint).toBe(true);

      component.toggleHint();
      expect(component.showHint).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty cards array', () => {
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.componentRef.setInput('cards', []);
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('should handle single card', () => {
      fixture.componentRef.setInput('topicId', 'topic-123');
      fixture.componentRef.setInput('cards', [mockCards[0]]);
      fixture.detectChanges();

      component.nextCard();
      expect(component.currentAnim).not.toBe('move-left-start');

      component.previousCard();
      expect(component.currentAnim).not.toBe('move-right-start');
    });
  });
});
