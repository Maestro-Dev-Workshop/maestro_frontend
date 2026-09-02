import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { Credits } from './credits/credits';
import { Memberships } from './memberships/memberships';

@Component({
  selector: 'app-store',
  imports: [Header, DashboardSidebar, Credits, Memberships],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {
  private readonly route = inject(ActivatedRoute);

  showMemberships = signal(false);

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.showMemberships.set(
        params.get('showMembership') === 'true'
      );
    });
  }
}