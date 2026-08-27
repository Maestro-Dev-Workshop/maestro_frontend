import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appMatchValidator]',
  standalone: true, // Ensuring it works as a standalone import
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MatchValidatorDirective,
      multi: true,
    },
  ],
})
export class MatchValidatorDirective implements Validator {
  // Pass an array containing the names of the two fields to compare: ['password', 'confirmPassword']
  @Input('appMatchValidator') matchFields: string[] = [];

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control || this.matchFields.length < 2) return null;

    const firstControl = control.get(this.matchFields[0]);
    const secondControl = control.get(this.matchFields[1]);

    // If either control doesn't exist yet or doesn't have a value, don't throw an error
    if (!firstControl || !secondControl || !secondControl.value) {
      return null;
    }

    // Check if the values match
    const isMatch = firstControl.value === secondControl.value;

    if (!isMatch) {
      // Set the error directly on the confirmation field so it highlights red in the UI
      secondControl.setErrors({ ...secondControl.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear the specific mismatch error if they now match, keeping other validation errors
      if (secondControl.errors) {
        const { passwordMismatch, ...remainingErrors } = secondControl.errors;
        secondControl.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }
  }
}
