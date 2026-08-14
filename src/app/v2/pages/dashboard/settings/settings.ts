import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-settings',
  imports: [Header, DashboardSidebar],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

}
