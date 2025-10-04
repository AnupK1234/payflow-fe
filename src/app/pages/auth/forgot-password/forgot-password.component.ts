import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;

  currentStep: 'email' | 'otp' | 'password' = 'email';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showNewPassword = false;
  showConfirmPassword = false;

  otpTimer = 0;
  otpInterval: any;
  userEmail = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Step 1: Request OTP
  requestOTP(): void {
    if (this.emailForm.invalid) {
      this.markFormGroupTouched(this.emailForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.emailForm.value.email;
    this.userEmail = email;

    this.http
      .post('http://localhost:8080/api/auth/forgot-password', { email })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'OTP sent successfully to your email!';
          this.currentStep = 'otp';
          this.startOtpTimer();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to send OTP. Please try again.';
        },
      });
  }

  // Step 2: Verify OTP
  verifyOTP(): void {
    if (this.otpForm.invalid) {
      this.markFormGroupTouched(this.otpForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const data = {
      email: this.userEmail,
      otp: this.otpForm.value.otp,
    };

    this.http.post('http://localhost:8080/api/auth/forgot-password/verify-otp', data).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'OTP verified successfully!';
        this.currentStep = 'password';
        this.clearOtpTimer();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid OTP. Please try again.';
      },
    });
  }

  // Step 3: Reset Password
  resetPassword(): void {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const data = {
      email: this.userEmail,
      newPassword: this.passwordForm.value.newPassword,
    };

    this.http
      .post('http://localhost:8080/api/auth/forgot-password/reset-password', data)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Password reset successful! Redirecting to login...';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
        },
      });
  }

  // OTP Timer Functions
  startOtpTimer(): void {
    this.otpTimer = 300; // 5 minutes = 300 seconds
    this.otpInterval = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) {
        this.clearOtpTimer();
      }
    }, 1000);
  }

  clearOtpTimer(): void {
    if (this.otpInterval) {
      clearInterval(this.otpInterval);
    }
    this.otpTimer = 0;
  }

  getTimerDisplay(): string {
    const minutes = Math.floor(this.otpTimer / 60);
    const seconds = this.otpTimer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  resendOTP(): void {
    this.otpForm.reset();
    this.clearOtpTimer();
    this.requestOTP();
  }

  togglePasswordVisibility(field: 'new' | 'confirm'): void {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  goBack(): void {
    if (this.currentStep === 'otp') {
      this.currentStep = 'email';
      this.clearOtpTimer();
      this.errorMessage = '';
      this.successMessage = '';
    } else if (this.currentStep === 'password') {
      this.currentStep = 'otp';
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'otp') {
        return 'OTP must be exactly 6 digits';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      otp: 'OTP',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
    };
    return labels[fieldName] || fieldName;
  }

  ngOnDestroy(): void {
    this.clearOtpTimer();
  }
}
