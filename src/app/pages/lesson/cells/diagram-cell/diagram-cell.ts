import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  effect,
  input
} from '@angular/core';

import mermaid from 'mermaid';

@Component({
  selector: 'app-diagram-cell',
  templateUrl: './diagram-cell.html',
  styleUrl: './diagram-cell.css'
})
export class DiagramCell {

  data = input<any>();

  diagramContent = '';
  context = '';

  @ViewChild('diagramContainer')
  diagramContainer!: ElementRef<HTMLDivElement>;

  constructor() {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    });

    effect(() => {
      const d = this.data();
      if (!d) return;

      this.diagramContent = d.metadata.diagram_content;
      this.context = d.content;

      queueMicrotask(() => this.renderDiagram());
    });
  }

  async renderDiagram() {
    if (!this.diagramContainer || !this.diagramContent) return;
  
    const id = "diagram-" + crypto.randomUUID();
  
    try {
      const { svg } = await mermaid.render(id, this.diagramContent);
  
      this.diagramContainer.nativeElement.innerHTML = svg;
  
    } catch {
      const errorNode = document.querySelector('[id^="ddiagram-"]');
  
      if (errorNode) {
        const container = this.diagramContainer.nativeElement;
  
        container.innerHTML = "";
        container.appendChild(errorNode); // moves node, not copies it
      }

      // Remove any leftover Mermaid temp nodes
      document.querySelectorAll(`[id^="${id}"]`).forEach(n => {
        if (!this.diagramContainer.nativeElement.contains(n)) {
          n.remove();
        }
      });
    }
  }
}