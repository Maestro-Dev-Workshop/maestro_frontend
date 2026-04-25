import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-quote-cell',
  imports: [],
  templateUrl: './quote-cell.html',
  styleUrl: './quote-cell.css',
})
export class QuoteCell {
  data = input<any>();
  quote = '';
  author = '';
  date = '';

  private updateOnInputChange = effect(() => {
    const content = this.data();
    this.quote = content.content || '';
    this.author = content.metadata.author || '';
    this.date = content.metadata.date || '';
  })
}
