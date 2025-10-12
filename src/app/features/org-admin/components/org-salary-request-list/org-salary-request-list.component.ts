import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  SalaryDisbursementRequest,
  SalaryRequestFilters,
} from '../../models/salary-filters.interface';
import { OrgSalaryRequestsService } from '../../services/salary-request.service';

@Component({
  selector: 'app-org-salary-requests-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './org-salary-request-list.component.html',
  styleUrls: ['./org-salary-request-list.component.css'],
})
export class OrgSalaryRequestsListComponent implements OnInit {
  filterForm!: FormGroup;
  requests: SalaryDisbursementRequest[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // UI State
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isCreating = false;

  // Filter options
  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  pageSizeOptions = [10, 25, 50, 100];

  constructor(private fb: FormBuilder, private salaryRequestsService: OrgSalaryRequestsService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRequests();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      status: ['ALL'],
      pageSize: [this.pageSize],
    });

    // Listen to page size changes
    this.filterForm.get('pageSize')?.valueChanges.subscribe((value) => {
      this.pageSize = value;
      this.currentPage = 0;
      this.loadRequests();
    });

    // Listen to status changes
    this.filterForm.get('status')?.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadRequests();
    });
  }

  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filters: SalaryRequestFilters = {
      status: this.filterForm.value.status,
      page: this.currentPage,
      size: this.pageSize,
    };

    this.salaryRequestsService.getOrganizationRequests(filters).subscribe({
      next: (response) => {
        this.requests = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load salary disbursement requests';
        console.error('Error loading requests:', error);
      },
    });
  }

  createNewRequest(): void {
    if (
      confirm(
        'Are you sure you want to create a new salary disbursement request? This will initiate salary payment for all active employees.'
      )
    ) {
      this.isCreating = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.salaryRequestsService.createRequest().subscribe({
        next: (response) => {
          this.isCreating = false;
          this.successMessage =
            'Salary disbursement request created successfully! Request ID: #' + response.id;
          this.loadRequests(); // Reload to show new request

          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.isCreating = false;
          this.errorMessage =
            error.error?.message || 'Failed to create salary disbursement request';
          console.error('Error creating request:', error);
        },
      });
    }
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRequests();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadRequests();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadRequests();
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
    const classes: { [key: string]: string } = {
      PENDING: 'badge-warning',
      APPROVED: 'badge-info',
      REJECTED: 'badge-danger',
      COMPLETED: 'badge-success',
    };
    return classes[status] || 'badge-secondary';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  refreshData(): void {
    this.loadRequests();
    this.successMessage = 'Data refreshed successfully!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getFilteredCount(status: string): number {
    return this.requests.filter((req) => req.status === status).length;
  }

  getPendingCount(): number {
    return this.getFilteredCount('PENDING');
  }

  getApprovedCount(): number {
    return this.getFilteredCount('APPROVED');
  }

  getRejectedCount(): number {
    return this.getFilteredCount('REJECTED');
  }

  getCompletedCount(): number {
    return this.getFilteredCount('COMPLETED');
  }
}
