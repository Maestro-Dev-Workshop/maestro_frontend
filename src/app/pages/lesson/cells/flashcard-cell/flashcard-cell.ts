import { Component, effect, input, signal } from '@angular/core';
import { FlashcardsComponent } from '../../../../shared/components/flashcards/flashcards';

@Component({
  selector: 'app-flashcard-cell',
  imports: [FlashcardsComponent],
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
