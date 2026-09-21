import { Component, computed, effect, ElementRef, inject, input, OnInit, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BaseOverlay } from '../../../shared/components/base-overlay/base-overlay';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { TutorialElement } from '../../../../shared/components/tutorial-element/tutorial-element';

import { DEFAULT_EXTENSION_CONFIG, ExtensionConfig, ExtensionSettings } from '../../../../core/models';
import { StandardBtn } from '../../../shared/components/standard-btn/standard-btn';
import { OnboardingService, OnboardingStep } from '../../../../core/services/onboarding.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-extension-config-overlay',
  imports: [BaseOverlay, FormsModule, ThemeIconComponent, StandardBtn, TutorialElement],
  templateUrl: './extension-config-overlay.html',
  styleUrl: './extension-config-overlay.css',
})
export class ExtensionConfigOverlay implements OnInit {
  config: ExtensionSettings = DEFAULT_EXTENSION_CONFIG;
  configuration = input.required<ExtensionSettings>();
  costSettings = input<any>();
  close = output<ExtensionSettings>();

  private onboardingService = inject(OnboardingService)
  private notify = inject(NotificationService)

  // Onboarding
  extensionList = viewChild<ElementRef>('extensionList');
  onboardingFlow = 'extension_config.first_lesson_creation'
  onboardingSteps: OnboardingStep[] = [];
  currentOnboardingStepIndex = signal(-1);
  currentOnboardingStep = computed(() =>
    this.onboardingSteps[this.currentOnboardingStepIndex()],
  );

  constructor() {
    // Keep config in sync whenever configuration changes
    effect(() => {
      this.config = structuredClone(this.configuration());
    });

    this.onboardingSteps = [
      {
        title: 'Step Title',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.',
        object: this.extensionList,
        tipPosition: 'top',
        tipAlignment: 'start',
        stepName: 'extension_list'
      },
    ];
  }

  ngOnInit() {
    this.loadOnboardingStatus();
  }

  private loadOnboardingStatus() {
    this.onboardingService.checkOnboardingStatus(this.onboardingFlow).subscribe({
      next: (response) => {
        if (!response.completed) {
          this.currentOnboardingStepIndex.set(response.current_step)
        }
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to load onboarding status.')
      }
    })
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

  costPerTopic(extensionType: string){
    const type = (extensionType == 'cells') ? 'lesson' : extensionType 
    return this.costSettings()[type].per_topic
  }

  getCost(extensionType: string, extension: any) {
    let cost = 0
    if (extensionType == "cells") {
      for (let type of extension.types) {
        cost += this.costSettings().lesson.cells[type]
      }
    } else if (extensionType == "glossary") {
      cost = this.costSettings().glossary.cost
    } else {
      cost = this.costSettings()[extensionType].per_amount * extension.amount
    }
    return cost
  }

  get extensions() {
    return Object.values(this.config || {}) as ExtensionConfig[];
  }

  // Onboarding helpers
  getTutorialObjectPosition() {
    if (!this.currentOnboardingStep()) return { top: 0, left: 0, bottom: 0, right: 0 };
    return this.onboardingService.getObjectPosition(this.currentOnboardingStep());
  }

  cycleOnboarding(): void {
    this.onboardingService.updateOnboardingStatus(this.onboardingFlow, this.currentOnboardingStep().stepName).subscribe({
      next: (response) => {},
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to update onboarding status.')
      }
    })
    this.currentOnboardingStepIndex.update((num) => num + 1)
  }
}
