import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { Router, RouterLink } from '@angular/router';
import { StandardBtn } from '../../../shared/components/standard-btn/standard-btn';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { CreditService } from '../../../../core/services/credit.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plan, SubscriptionStatus } from '../../../../core/models';
import { CreditBalance, CreditHistory } from '../../../../core/models/credit.model';

@Component({
  selector: 'app-usage-stats',
  imports: [CommonModule, Header, DashboardSidebar, ThemeIconComponent, RouterLink, StandardBtn],
  templateUrl: './usage-stats.html',
  styleUrl: './usage-stats.css',
})
export class UsageStats {
  subscriptionService = inject(SubscriptionService)
  creditService = inject(CreditService)
  notify = inject(NotificationService)

  subscriptionData = signal<SubscriptionStatus | null>(null);
  membershipData = signal<Plan | null>(null);
  creditBalanceData = signal<CreditBalance | null>(null);
  creditHistoryData = signal<CreditHistory[]>([]);

  loading = {
    subscription: signal(true),
    balance: signal(true),
    history: signal(true),
    subscriptionCancel: signal(false),
  }

  showDetails = signal(true);
  membershipFeatures = signal([
    {
      tag: 'membership_credits',
      title: '50 Monthly Credits',
      desc: 'Gain 50 membership credits that expire and renew every 30 days.',
      icon: 'monthly-credit-icon',
      enabled: true,
    },
    {
      tag: 'discount',
      title: '0% Discount',
      desc: 'Your current membership offers no inherent discount on credit purchases from the shop.',
      icon: 'discount-icon',
      enabled: false,
    },
    {
      tag: 'file_size_limit',
      title: '100MB Upload Limit',
      desc: 'Upload files with cumulative size up to a total of 100MB per lesson.',
      icon: 'upload-limit-icon',
      enabled: true,
    },
    {
      tag: 'word_soft_limit',
      title: '10,000 Words Soft Limit',
      desc: 'Process files for each lesson with total word count up to 10,000 before overcharge fees kick in.',
      icon: 'word-limit-icon',
      enabled: true,
    },
    {
      tag: 'lesson_capacity',
      title: '20 Max Lesson Capacity',
      desc: 'Keep up to a maximum of 20 lessons within Maestro.',
      icon: 'max-lesson-icon',
      enabled: true,
    },
    {
      tag: 'chatbot_messages',
      title: '10 Free Chatbot Messages',
      desc: 'Send up to 10 free messages to the chatbot per lesson, before overcharge fees kick in.',
      icon: 'chatbot-messages-icon',
      enabled: true,
    },
    {
      tag: 'cell_types',
      title: 'Limited Cell Types',
      desc: 'Restricted access to the full catalog of content cells for lesson generation.',
      icon: 'limited-cell-icon',
      enabled: false,
    },
  ]);

  creditBalance = signal([
    {
      tag: 'topup_credits',
      title: 'Top-up Credits',
      value: 0,
      desc: 'Credits from shop purchases and other promos.',
    },
    {
      tag: 'membership_credits',
      title: 'Membership Credits',
      value: 0,
      desc: 'Credits from membership plan. Refreshes on January 1.',
    },
    {
      tag: 'total_credits',
      title: 'Total Credit Balance',
      value: 0,
      desc: 'Membership Credits are consumed before Top-up Credits.',
    },
  ]);

  // Dynamic Mock Data for Credit History
  creditHistory = signal([
    {
      date: '-',
      amount: 0,
      context: '-',
    },
  ]);

  ngOnInit() {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.loadSubscriptionPlanDetails(response.subscription.plan);
        this.subscriptionData.set(response.subscription);
        this.membershipData.set(response.subscription.plan);

        this.creditService.getBalance().subscribe({
          next: (response) => {
            this.loadCreditBalanceDetails(response.balance);
            this.creditBalanceData.set(response.balance);
          },
          error: (res) => {
            this.notify.showError('Failed to load credit balance.');
          }
        })
      },
      error: (res) => {
        this.notify.showError('Failed to load subscription data.');
      }
    })


    this.creditService.getHistory().subscribe({
      next: (response) => {
        this.loadCreditHistoryDetails(response.history);
        this.creditHistoryData.set(response.history);
      },
      error: (res) => {
        this.notify.showError('Failed to load credit history.');
      }
    })
  }

  private loadSubscriptionPlanDetails(plan: Plan) {
    this.membershipFeatures.set(this.membershipFeatures().map((feature: any) => {
      switch (feature.tag) {
        case 'membership_credits':
          if (plan.membership_credits) {
            feature.enabled = plan.membership_credits > 0;
            feature.desc = `Gain ${plan.membership_credits} membership credits that expire and renew every 30 days.`;
            feature.title = `${plan.membership_credits} Monthly Credits`;
          }
          break;

        case 'discount':
          if (plan.topup_discount) {
            feature.enabled = plan.topup_discount > 0;
            feature.desc = `Your current membership offers ${plan.topup_discount}% discount on credit purchases from the shop.`;
            feature.title = `${plan.topup_discount}% Discount`;
          }
          break;

        case 'file_size_limit':
          if (plan.lesson_cummulative_file_size) {
            feature.enabled = plan.lesson_cummulative_file_size > 0;
            feature.desc = `Upload files with cumulative size up to a total of ${plan.lesson_cummulative_file_size}MB per lesson.`;
            feature.title = `${plan.lesson_cummulative_file_size}MB Upload Limit`;
          }
          break;

        case 'word_soft_limit':
          if (plan.word_soft_limit) {
            feature.enabled = plan.word_soft_limit > 0;
            feature.desc = `Process files for each lesson with total word count up to ${plan.word_soft_limit} before overcharge fees kick in.`;
            feature.title = `${plan.word_soft_limit.toLocaleString()} Words Soft Limit`;
          }
          break;

        case 'lesson_capacity':
          if (plan.lesson_capacity) {
            feature.enabled = true;
            feature.desc = (plan.lesson_capacity <= 0) 
            ? 'Keep an unlimited number of lessons within Maestro.'
            : `Keep up to a maximum of ${plan.lesson_capacity} lessons within Maestro.`
            feature.title = (plan.lesson_capacity <= 0)
            ? 'Unlimited Lesson Capacity'
            : `${plan.lesson_capacity} Max Lesson Capacity`
          }
          break;

        case 'chatbot_messages':
          if (plan.chatbot_messages) {
            feature.enabled = plan.chatbot_messages > 0;
            feature.desc = `Send up to ${plan.chatbot_messages} free messages to the chatbot per lesson, before overcharge fees kick in.`;
            feature.title = `${plan.chatbot_messages} Free Chatbot Messages`;
          }
          break;

        case 'cell_types':
          if (plan.cells_allowed) {
            feature.enabled = !plan.cells_allowed.limited;
            feature.desc = plan.cells_allowed.limited
              ? 'Restricted access to the full catalog of content cells for lesson generation.'
              : 'Full access to the catalog of content cells for lesson generation.';
            feature.title = plan.cells_allowed.limited ? 'Limited Cell Types' : 'Exclusive Cell Types';
          }
          break;
      }
      return feature
    }))
    this.loading.subscription.set(false);
  }

  private loadCreditBalanceDetails(balance: CreditBalance) {
    this.creditBalance.set(this.creditBalance().map((item: any) => {
      switch (item.tag) {
        case 'topup_credits':
          item.value = Number(balance.topup_credits);
          break;

        case 'membership_credits':
          item.value = Number(balance.membership_credits);
          const subscription = this.subscriptionData();
          if (subscription?.end_date) {
            item.desc = `Credits from membership plan. Refreshes on ${new Date(
              subscription.end_date
            ).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric'
            })}.`;
          } else {
            item.desc = 'Credits from membership plan. Refreshes every 30 days.';
          }
          break;

        case 'total_credits':
          item.value = Number(balance.topup_credits) + Number(balance.membership_credits);
          break;
      }
      return item
    }))
    this.loading.balance.set(false);
  }

  private loadCreditHistoryDetails(history: CreditHistory[]) {
    this.creditHistory.set(history.filter((item: any) => item.status == 'SUCCESS').map((item: any) => ({
      date: new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      amount: Number(item.amount),
      context: item.description || item.reference || '-',
    })))
    this.loading.history.set(false);
  }

  cancelSubscription() {
    this.loading.subscriptionCancel.set(true);
    this.subscriptionService.cancel().subscribe({
      next: (response) => {
        this.notify.showSuccess("Subscription cancelled successfully.");
        this.loading.subscriptionCancel.set(false);
        window.location.reload();
      },
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to cancel subscription. Please try again later.");
      },
      complete: () => {
        this.loading.subscriptionCancel.set(false);
      }
    });
  }

  get uncancellableSubscription() {
    return ['beta', 'free2play'].includes(this.membershipData()?.code || '')
  }
}
