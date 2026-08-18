import { Component, computed, effect, ElementRef, input, output, signal, untracked, viewChild } from '@angular/core';
import { MarkdownPipe } from '../../../../shared/pipes/markdown-pipe';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-glossary',
  imports: [MarkdownPipe, ThemeIconComponent],
  templateUrl: './glossary.html',
  styleUrl: './glossary.css',
})
export class Glossary {
  glossaryItems = input<any>();
  scroll = output<any>();
  mainGlossary = viewChild<ElementRef>('mainGlossary');
  sideNavigation = viewChild<ElementRef>('sideNavigation');

  arrangedGlossary = computed(() => {
    // create an array of objects for each letter with corresponding terms, use # to represent non-alphabetical starting terms
    const arranged: { letter: string, terms: any[] }[] = [];
    const groupedTerms: { [key: string]: any[] } = {};
    this.glossaryItems().forEach((item: any) => {
      const firstChar = item.term.charAt(0).toUpperCase();
      const key = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!groupedTerms[key]) {
        groupedTerms[key] = [];
      }
      groupedTerms[key].push(item);
    });
    Object.keys(groupedTerms).forEach(letter => {
      arranged.push({ letter, terms: groupedTerms[letter] });
    });
    return arranged.sort((a, b) => a.letter.localeCompare(b.letter));
  })

  constructor() {}

  private updateOnInputChange = effect(() => {
    const view = this.glossaryItems();
    if (view?.length) {
      untracked(() => {
        setTimeout(() => this.scrollToTop(), 0);
      });
    }
  });

  scrollToTop() {
    const el1 = this.mainGlossary();
    if (el1?.nativeElement) {
      el1.nativeElement.scrollTop = 0;
    }
    const el2 = this.sideNavigation();
    if (el2?.nativeElement) {
      el2.nativeElement.scrollTop = 0;
    }
  }

  scrollToElement(id: string) {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Had to force smooth scrolling
  scrollToElementSmooth(id: string) {
    const glossaryContainer = this.mainGlossary();
    if (glossaryContainer?.nativeElement) {
      const target = document.getElementById(id);
      if (target) {
        const container = glossaryContainer.nativeElement;
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        
        const targetPosition = container.scrollTop + (targetRect.top - containerRect.top) - 20;
        const startPosition = container.scrollTop;
        const distance = targetPosition - startPosition;
        const duration = 500; // milliseconds
        let startTime: number | null = null;
  
        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // Easing function for smooth animation
          const ease = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
          container.scrollTop = startPosition + (distance * ease);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        };
  
        requestAnimationFrame(animation);
      }
    }
  }
}
