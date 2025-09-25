import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  @Output() navigateSection = new EventEmitter<'top' | 'features' | 'pricing' | 'contact'>();

  onHomeClick() {
    this.navigateSection.emit('top');
  }

  onFeaturesClick() {
    this.navigateSection.emit('features');
  }

  onPricingClick() {
    this.navigateSection.emit('pricing');
  }
}
