import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientsService, Client, ClientRequest } from '../../services/clients.service';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css'],
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';

  // UI State
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Modal States
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedClient: Client | null = null;

  // Forms
  clientForm!: FormGroup;

  // Stats
  activeCount = 0;
  inactiveCount = 0;

  constructor(private fb: FormBuilder, private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadClients();
  }

  initializeForm(): void {
    this.clientForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      contactPersonName: ['', [Validators.required, Validators.maxLength(100)]],
      contactEmail: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', [Validators.maxLength(255)]],
      city: ['', [Validators.maxLength(50)]],
      state: ['', [Validators.maxLength(50)]],
      country: ['', [Validators.maxLength(50)]],
      postalCode: ['', [Validators.maxLength(10)]],
      status: ['ACTIVE', [Validators.required]],
      accountNumber: ['', [Validators.pattern(/^\d{12}$/)]],
      ifsc: ['', [Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
    });
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientsService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load clients';
        console.error('Error loading clients:', error);
      },
    });
  }

  calculateStats(): void {
    this.activeCount = this.clients.filter((c) => c.status === 'ACTIVE').length;
    this.inactiveCount = this.clients.filter((c) => c.status === 'INACTIVE').length;
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClients = this.clients;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(
      (client) =>
        client.companyName.toLowerCase().includes(term) ||
        client.contactPersonName.toLowerCase().includes(term) ||
        client.contactEmail.toLowerCase().includes(term) ||
        client.contactPhone.includes(term)
    );
  }

  openCreateModal(): void {
    this.clientForm.reset({ status: 'ACTIVE' });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.clientForm.reset();
  }

  openEditModal(client: Client): void {
    this.selectedClient = client;
    this.clientForm.patchValue({
      companyName: client.companyName,
      contactPersonName: client.contactPersonName,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      country: client.country || '',
      postalCode: client.postalCode || '',
      status: client.status,
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedClient = null;
    this.clientForm.reset();
  }

  openDeleteModal(client: Client): void {
    this.selectedClient = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedClient = null;
  }

  submitCreate(): void {
    
    if (this.clientForm.invalid) {
      this.markFormGroupTouched(this.clientForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const clientData: ClientRequest = {
      ...this.clientForm.value,
    };

    // Add bank account if provided
    if (this.clientForm.value.accountNumber && this.clientForm.value.ifsc) {
      clientData.bankAccount = {
        accountNumber: this.clientForm.value.accountNumber,
        ifsc: this.clientForm.value.ifsc,
      };
    }
    
    this.clientsService.createClient(clientData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Client "${response.companyName}" created successfully!`;
        this.closeCreateModal();
        this.loadClients();

        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create client';
      },
    });
  }

  submitEdit(): void {
    if (this.clientForm.invalid || !this.selectedClient) {
      this.markFormGroupTouched(this.clientForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const clientData: ClientRequest = {
      ...this.clientForm.value,
    };

    if (this.clientForm.value.accountNumber && this.clientForm.value.ifsc) {
      clientData.bankAccount = {
        accountNumber: this.clientForm.value.accountNumber,
        ifsc: this.clientForm.value.ifsc,
      };
    }

    this.clientsService.updateClient(this.selectedClient.id, clientData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Client "${response.companyName}" updated successfully!`;
        this.closeEditModal();
        this.loadClients();

        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to update client';
      },
    });
  }

  confirmDelete(): void {
    if (!this.selectedClient) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.clientsService.deleteClient(this.selectedClient.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = `Client "${this.selectedClient!.companyName}" deleted successfully!`;
        this.closeDeleteModal();
        this.loadClients();

        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to delete client';
        this.closeDeleteModal();
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
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Maximum ${maxLength} characters allowed`;
    }
    if (field?.hasError('pattern')) {
      return this.getPatternError(fieldName);
    }
    return '';
  }

  private getPatternError(fieldName: string): string {
    const patterns: { [key: string]: string } = {
      contactPhone: 'Phone number must be exactly 10 digits',
      accountNumber: 'Account number must be exactly 12 digits',
      ifsc: 'Invalid IFSC code format (e.g., ABCD0123456)',
    };
    return patterns[fieldName] || 'Invalid format';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      companyName: 'Company Name',
      contactPersonName: 'Contact Person',
      contactEmail: 'Email',
      contactPhone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      country: 'Country',
      postalCode: 'Postal Code',
      status: 'Status',
      accountNumber: 'Account Number',
      ifsc: 'IFSC Code',
    };
    return labels[fieldName] || fieldName;
  }

  refreshData(): void {
    this.loadClients();
    this.successMessage = 'Data refreshed successfully!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
