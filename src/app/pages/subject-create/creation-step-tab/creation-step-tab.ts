import { CommonModule, NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-creation-step-tab',
  standalone: true,
  imports: [CommonModule, ThemeIconComponent],
  templateUrl: './creation-step-tab.html',
  styleUrl: './creation-step-tab.css'
})
export class CreationStepTab implements OnInit {
  text = input.required<string>();
  icon = input<string>('');
  active = input();

  bgColour = '';
  textColour = '';

  ngOnInit () {
    if (this.active()) {
      this.bgColour = 'bg-[var(--text-primary)]';
      this.textColour = 'text-[var(--text-primary)]';
    } else {
      this.bgColour = 'bg-prussian-blue-400';
      this.textColour = 'text-[var(--text-primary-hover)]';
    }
  }
}
