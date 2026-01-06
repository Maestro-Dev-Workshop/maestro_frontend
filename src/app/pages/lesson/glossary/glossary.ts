import { Component, input } from '@angular/core';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';

@Component({
  selector: 'app-glossary',
  imports: [MarkdownPipe],
  templateUrl: './glossary.html',
  styleUrl: './glossary.css',
})
export class Glossary {
  glossaryItems = input<any>();
}
