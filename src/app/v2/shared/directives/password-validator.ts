import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPasswordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidator,
      multi: true,
    },
  ],
})
export class PasswordValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+.,?-]{8,}$/;
    return regex.test(control.value) ? null : { invalidPassword: true };
  }
}
