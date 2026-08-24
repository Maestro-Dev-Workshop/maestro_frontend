import { Component } from '@angular/core';
import { ThemeIconComponent } from '../../../../../shared/components/theme-icon/theme-icon';
import { ShinyBtnComponent } from '../../../../shared/components/shiny-btn/shiny-btn';

@Component({
  selector: 'app-memberships',
  imports: [ThemeIconComponent, ShinyBtnComponent],
  templateUrl: './memberships.html',
  styleUrl: './memberships.css',
})
export class Memberships {
  memberships = [
    {
      title: 'Standard',
      price: '₦6,000',
      subtitle: 'For consistent learners who need more flexibility.',
      features: [
        { value: '300', text: 'membership credits per month' },
        { value: '15%', text: 'discount on credit purchases' },
        { value: '30,000', text: 'word soft limit' },
        { value: '200MB', text: 'lesson files size limit' },
        { value: '50', text: 'total subject capacity' },
        { value: '30', text: 'free chatbot messages' },
        { value: 'Exclusive Cell Types', text: 'unlocked' },
      ],
    },
    {
      title: 'Premium',
      price: '₦15,000',
      subtitle: 'For serious learners who want to go all out.',
      isPremium: true,
      features: [
        { value: '1000', text: 'membership credits per month' },
        { value: '25%', text: 'discount on credit purchases' },
        { value: '80,000', text: 'word soft limit' },
        { value: '500MB', text: 'lesson files size limit' },
        { value: 'Unlimited', text: 'total subject capacity' },
        { value: '60', text: 'free chatbot messages' },
        { value: 'Exclusive Cell Types', text: 'unlocked' },
      ],
    },
  ];
}
