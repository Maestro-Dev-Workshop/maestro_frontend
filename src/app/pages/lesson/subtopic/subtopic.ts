import { Component, effect, ElementRef, input, output, untracked, viewChild, ViewChild } from '@angular/core';
import { MarkdownCell } from '../cells/markdown-cell/markdown-cell';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import { ChartCell } from "../cells/chart-cell/chart-cell";
import { AudioSnippetCell } from '../cells/audio-snippet-cell/audio-snippet-cell';
import { ExecutableCodeCell } from '../cells/executable-code-cell/executable-code-cell';
// import { ChartCell } from '../cells/chart-cell/chart-cell';

@Component({
  selector: 'app-subtopic',
  imports: [
    ThemeIconComponent, 
    MarkdownCell, 
    ChartCell,
    AudioSnippetCell,
    ExecutableCodeCell,
  ],
  templateUrl: './subtopic.html',
  styleUrl: './subtopic.css'
})
export class Subtopic {
  currentTopic = input<any>();
  currentView = input<any>();
  cycleSubtopic = output<any>();
  getPosition = input<any>();
  viewContainer = viewChild<ElementRef>('viewContainer');

  private updateOnInputChange = effect(() => {
    const view = this.currentView();
    if (view?.content) {
      untracked(() => {
        setTimeout(() => this.scrollToTop(), 0);
      });
    }
  });

  scrollToTop() {
    const element = this.viewContainer();
    if (element?.nativeElement) {
      element.nativeElement.scrollTop = 0;
    }
  }

  prevSubtopic() {
    this.cycleSubtopic.emit({ id: this.currentTopic().id, direction: 'prev' });
  }

  nextSubtopic() {
    this.cycleSubtopic.emit({ id: this.currentTopic().id, direction: 'next' });
  }
}
