import { AbstractControl, ValidationErrors } from '@angular/forms';

export class StringValidators {
  static empty(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'empty': true };
  }

  static whitespace(control: AbstractControl): ValidationErrors | null {
    if (control.value == null || control.value.length <= 0) {
      return null;
    }

    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;

    return isValid ? null : { 'whitespace': true };
  }
}
