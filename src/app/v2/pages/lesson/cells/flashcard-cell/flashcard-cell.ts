import { Component, effect, input, signal } from '@angular/core';
import { Flashcards } from '../../../../shared/components/flashcards/flashcards';
import { FlashcardTemplate } from '../../../../shared/components/flashcard-template/flashcard-template';

@Component({
  selector: 'app-flashcard-cell',
  imports: [Flashcards, FlashcardTemplate],
  templateUrl: './flashcard-cell.html',
  styleUrl: './flashcard-cell.css',
})
export class FlashcardCell {
  data = input<any>();
  cards = signal<any[]>([]);

  private updateOnInputChange = effect(() => {
    console.log(this.data())
    const content = this.data()?.metadata.cards || [];
    this.cards.set(content);
  })

  onCardChange(index: number) {
    return
  }
}
