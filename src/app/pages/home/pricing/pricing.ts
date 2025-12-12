import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { CurrencyLocalizerPipe } from '../../../shared/pipes/currency-localizer-pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  imports: [RouterLink, CurrencyLocalizerPipe, CommonModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css'
})
export class Pricing implements OnInit {
  basicPrice = 0
  standardPrice = 10
  premiumPrice = 25
  countryCode = 'US';

  constructor(
    private subscriptionService: SubscriptionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptionService.getPlans().subscribe({
      next: (res) => {
        console.log(res);
        res.plans.forEach((plan: any) => {
          if (plan.name.toLowerCase() === 'basic') {
            this.basicPrice = plan.display_price;
          } else if (plan.name.toLowerCase() === 'standard') {
            this.standardPrice = plan.display_price;
          } else if (plan.name.toLowerCase() === 'premium') {
            this.premiumPrice = plan.display_price;
          }
        });
        this.countryCode = res.country_code
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching plans:', err);
      }
    });
  }

}
