import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService, Employee, EmployeeFilters } from '../../services/employee.service';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeesListComponent implements OnInit {
  filterForm!: FormGroup;
  employees: Employee[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // UI State
  isLoading: boolean = false;
  errorMessage = '';
  successMessage = '';

  // Modal
  showDeleteModal = false;
  selectedEmployee: Employee | null = null;

  // Filter options
  departmentOptions = [
    { value: 'ALL', label: 'All Departments' },
    { value: 'IT', label: 'IT' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Marketing', label: 'Marketing' },
  ];

  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  pageSizeOptions = [10, 25, 50, 100];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployees();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      department: ['ALL'],
      status: ['ALL'],
      search: [''],
      pageSize: [this.pageSize],
    });

    // Listen to page size changes
    this.filterForm.get('pageSize')?.valueChanges.subscribe((value) => {
      this.pageSize = value;
      this.currentPage = 0;
      this.loadEmployees();
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      department: 'ALL',
      status: 'ALL',
      search: '',
    });
    this.applyFilters();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filters: EmployeeFilters = {
      department: this.filterForm.value.department,
      status: this.filterForm.value.status,
      search: this.filterForm.value.search,
      page: this.currentPage,
      size: this.pageSize,
    };

    this.employeeService.getEmployees(filters).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.employees = response;
          this.totalElements = response.length;
          this.totalPages = 1;
        } else {
          // When backend is paginated
          this.employees = response.content || [];
          this.totalElements = response.totalElements || this.employees.length;
          this.totalPages = response.totalPages || 1;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load employees';
        console.error('Error loading employees:', error);
      },
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/organization/employees/create']);
  }

  navigateToView(id: number): void {
    this.router.navigate([`/organization/employees/${id}`]);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/organization/employees', id, 'edit']);
  }

  navigateToSalary(id: number): void {
    this.router.navigate(['/organization/employees', id, 'salary']);
  }

  openDeleteModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedEmployee = null;
  }

  confirmDelete(): void {
    if (!this.selectedEmployee) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = `Employee ${this.selectedEmployee!.fullName} deleted successfully!`;
        this.closeDeleteModal();
        this.loadEmployees();

        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to delete employee';
        this.closeDeleteModal();
        console.error('Error deleting employee:', error);
      },
    });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadEmployees();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Utility methods
  getStatusBadgeClass(status: string): string {
    return status === 'ACTIVE' ? 'badge-success' : 'badge-secondary';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  refreshData(): void {
    this.loadEmployees();
    this.successMessage = 'Data refreshed successfully!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getActiveCount(): number {
    return (this.employees || []).filter((emp) => emp.status === 'ACTIVE').length;
  }

  getInactiveCount(): number {
    return (this.employees || []).filter((emp) => emp.status === 'INACTIVE').length;
  }

  getTotalSalary(): number {
    return (this.employees || []).reduce((sum, emp) => sum + (emp.salary?.total || 0), 0);
  }
}
