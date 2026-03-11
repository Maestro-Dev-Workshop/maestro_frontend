import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rating-modal.html',
})
export class RatingModal {
  // Inputs
  visible = input<boolean>(false);
  title = input<string>('How was your learning experience?');
  subtitle = input<string>('Your feedback helps improve Maestro');

  // Outputs
  close = output<void>();
  submit = output<{ rating: number; feedback: string }>();

  // Internal state
  rating = signal(0);
  feedback = signal('');

  readonly ratingDescriptions = [
    'Confusing/Inaccurate',
    'Hard to Follow',
    'Okay but not Helpful',
    'Clear and Helpful',
    'Excellent',
  ];

  ratingDescription = computed(() => {
    const r = this.rating();
    if (r <= 0) return this.ratingDescriptions[0];
    return this.ratingDescriptions[Math.max(0, r - 1)];
  });

  setRating(value: number): void {
    this.rating.set(value);
  }

  onBackdropClick(): void {
    this.close.emit();
    this.resetState();
  }

  onCancel(): void {
    this.close.emit();
    this.resetState();
  }

  onSubmit(): void {
    this.submit.emit({
      rating: this.rating(),
      feedback: this.feedback(),
    });
    this.resetState();
  }

  private resetState(): void {
    this.rating.set(0);
    this.feedback.set('');
  }
}
