import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-subtopic',
  imports: [],
  templateUrl: './subtopic.html',
  styleUrl: './subtopic.css'
})
export class Subtopic {
  currentTopic = input<any>();
  currentView = input<any>();
  cycleSubtopic = output<any>();

  prevSubtopic() {
    this.cycleSubtopic.emit({ topic_id: this.currentTopic().topic_id, direction: 'prev' });
  }

  nextSubtopic() {
    this.cycleSubtopic.emit({ topic_id: this.currentTopic().topic_id, direction: 'next' });
  }
}
