import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shiny-btn',
  standalone: true,
  templateUrl: './shiny-btn.html',
  styleUrl: './shiny-btn.css',
})
export class ShinyBtnComponent {
  additionalClasses = input<string>('');
}