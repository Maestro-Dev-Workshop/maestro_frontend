import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, ThemeIconComponent, CdkDrag, CdkDropList],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  content = input<any>();
  currentView = input<any>();
  updateView = output<any>();
  closeSidebar = output<void>();
  reorderTopicEvent = output<any>();

  // Track expanded state locally since content is now read-only
  expandedTopics = signal<Set<string>>(new Set());

  isTopicExpanded(topicId: string): boolean {
    return this.expandedTopics().has(topicId);
  }

  toggleExpandTopic(topicId: string): void {
    this.expandedTopics.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  }

  selectView(id: string, type: string): void {
    this.updateView.emit({ id, type });
    this.closeSidebar.emit();
  }

  closeBar(): void {
    this.closeSidebar.emit();
  }

  dropTopic(event: CdkDragDrop<any[]>): void {
    const topics = [...this.content().topics];
    moveItemInArray(topics, event.previousIndex, event.currentIndex);
    this.reorderTopicEvent.emit(topics.map((topic: any) => topic.id));
  }
}
