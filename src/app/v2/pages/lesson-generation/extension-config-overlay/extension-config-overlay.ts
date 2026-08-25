import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BaseOverlay } from '../../../shared/components/base-overlay/base-overlay';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

import { DEFAULT_EXTENSION_CONFIG, ExtensionConfig, ExtensionSettings } from '../../../../core/models';

@Component({
  selector: 'app-extension-config-overlay',
  imports: [BaseOverlay, FormsModule, ThemeIconComponent],
  templateUrl: './extension-config-overlay.html',
  styleUrl: './extension-config-overlay.css',
})
export class ExtensionConfigOverlay {
  config: ExtensionSettings = DEFAULT_EXTENSION_CONFIG;
  configuration = input.required<ExtensionSettings>();
  close = output<ExtensionSettings>();

  constructor() {
    // Keep config in sync whenever configuration changes
    effect(() => {
      this.config = structuredClone(this.configuration());
    });
  }

  save() {
    // save `this.extensions` values in `this.config`
    if (this.config) {
      this.config = this.extensions.reduce((acc: any, ext) => {
        acc[ext.name] = ext;
        return acc;
      }, {} as ExtensionSettings);
      this.close.emit(this.config);
    }
  }

  toggleExtension(extension: ExtensionConfig) {
    extension.enabled = !extension.enabled;
  }

  get extensions() {
    return Object.values(this.config || {}) as ExtensionConfig[];
  }
}
