import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { BetaRegistrationService } from '../../../core/services/BetaRegistration.service';

interface BetaFormData {
  fieldOfStudy: string;
  university: string;
  levelOfStudy: string;
  studyTools: string;
  hoursPerWeek: number | null;
  confidenceLevel: number | null;
  challenges: string;
}

@Component({
  selector: 'app-beta-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beta-registration-form.html',
})
export class BetaRegistrationFormComponent {
  @Output() back = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  loading = false;
  submitAttempted = false;

  notify = inject(NotificationService);
  betaService = inject(BetaRegistrationService);

  formData: BetaFormData = {
    fieldOfStudy: '',
    university: '',
    levelOfStudy: '',
    studyTools: '',
    hoursPerWeek: null,
    confidenceLevel: null,
    challenges: '',
  };

  confidenceOptions = [
    { value: 1, label: '1 — Not confident at all' },
    { value: 2, label: '2 — Slightly confident' },
    { value: 3, label: '3 — Moderately confident' },
    { value: 4, label: '4 — Very confident' },
    { value: 5, label: '5 — Extremely confident' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  onBack(): void {
    this.back.emit();
  }

  private isFormValid(): boolean {
    return (
      this.formData.fieldOfStudy.trim() !== '' &&
      this.formData.university.trim() !== '' &&
      this.formData.levelOfStudy !== '' &&
      this.formData.studyTools.trim() !== '' &&
      this.formData.hoursPerWeek !== null &&
      this.formData.confidenceLevel !== null
    );
  }

  onSubmit(): void {
    this.submitAttempted = true;

    if (!this.isFormValid()) {
      this.notify.showError('Please fill in all required fields.');
      return;
    }

    this.loading = true;

    this.betaService
      .register({
        field_of_study: this.formData.fieldOfStudy,
        university: this.formData.university,
        level_of_study: this.formData.levelOfStudy,
        study_tools: this.formData.studyTools,
        hours_per_week: this.formData.hoursPerWeek!,
        confidence_level: this.formData.confidenceLevel!,
        challenges: this.formData.challenges,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.notify.showSuccess("You're in! Welcome to Maestro Premium.");
          this.submitted.emit();
        },
        error: (err) => {
          this.loading = false;
          this.notify.showError(
            err?.error?.message || 'Something went wrong. Please try again.',
          );
          this.cdr.detectChanges();
        },
      });
  }
}
