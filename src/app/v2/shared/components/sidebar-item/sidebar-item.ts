import { Component, input, output } from '@angular/core';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { CommonModule } from '@angular/common';

export interface SidebarItemModel {
  title: string;
  icon: string;
  selected: boolean;
  route?: string;
}

@Component({
  selector: 'app-sidebar-item',
  imports: [ThemeIconComponent, CommonModule],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
})
export class SidebarItem {
  title = input.required<string>();
  icon = input<string>("");
  selected = input<boolean>(false);
  expanded = input<boolean>(true);
  className = input<string>('')
  clickedAction = output<void>();

  buttonClicked() {
    this.clickedAction.emit();
  }
}
