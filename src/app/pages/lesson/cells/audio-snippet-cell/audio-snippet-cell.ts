import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-audio-snippet-cell',
  imports: [],
  templateUrl: './audio-snippet-cell.html',
  styleUrl: './audio-snippet-cell.css',
})
export class AudioSnippetCell {
  data = input<any>();
  source = ''

  private updateOnInputChange = effect(() => {
    this.source = this.data().content
  });
}
