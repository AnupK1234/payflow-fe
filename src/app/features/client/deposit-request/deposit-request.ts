import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../services/client.service';
import { CreateDepositRequest } from '../models/deposit-request.model';

@Component({
  selector: 'app-deposit-request',
  templateUrl: './deposit-request.html',
  styleUrls: ['./deposit-request.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DepositRequestComponent {
  amount: number | null = null;
  reason: string = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private clientService: ClientService) {}

  submitDeposit(): void {
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const depositRequest: CreateDepositRequest = {
      amount: this.amount,
      reason: this.reason
    };

    this.clientService.createDepositRequest(depositRequest).subscribe({
      next: () => {
        this.successMessage = 'Deposit request submitted successfully!';
        this.amount = null;
        this.reason = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to submit deposit request';
        this.isLoading = false;
      }
    });
  }
}
