import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { Plan, SubscriptionStatus } from '../../../core/models/subscription.model';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './subscription.html'
})
export class Subscription implements OnInit {

  // --------------------------
  // USER PROFILE SIGNALS
  // --------------------------
  firstname = signal('');
  lastname = signal('');
  email = signal('');

  // --------------------------
  // SUBSCRIPTION SIGNALS
  // --------------------------
  plans = signal<Plan[]>([]);
  status = signal<SubscriptionStatus | null>(null);

  activeTab = signal<'account' | 'billing'>('billing');

  // --------------------------
  // USAGE DATA (Make dynamic later)
  // --------------------------
  generatedLessons = 1;
  generatedLimit = 2;
  savedLessons = 3;
  savedLimit = 5;

  // --------------------------
  // DONUT DRAW SETTINGS
  // --------------------------
  outerRadius = 80;
  innerRadius = 55;

  outerCircumference = 2 * Math.PI * this.outerRadius;
  innerCircumference = 2 * Math.PI * this.innerRadius;

  // STRING values (required by Angular 20 for SVG)
  outerDashArray = '';
  outerDashOffset = '';
  innerDashArray = '';
  innerDashOffset = '';

  constructor(
    private subSvc: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.firstname.set(localStorage.getItem('firstname') || '');
    this.lastname.set(localStorage.getItem('lastname') || '');
    this.email.set(localStorage.getItem('userEmail') || '');

    this.subSvc.getPlans().subscribe(plans => this.plans.set(plans));
    this.refresh();
    this.calculateUsage();
  }

  openTab(tab: 'account' | 'billing') {
    this.activeTab.set(tab);
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  onSubscribe(id: string) {
    this.subSvc.subscribe(id).subscribe(() => this.refresh());
  }

  saveProfile() {
    localStorage.setItem('firstname', this.firstname());
    localStorage.setItem('lastname', this.lastname());
    localStorage.setItem('userEmail', this.email());
    alert("Profile saved!");
  }

  refresh() {
    this.subSvc.getStatus().subscribe(st => {
      this.status.set(st);
      this.calculateUsage();
    });
  }

  // ------------------------------------
  // PLAN LIMITS (Backend still missing)
  // ------------------------------------
  getMaxSubjects() {
    const id = this.status()?.plan?.id;
    switch (id) {
      case 'starter': return 2;
      case 'pro': return 8;
      case 'premium': return 25;
      default: return 1;
    }
  }

  // --------------------------
  // DONUT CALCULATION
  // --------------------------
  calculateUsage() {
    const used = this.generatedLessons || 0;
    const max = this.generatedLimit || 1;
    const saved = this.savedLessons || 0;
    const savedLimit = this.savedLimit || 1;

    // OUTER RING — lesson generation
    const outerPercent = Math.min(used / max, 1);
    this.outerDashArray = `${this.outerCircumference * outerPercent} ${this.outerCircumference * (1 - outerPercent)}`;
    this.outerDashOffset = `${this.outerCircumference * outerPercent}`;

    // INNER RING — saved lessons
    const innerPercent = Math.min(saved / savedLimit, 1);
    this.innerDashArray = `${this.innerCircumference * innerPercent} ${this.innerCircumference * (1 - innerPercent)}`;
    this.innerDashOffset = `${this.innerCircumference * innerPercent}`;
  }
}
