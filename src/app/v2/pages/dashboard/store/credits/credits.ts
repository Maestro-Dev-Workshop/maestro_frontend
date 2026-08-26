import { Component } from '@angular/core';
import { ThemeIconComponent } from '../../../../../shared/components/theme-icon/theme-icon';
import { ShinyBtnComponent } from '../../../../shared/components/shiny-btn/shiny-btn';

@Component({
  selector: 'app-credits',
  imports: [ThemeIconComponent, ShinyBtnComponent],
  templateUrl: './credits.html',
  styleUrl: './credits.css',
})
export class Credits {
  creditPacks = [
    { credits: 20, price: '₦500', desc: 'Small pack description' },
    {
      credits: '100',
      bonusCredits: '+ 25',
      price: '₦2,000',
      desc: 'Medium pack description',
      bonus: true,
    },
    {
      credits: 500,
      price: '₦6,400',
      oldPrice: '₦8,000',
      desc: 'Large pack description',
      discount: '20% Discount',
    },
    { credits: 2400, price: '₦30,000', desc: 'Mega pack description' },
  ];
}
