import { Injectable, signal, ElementRef, Signal } from '@angular/core';

export interface OnboardingStep {
  title: string;
  text: string;
  object: Signal<ElementRef | undefined>;
  tipPosition: string;
  tipAlignment: string;
}

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private currentStep = signal(-1);

  get currentStepIndex() {
    return this.currentStep.asReadonly();
  }

  startOnboarding() {
    this.currentStep.set(0);
  }

  nextStep() {
    this.currentStep.update((step) => step + 1);
  }

  skipOnboarding() {
    this.currentStep.set(-1);
  }

  isActive(): boolean {
    return this.currentStep() >= 0;
  }

  getObjectPosition(step: OnboardingStep): {
    top: number;
    left: number;
    bottom: number;
    right: number;
  } {
    const element = step.object();
    if (!element) {
      return { top: 0, left: 0, bottom: 0, right: 0 };
    }

    const rect = element.nativeElement.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
    };
  }
}
