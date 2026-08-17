import { Component, input, output, signal } from '@angular/core';
import { SidebarItem } from '../../../shared/components/sidebar-item/sidebar-item';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { Router } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-lesson-sidebar',
  imports: [SidebarItem, ThemeIconComponent, CdkDrag, CdkDropList],
  templateUrl: './lesson-sidebar.html',
  styleUrl: './lesson-sidebar.css',
})
export class LessonSidebar {
  constructor(
    private router: Router
  ) {}
  
  content = input<any>();
  currentView = input<any>();
  updateView = output<any>();
  closeSidebar = output<void>();
  reorderTopicEvent = output<any>();
  
  // Track expanded state locally since content is now read-only
  expandedTopics = signal<Set<string>>(new Set());
  flashcardExpanded = signal<boolean>(false)
  sidebarExpanded = signal<boolean>(true)

  toggleFlashcardExpansion() {
    this.flashcardExpanded.set(!this.flashcardExpanded())
    if (this.flashcardExpanded()) {
      this.sidebarExpanded.set(true)
    }
  }

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

  toggleSidebar() {
    this.sidebarExpanded.set(!this.sidebarExpanded());
    if (!this.sidebarExpanded()) {
      this.flashcardExpanded.set(false);
    }
  }

  backToDashboard() {
    this.router.navigateByUrl('/v2/lessons');
  }
}
