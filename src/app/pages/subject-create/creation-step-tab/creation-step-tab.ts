import { CommonModule, NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-creation-step-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creation-step-tab.html',
  styleUrl: './creation-step-tab.css'
})
export class CreationStepTab implements OnInit {
  text = input.required<string>();
  icon = input<string | null>(null);
  active = input();

  bgColour = '';
  textColour = '';

  ngOnInit () {
    if (this.active()) {
      this.bgColour = 'bg-prussian-blue-800';
      this.textColour = 'text-prussian-blue-900';
    } else {
      this.bgColour = 'bg-prussian-blue-250';
      this.textColour = 'text-prussian-blue-500';
    }
  }
}
