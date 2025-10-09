import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EmployeeSelfService } from '../../services/employee-self';
import { SalaryAccountUpdateRequestDTO } from '../../models/salary-account-update-request.model';

@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-account.html',
  styleUrls: ['./update-account.css']
})
export class UpdateAccountComponent implements OnInit {
  salaryAccountForm!: FormGroup;
  updatingFlag = false;
  status: 'idle' | 'success' | 'error' = 'idle';
  message: string = '';

  constructor(private fb: FormBuilder, private service: EmployeeSelfService) {}

  ngOnInit(): void {
    this.salaryAccountForm = this.fb.group({
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      bankName: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.salaryAccountForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  
  statusMessage(): string {
    return this.message;
  }


  submissionStatus(): 'success' | 'error' | 'idle' {
    return this.status;
  }

 
  updating(): boolean {
    return this.updatingFlag;
  }

  submitAccountUpdate(): void {
    if (this.salaryAccountForm.invalid) {
      this.salaryAccountForm.markAllAsTouched();
      return;
    }

    this.updatingFlag = true;
    this.status = 'idle';
    this.message = '';

    const payload: SalaryAccountUpdateRequestDTO = this.salaryAccountForm.value;

    this.service.requestSalaryAccountUpdate(payload).subscribe({
      next: (res) => {
        this.updatingFlag = false;
        this.status = 'success';
        this.message = 'Bank account updated successfully!';
        this.salaryAccountForm.reset();
      },
      error: (err) => {
        this.updatingFlag = false;
        this.status = 'error';

        if (err.error?.message) {
          const messages: string[] = err.error.message
            .split(/\r?\n|;/)
            .map((m: string) => m.trim())
            .filter(Boolean);


          ['accountNumber', 'ifscCode', 'bankName'].forEach(field => {
            const control = this.salaryAccountForm.get(field);
            if (control) {
              const errors = { ...control.errors };
              delete errors['serverError'];
              control.setErrors(Object.keys(errors).length ? errors : null);
            }
          });


          messages.forEach(msg => {
            const lower = msg.toLowerCase();
            if (lower.includes('account number')) {
              this.addServerError('accountNumber', msg);
            } else if (lower.includes('ifsc')) {
              this.addServerError('ifscCode', msg);
            } else if (lower.includes('bank')) {
              this.addServerError('bankName', msg);
            }
          });
        }

        console.error(err);
      }
    });
  }

  private addServerError(controlName: string, message: string) {
    const control: AbstractControl | null = this.salaryAccountForm.get(controlName);
    if (control && !control.errors?.['serverError']) {
      control.setErrors({ ...control.errors, serverError: message });
    }
  }
}
