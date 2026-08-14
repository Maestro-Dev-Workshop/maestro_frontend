import { Component, input, output } from '@angular/core';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

export interface SidebarItemModel {
  title: string;
  icon: string;
  selected: boolean;
  route?: string;
  type?: "link" | "button" | "dropdown";
}

@Component({
  selector: 'app-sidebar-item',
  imports: [ThemeIconComponent],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
})
export class SidebarItem {
  title = input.required<string>();
  icon = input<string>("");
  selected = input<boolean>(false);
  expanded = input<boolean>(true);
  clickedAction = output<void>();

  buttonClicked() {
    this.clickedAction.emit();
  }
}
