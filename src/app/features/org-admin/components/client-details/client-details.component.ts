import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsService, Client } from '../../services/clients.service';
import {
  ClientPaymentRequestDTO,
  PaymentRequestService,
} from '../../services/payment-request.service';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css'],
})
export class ClientDetailsComponent implements OnInit {
  client: Client | null = null;
  clientId: number = 0;

  // UI State
  isLoading = false;
  isLoadingPayment = false;
  errorMessage = '';
  successMessage = '';

  // Payment Request Modal
  showPaymentModal = false;
  paymentRequestForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private paymentRequestService: PaymentRequestService
  ) {}

  ngOnInit(): void {
    this.initializePaymentForm();
    this.route.params.subscribe((params) => {
      this.clientId = +params['id'];
      if (this.clientId) {
        this.loadClientDetails();
      }
    });
  }

  initializePaymentForm(): void {
    this.paymentRequestForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      reason: ['', [Validators.required, Validators.maxLength(500)]],
      dueDate: ['', [Validators.required]],
      taxAmount: ['', [Validators.min(0)]],
      notes: ['', [Validators.maxLength(1000)]],
    });
  }

  loadClientDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientsService.getClientById(this.clientId).subscribe({
      next: (client) => {
        this.client = client;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load client details';
        console.error('Error loading client:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/organization/clients']);
  }

  openPaymentRequestModal(): void {
    this.paymentRequestForm.reset();
    // Set default due date to 30 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    this.paymentRequestForm.patchValue({
      dueDate: defaultDueDate.toISOString().split('T')[0],
    });
    this.showPaymentModal = true;
  }

  closePaymentRequestModal(): void {
    this.showPaymentModal = false;
    this.paymentRequestForm.reset();
  }

  submitPaymentRequest(): void {
    if (this.paymentRequestForm.invalid || !this.client) {
      this.markFormGroupTouched(this.paymentRequestForm);
      return;
    }

    this.isLoadingPayment = true;
    this.errorMessage = '';

    const requestData: ClientPaymentRequestDTO = {
      clientId: this.clientId,
      amount: this.paymentRequestForm.value.amount,
      reason: this.paymentRequestForm.value.reason,
      dueDate: this.paymentRequestForm.value.dueDate,
      taxAmount: this.paymentRequestForm.value.taxAmount || 0,
      notes: this.paymentRequestForm.value.notes || undefined,
    };

    this.paymentRequestService.sendPaymentRequest(requestData).subscribe({
      next: (response) => {
        this.isLoadingPayment = false;
        this.successMessage = 'Payment request sent successfully!';
        this.closePaymentRequestModal();

        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        this.isLoadingPayment = false;
        this.errorMessage = error.error?.message || 'Failed to send payment request';
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentRequestForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.paymentRequestForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('min')) {
      const min = field.errors?.['min'].min;
      return `Minimum value is ${min}`;
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Maximum ${maxLength} characters allowed`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      amount: 'Amount',
      reason: 'Description',
      dueDate: 'Due Date',
      taxAmount: 'Tax Amount',
      notes: 'Notes',
    };
    return labels[fieldName] || fieldName;
  }

  getTotalAmount(): number {
    const amount = this.paymentRequestForm.get('amount')?.value || 0;
    const tax = this.paymentRequestForm.get('taxAmount')?.value || 0;
    return parseFloat(amount) + parseFloat(tax);
  }

  editClient(): void {
    this.router.navigate(['/clients/edit', this.clientId]);
  }
}
