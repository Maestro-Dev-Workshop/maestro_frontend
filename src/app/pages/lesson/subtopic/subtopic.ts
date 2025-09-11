import { Component, input, output } from '@angular/core';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
// import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-subtopic',
  imports: [MarkdownPipe],
  templateUrl: './subtopic.html',
  styleUrl: './subtopic.css'
})
export class Subtopic {
  currentTopic = input<any>();
  currentView = input<any>();
  cycleSubtopic = output<any>();

  prevSubtopic() {
    this.cycleSubtopic.emit({ id: this.currentTopic().id, direction: 'prev' });
  }

  nextSubtopic() {
    this.cycleSubtopic.emit({ id: this.currentTopic().id, direction: 'next' });
  }
}
