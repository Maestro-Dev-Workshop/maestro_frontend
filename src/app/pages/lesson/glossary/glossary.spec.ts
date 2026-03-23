import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Glossary } from './glossary';

describe('Glossary', () => {
  let component: Glossary;
  let fixture: ComponentFixture<Glossary>;

  const mockGlossaryItems = [
    { term: 'Algorithm', definition: 'A step-by-step procedure' },
    { term: 'API', definition: 'Application Programming Interface' },
    { term: 'Boolean', definition: 'A true/false value' },
    { term: 'Class', definition: 'A blueprint for objects' },
    { term: '123Number', definition: 'A term starting with number' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Glossary],
    }).compileComponents();

    fixture = TestBed.createComponent(Glossary);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with glossary items', () => {
      fixture.componentRef.setInput('glossaryItems', mockGlossaryItems);
      fixture.detectChanges();

      expect(component.glossaryItems()).toEqual(mockGlossaryItems);
    });
  });

  describe('Arranged Glossary', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('glossaryItems', mockGlossaryItems);
      fixture.detectChanges();
    });

    it('should group items by first letter', () => {
      const arranged = component.arrangedGlossary();

      expect(arranged.length).toBeGreaterThan(0);
      expect(arranged.find(g => g.letter === 'A')).toBeTruthy();
      expect(arranged.find(g => g.letter === 'B')).toBeTruthy();
      expect(arranged.find(g => g.letter === 'C')).toBeTruthy();
    });

    it('should group non-alphabetical items under #', () => {
      const arranged = component.arrangedGlossary();
      const hashGroup = arranged.find(g => g.letter === '#');

      expect(hashGroup).toBeTruthy();
      expect(hashGroup!.terms.find((t: any) => t.term === '123Number')).toBeTruthy();
    });

    it('should put multiple items starting with same letter together', () => {
      const arranged = component.arrangedGlossary();
      const aGroup = arranged.find(g => g.letter === 'A');

      expect(aGroup).toBeTruthy();
      expect(aGroup!.terms.length).toBe(2); // Algorithm and API
    });

    it('should sort groups alphabetically', () => {
      const arranged = component.arrangedGlossary();
      const letters = arranged.map(g => g.letter);

      for (let i = 1; i < letters.length; i++) {
        expect(letters[i].localeCompare(letters[i - 1])).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Scroll Functions', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('glossaryItems', mockGlossaryItems);
      fixture.detectChanges();
    });

    it('should have scrollToTop method', () => {
      expect(component.scrollToTop).toBeDefined();
    });

    it('should have scrollToElement method', () => {
      expect(component.scrollToElement).toBeDefined();
    });

    it('should have scrollToElementSmooth method', () => {
      expect(component.scrollToElementSmooth).toBeDefined();
    });

    it('should handle scrollToElement with invalid id', () => {
      expect(() => {
        component.scrollToElement('non-existent-id');
      }).not.toThrow();
    });

    it('should handle scrollToElementSmooth with invalid id', () => {
      expect(() => {
        component.scrollToElementSmooth('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('Scroll Output', () => {
    it('should have scroll output', () => {
      expect(component.scroll).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty glossary items', () => {
      fixture.componentRef.setInput('glossaryItems', []);
      fixture.detectChanges();

      const arranged = component.arrangedGlossary();
      expect(arranged.length).toBe(0);
    });

    it('should handle single item', () => {
      fixture.componentRef.setInput('glossaryItems', [mockGlossaryItems[0]]);
      fixture.detectChanges();

      const arranged = component.arrangedGlossary();
      expect(arranged.length).toBe(1);
    });

    it('should handle all items starting with same letter', () => {
      const sameLetterItems = [
        { term: 'Array', definition: 'An ordered collection' },
        { term: 'Algorithm', definition: 'A procedure' },
        { term: 'API', definition: 'An interface' },
      ];

      fixture.componentRef.setInput('glossaryItems', sameLetterItems);
      fixture.detectChanges();

      const arranged = component.arrangedGlossary();
      expect(arranged.length).toBe(1);
      expect(arranged[0].letter).toBe('A');
      expect(arranged[0].terms.length).toBe(3);
    });

    it('should handle lowercase starting letters', () => {
      const lowercaseItems = [
        { term: 'algorithm', definition: 'A procedure' },
      ];

      fixture.componentRef.setInput('glossaryItems', lowercaseItems);
      fixture.detectChanges();

      const arranged = component.arrangedGlossary();
      expect(arranged.find(g => g.letter === 'A')).toBeTruthy();
    });
  });

  describe('View Reset on Input Change', () => {
    it('should reset view when items change', fakeAsync(() => {
      fixture.componentRef.setInput('glossaryItems', mockGlossaryItems);
      fixture.detectChanges();
      tick();

      fixture.componentRef.setInput('glossaryItems', [...mockGlossaryItems]);
      fixture.detectChanges();
      tick();

      expect(component).toBeTruthy();
    }));
  });

  describe('UI Elements', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('glossaryItems', mockGlossaryItems);
      fixture.detectChanges();
    });

    it('should display terms', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Algorithm');
      expect(compiled.textContent).toContain('API');
    });

    it('should display definitions', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('step-by-step');
    });
  });
});
