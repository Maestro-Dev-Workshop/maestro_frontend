import { Component, input, output } from '@angular/core';
import { MarkdownCell } from '../cells/markdown-cell/markdown-cell';
// import { ChartCell } from '../cells/chart-cell/chart-cell';

@Component({
  selector: 'app-subtopic',
  imports: [MarkdownCell],
  templateUrl: './subtopic.html',
  styleUrl: './subtopic.css'
})
export class Subtopic {
  currentTopic = input<any>();
  currentView = input<any>();
  cycleSubtopic = output<any>();
  getPosition = input<any>();


  prevSubtopic() {
    this.cycleSubtopic.emit({ id: this.currentTopic().id, direction: 'prev' });
  }

  nextSubtopic() {
    this.cycleSubtopic.emit({ id: this.currentTopic().id, direction: 'next' });
  }
}
