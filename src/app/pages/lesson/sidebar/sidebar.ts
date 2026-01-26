import { Component, input, model, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, ThemeIconComponent, CdkDrag, CdkDropList],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  content = model<any>();
  currentView = input<any>();
  updateView = output<any>();
  closeSidebar = output<void>();
  reorderTopicEvent = output<any>();

  logContent() {
    return;
  }

  toggleExpandTopic(topic_id: string) {
    const topic = this.content().topics.find((t: any) => t.id === topic_id);
    if (topic) {
      topic.expanded = !topic.expanded;
    }
  }

  selectView(id: string, type: string) {
    this.updateView.emit({ id, type });
    this.closeSidebar.emit();
  }

  closeBar() {
    this.closeSidebar.emit();
  }

  dropTopic(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.content().topics, event.previousIndex, event.currentIndex);
    this.reorderTopicEvent.emit(this.content().topics.map((topic:any) => topic.id))
  }
}
