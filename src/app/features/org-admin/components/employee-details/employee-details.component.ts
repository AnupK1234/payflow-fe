import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css',
})
export class EmployeeDetailsComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  id = signal<number | null>(null);
  employee = signal<Employee | null>(null);
  editMode = signal(false);
  loading = signal(false);

  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    employeeCode: [''],
    dateOfJoining: [''],
    jobTitle: [''],
    department: [''],
    status: [''],
    bankAccountNumber: [''],
    ifscCode: [''],
    aadhaarNumber: [''],
    panNumber: [''],
  });

  constructor() {
    effect(() => {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.id.set(+idParam);
        this.loadEmployee();
      }
    });

    // Auto enable edit mode if query param ?edit=true
    effect(() => {
      const editParam = this.route.snapshot.queryParamMap.get('edit');
      if (editParam === 'true') this.editMode.set(true);
    });
  }

  loadEmployee() {
    if (!this.id()) return;
    this.loading.set(true);
 
    this.employeeService.getEmployeeById(this.id()!).subscribe({
      next: (data) => {
        this.employee.set(data);
        this.form.patchValue(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  toggleEdit() {
    this.editMode.update((v) => !v);
  }

  saveChanges() {
    if (this.form.invalid || !this.id()) return;
    this.employeeService.updateEmployee(this.id()!, this.form.value).subscribe({
      next: (updated) => {
        this.employee.set(updated);
        this.toggleEdit();
      },
      error: (err) => console.error(err),
    });
  }

  backToDashboard() {
    this.router.navigate(['/bank-admin/employees']);
  }
}
