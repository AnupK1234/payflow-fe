import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-salary-structures',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-salary-structures.component.html',
})
export class EmployeeSalaryStructuresComponent {
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  id = signal<number | null>(null);
  structures = signal<any[]>([]);
  loading = signal(false);
  adding = signal(false);

  form = this.fb.nonNullable.group({
    effectiveFrom: ['', Validators.required],
    effectiveTo: ['', Validators.required],
    basic: [0, Validators.required],
  });

  constructor() {
    effect(() => {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.id.set(+idParam);
        this.loadStructures();
      }
    });
  }

  loadStructures() {
    if (!this.id()) return;
    this.loading.set(true);
    this.employeeService.getEmployeeSalaryStructures(this.id()!).subscribe({
      next: (data) => {
        this.structures.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  toggleAdd() {
    this.adding.update((v) => !v);
  }

  addSalaryStructure() {
    if (this.form.invalid || !this.id()) return;
    const payload = this.form.value;

    this.employeeService.addEmployeeSalaryStructure(this.id()!, payload).subscribe({
      next: () => {
        this.form.reset();
        this.adding.set(false);
        this.loadStructures();
      },
      error: (err) => console.error(err),
    });
  }

  backToEmployee() {
    this.router.navigate([`/organization/employees/${this.id()}`]);
  }
}
