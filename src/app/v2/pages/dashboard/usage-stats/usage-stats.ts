import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-usage-stats',
  imports: [CommonModule, Header, DashboardSidebar, ThemeIconComponent],
  templateUrl: './usage-stats.html',
  styleUrl: './usage-stats.css',
})
export class UsageStats {
  showDetails = signal(true);
  membershipFeatures = signal([
    {
      title: '50 Monthly Credits',
      desc: '...',
      icon: 'monthly-credit-icon',
      enabled: true,
    },
    {
      title: '0% Discount',
      desc: '...',
      icon: 'discount-icon',
      enabled: false,
    },
    {
      title: '100MB Upload Limit',
      desc: '...',
      icon: 'upload-limit-icon',
      enabled: true,
    },
    {
      title: '10,000 Words Soft Limit',
      desc: '...',
      icon: 'word-limit-icon',
      enabled: true,
    },
    {
      title: '20 Max Lesson Capacity',
      desc: '...',
      icon: 'max-lesson-icon',
      enabled: true,
    },
    {
      title: '10 Free Chatbot Messages',
      desc: '...',
      icon: 'chatbot-messages-icon',
      enabled: true,
    },
    {
      title: 'Limited Cell Types',
      desc: '...',
      icon: 'limited-cell-icon',
      enabled: false,
    },
  ]);

  creditBalance = signal([
    {
      title: 'Top-up Credits',
      value: 163,
      desc: 'Credits from shop purchases and other promos.',
    },
    {
      title: 'Membership Credits',
      value: 72,
      desc: 'Credits from membership plan. Refreshes on June 1.',
    },
    {
      title: 'Total Credits',
      value: 245,
      desc: 'Membership Credits are consumed before Top-up Credits.',
    },
  ]);

  // Dynamic Mock Data for Credit History
  creditHistory = signal([
    {
      date: '20 May 2026',
      amount: -84,
      context: 'Lesson Generation for Mathematics',
    },
    { date: '19 May 2026', amount: 125, context: 'Large Credit Pack' },
    { date: '1 May 2026', amount: 50, context: 'Membership Credits' },
    {
      date: '22 April 2026',
      amount: -27,
      context: 'Lesson Generation for Numerical Methods and Analysis',
    },
  ]);
}
