import { ChangeDetectorRef, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import { FlashcardsComponent } from '../../../shared/components/flashcards/flashcards';

@Component({
  selector: 'app-lesson-flashcards',
  imports: [FlashcardsComponent],
  templateUrl: './lesson-flashcards.html',
  styleUrl: './lesson-flashcards.css'
})
export class LessonFlashcards {
  topicId = input<string>();
  cards = input<any>();

  onCardChange(index: number) {
    return
  }
}
