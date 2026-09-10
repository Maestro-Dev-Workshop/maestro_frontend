import { Injectable, signal, ElementRef, Signal, inject, OnInit } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { Observable } from 'rxjs';
import { ApiResponse, OnboardingStatusResponse } from '../models';

export interface OnboardingStep {
  title: string;
  text: string;
  object: Signal<ElementRef | undefined>;
  tipPosition: string;
  tipAlignment: string;
  stepName: string;
}

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private http = inject(HttpBaseService);

  getObjectPosition(step: OnboardingStep): {
    top: number;
    left: number;
    bottom: number;
    right: number;
  } {
    const element = step.object();
    const nativeElement = element?.nativeElement;
  
    if (!nativeElement) {
      return { top: 0, left: 0, bottom: 0, right: 0 };
    }
  
    const rect = nativeElement.getBoundingClientRect();
  
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
  
    return {
      top: rect.top + scrollY,
      left: rect.left + scrollX,
      bottom: rect.bottom + scrollY,
      right: rect.right + scrollX,
    };
  }

  checkOnboardingStatus(flowId: string): Observable<OnboardingStatusResponse> {
    return this.http.get<OnboardingStatusResponse>(`onboarding/${flowId}/status`)
  }

  updateOnboardingStatus(flowId: string, stepName: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`onboarding/add-record`, {
      flow_id: flowId,
      step_name: stepName
    })
  }
}
