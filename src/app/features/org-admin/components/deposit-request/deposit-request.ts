import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrgAdminDepositRequestService } from '../../services/org-admin-deposit-request.service';
import { CreateDepositRequest, DepositResponse, DepositStatus } from '../../models/deposit-request.model';

@Component({
  selector: 'app-request-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit-request.html',
  styleUrls: ['./deposit-request.css'],
})
export class RequestDepositComponent implements OnInit {
  amount: number | null = null;
  reason: string = '';
  isLoading = false;
  isFetching = false;
  successMessage = '';
  errorMessage = '';
  deposits: DepositResponse[] = [];
  filteredDeposits: DepositResponse[] = [];
  searchTerm: string = '';
  statusFilter: string = 'ALL';
  sortBy: string = 'newest';

  
  statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  
  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount-high', label: 'Amount (High to Low)' },
    { value: 'amount-low', label: 'Amount (Low to High)' },
  ];

  constructor(private depositService: OrgAdminDepositRequestService) {}

  ngOnInit(): void {
    this.fetchDeposits();
  }

  submitDeposit(): void {
 
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount greater than 0';
      return;
    }

    

    if (this.reason.length > 500) {
      this.errorMessage = 'Reason cannot exceed 500 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const depositRequest: CreateDepositRequest = {
      amount: this.amount,
      reason: this.reason.trim()
    };

    this.depositService.createDepositRequest(depositRequest).subscribe({
      next: () => {
        this.successMessage = 'Deposit request submitted successfully!';
        this.amount = null;
        this.reason = '';
        this.isLoading = false;
        this.fetchDeposits();
        
        
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.message || 'Failed to submit deposit request. Please try again.';
        this.isLoading = false;
        
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  fetchDeposits(): void {
    this.isFetching = true;
    this.depositService.listDeposits().subscribe({
      next: (data: DepositResponse[]) => {
        this.deposits = data;
        this.applyFilters();
        this.isFetching = false;
      },
      error: (err) => {
        console.error('Failed to fetch deposits', err);
        this.errorMessage = 'Failed to load deposit history. Please try again later.';
        this.isFetching = false;
        
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  applyFilters(): void {
    let result = [...this.deposits];
    
   
    if (this.statusFilter !== 'ALL') {
      result = result.filter(deposit => deposit.status === this.statusFilter);
    }
    
    
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(deposit => 
        deposit.reason.toLowerCase().includes(term) ||
        deposit.id.toString().includes(term) ||
        deposit.amount.toString().includes(term)
      );
    }
    

    result = this.sortDeposits(result);
    
    this.filteredDeposits = result;
  }

  sortDeposits(deposits: DepositResponse[]): DepositResponse[] {
    switch (this.sortBy) {
      case 'newest':
        return deposits.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return deposits.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'amount-high':
        return deposits.sort((a, b) => b.amount - a.amount);
      case 'amount-low':
        return deposits.sort((a, b) => a.amount - b.amount);
      default:
        return deposits;
    }
  }

  getStatusBadgeClass(status: DepositStatus): string {
    switch (status) {
      case 'APPROVED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning text-dark';
      case 'REJECTED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'ALL';
    this.sortBy = 'newest';
    this.applyFilters();
  }

  getTotalAmount(): number {
    return this.filteredDeposits.reduce((total, deposit) => total + deposit.amount, 0);
  }

  getPendingCount(): number {
    return this.deposits.filter(deposit => deposit.status === 'PENDING').length;
  }

  getApprovedCount(): number {
    return this.deposits.filter(deposit => deposit.status === 'APPROVED').length;
  }

  getRejectedCount(): number {
    return this.deposits.filter(deposit => deposit.status === 'REJECTED').length;
  }
}