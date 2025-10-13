import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPreferenceValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PreferenceValidator,
      multi: true,
    },
  ],
})
export class PreferenceValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return (control.value.length <= 1000) ? null : { invalidPreference: true };
  }
}
