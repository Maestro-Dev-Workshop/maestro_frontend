import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeIconComponent } from '../theme-icon/theme-icon';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule, ThemeIconComponent],
  templateUrl: './context-menu.html',
})
export class ContextMenu {
  // Inputs
  visible = input<boolean>(false);
  position = input<{ x: number; y: number }>({ x: 0, y: 0 });
  items = input<ContextMenuItem[]>([]);

  // Outputs
  itemClick = output<string>();
  close = output<void>();

  onItemClick(event: MouseEvent, itemId: string): void {
    event.stopPropagation();
    this.itemClick.emit(itemId);
  }

  onBackdropClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
