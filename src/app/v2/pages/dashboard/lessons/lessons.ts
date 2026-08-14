import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-lessons',
  imports: [Header, DashboardSidebar],
  templateUrl: './lessons.html',
  styleUrl: './lessons.css',
})
export class Lessons {

}
