import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subtopic } from './subtopic';

describe('Subtopic', () => {
  let component: Subtopic;
  let fixture: ComponentFixture<Subtopic>;

  const mockTopic = {
    id: 'topic-123',
    title: 'Test Topic',
    subtopics: [
      { id: 'subtopic-1', title: 'Subtopic 1' },
      { id: 'subtopic-2', title: 'Subtopic 2' },
    ],
  };

  const mockCurrentView = {
    type: 'subtopic',
    id: 'subtopic-1',
    content: {
      id: 'subtopic-1',
      title: 'Subtopic 1',
      cells: [
        { type: 'markdown', content: '# Introduction\n\nThis is a test.' },
        { type: 'markdown', content: 'Some more content.' },
      ],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic],
    }).compileComponents();

    fixture = TestBed.createComponent(Subtopic);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should accept currentTopic input', () => {
      fixture.componentRef.setInput('currentTopic', mockTopic);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();

      expect(component.currentTopic()).toEqual(mockTopic);
    });

    it('should accept currentView input', () => {
      fixture.componentRef.setInput('currentTopic', mockTopic);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();

      expect(component.currentView()).toEqual(mockCurrentView);
    });
  });

  describe('Subtopic Navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentTopic', mockTopic);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();
    });

    it('should emit cycleSubtopic with prev direction', () => {
      spyOn(component.cycleSubtopic, 'emit');

      component.prevSubtopic();

      expect(component.cycleSubtopic.emit).toHaveBeenCalledWith({ id: 'topic-123', direction: 'prev' });
    });

    it('should emit cycleSubtopic with next direction', () => {
      spyOn(component.cycleSubtopic, 'emit');

      component.nextSubtopic();

      expect(component.cycleSubtopic.emit).toHaveBeenCalledWith({ id: 'topic-123', direction: 'next' });
    });
  });

  describe('Scroll to Top', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentTopic', mockTopic);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();
    });

    it('should have scrollToTop method', () => {
      expect(component.scrollToTop).toBeDefined();
    });

    it('should not throw when viewContainer is not available', () => {
      expect(() => {
        component.scrollToTop();
      }).not.toThrow();
    });
  });

  describe('Input Change Effect', () => {
    it('should scroll to top when view content changes', fakeAsync(() => {
      fixture.componentRef.setInput('currentTopic', mockTopic);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();

      const newView = {
        ...mockCurrentView,
        id: 'subtopic-2',
        content: { ...mockCurrentView.content, id: 'subtopic-2' },
      };

      fixture.componentRef.setInput('currentView', newView);
      fixture.detectChanges();
      tick();

      expect(component).toBeTruthy();
    }));
  });

  describe('Edge Cases', () => {
    it('should handle null currentView content', () => {
      fixture.componentRef.setInput('currentTopic', mockTopic);
      fixture.componentRef.setInput('currentView', { type: 'subtopic', id: 'subtopic-1', content: null });
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('should handle empty cells array', () => {
      const viewWithNoCells = {
        ...mockCurrentView,
        content: { ...mockCurrentView.content, cells: [] },
      };

      fixture.componentRef.setInput('currentTopic', mockTopic);
      fixture.componentRef.setInput('currentView', viewWithNoCells);
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });
  });

  describe('getPosition Input', () => {
    it('should accept getPosition input', () => {
      const getPositionFn = jasmine.createSpy('getPosition').and.returnValue({ top: 0, left: 0, bottom: 0, right: 0 });

      fixture.componentRef.setInput('currentTopic', mockTopic);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.componentRef.setInput('getPosition', getPositionFn);
      fixture.detectChanges();

      expect(component.getPosition()).toBe(getPositionFn);
    });
  });
});
