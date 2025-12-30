import { Component, input } from '@angular/core';
import { MarkdownPipe } from '../../../../shared/pipes/markdown-pipe';

@Component({
  selector: 'app-markdown-cell',
  imports: [MarkdownPipe],
  templateUrl: './markdown-cell.html',
  styleUrl: './markdown-cell.css',
})
export class MarkdownCell {
  data = input<any>();
}
