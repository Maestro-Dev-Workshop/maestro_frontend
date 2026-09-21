import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shiny-btn',
  standalone: true,
  templateUrl: './shiny-btn.html',
  styleUrl: './shiny-btn.css',
})
export class ShinyBtnComponent {
  additionalClasses = input<string>('');
  disabled = input<boolean>(false);

  onPointerMove(event: PointerEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
  
    button.style.setProperty(
      '--glow-x',
      `${event.clientX - rect.left}px`
    );
  
    button.style.setProperty(
      '--glow-y',
      `${event.clientY - rect.top}px`
    );
  
    button.classList.add('glow-active');
  }
  
  onPointerLeave(event: PointerEvent) {
    (event.currentTarget as HTMLElement).classList.remove('glow-active');
  }
}