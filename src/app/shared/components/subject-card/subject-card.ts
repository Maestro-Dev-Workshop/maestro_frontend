import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeIconComponent } from '../theme-icon/theme-icon';
import { SubjectStatus } from '../../../core/models/subject-status.model';
import { TopicModel } from '../../../core/models/topic.model';
import { ExtensionModel } from '../../../core/models/api-response.model';

/** Data structure for the subject card component */
export interface SubjectCardData {
  id: string;
  name: string;
  status: SubjectStatus | string;
  completion: number;
  topics: TopicModel[];
  extensions: ExtensionModel[];
}

@Component({
  selector: 'app-subject-card',
  standalone: true,
  imports: [CommonModule, ThemeIconComponent],
  templateUrl: './subject-card.html',
})
export class SubjectCard {
  // Inputs
  subject = input.required<SubjectCardData>();
  disabled = input<boolean>(false);

  // Outputs
  cardClick = output<SubjectCardData>();
  contextMenu = output<{ event: MouseEvent; subject: SubjectCardData }>();
  continueClick = output<{ event: MouseEvent; subject: SubjectCardData }>();

  // Expose enum for template
  readonly SubjectStatus = SubjectStatus;

  // Computed values
  borderColor = computed(() => {
    const status = this.subject().status;
    if (status === SubjectStatus.IN_PROGRESS) return 'var(--text-primary-hover)';
    if (status === SubjectStatus.COMPLETED) return '#45AD40';
    return '#EAAA08';
  });

  buttonText = computed(() => {
    const status = this.subject().status;
    if (status === SubjectStatus.IN_PROGRESS) return 'Continue';
    if (status === SubjectStatus.COMPLETED) return 'Completed';
    return 'Resume Setup';
  });

  topicsText = computed(() => {
    const topics = this.subject().topics;
    if (!topics || topics.length === 0) return 'NA';
    if (topics.length === 1) return '1 topic';
    return `${topics.length} topics`;
  });

  extensionsString = computed(() => {
    return this.subject().extensions.map((ext) => ext.type).join(', ');
  });

  progressOffset = computed(() => {
    const completion = this.subject().completion || 0;
    return 87.96 - (87.96 * completion / 100);
  });

  // Event handlers
  onCardClick(): void {
    if (!this.disabled()) {
      this.cardClick.emit(this.subject());
    }
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu.emit({ event, subject: this.subject() });
  }

  onContinueClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.continueClick.emit({ event, subject: this.subject() });
    }
  }

  onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
    this.contextMenu.emit({ event, subject: this.subject() });
  }
}
