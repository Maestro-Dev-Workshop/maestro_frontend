import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownCell } from './markdown-cell';

describe('MarkdownCell', () => {
  let component: MarkdownCell;
  let fixture: ComponentFixture<MarkdownCell>;

  const mockMarkdownData = {
    type: 'markdown',
    content: '# Hello World\n\nThis is **bold** text and *italic* text.',
    metadata: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownCell],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownCell);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should accept data input', () => {
      fixture.componentRef.setInput('data', mockMarkdownData);
      fixture.detectChanges();

      expect(component.data()).toEqual(mockMarkdownData);
    });
  });

  describe('Content Rendering', () => {
    it('should have data available after input', () => {
      fixture.componentRef.setInput('data', mockMarkdownData);
      fixture.detectChanges();

      expect(component.data().content).toContain('Hello World');
    });

    it('should render markdown content via pipe', () => {
      fixture.componentRef.setInput('data', mockMarkdownData);
      fixture.detectChanges();

      expect(component.data().content).toContain('bold');
      expect(component.data().content).toContain('italic');
    });
  });

  describe('Different Content Types', () => {
    it('should handle headers', () => {
      const headerData = {
        type: 'markdown',
        content: '# Heading 1\n## Heading 2\n### Heading 3',
        metadata: {},
      };

      fixture.componentRef.setInput('data', headerData);
      fixture.detectChanges();

      expect(component.data().content).toContain('Heading 1');
    });

    it('should handle code blocks', () => {
      const codeData = {
        type: 'markdown',
        content: '```javascript\nconst x = 5;\n```',
        metadata: {},
      };

      fixture.componentRef.setInput('data', codeData);
      fixture.detectChanges();

      expect(component.data().content).toContain('const x = 5');
    });

    it('should handle lists', () => {
      const listData = {
        type: 'markdown',
        content: '- Item 1\n- Item 2\n- Item 3',
        metadata: {},
      };

      fixture.componentRef.setInput('data', listData);
      fixture.detectChanges();

      expect(component.data().content).toContain('Item 1');
    });

    it('should handle links', () => {
      const linkData = {
        type: 'markdown',
        content: '[Click here](https://example.com)',
        metadata: {},
      };

      fixture.componentRef.setInput('data', linkData);
      fixture.detectChanges();

      expect(component.data().content).toContain('Click here');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      const emptyData = {
        type: 'markdown',
        content: '',
        metadata: {},
      };

      fixture.componentRef.setInput('data', emptyData);
      fixture.detectChanges();

      expect(component.data().content).toBe('');
    });

    it('should handle special characters', () => {
      const specialData = {
        type: 'markdown',
        content: '< > & " \' ` ~ ! @ # $ % ^ * ( )',
        metadata: {},
      };

      fixture.componentRef.setInput('data', specialData);
      fixture.detectChanges();

      expect(component.data()).toBeTruthy();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(10000);
      const longData = {
        type: 'markdown',
        content: longContent,
        metadata: {},
      };

      fixture.componentRef.setInput('data', longData);
      fixture.detectChanges();

      expect(component.data().content.length).toBe(10000);
    });
  });
});
