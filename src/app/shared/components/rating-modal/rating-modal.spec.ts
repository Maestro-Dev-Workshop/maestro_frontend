import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingModal } from './rating-modal';
import { FormsModule } from '@angular/forms';

describe('RatingModal', () => {
  let component: RatingModal;
  let fixture: ComponentFixture<RatingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingModal, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingModal);
    component = fixture.componentInstance;
  });

  describe('Visibility', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render when visible is true', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.fixed.inset-0');
      expect(modal).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      fixture.componentRef.setInput('visible', false);
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.fixed.inset-0');
      expect(modal).toBeFalsy();
    });

    it('should display custom title', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('title', 'Custom Title');
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h4');
      expect(title.textContent).toContain('Custom Title');
    });

    it('should display custom subtitle', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.componentRef.setInput('subtitle', 'Custom Subtitle');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Custom Subtitle');
    });
  });

  describe('Star Rating', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
    });

    it('should highlight stars based on rating', () => {
      component.setRating(3);
      fixture.detectChanges();

      const stars = fixture.nativeElement.querySelectorAll('button svg');
      const highlightedStars = Array.from(stars).filter(
        (star: any) => star.classList.contains('text-yellow-400')
      );

      expect(highlightedStars.length).toBe(3);
    });

    it('should update rating on star click', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const fourthStar = buttons[3]; // 0-indexed, so index 3 is the 4th star
      fourthStar.click();
      fixture.detectChanges();

      expect(component.rating()).toBe(4);
    });

    it('should display correct rating description for 1 star', () => {
      component.setRating(1);
      fixture.detectChanges();

      expect(component.ratingDescription()).toBe('Confusing/Inaccurate');
    });

    it('should display correct rating description for 3 stars', () => {
      component.setRating(3);
      fixture.detectChanges();

      expect(component.ratingDescription()).toBe('Okay but not Helpful');
    });

    it('should display correct rating description for 5 stars', () => {
      component.setRating(5);
      fixture.detectChanges();

      expect(component.ratingDescription()).toBe('Excellent');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
    });

    it('should emit submit with rating and feedback', () => {
      spyOn(component.submit, 'emit');

      component.setRating(4);
      component.feedback.set('Great experience!');
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector(
        'button.bg-prussian-blue-700'
      );
      submitButton.click();

      expect(component.submit.emit).toHaveBeenCalledWith({
        rating: 4,
        feedback: 'Great experience!',
      });
    });

    it('should emit close on backdrop click', () => {
      spyOn(component.close, 'emit');

      const backdrop = fixture.nativeElement.querySelector('.fixed.inset-0');
      backdrop.click();

      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should emit close on cancel button', () => {
      spyOn(component.close, 'emit');

      const cancelButton = fixture.nativeElement.querySelector(
        'button.bg-\\[var\\(--bg-card\\)\\]'
      );
      cancelButton.click();

      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should reset state after close', () => {
      component.setRating(4);
      component.feedback.set('Some feedback');
      fixture.detectChanges();

      component.onCancel();
      fixture.detectChanges();

      expect(component.rating()).toBe(0);
      expect(component.feedback()).toBe('');
    });

    it('should not close when clicking inside modal', () => {
      spyOn(component.close, 'emit');

      const modalContent = fixture.nativeElement.querySelector('.max-w-md');
      modalContent.click();

      expect(component.close.emit).not.toHaveBeenCalled();
    });
  });

  describe('Textarea', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
    });

    it('should update feedback signal on input', async () => {
      const textarea = fixture.nativeElement.querySelector('textarea');
      textarea.value = 'Test feedback';
      textarea.dispatchEvent(new Event('ngModelChange'));

      // Simulate ngModel change
      component.feedback.set('Test feedback');
      fixture.detectChanges();

      expect(component.feedback()).toBe('Test feedback');
    });

    it('should have placeholder text', () => {
      const textarea = fixture.nativeElement.querySelector('textarea');
      expect(textarea.placeholder).toContain("Anything you'd like to add");
    });
  });
});
