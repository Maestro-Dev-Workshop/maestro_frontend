import { Component, input, OnInit, signal } from '@angular/core';
import { SidebarItem, SidebarItemModel } from '../../../shared/components/sidebar-item/sidebar-item';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [SidebarItem, ThemeIconComponent],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.css',
})
export class DashboardSidebar implements OnInit {
  dashboardPages : SidebarItemModel[] = [
    {
      title: "Lessons",
      icon: "lessons-menu-icon",
      selected: false,
      route: "/v2/lessons"
    },
    {
      title: "Credit Store",
      icon: "store-menu-icon",
      selected: false,
      route: "/v2/store"
    },
    {
      title: "Membership & Usage",
      icon: "usage-menu-icon",
      selected: false,
      route: "/v2/usage-stats"
    },
  ]

  currentPage = input<string>("")

  initials = signal<string>("EE")
  fullName = signal<string>("Emmanuel Ewuoso")
  email = signal<string>("ewuoso03@gmail.com")
  expanded = signal<boolean>(true)

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    // Set the selected page based on the currentPage input
    this.dashboardPages.forEach((page) => {
      page.selected = (page.title === this.currentPage());
    });

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      this.expanded.set(false)
    }
  }

  toggleSidebar() {
    this.expanded.set(!this.expanded());
  }

  navigateToPage(route: string | undefined, index: number) {
    this.router.navigateByUrl(route || '/v2/lessons');
  }

  navigateToSettings() {
    this.router.navigateByUrl('/v2/settings');
  }
}
