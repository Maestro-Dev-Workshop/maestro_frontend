import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-standard-btn',
  imports: [CommonModule, ThemeIconComponent],
  templateUrl: './standard-btn.html',
  styleUrl: './standard-btn.css',
})
export class StandardBtn {
  flavour = input<'main' | 'alt'>('main');
  leftIcon = input<string>('');
  invertLeftIcon = input<boolean>(false);
  rightIcon = input<string>('');
  invertRightIcon = input<boolean>(false);
  className = input<string>('');
  disabled = input<boolean>(false);
}
