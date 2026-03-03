import { Component, effect, input } from '@angular/core';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: true })

@Component({
  selector: 'app-diagram-cell',
  imports: [],
  templateUrl: './diagram-cell.html',
  styleUrl: './diagram-cell.css',
})
export class DiagramCell {
  data = input<any>();
  diagramContent = ''

  private updateOnInputChange = effect(() => {
    this.diagramContent = this.data().content
  });
}
