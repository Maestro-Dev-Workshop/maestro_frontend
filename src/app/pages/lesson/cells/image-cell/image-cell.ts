import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-image-cell',
  imports: [],
  templateUrl: './image-cell.html',
  styleUrl: './image-cell.css',
})
export class ImageCell {
  data = input<any>();
  source = ''
  caption = ''

  private updateOnInputChange = effect(() => {
    this.source = this.data().content
    this.caption = this.data().metadata.caption
  });
}
