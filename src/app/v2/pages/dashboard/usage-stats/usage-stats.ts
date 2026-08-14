import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-usage-stats',
  imports: [Header, DashboardSidebar],
  templateUrl: './usage-stats.html',
  styleUrl: './usage-stats.css',
})
export class UsageStats {

}
