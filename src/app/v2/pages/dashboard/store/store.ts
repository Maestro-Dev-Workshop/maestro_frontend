import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { ShinyBtnComponent } from '../../../shared/components/shiny-btn/shiny-btn';

@Component({
  selector: 'app-store',
  imports: [CommonModule, Header, DashboardSidebar, ThemeIconComponent, ShinyBtnComponent],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {
  showMemberships = signal(false);

  creditPacks = [
    { credits: 20, price: '₦500', desc: 'Small pack description' },
    { credits: '100', bonusCredits: '+ 25', price: '₦2,000', desc: 'Medium pack description', bonus: true },
    { credits: 500, price: '₦6,400', oldPrice: '₦8,000', desc: 'Large pack description', discount: '20% Discount' },
    { credits: 2400, price: '₦30,000', desc: 'Mega pack description' }
  ];

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
        { value: 'Exclusive Cell Types', text: 'unlocked' }
      ]
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
        { value: 'Exclusive Cell Types', text: 'unlocked' }
      ]
    }
  ];
}