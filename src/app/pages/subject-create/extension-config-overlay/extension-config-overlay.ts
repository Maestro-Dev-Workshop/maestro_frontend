import { AfterViewInit, Component, effect, input, model, NO_ERRORS_SCHEMA, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-extension-config-overlay',
  imports: [FormsModule, ThemeIconComponent],
  templateUrl: './extension-config-overlay.html',
  styleUrl: './extension-config-overlay.css',
})
export class ExtensionConfigOverlay {
  show = false;
  close = output<any>();
  configuration = input<any>();
  constraints = input<any>();
  config: any;
  extensionVisibility: any = {};

  constructor() {
    // ✅ keep config in sync whenever configuration changes
    effect(() => {
      const cfg = this.configuration();
      this.config = cfg ? structuredClone(cfg) : null;
      const vals:any[] = Object.values(this.config || {});
      for (const ext of vals) {
        if (ext.enabled) {
          this.extensionVisibility[ext.name] = true;
        }
      }
    });
  }

  save() {
    this.close.emit(this.config);
  }

  toggleType(event: any, section: string) {
    if (event.target.checked) {
      this.config[section].types.push(event.target.value);
    } else {
      this.config[section].types = this.config[section].types.filter((qt:any) => qt !== event.target.value);
    }
  }

  toggleExtensionVisibility(extensionName: string) {
    this.extensionVisibility[extensionName] = !this.extensionVisibility[extensionName];
  }
}
