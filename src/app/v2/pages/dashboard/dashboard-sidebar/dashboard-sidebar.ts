import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SidebarItem, SidebarItemModel } from '../../../shared/components/sidebar-item/sidebar-item';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

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

  initials = signal<string>("JD")
  fullName = signal<string>("John Doe")
  email = signal<string>("john.doe@gmail.com")
  expanded = signal<boolean>(true)

  authService = inject(AuthService)

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

    this.authService.getUserDetails().subscribe({
      next: (response) => {
        this.initials.set(response.user.first_name.slice(0,1) + response.user.last_name.slice(0,1));
        this.fullName.set(response.user.first_name + ' ' + response.user.last_name);
        this.email.set(response.user.email);
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    })
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
