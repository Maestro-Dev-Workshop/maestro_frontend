import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextMenu, ContextMenuItem } from './context-menu';

describe('ContextMenu', () => {
  let component: ContextMenu;
  let fixture: ComponentFixture<ContextMenu>;

  const mockItems: ContextMenuItem[] = [
    { id: 'delete', label: 'Delete', icon: 'delete-icon' },
    { id: 'edit', label: 'Edit', icon: 'edit-icon' },
    { id: 'share', label: 'Share' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextMenu);
    component = fixture.componentInstance;
  });

  describe('Visibility', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render when visible is true', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('position', { x: 100, y: 200 });
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const menu = fixture.nativeElement.querySelector('.fixed.z-40');
      expect(menu).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      fixture.componentRef.setInput('visible', false);
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const menu = fixture.nativeElement.querySelector('.fixed.z-40');
      expect(menu).toBeFalsy();
    });
  });

  describe('Positioning', () => {
    it('should render at specified position', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('position', { x: 150, y: 250 });
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const menu = fixture.nativeElement.querySelector('.fixed.z-40');
      expect(menu.style.left).toBe('150px');
      expect(menu.style.top).toBe('250px');
    });

    it('should update position when input changes', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('position', { x: 100, y: 100 });
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      fixture.componentRef.setInput('position', { x: 200, y: 300 });
      fixture.detectChanges();

      const menu = fixture.nativeElement.querySelector('.fixed.z-40');
      expect(menu.style.left).toBe('200px');
      expect(menu.style.top).toBe('300px');
    });
  });

  describe('Menu Items', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('position', { x: 0, y: 0 });
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();
    });

    it('should display all menu items', () => {
      const items = fixture.nativeElement.querySelectorAll('li');
      expect(items.length).toBe(3);
    });

    it('should display item labels', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Delete');
      expect(compiled.textContent).toContain('Edit');
      expect(compiled.textContent).toContain('Share');
    });

    it('should display icons when provided', () => {
      const icons = fixture.nativeElement.querySelectorAll('app-theme-icon');
      // Delete and Edit have icons, Share doesn't
      expect(icons.length).toBe(2);
    });
  });

  describe('Interactions', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('position', { x: 0, y: 0 });
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();
    });

    it('should emit itemClick with item ID on click', () => {
      spyOn(component.itemClick, 'emit');

      const deleteItem = fixture.nativeElement.querySelector('li');
      deleteItem.click();

      expect(component.itemClick.emit).toHaveBeenCalledWith('delete');
    });

    it('should emit correct ID for each item', () => {
      spyOn(component.itemClick, 'emit');

      const items = fixture.nativeElement.querySelectorAll('li');

      items[0].click();
      expect(component.itemClick.emit).toHaveBeenCalledWith('delete');

      items[1].click();
      expect(component.itemClick.emit).toHaveBeenCalledWith('edit');

      items[2].click();
      expect(component.itemClick.emit).toHaveBeenCalledWith('share');
    });

    it('should stop propagation on menu click', () => {
      const event = new MouseEvent('click', { bubbles: true });
      spyOn(event, 'stopPropagation');

      const menu = fixture.nativeElement.querySelector('.fixed.z-40');
      menu.dispatchEvent(event);

      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('position', { x: 0, y: 0 });
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('li');
      expect(items.length).toBe(0);
    });

    it('should handle items without icons', () => {
      const itemsWithoutIcons: ContextMenuItem[] = [
        { id: 'item1', label: 'Item 1' },
        { id: 'item2', label: 'Item 2' },
      ];

      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('position', { x: 0, y: 0 });
      fixture.componentRef.setInput('items', itemsWithoutIcons);
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('app-theme-icon');
      expect(icons.length).toBe(0);
    });

    it('should handle default position (0, 0)', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const menu = fixture.nativeElement.querySelector('.fixed.z-40');
      expect(menu.style.left).toBe('0px');
      expect(menu.style.top).toBe('0px');
    });
  });
});
