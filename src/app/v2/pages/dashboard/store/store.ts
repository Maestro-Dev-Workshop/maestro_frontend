import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-store',
  imports: [Header, DashboardSidebar],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {

}
