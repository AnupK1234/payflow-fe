import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageResponse, SalaryDisbursementRequest } from '../../models/salary-request.model';
import { BankAdminService } from '../../services/bank-admin.service';

@Component({
  selector: 'app-salary-requests-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salary-requests-list.component.html',
  styleUrls: ['./salary-requests-list.component.css'],
})
export class SalaryRequestsListComponent implements OnInit {
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

  // Modal
  showActionModal = false;
  selectedRequest: SalaryDisbursementRequest | null = null;
  actionType: 'approve' | 'reject' | null = null;

  // Filter options
  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  pageSizeOptions = [10, 25, 50, 100];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private service: BankAdminService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRequests();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      status: ['ALL'],
      pageSize: [this.pageSize],
    });

    // Listen to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 0; // Reset to first page
      this.pageSize = this.filterForm.value.pageSize;
      this.loadRequests();
    });
  }

  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service
      .getSalaryRequests(this.filterForm.value.status, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.requests = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to load salary disbursement requests';
        },
      });
  }

  openActionModal(request: SalaryDisbursementRequest, action: 'approve' | 'reject'): void {
    this.selectedRequest = request;
    this.actionType = action;
    this.showActionModal = true;
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.selectedRequest = null;
    this.actionType = null;
  }

  confirmAction(): void {
    if (!this.selectedRequest || !this.actionType) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.takeAction(this.selectedRequest.id, this.actionType).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage =
          typeof response === 'string' ? response : `Request ${this.actionType}d successfully!`;
        this.closeActionModal();
        this.loadRequests();

        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || `Failed to ${this.actionType} request`;
        this.closeActionModal();
      },
    });
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

  canTakeAction(request: SalaryDisbursementRequest): boolean {
    return request.status === 'PENDING';
  }

  refreshData(): void {
    this.loadRequests();
    this.successMessage = 'Data refreshed successfully!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
