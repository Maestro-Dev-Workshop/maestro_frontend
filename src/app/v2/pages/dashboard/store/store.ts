import { Component, signal } from '@angular/core';
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
  showMemberships = signal(false);
}
