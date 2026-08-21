import { Component, input, output } from '@angular/core';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-flashcard-template',
  imports: [ThemeIconComponent],
  templateUrl: './flashcard-template.html',
  styleUrl: './flashcard-template.css',
})
export class FlashcardTemplate {
  face = input<'front' | 'back'>('front');
  content = input<string>('');
  toggleFlip = output<void>();
  toggleHint = output<void>();

  flip() {
    this.toggleFlip.emit();
  }

  hint() {  
    this.toggleHint.emit();
  }
}
