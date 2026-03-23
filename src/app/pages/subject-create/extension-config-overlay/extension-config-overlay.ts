import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import { ExtensionSettings, ExtensionConstraints, ExtensionConfig, DEFAULT_EXTENSION_CONFIG } from '../../../core/models/extension-settings.model';

/** Visibility state for extension sections */
type ExtensionVisibilityMap = Record<string, boolean>;

@Component({
  selector: 'app-extension-config-overlay',
  imports: [FormsModule, ThemeIconComponent],
  templateUrl: './extension-config-overlay.html',
  styleUrl: './extension-config-overlay.css',
})
export class ExtensionConfigOverlay {
  show = false;
  close = output<ExtensionSettings>();
  configuration = input.required<ExtensionSettings>();
  constraints = input.required<ExtensionConstraints>();
  config: ExtensionSettings = DEFAULT_EXTENSION_CONFIG;
  extensionVisibility: ExtensionVisibilityMap = {};

  constructor() {
    // Keep config in sync whenever configuration changes
    effect(() => {
      this.config = structuredClone(this.configuration());
      const vals: ExtensionConfig[] = Object.values(this.config || {});
      for (const ext of vals) {
        if (ext.enabled) {
          this.extensionVisibility[ext.name] = true;
        }
      }
    });
  }

  save() {
    if (this.config) {
      this.close.emit(this.config);
    }
  }

  toggleType(event: Event, section: keyof ExtensionSettings) {
    const target = event.target as HTMLInputElement;
    const configSection = this.config?.[section];
    if (!configSection || !('types' in configSection)) return;

    if (target.checked) {
      configSection.types.push(target.value);
    } else {
      configSection.types = configSection.types.filter((qt: string) => qt !== target.value);
    }
  }

  toggleExtensionVisibility(extensionName: string) {
    this.extensionVisibility[extensionName] = !this.extensionVisibility[extensionName];
  }
}
