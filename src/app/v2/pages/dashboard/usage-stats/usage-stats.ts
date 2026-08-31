import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-usage-stats',
  imports: [CommonModule, Header, DashboardSidebar, ThemeIconComponent, RouterLink],
  templateUrl: './usage-stats.html',
  styleUrl: './usage-stats.css',
})
export class UsageStats {

  showDetails = signal(true);
  membershipFeatures = signal([
    {
      title: '50 Monthly Credits',
      desc: 'Gain 50 membership credits that expire and renew every 30 days.',
      icon: 'monthly-credit-icon',
      enabled: true,
    },
    {
      title: '0% Discount',
      desc: 'Your current membership offers no inherent discount on credit purchases from the shop.',
      icon: 'discount-icon',
      enabled: false,
    },
    {
      title: '100MB Upload Limit',
      desc: 'Upload files with cumulative size up to a total of 100MB per lesson.',
      icon: 'upload-limit-icon',
      enabled: true,
    },
    {
      title: '10,000 Words Soft Limit',
      desc: 'Process files for each lesson with total word count up to 10,000 before overcharge fees kick in.',
      icon: 'word-limit-icon',
      enabled: true,
    },
    {
      title: '20 Max Lesson Capacity',
      desc: 'Keep up to a maximum of 20 lessons within Maestro.',
      icon: 'max-lesson-icon',
      enabled: true,
    },
    {
      title: '10 Free Chatbot Messages',
      desc: 'Send up to 10 free messages to the chatbot per lesson, before overcharge fees kick in.',
      icon: 'chatbot-messages-icon',
      enabled: true,
    },
    {
      title: 'Limited Cell Types',
      desc: 'Restricted access to the full catalog of content cells for lesson generation.',
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
