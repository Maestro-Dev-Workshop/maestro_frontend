import { ChangeDetectorRef, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-flashcards',
  imports: [ThemeIconComponent],
  templateUrl: './flashcards.html',
  styleUrl: './flashcards.css'
})
export class Flashcards {
  topicId = input<string>();
  cards = input<any>();
  currentIndex: number = 0;
  showAnswer: boolean = false;
  showHint: boolean = false;
  currentAnim = '';
  cardElement = viewChild<ElementRef>('card')

  constructor(private cdr: ChangeDetectorRef) {}

  private updateOnInputChange = effect(() => {
    const viewCards = this.cards();
    if (viewCards?.length) {
      this.currentIndex = 0;
      this.showAnswer = false;
      this.showHint = false;
    }
  });

  nextCard() {
    if (this.currentIndex < this.cards().length - 1) {
      this.cardElement()?.nativeElement.classList.add('move-left-start');
      this.currentAnim = 'move-left-start';
    }
  }

  previousCard() {
    if (this.currentIndex > 0) {
      this.cardElement()?.nativeElement.classList.add('move-right-start');
      this.currentAnim = 'move-right-start';
    }
  }

  toggleAnswer() {
    this.cardElement()?.nativeElement.classList.add('flip-start');
    this.currentAnim = 'flip-start';
  }

  toggleHint() {
    this.showHint = !this.showHint;
  }

  ngOnInit() {
    this.cardElement()?.nativeElement.addEventListener('animationend', (ev: any) => {
      this.animationAction(this.currentAnim);
    });
  }

  animationAction(anim: string) {
    switch (anim) {
      case 'flip-start':
        this.showAnswer = !this.showAnswer;
        this.cardElement()?.nativeElement.classList.remove('flip-start');
        this.cardElement()?.nativeElement.classList.add('flip-end');
        this.currentAnim = 'flip-end';
        break;
      case 'flip-end':
        this.cardElement()?.nativeElement.classList.remove('flip-end');
        this.currentAnim = '';
        break;

      case 'move-left-start':
        this.currentIndex++;
        this.showAnswer = false;
        this.showHint = false;
        this.cardElement()?.nativeElement.classList.remove('move-left-start');
        this.cardElement()?.nativeElement.classList.add('move-left-end');
        this.currentAnim = 'move-left-end';
        break;
      case 'move-left-end':
        this.cardElement()?.nativeElement.classList.remove('move-left-end');
        this.currentAnim = '';
        break;

      case 'move-right-start':
        this.currentIndex--;
        this.showAnswer = false;
        this.showHint = false;
        this.cardElement()?.nativeElement.classList.remove('move-right-start');
        this.cardElement()?.nativeElement.classList.add('move-right-end');
        this.currentAnim = 'move-right-end';
        break;
      case 'move-right-end':
        this.cardElement()?.nativeElement.classList.remove('move-right-end');
        this.currentAnim = '';
        break;
    }
    this.cdr.detectChanges();
  }
}
