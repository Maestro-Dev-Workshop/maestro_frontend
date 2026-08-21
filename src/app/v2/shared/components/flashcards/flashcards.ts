import {
  Component,
  input,
  output,
  TemplateRef,
  ChangeDetectionStrategy,
  signal
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

/**
 * Flashcard Data Type
 */
export interface FlashcardItem {
  front: string;
  back: string;
  hint?: string;
}

/**
 * Slide Animation (optional, safe)
 */
import {
  trigger,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import { FlashcardTemplate } from '../flashcard-template/flashcard-template';

const slideAnimation = trigger('slide', [
  transition(':increment', [
    animate(
      '400ms ease-out', 
      keyframes([
        style({ transform: 'translateX(0)', opacity: 1, offset: 0 }),
        style({ transform: 'translateX(-100%)', opacity: 0, offset: 1 }),
      ])
    )
  ]),
  transition(':decrement', [
    animate(
      '400ms ease-out', 
      keyframes([
        style({ transform: 'translateX(-100%)', opacity: 0, offset: 0 }),
        style({ transform: 'translateX(0)', opacity: 1, offset: 1 }),
      ])
    )
  ])
]);

const behindSlideAnimation = trigger('behind-slide', [
  transition(':increment', [
    animate(
      '400ms ease-out', 
      keyframes([
        style({ transform: 'translateX(0) translateY(0)', offset: 0 }),
        style({ transform: 'translateX(-0.75rem) translateY(-0.75rem)', offset: 1 }),
      ])
    )
  ]),
  transition(':decrement', [
    animate(
      '400ms ease-out', 
      keyframes([
        style({ transform: 'translateX(-0.75rem) translateY(-0.75rem)', offset: 0 }),
        style({ transform: 'translateX(0) translateY(0)', offset: 1 }),
      ])
    )
  ])
]);

/**
 * Flip Animation (visual only — NOT state dependent)
 */
const flipAnimation = trigger('flip', [
  transition('false => true', [
    animate(
      '600ms ease-in-out',
      keyframes([
        style({ transform: 'scale(1)', offset: 0 }),
        style({ transform: 'scale(1.25)', offset: 0.3 }),
        style({ transform: 'scale(1.25) scaleX(0)', offset: 0.5 }),
        style({ transform: 'scale(1.25)', offset: 0.7 }),
        style({ transform: 'scale(1)', offset: 1 }),
      ])
    )
  ])
]);

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [ThemeIconComponent, NgTemplateOutlet, FlashcardTemplate],
  templateUrl: './flashcards.html',
  animations: [slideAnimation, flipAnimation, behindSlideAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Flashcards {

  /** Inputs */
  cards = input<FlashcardItem[]>([]);
  showHeader = input<boolean>(true);
  enableHint = input<boolean>(true);
  loop = input<boolean>(false);

  /** Custom templates */
  frontTemplate = input<TemplateRef<any> | null>(null);
  backTemplate = input<TemplateRef<any> | null>(null);

  /** Outputs */
  cardChange = output<number>();
  flipped = output<boolean>();

  /** State */
  currentIndex = signal(0);
  showAnswer = signal(false);
  showHint = signal(false);
  currentAnimationIndex = signal(0);

  /** Flip control */
  flipState = signal(false);
  private pendingFlip = false;

  /** Navigation */
  nextCard() {
    const next = this.currentIndex() + 1;

    if (next < this.cards().length) {
      this.currentIndex.set(next);
    } else if (this.loop()) {
      this.currentIndex.set(0);
    }

    this.resetCardState();
    this.cardChange.emit(this.currentIndex());
  }

  previousCard() {
    const prev = this.currentIndex() - 1;
    this.currentAnimationIndex.update((value) => value - 1)

    if (prev >= 0) {
      this.currentIndex.set(prev);
    } else if (this.loop()) {
      this.currentIndex.set(this.cards().length - 1);
    }

    this.resetCardState();
    this.cardChange.emit(this.currentIndex());
  }

  /**
   * FIXED FLIP LOGIC (correct timing)
   * - animation starts
   * - halfway swap content
   * - finish animation
   */
  toggleAnswer() {
    if (this.flipState()) return;

    this.pendingFlip = true;
    this.flipState.set(true);

    setTimeout(() => {
      this.showAnswer.update(v => !v);
      this.flipped.emit(this.showAnswer());
    }, 300); // midpoint of 600ms animation
  }

  /** animation end */
  onFlipDone() {
    this.flipState.set(false);
    this.pendingFlip = false;
  }

  onSlideDone() {
    this.currentAnimationIndex.set(this.currentIndex())
  }

  /** Hint */
  toggleHint() {
    this.showHint.update(v => !v);
  }

  /** Reset state when navigating */
  private resetCardState() {
    this.showAnswer.set(false);
    this.showHint.set(false);
  }

  /** Helpers */
  get currentCard(): FlashcardItem | null {
    return this.cards()?.[this.currentIndex()] ?? null;
  }

  get isFirst() {
    return this.currentIndex() === 0;
  }

  get isLast() {
    return this.currentIndex() === this.cards().length - 1;
  }
}