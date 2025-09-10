import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  @Output() navigateSection = new EventEmitter<'top' | 'features' | 'contact'>();

  constructor(private router: Router) {}

  onHomeClick() {
    this.navigateSection.emit('top');
  }

  onFeaturesClick() {
    this.navigateSection.emit('features');
  }

  onContactClick() {
    this.navigateSection.emit('contact');
  }

  onGetStartedClick() {
    this.router.navigate(['/auth/signup']);
  }
}
