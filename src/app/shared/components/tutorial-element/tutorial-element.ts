import {
  Component,
  input,
  signal,
  computed,
  effect,
  HostListener,
  ElementRef,
  ViewChild,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// type Position = 'top' | 'right' | 'bottom' | 'left';
// type Alignment = 'start' | 'end';

@Component({
  selector: 'app-tutorial-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial-element.html',
  styleUrl: './tutorial-element.css',
})
export class TutorialElement {

  // ===== Inputs =====
  title = input('New Subject');
  text = input('Click here to create a new subject.');
  objectDimensions = input({
    top: 0,
    bottom: 20,
    left: 0,
    right: 50,
  });
  tipPosition = input('bottom');     // preferred
  tipAlignment = input('start');   // preferred

  // ===== Visibility =====
  next = output();

  // ===== Screen tracking =====
  screenWidth = signal(window.innerWidth);
  screenHeight = signal(window.innerHeight);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    this.screenHeight.set(window.innerHeight);
  }

  // ===== Tooltip reference =====
  @ViewChild('tooltipEl')
  tooltipRef!: ElementRef<HTMLDivElement>;

  // ===== Resolved values =====
  resolvedPosition = signal(this.tipPosition());
  resolvedAlignment = signal(this.tipAlignment());

  private readonly clockwiseOrder = [
    'top',
    'right',
    'bottom',
    'left'
  ];

  private readonly alignments = ['start', 'end'];

  // ===== Highlight box style =====
  highlightStyle = computed(() => {
    const obj = this.objectDimensions();
    return {
      top: `${obj.top - 5}px`,
      left: `${obj.left - 5}px`,
      width: `${obj.right - obj.left + 10}px`,
      height: `${obj.bottom - obj.top + 10}px`,
    };
  });

  // ===== Tooltip style =====
  tooltipStyle = computed(() => {
    const obj = this.objectDimensions();
    const width = 220;
    const height = 110;

    const coords = this.calculateCoords(
      this.resolvedPosition(),
      this.resolvedAlignment(),
      obj,
      width,
      height
    );

    return {
      top: `${coords.top}px`,
      left: `${coords.left}px`,
    };
  });

  // ===== Auto-positioning engine =====
  constructor() {
    effect(() => {
      const preferredPosition = this.tipPosition();
      const preferredAlignment = this.tipAlignment();
      const obj = this.objectDimensions();

      this.screenWidth();
      this.screenHeight();

      const width = 220;
      const height = 110;

      let position = preferredPosition;
      let attempts = 0;

      while (attempts < 4) {

        // Try preferred alignment first
        const alignmentsToTry =
          preferredAlignment === 'start'
            ? ['start', 'end']
            : ['end', 'start'];

        for (const alignment of alignmentsToTry) {
          
          const coords = this.calculateCoords(
            position,
            alignment,
            obj,
            width,
            height
            );

          if (this.fitsOnScreen(coords.top, coords.left, width, height)) {
            this.resolvedPosition.set(position);
            this.resolvedAlignment.set(alignment);
            return;
          }
        }

        position = this.nextClockwise(position);
        attempts++;
      }

      // fallback
      this.resolvedPosition.set(preferredPosition);
      this.resolvedAlignment.set(preferredAlignment);
    });
  }

  // ===== Coordinate calculator with alignment =====
  private calculateCoords(
    position: string,
    alignment: string,
    obj: any,
    width: number,
    height: number
  ): any {
    const gap = 12;

    switch (position) {

      case 'top':
        return {
          top: obj.top - height - gap,
          left:
            alignment === 'start'
              ? obj.left
              : obj.right - width
        };

      case 'bottom':
        return {
          top: obj.bottom + gap,
          left:
            alignment === 'start'
              ? obj.left
              : obj.right - width
        };

      case 'left':
        return {
          left: obj.left - width - gap,
          top:
            alignment === 'start'
              ? obj.top
              : obj.bottom - height
        };

      case 'right':
        return {
          left: obj.right + gap,
          top:
            alignment === 'start'
              ? obj.top
              : obj.bottom - height
        };
    }
  }

  // ===== Screen bounds check =====
  private fitsOnScreen(
    top: number,
    left: number,
    width: number,
    height: number
  ): boolean {
    const padding = 8;

    return (
      left >= padding &&
      top >= padding &&
      left + width <= this.screenWidth() - padding &&
      top + height <= this.screenHeight() - padding
    );
  }

  // ===== Clockwise rotation =====
  private nextClockwise(pos: string): string {
    const index = this.clockwiseOrder.indexOf(pos);
    return this.clockwiseOrder[(index + 1) % 4];
  }

  close() {
    this.next.emit();
  }
}