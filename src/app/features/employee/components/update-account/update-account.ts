import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  updating = false;

  constructor(private fb: FormBuilder, private service: EmployeeSelfService) {}

  ngOnInit(): void {
    this.salaryAccountForm = this.fb.group({
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      bankName: ['', Validators.required]
    });
  }

  submitAccountUpdate(): void {
    if (this.salaryAccountForm.invalid) {
      this.salaryAccountForm.markAllAsTouched();
      return;
    }

    this.updating = true;
    const payload: SalaryAccountUpdateRequestDTO = this.salaryAccountForm.value;

    this.service.requestSalaryAccountUpdate(payload).subscribe({
      next: (res) => {
        alert(res);
        this.updating = false;
        this.salaryAccountForm.reset();
      },
      error: (err) => {
        this.updating = false;

        if (err.error?.message) {
          const messages: string[] = err.error.message
            .split(/\r?\n|;/)
            .map((m: string) => m.trim())
            .filter(Boolean);

          // Clear previous server errors
          ['accountNumber', 'ifscCode', 'bankName'].forEach(field => {
            const errors = this.salaryAccountForm.controls[field].errors || {};
            delete errors['serverError'];
            this.salaryAccountForm.controls[field].setErrors(
              Object.keys(errors).length ? errors : null
            );
          });

          // Assign only the highest-priority message per field
          messages.forEach((msg: string) => {
            const lower = msg.toLowerCase();

            if (lower.includes('account number')) {
              const control = this.salaryAccountForm.controls['accountNumber'];
              if (!control.errors?.['serverError']) {
                control.setErrors({ ...control.errors, serverError: msg });
              }
            } else if (lower.includes('ifsc')) {
              const control = this.salaryAccountForm.controls['ifscCode'];
              if (!control.errors?.['serverError']) {
                control.setErrors({ ...control.errors, serverError: msg });
              }
            } else if (lower.includes('bank')) {
              const control = this.salaryAccountForm.controls['bankName'];
              if (!control.errors?.['serverError']) {
                control.setErrors({ ...control.errors, serverError: msg });
              }
            }
          });
        }

        console.error(err);
      }
    });
  }
}





