import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appSubjectNameValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SubjectNameValidator,
      multi: true,
    },
  ],
})
export class SubjectNameValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return (control.value.length <= 30) ? null : { invalidName: true };
  }
}
