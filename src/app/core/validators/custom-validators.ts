import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

/**
 * Custom validator to check if two form controls (typically password/confirm) have matching values.
 */
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const group = control as FormGroup;
  const password = group.get('tempPassword');
  const confirmPassword = group.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null; // Controls not found
  }

  // Ensure the confirm password field is validated only after it has a value
  if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    // Set the error on the confirmPassword control for better error display
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Clear the error if they match
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
};
