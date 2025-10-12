import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService, CreateEmployeeRequest } from '../../services/employee.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
})
export class EmployeeCreateComponent implements OnInit {
  employeeForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  currentStep = 1;
  totalSteps = 3;

  departments = ['IT', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing'];
  cookie = inject(CookieService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      // Personal Information (Step 1)
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      dateOfJoining: ['', [Validators.required]],
      employeeCode: ['', [Validators.required]],

      // Employment Details (Step 2)
      department: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],

      // Bank Account Details (Step 2)
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      ifsc: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      aadhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      panNumber: ['', [Validators.required]],

      // Salary Details (Step 3)
      basic: ['', [Validators.required, Validators.min(0)]],
      hra: ['', [Validators.required, Validators.min(0)]],
      da: ['', [Validators.required, Validators.min(0)]],
      pf: ['', [Validators.required, Validators.min(0)]],
      allowances: ['', [Validators.required, Validators.min(0)]],
    });
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    this.currentStep--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  validateCurrentStep(): boolean {
    let fieldsToValidate: string[] = [];

    switch (this.currentStep) {
      case 1:
        fieldsToValidate = ['fullName', 'email', 'phoneNumber', 'dateOfJoining'];
        break;
      case 2:
        fieldsToValidate = [
          'department',
          'jobTitle',
          'accountNumber',
          'ifsc',
          'panNumber',
          'aadhaarNumber',
        ];
        break;
      case 3:
        fieldsToValidate = ['basic', 'hra', 'da', 'pf', 'allowances'];
        break;
    }

    let isValid = true;
    fieldsToValidate.forEach((field) => {
      const control = this.employeeForm.get(field);
      control?.markAsTouched();
      if (control?.invalid) {
        isValid = false;
      }
    });

    return isValid;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const employeeData: CreateEmployeeRequest = {
      fullName: this.employeeForm.value.fullName,
      email: this.employeeForm.value.email,
      employeeCode: this.employeeForm.value.employeeCode,
      phoneNumber: this.employeeForm.value.phoneNumber,
      department: this.employeeForm.value.department,
      panNumber: this.employeeForm.value.panNumber,
      aadhaarNumber: this.employeeForm.value.aadhaarNumber,
      jobTitle: this.employeeForm.value.jobTitle,
      organizationId: JSON.parse(this.cookie.get('user')).organizationId,
      dateOfJoining: this.employeeForm.value.dateOfJoining,
      bankAccount: {
        accountNumber: this.employeeForm.value.accountNumber,
        ifsc: this.employeeForm.value.ifsc,
      },
      salary: {
        basic: parseFloat(this.employeeForm.value.basic),
        hra: parseFloat(this.employeeForm.value.hra),
        da: parseFloat(this.employeeForm.value.da),
        pf: parseFloat(this.employeeForm.value.pf),
        allowances: parseFloat(this.employeeForm.value.allowances),
      },
    };

    this.employeeService.createEmployee(employeeData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/organization/employees'], {
          queryParams: { success: 'Employee created successfully!' },
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create employee';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      this.router.navigate(['/organization/employees']);
    }
  }

  calculateTotalSalary(): number {
    const basic = parseFloat(this.employeeForm.value.basic) || 0;
    const hra = parseFloat(this.employeeForm.value.hra) || 0;
    const da = parseFloat(this.employeeForm.value.da) || 0;
    const allowances = parseFloat(this.employeeForm.value.allowances) || 0;
    const pf = parseFloat(this.employeeForm.value.pf) || 0;

    return basic + hra + da + allowances - pf;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
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
    if (field?.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} must be greater than or equal to 0`;
    }
    if (field?.hasError('pattern')) {
      return this.getPatternError(fieldName);
    }
    return '';
  }

  private getPatternError(fieldName: string): string {
    const patterns: { [key: string]: string } = {
      phoneNumber: 'Phone number must be a valid 10-digit Indian number',
      accountNumber: 'Account number must be exactly 12 digits',
      ifsc: 'Invalid IFSC code format (e.g., ABCD0123456)',
    };
    return patterns[fieldName] || 'Invalid format';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      dateOfJoining: 'Date of Joining',
      department: 'Department',
      jobTitle: 'Job Title',
      accountNumber: 'Account Number',
      ifsc: 'IFSC Code',
      basic: 'Basic Salary',
      hra: 'HRA',
      da: 'DA',
      pf: 'PF',
      allowances: 'Allowances',
    };
    return labels[fieldName] || fieldName;
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
