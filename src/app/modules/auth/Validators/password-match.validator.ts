import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function PasswordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const password = form.get(passwordField)?.value;
    const confirmPassword = form.get(confirmPasswordField)?.value;

    if(!password || !confirmPassword ){
      return null;
    }

    if (password !== confirmPassword) {
      // form.get(confirmPasswordField)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (form.get(confirmPasswordField)?.hasError('passwordMismatch')) {
        form.get(confirmPasswordField)?.setErrors(null);
      }
      return null;
    }
  };
}
