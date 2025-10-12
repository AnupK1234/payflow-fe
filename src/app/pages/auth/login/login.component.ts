import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CaptchaService } from '../../../core/services/captcha.service';

// Define a type/interface for the login form for better type safety
type LoginFormFields = {
  username: [string, any[]];
  password: [string, any[]];
  captcha: [string, any[]];
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  generatedCaptcha = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private captchaService: CaptchaService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.regenerateCaptcha();
  }

  initializeForm(): void {
    const fields: LoginFormFields = {
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
    };
    this.loginForm = this.fb.group(fields);
  }

  regenerateCaptcha(): void {
    this.generatedCaptcha = this.captchaService.generateCaptcha();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    
    if (this.loginForm.value.captcha !== this.generatedCaptcha) {
      this.handleCaptchaError();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

  
    this.authService.login({ username, password }).subscribe({
      next: (user) => {
        this.isLoading = false;
      
        this.authService.routeUserByRole(user);
      },
      error: (error: Error) => {
        this.isLoading = false;
       
        this.errorMessage = error.message;
        this.handleCaptchaError();
      },
    });
  }

  private handleCaptchaError(): void {
    this.errorMessage = 'Invalid CAPTCHA. Please try again.';
    this.regenerateCaptcha();
    this.loginForm.patchValue({ captcha: '' });
  }

 

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: keyof LoginFormFields): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: keyof LoginFormFields): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    return '';
  }

  private getFieldLabel(fieldName: keyof LoginFormFields): string {
    const labels: { [key in keyof LoginFormFields]: string } = {
      username: 'Username',
      password: 'Password',
      captcha: 'CAPTCHA',
    };
    return labels[fieldName] || fieldName;
  }
}