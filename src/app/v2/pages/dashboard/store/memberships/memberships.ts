import { Component, inject, OnInit, signal } from '@angular/core';
import { ThemeIconComponent } from '../../../../../shared/components/theme-icon/theme-icon';
import { ShinyBtnComponent } from '../../../../shared/components/shiny-btn/shiny-btn';
import { Plan, SubscriptionStatus } from '../../../../../core/models';
import { SubscriptionService } from '../../../../../core/services/subscription.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CurrencyLocalizerPipe } from '../../../../../shared/pipes/currency-localizer-pipe';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StandardBtn } from '../../../../shared/components/standard-btn/standard-btn';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-memberships',
  imports: [ThemeIconComponent, ShinyBtnComponent, CurrencyLocalizerPipe, CommonModule, DecimalPipe, StandardBtn],
  templateUrl: './memberships.html',
  styleUrl: './memberships.css',
})
export class Memberships implements OnInit {
  loading = {
    status: signal(true),
    text: signal('Loading membership plans...'),
  }
  socket!: Socket;

  memberships = signal<any[]>([]);

  membershipTemplate = {
    code: 'code',
    title: 'name',
    price: 'display_price',
    subtitle: 'description',
    features: [
      { value: '-', text: 'membership credits per month', key: 'membership_credits' },
      { value: '-%', text: 'discount on credit purchases', key: 'topup_discount' },
      { value: '-', text: 'word soft limit', key: 'word_soft_limit' },
      { value: '-MB', text: 'lesson files size limit', key: 'lesson_cummulative_file_size' },
      { value: '-', text: 'total lesson capacity', key: 'lesson_capacity' },
      { value: '-', text: 'free chatbot messages', key: 'chatbot_messages' },
      { value: 'Exclusive Cell Types', text: 'unlocked', key: 'cells_allowed' },
    ],
  }

  plans = signal<Plan[]>([]);
  subscription = signal<SubscriptionStatus | null>(null);
  countryCode = signal('US')

  subscriptionService = inject(SubscriptionService)
  notify = inject(NotificationService)

  ngOnInit() {
    this.subscriptionService.getPlans().subscribe({
      next: (response) => {
        this.plans.set(response.plans)
        this.countryCode.set(response.country_code);
        this.loadMembershipPlans();
        this.loading.status.set(false);
      }, 
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to load subscription plans. Please try again later.");
        this.loading.status.set(false);
      }
    });

    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.subscription.set(response.subscription);
      },
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to load subscription status. Please try again later.");
      },
    });
  }

  // Load membership plans and map them to the template structure
  private loadMembershipPlans() {
    const plans = this.plans();
    const memberships = plans.map((plan: any) => {
      return {
        code: plan.code,
        title: plan.name,
        price: plan.display_price,
        subtitle: plan.description,
        features: this.membershipTemplate.features.map(feature => {
          if (feature.key == 'topup_discount') {
            return {
              value: plan[feature.key].toLocaleString() + '%' || feature.value,
              text: feature.text,
            }
          } else if (feature.key == 'lesson_cummulative_file_size') {
            return {
              value: plan[feature.key].toLocaleString() + 'MB' || feature.value,
              text: feature.text,
            }
          } else if (feature.key == 'lesson_capacity') {
            return {
              value: (plan[feature.key] > 0 ? plan[feature.key].toLocaleString() : 'Unlimited') || feature.value,
              text: feature.text,
            }
          } else if (feature.key == 'cells_allowed') {
            return {
              value: plan[feature.key].limited ? 'Limited Cell Types' : 'Exclusive Cell Types',
              text: plan[feature.key].limited ? 'available' : 'unlocked',
            }
          } else {
            return {
              value: plan[feature.key].toLocaleString() || feature.value,
              text: feature.text,
            }
          }
        })
      }
    });
    this.memberships.set(memberships);
  }

  changeMembership(planCode: string) {
    this.loading.status.set(true);
    this.loading.text.set('Redirecting to payment gateway...');

    this.subscriptionService.subscribe(planCode).subscribe({
      next: (response) => {
        window.open(response.transaction.authorization_url, '_blank');
        this.loading.status.set(false);

        this.socket = io(environment.apiUrl.slice(0, -4), {
          withCredentials: true
        });
    
        this.socket.emit("join-email-room", this.subscription()?.user_email);
      
        this.socket.on("subscription-paid", () => {
          this.notify.showSuccess("Payment successfully processed.");
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        });

        this.socket.on("subscription-payment-failed", () => {
          this.notify.showError("Payment failed. Please try again.");
        });
      },
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to initiate subscription. Please try again.");
        this.loading.status.set(false);
      }
    });
  }
}
