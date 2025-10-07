// reset-password.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [CookieService],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
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

  @ViewChild('otpInput') otpInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

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
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /** Step 1: Send OTP */
  sendOTP(): void {
    if (this.emailForm.invalid) {
      this.markFormGroupTouched(this.emailForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.userEmail = this.emailForm.value.email;

    this.http
      .post('http://localhost:8080/api/auth/forgot-password', { email: this.userEmail }, { responseType: 'text' })
      .subscribe({
        next: (res: string) => {
          this.isLoading = false;
          this.successMessage = res;
          this.currentStep = 'otp';
          this.startOtpTimer();
          setTimeout(() => this.otpInput.nativeElement.focus(), 0);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error || 'Failed to send OTP';
        },
      });
  }

  /** Step 2: Verify OTP */
  verifyOTP(): void {
    if (this.otpForm.invalid) {
      this.markFormGroupTouched(this.otpForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const data = { email: this.userEmail, otp: this.otpForm.value.otp };

    this.http
      .post('http://localhost:8080/api/auth/verify-otp', data, { responseType: 'text' })
      .subscribe({
        next: (res: string) => {
          this.isLoading = false;
          this.successMessage = res;
          this.currentStep = 'password';
          this.clearOtpTimer();

          // Store OTP in cookie for 4 minutes
          this.cookieService.set('forgotPasswordOtp', this.otpForm.value.otp, 4 / 1440); // 4 mins
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error || 'Invalid OTP';
        },
      });
  }

  /** Step 3: Reset Password */
  resetPassword(): void {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    // Get OTP from cookie
    const otp = this.cookieService.get('forgotPasswordOtp');
    if (!otp) {
      this.errorMessage = 'OTP expired or missing. Please resend OTP.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const data = { email: this.userEmail, otp, newPassword: this.passwordForm.value.newPassword };

    this.http
      .post('http://localhost:8080/api/auth/reset-password', data, { responseType: 'text' })
      .subscribe({
        next: (res: string) => {
          this.isLoading = false;
          this.successMessage = res;

          // Delete OTP cookie
          this.cookieService.delete('forgotPasswordOtp');

          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error || 'Failed to reset password';
        },
      });
  }

  /** OTP Timer */
  startOtpTimer(): void {
    this.otpTimer = 240; // 4 minutes
    this.otpInterval = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) this.clearOtpTimer();
    }, 1000);
  }

  clearOtpTimer(): void {
    if (this.otpInterval) clearInterval(this.otpInterval);
    this.otpTimer = 0;
  }

  getTimerDisplay(): string {
    const minutes = Math.floor(this.otpTimer / 60);
    const seconds = this.otpTimer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  resendOTP(): void {
    if (this.isLoading || this.otpTimer > 0) return;
    this.otpForm.reset();
    this.clearOtpTimer();
    this.sendOTP();
  }

  togglePasswordVisibility(field: 'new' | 'confirm'): void {
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => formGroup.get(key)?.markAsTouched());
  }

  ngOnDestroy(): void {
    this.clearOtpTimer();
  }
}
