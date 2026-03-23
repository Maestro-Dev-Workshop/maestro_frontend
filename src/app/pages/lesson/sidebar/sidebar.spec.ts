import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  const mockContent = {
    subject_name: 'Test Subject',
    topics: [
      {
        id: 'topic-1',
        title: 'Topic 1',
        completed: false,
        subtopics: [
          { id: 'subtopic-1', title: 'Subtopic 1', read: true },
          { id: 'subtopic-2', title: 'Subtopic 2', read: false },
        ],
        exercise: { id: 'exercise-1', score: null },
        flashcards: [{ id: 'fc-1' }],
      },
      {
        id: 'topic-2',
        title: 'Topic 2',
        completed: true,
        subtopics: [
          { id: 'subtopic-3', title: 'Subtopic 3', read: true },
        ],
        exercise: { id: 'exercise-2', score: 80 },
        flashcards: [],
      },
    ],
    exam: { id: 'exam-1', score: null },
    glossary: [{ term: 'Term 1', definition: 'Def 1' }],
  };

  const mockCurrentView = {
    type: 'subtopic',
    id: 'subtopic-1',
    content: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
  });

  describe('Rendering', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display subject name', () => {
      fixture.componentRef.setInput('content', mockContent);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Test Subject');
    });

    it('should display all topics', () => {
      fixture.componentRef.setInput('content', mockContent);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Topic 1');
      expect(compiled.textContent).toContain('Topic 2');
    });
  });

  describe('Topic Expansion', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockContent);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();
    });

    it('should initially have no topics expanded', () => {
      expect(component.isTopicExpanded('topic-1')).toBe(false);
      expect(component.isTopicExpanded('topic-2')).toBe(false);
    });

    it('should toggle topic expansion', () => {
      component.toggleExpandTopic('topic-1');
      expect(component.isTopicExpanded('topic-1')).toBe(true);

      component.toggleExpandTopic('topic-1');
      expect(component.isTopicExpanded('topic-1')).toBe(false);
    });

    it('should allow multiple topics to be expanded', () => {
      component.toggleExpandTopic('topic-1');
      component.toggleExpandTopic('topic-2');

      expect(component.isTopicExpanded('topic-1')).toBe(true);
      expect(component.isTopicExpanded('topic-2')).toBe(true);
    });
  });

  describe('View Selection', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockContent);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();
    });

    it('should emit updateView when selecting subtopic', () => {
      spyOn(component.updateView, 'emit');

      component.selectView('subtopic-2', 'subtopic');

      expect(component.updateView.emit).toHaveBeenCalledWith({ id: 'subtopic-2', type: 'subtopic' });
    });

    it('should emit updateView when selecting exercise', () => {
      spyOn(component.updateView, 'emit');

      component.selectView('exercise-1', 'exercise');

      expect(component.updateView.emit).toHaveBeenCalledWith({ id: 'exercise-1', type: 'exercise' });
    });

    it('should emit updateView when selecting exam', () => {
      spyOn(component.updateView, 'emit');

      component.selectView('exam-1', 'exam');

      expect(component.updateView.emit).toHaveBeenCalledWith({ id: 'exam-1', type: 'exam' });
    });

    it('should emit updateView when selecting glossary', () => {
      spyOn(component.updateView, 'emit');

      component.selectView('glossary', 'glossary');

      expect(component.updateView.emit).toHaveBeenCalledWith({ id: 'glossary', type: 'glossary' });
    });

    it('should emit updateView when selecting flashcards', () => {
      spyOn(component.updateView, 'emit');

      component.selectView('topic-1', 'flashcards');

      expect(component.updateView.emit).toHaveBeenCalledWith({ id: 'topic-1', type: 'flashcards' });
    });

    it('should emit closeSidebar after view selection', () => {
      spyOn(component.closeSidebar, 'emit');

      component.selectView('subtopic-1', 'subtopic');

      expect(component.closeSidebar.emit).toHaveBeenCalled();
    });
  });

  describe('Close Sidebar', () => {
    it('should emit closeSidebar on closeBar call', () => {
      spyOn(component.closeSidebar, 'emit');

      component.closeBar();

      expect(component.closeSidebar.emit).toHaveBeenCalled();
    });
  });

  describe('Topic Reordering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockContent);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();
    });

    it('should emit reorderTopicEvent on drop', () => {
      spyOn(component.reorderTopicEvent, 'emit');

      const mockDropEvent: CdkDragDrop<any[]> = {
        previousIndex: 0,
        currentIndex: 1,
        item: {} as any,
        container: {} as any,
        previousContainer: {} as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: {} as any,
      };

      component.dropTopic(mockDropEvent);

      expect(component.reorderTopicEvent.emit).toHaveBeenCalledWith(['topic-2', 'topic-1']);
    });

    it('should not change order when dropped in same position', () => {
      spyOn(component.reorderTopicEvent, 'emit');

      const mockDropEvent: CdkDragDrop<any[]> = {
        previousIndex: 0,
        currentIndex: 0,
        item: {} as any,
        container: {} as any,
        previousContainer: {} as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: {} as any,
      };

      component.dropTopic(mockDropEvent);

      expect(component.reorderTopicEvent.emit).toHaveBeenCalledWith(['topic-1', 'topic-2']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      fixture.componentRef.setInput('content', { topics: [], glossary: [] });
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('should handle content with no exam', () => {
      const contentWithoutExam = { ...mockContent, exam: null };
      fixture.componentRef.setInput('content', contentWithoutExam);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('should handle topics without exercises', () => {
      const topicWithoutExercise = {
        ...mockContent,
        topics: [{ ...mockContent.topics[0], exercise: null }],
      };
      fixture.componentRef.setInput('content', topicWithoutExercise);
      fixture.componentRef.setInput('currentView', mockCurrentView);
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });
  });
});
