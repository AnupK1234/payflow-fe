import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { FileUploaderService } from '../../../core/services/file-uploader.service';
import { passwordMatchValidator } from '../../../core/validators/custom-validators';
import { OrganizationRequest } from '../../../interfaces/organization-request.interface';

// Define a type for the multi-step form fields for better type safety
type SignupFormFields =
  | 'name'
  | 'registrationNumber'
  | 'address'
  | 'accountNumber'
  | 'ifsc'
  | 'adminUsername'
  | 'adminEmail'
  | 'tempPassword'
  | 'confirmPassword'
  | 'acceptTerms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';
  selectedFiles: File[] = [];
  currentStep = 1;
  totalSteps = 3;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // Dependency Injection is cleaner: Removed HttpClient
    private organizationService: OrganizationService,
    private fileUploaderService: FileUploaderService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.signupForm = this.fb.group(
      {
        // Step 1
        name: ['', [Validators.required, Validators.minLength(3)]],
        registrationNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{10,20}$/)]],
        address: ['', [Validators.required, Validators.minLength(10)]],

        // Step 2
        accountNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        ifsc: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],

        // Step 3
        adminUsername: ['', [Validators.required, Validators.minLength(3)]],
        adminEmail: ['', [Validators.required, Validators.email]],
        tempPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],

        // Terms acceptance
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      {
        // Use the external custom validator
        validators: passwordMatchValidator,
      }
    );
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onFileSelect(event: Event): void {
    this.errorMessage = '';
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      try {
        // Delegate file validation to the service
        this.fileUploaderService.validateFiles(files);
        this.selectedFiles = files;
      } catch (error: any) {
        this.errorMessage = error.message;
        this.selectedFiles = []; // Clear files if validation fails
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      this.errorMessage = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    this.currentStep--;
    this.errorMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  validateCurrentStep(): boolean {
    let fieldsToValidate: SignupFormFields[] = [];

    // Define fields based on step
    switch (this.currentStep) {
      case 1:
        fieldsToValidate = ['name', 'registrationNumber', 'address'];
        break;
      case 2:
        fieldsToValidate = ['accountNumber', 'ifsc'];
        break;
      case 3:
        fieldsToValidate = [
          'adminUsername',
          'adminEmail',
          'tempPassword',
          'confirmPassword',
          'acceptTerms',
        ];
        break;
    }

    let isValid = true;
    fieldsToValidate.forEach((field) => {
      const control = this.signupForm.get(field);
      control?.markAsTouched();
      // Check for form control validity (excludes form group validators like password mismatch initially)
      if (control?.invalid) {
        isValid = false;
      }
    });

    // Check for form group validation errors (like passwordMismatch) only after individual controls are checked
    if (this.currentStep === 3) {
      this.signupForm.updateValueAndValidity(); // Ensure group validation runs
      if (this.signupForm.hasError('passwordMismatch')) {
        this.errorMessage = 'Passwords do not match';
        isValid = false;
      }
    }

    return isValid;
  }

  onSubmit(): void {
    // Re-validate the final step to catch any forgotten group validation
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Please upload at least one verification document';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // 1. Prepare the JSON payload based on the interface
    const requestData: OrganizationRequest = {
      name: this.signupForm.value.name,
      registrationNumber: this.signupForm.value.registrationNumber,
      address: this.signupForm.value.address,
      bankAccount: {
        accountNumber: this.signupForm.value.accountNumber,
        ifsc: this.signupForm.value.ifsc,
        status: 'ACTIVE',
      },
      adminUsername: this.signupForm.value.adminUsername,
      adminEmail: this.signupForm.value.adminEmail,
      tempPassword: this.signupForm.value.tempPassword,
    };

    // 2. Delegate FormData creation to the service
    const formData = this.fileUploaderService.createFormData(requestData, this.selectedFiles);

    // 3. Delegate API call to the OrganizationService
    this.organizationService.register(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage =
          'Registration successful! Please check your email for further instructions.';

        // Redirect logic remains in the component (UI/Navigation)
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: Error) => {
        this.isLoading = false;
        // Error message comes cleanly from the service
        this.errorMessage = error.message;
      },
    });
  }

  // --- Form Helper Methods ---

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: SignupFormFields): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Refactored error messaging to be much cleaner and type-safe
  getErrorMessage(fieldName: SignupFormFields): string {
    const field = this.signupForm.get(fieldName);
    if (!field || !field.touched || field.valid) {
      return '';
    }

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.hasError('minlength')) {
      const minLength = field.errors!['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('pattern')) {
      return this.getPatternError(fieldName);
    }
    // Specific error for password mismatch, usually checked on the form group
    if (field.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    return '';
  }

  // Use a map for pattern errors for cleaner code
  private getPatternError(fieldName: SignupFormFields): string {
    const patterns: { [key in SignupFormFields]?: string } = {
      registrationNumber: 'Registration number must be 10-20 alphanumeric characters',
      accountNumber: 'Account number must be exactly 12 digits',
      ifsc: 'Invalid IFSC code format (e.g., ABCD0123456)',
    };
    return patterns[fieldName] || 'Invalid format';
  }

  private getFieldLabel(fieldName: SignupFormFields): string {
    const labels: { [key in SignupFormFields]: string } = {
      name: 'Organization Name',
      registrationNumber: 'Registration Number',
      address: 'Address',
      accountNumber: 'Account Number',
      ifsc: 'IFSC Code',
      adminUsername: 'Username',
      adminEmail: 'Email',
      tempPassword: 'Password',
      confirmPassword: 'Confirm Password',
      acceptTerms: 'Terms and Conditions',
    };
    return labels[fieldName] || fieldName;
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
