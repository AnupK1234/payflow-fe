// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.css']
// })
// export class SignupComponent implements OnInit {
//   signupForm!: FormGroup;
//   isLoading = false;
//   showPassword = false;
//   showConfirmPassword = false;
//   errorMessage = '';
//   successMessage = '';
//   selectedFiles: File[] = [];
//   currentStep = 1;
//   totalSteps = 3;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//   }

//   initializeForm(): void {
//     this.signupForm = this.fb.group({
//       // Organization Details (Step 1)
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       registrationNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{10,20}$/)]],
//       address: ['', [Validators.required, Validators.minLength(10)]],
      
//       // Bank Account Details (Step 2)
//       accountNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
//       ifsc: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      
//       // Admin User Details (Step 3)
//       adminUsername: ['', [Validators.required, Validators.minLength(3)]],
//       adminEmail: ['', [Validators.required, Validators.email]],
//       tempPassword: ['', [Validators.required, Validators.minLength(8)]],
//       confirmPassword: ['', [Validators.required]],
      
//       // Terms acceptance
//       acceptTerms: [false, [Validators.requiredTrue]]
//     }, {
//       validators: this.passwordMatchValidator
//     });
//   }

//   passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
//     const password = group.get('tempPassword')?.value;
//     const confirmPassword = group.get('confirmPassword')?.value;
//     return password === confirmPassword ? null : { passwordMismatch: true };
//   }

//   togglePasswordVisibility(field: 'password' | 'confirm'): void {
//     if (field === 'password') {
//       this.showPassword = !this.showPassword;
//     } else {
//       this.showConfirmPassword = !this.showConfirmPassword;
//     }
//   }

//   onFileSelect(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files) {
//       const files = Array.from(input.files);
      
//       // Validate file size (max 5MB each)
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       const invalidFiles = files.filter(file => file.size > maxSize);
      
//       if (invalidFiles.length > 0) {
//         this.errorMessage = 'Some files exceed 5MB limit. Please select smaller files.';
//         return;
//       }

//       this.selectedFiles = files;
//       this.errorMessage = '';
//     }
//   }

//   removeFile(index: number): void {
//     this.selectedFiles.splice(index, 1);
//   }

//   nextStep(): void {
//     if (this.validateCurrentStep()) {
//       this.currentStep++;
//       this.errorMessage = '';
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }

//   previousStep(): void {
//     this.currentStep--;
//     this.errorMessage = '';
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   validateCurrentStep(): boolean {
//     let fieldsToValidate: string[] = [];

//     switch (this.currentStep) {
//       case 1:
//         fieldsToValidate = ['name', 'registrationNumber', 'address'];
//         break;
//       case 2:
//         fieldsToValidate = ['accountNumber', 'ifsc'];
//         break;
//       case 3:
//         fieldsToValidate = ['adminUsername', 'adminEmail', 'tempPassword', 'confirmPassword', 'acceptTerms'];
//         break;
//     }

//     let isValid = true;
//     fieldsToValidate.forEach(field => {
//       const control = this.signupForm.get(field);
//       control?.markAsTouched();
//       if (control?.invalid) {
//         isValid = false;
//       }
//     });

//     if (this.currentStep === 3 && this.signupForm.hasError('passwordMismatch')) {
//       this.errorMessage = 'Passwords do not match';
//       isValid = false;
//     }

//     return isValid;
//   }

//   onSubmit(): void {
//     if (this.signupForm.invalid) {
//       this.markFormGroupTouched(this.signupForm);
//       return;
//     }

//     if (this.selectedFiles.length === 0) {
//       this.errorMessage = 'Please upload at least one verification document';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';

//     // Prepare form data
//     const formData = new FormData();

//     // Prepare JSON data
//     const organizationData = {
//       name: this.signupForm.value.name,
//       registrationNumber: this.signupForm.value.registrationNumber,
//       address: this.signupForm.value.address,
//       bankAccount: {
//         accountNumber: this.signupForm.value.accountNumber,
//         ifsc: this.signupForm.value.ifsc,
//         status: 'ACTIVE'
//       },
//       adminUsername: this.signupForm.value.adminUsername,
//       adminEmail: this.signupForm.value.adminEmail,
//       tempPassword: this.signupForm.value.tempPassword
//     };

//     // Add JSON data as blob
//     formData.append('data', new Blob([JSON.stringify(organizationData)], {
//       type: 'application/json'
//     }));

//     // Add documents
//     this.selectedFiles.forEach(file => {
//       formData.append('documents', file);
//     });

//     // API call to backend
//     this.http.post('http://localhost:8080/api/organizations/register', formData)
//       .subscribe({
//         next: (response) => {
//           this.isLoading = false;
//           this.successMessage = 'Registration successful! Please check your email for further instructions.';
          
//           // Redirect to login after 3 seconds
//           setTimeout(() => {
//             this.router.navigate(['/login']);
//           }, 3000);
//         },
//         error: (error) => {
//           this.isLoading = false;
//           this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
//         }
//       });
//   }

//   private markFormGroupTouched(formGroup: FormGroup): void {
//     Object.keys(formGroup.controls).forEach(key => {
//       const control = formGroup.get(key);
//       control?.markAsTouched();
//     });
//   }

//   isFieldInvalid(fieldName: string): boolean {
//     const field = this.signupForm.get(fieldName);
//     return !!(field && field.invalid && field.touched);
//   }

//   getErrorMessage(fieldName: string): string {
//     const field = this.signupForm.get(fieldName);
//     if (field?.hasError('required')) {
//       return `${this.getFieldLabel(fieldName)} is required`;
//     }
//     if (field?.hasError('minlength')) {
//       const minLength = field.errors?.['minlength'].requiredLength;
//       return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
//     }
//     if (field?.hasError('email')) {
//       return 'Please enter a valid email address';
//     }
//     if (field?.hasError('pattern')) {
//       return this.getPatternError(fieldName);
//     }
//     return '';
//   }

//   private getPatternError(fieldName: string): string {
//     const patterns: { [key: string]: string } = {
//       registrationNumber: 'Registration number must be 10-20 alphanumeric characters',
//       accountNumber: 'Account number must be exactly 12 digits',
//       ifsc: 'Invalid IFSC code format (e.g., ABCD0123456)'
//     };
//     return patterns[fieldName] || 'Invalid format';
//   }

//   private getFieldLabel