import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Landing } from '../landing/landing';
import { Features } from '../features/features';
import { Pricing } from '../pricing/pricing';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  imports: [Landing, Features, Pricing, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  vscroller: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.router.navigate(['/login']);
  }
  scrollTo(section: 'top' | 'features' | 'contact') {
  if (section === 'top') {
    this.vscroller.scrollToPosition([0, 0]);
  } else {
    this.vscroller.scrollToAnchor(section);
  }
}
}
