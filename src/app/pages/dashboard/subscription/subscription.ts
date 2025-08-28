import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../core/services/subscription.service';
import {Plan, SubscriptionStatus} from '../../../core/models/subscription.model';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  template: ` `
})
export class SubscriptionComponent implements OnInit {
  plans = signal<Plan[]>([]);
  status = signal<SubscriptionStatus | null>(null);

  constructor(private subSvc: SubscriptionService) {}

  ngOnInit() {
    this.subSvc.getPlans().subscribe(plans => this.plans.set(plans));
    this.refresh();
  }

  onSubscribe(id: string) {
    this.subSvc.subscribe(id).subscribe(() => this.refresh());
  }

  onCancel() {
    this.subSvc.cancel().subscribe(() => this.refresh());
  }

  private refresh() {
    this.subSvc.getStatus().subscribe(st => this.status.set(st));
  }
}