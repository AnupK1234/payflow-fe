import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DepositRequestsService } from '../../services/deposit-requests.service';
import { DepositFilters, DepositRequest } from '../../models/deposit.model';

@Component({
  selector: 'app-deposit-requests-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deposit-requests-list.component.html',
  styleUrls: ['./deposit-requests-list.component.css'],
})
export class DepositRequestsListComponent implements OnInit {
  filterForm!: FormGroup;
  requests: DepositRequest[] = [];

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
  selectedRequest: DepositRequest | null = null;
  actionType: 'approve' | 'reject' | null = null;

  // Filter options
  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  pageSizeOptions = [10, 25, 50, 100];

  // Date range presets
  datePresets = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'week' },
    { label: 'Last 30 Days', value: 'month' },
    { label: 'Custom Range', value: 'custom' },
  ];

  showCustomDateRange = false;

  constructor(private fb: FormBuilder, private depositService: DepositRequestsService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRequests();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      status: ['ALL'],
      datePreset: [''],
      startDate: [''],
      endDate: [''],
      pageSize: [this.pageSize],
    });

    // Listen to page size changes
    this.filterForm.get('pageSize')?.valueChanges.subscribe((value) => {
      this.pageSize = value;
      this.currentPage = 0;
      this.loadRequests();
    });

    // Listen to date preset changes
    this.filterForm.get('datePreset')?.valueChanges.subscribe((preset) => {
      this.handleDatePresetChange(preset);
    });
  }

  handleDatePresetChange(preset: string): void {
    const today = new Date();
    let startDate = '';
    let endDate = '';

    switch (preset) {
      case 'today':
        startDate = this.formatDate(today);
        endDate = this.formatDate(today);
        this.showCustomDateRange = false;
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        startDate = this.formatDate(weekAgo);
        endDate = this.formatDate(today);
        this.showCustomDateRange = false;
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30);
        startDate = this.formatDate(monthAgo);
        endDate = this.formatDate(today);
        this.showCustomDateRange = false;
        break;
      case 'custom':
        this.showCustomDateRange = true;
        startDate = '';
        endDate = '';
        break;
      default:
        this.showCustomDateRange = false;
        startDate = '';
        endDate = '';
    }

    this.filterForm.patchValue(
      {
        startDate: startDate,
        endDate: endDate,
      },
      { emitEvent: false }
    );

    if (preset !== 'custom') {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadRequests();
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      status: 'ALL',
      datePreset: '',
      startDate: '',
      endDate: '',
    });
    this.showCustomDateRange = false;
    this.applyFilters();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filters: DepositFilters = {
      status: this.filterForm.value.status,
      startDate: this.filterForm.value.startDate,
      endDate: this.filterForm.value.endDate,
      page: this.currentPage,
      size: this.pageSize,
    };

    this.depositService.getDepositRequests(filters).subscribe({
      next: (response) => {
        this.requests = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load deposit requests';
        console.error('Error loading requests:', error);
      },
    });
  }

  openActionModal(request: DepositRequest, action: 'approve' | 'reject'): void {
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

    const approve = this.actionType === 'approve';

    this.depositService.approveDeposit(this.selectedRequest.id, approve).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Request ${this.actionType}d successfully!`;
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
        console.error(`Error ${this.actionType}ing request:`, error);
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
      APPROVED: 'badge-success',
      REJECTED: 'badge-danger',
    };
    return classes[status] || 'badge-secondary';
  }

  formatDisplayDate(dateString: string | null): string {
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

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  canTakeAction(request: DepositRequest): boolean {
    return request.status === 'PENDING';
  }

  refreshData(): void {
    this.loadRequests();
    this.successMessage = 'Data refreshed successfully!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getTotalAmount(): number {
    return this.requests.reduce((sum, req) => sum + req.amount, 0);
  }

  getFilteredCount(status: string): number {
    return this.requests.filter((req) => req.status === status).length;
  }
}
