import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Landing } from '../landing/landing';
import { Features } from '../features/features';
import { Pricing } from '../pricing/pricing';
import { Contact } from '../contact/contact';
import { Team } from '../team/team';

@Component({
  selector: 'app-home',
  imports: [Landing, Features, Pricing, Contact, Team],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(
    private router: Router,
    private vscroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    // this.router.navigate(['/login']);
  }

  scrollTo(section: 'top' | 'features' | 'pricing' | 'contact' ) {
    if (section === 'top') {
      this.vscroller.scrollToPosition([0, 0]);
    } else {
      this.vscroller.scrollToAnchor(section);
    }
  }
}
