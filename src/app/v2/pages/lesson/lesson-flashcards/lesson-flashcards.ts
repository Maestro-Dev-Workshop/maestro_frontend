import { ChangeDetectorRef, Component, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { Flashcards } from '../../../shared/components/flashcards/flashcards';
import { FlashcardTemplate } from '../../../shared/components/flashcard-template/flashcard-template';

@Component({
  selector: 'app-lesson-flashcards',
  imports: [Flashcards, ThemeIconComponent, FlashcardTemplate],
  templateUrl: './lesson-flashcards.html',
  styleUrl: './lesson-flashcards.css'
})
export class LessonFlashcards {
  deckContent = input<any>();
  currentCardNumber = signal(1)
  totalCards = signal(1)

  private onInputChange = effect(() => {
    this.totalCards.set(this.deckContent().flashcards.length)
  })

  onCardChange(index: number) {
    this.currentCardNumber.set(index + 1)
  }
}
