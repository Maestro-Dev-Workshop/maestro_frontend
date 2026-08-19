import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DiagramCell } from './diagram-cell';

describe('DiagramCell', () => {
  let component: DiagramCell;
  let fixture: ComponentFixture<DiagramCell>;

  const mockDiagramData = {
    type: 'diagram',
    content: 'This flowchart shows the decision process.',
    metadata: {
      diagram_content: `graph TD
        A[Start] --> B{Is it?}
        B -- Yes --> C[OK]
        B -- No --> D[End]`,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramCell],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagramCell);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty diagramContent', () => {
      expect(component.diagramContent).toBe('');
    });

    it('should initialize with empty context', () => {
      expect(component.context).toBe('');
    });
  });

  describe('Data Input', () => {
    it('should accept data input', fakeAsync(() => {
      fixture.componentRef.setInput('data', mockDiagramData);
      fixture.detectChanges();
      tick();

      expect(component.data()).toEqual(mockDiagramData);
    }));

    it('should update diagramContent from metadata', fakeAsync(() => {
      fixture.componentRef.setInput('data', mockDiagramData);
      fixture.detectChanges();
      tick();

      expect(component.diagramContent).toBe(mockDiagramData.metadata.diagram_content);
    }));

    it('should update context from content', fakeAsync(() => {
      fixture.componentRef.setInput('data', mockDiagramData);
      fixture.detectChanges();
      tick();

      expect(component.context).toBe('This flowchart shows the decision process.');
    }));
  });

  describe('Diagram Rendering', () => {
    it('should have renderDiagram method', () => {
      expect(component.renderDiagram).toBeDefined();
    });

    it('should have diagramContainer reference after view init', fakeAsync(() => {
      fixture.componentRef.setInput('data', mockDiagramData);
      fixture.detectChanges();
      tick();

      expect(component.diagramContainer).toBeDefined();
    }));
  });

  describe('Different Diagram Types', () => {
    it('should handle flowchart', fakeAsync(() => {
      const flowchartData = {
        ...mockDiagramData,
        metadata: {
          diagram_content: `flowchart TD
            A --> B --> C`,
        },
      };

      fixture.componentRef.setInput('data', flowchartData);
      fixture.detectChanges();
      tick();

      expect(component.diagramContent).toContain('flowchart');
    }));

    it('should handle sequence diagram', fakeAsync(() => {
      const sequenceData = {
        ...mockDiagramData,
        metadata: {
          diagram_content: `sequenceDiagram
            Alice->>Bob: Hello
            Bob->>Alice: Hi`,
        },
      };

      fixture.componentRef.setInput('data', sequenceData);
      fixture.detectChanges();
      tick();

      expect(component.diagramContent).toContain('sequenceDiagram');
    }));

    it('should handle class diagram', fakeAsync(() => {
      const classData = {
        ...mockDiagramData,
        metadata: {
          diagram_content: `classDiagram
            class Animal {
              +name: string
              +makeSound()
            }`,
        },
      };

      fixture.componentRef.setInput('data', classData);
      fixture.detectChanges();
      tick();

      expect(component.diagramContent).toContain('classDiagram');
    }));
  });

  describe('Edge Cases', () => {
    it('should handle null data gracefully', fakeAsync(() => {
      fixture.componentRef.setInput('data', null);
      fixture.detectChanges();
      tick();

      expect(component.diagramContent).toBe('');
    }));

    it('should handle undefined data gracefully', fakeAsync(() => {
      fixture.componentRef.setInput('data', undefined);
      fixture.detectChanges();
      tick();

      expect(component.diagramContent).toBe('');
    }));

    it('should handle empty diagram content', fakeAsync(() => {
      const emptyDiagramData = {
        ...mockDiagramData,
        metadata: {
          diagram_content: '',
        },
      };

      fixture.componentRef.setInput('data', emptyDiagramData);
      fixture.detectChanges();
      tick();

      expect(component.diagramContent).toBe('');
    }));
  });
});
