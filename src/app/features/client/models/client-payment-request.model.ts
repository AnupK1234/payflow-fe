// export interface ClientPaymentRequest {
//   id: number;
//   amount: number;
//   senderName: string;
//   clientBankAccountId: number;  
//   status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
//   createdAt: string; 
//   updatedAt?: string;
//   description?: string; 
// }
import { BankAccount } from './bank-account.model';

// Payment statuses used in the app
export type PaymentStatus = 'PENDING' | 'ACCEPTED' | 'PAID' | 'FAILED' | 'REJECTED';

// Represents a single client payment request
export interface ClientPaymentRequest {
  id: number;
  amount: number;
  status: PaymentStatus;
  createdAt: string;                // ISO date string
  clientBankAccounts?: BankAccount[]; // Optional list of client's bank accounts
  clientBankAccountId?: number;       // Selected bank account ID for payment
  description?: string;               // Optional description of the request
}

// Dashboard stats for a client
export interface DashboardStats {
  totalRequests: number;
  pending: number;
  accepted: number;
  paid: number;
  failed: number;
  rejected: number;
}
