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

export type PaymentStatus = 'PENDING' | 'ACCEPTED' | 'PAID' | 'FAILED' | 'REJECTED';

export interface ClientPaymentRequest {
  id: number;
  amount: number;
  status: PaymentStatus;
  createdAt: string;                   
  clientBankAccounts?: BankAccount[];  
  clientBankAccountId?: number;        
  reason?: string;                     // renamed from description
  metadata?: string;                  
}

export interface DashboardStats {
  totalRequests: number;
  pending: number;
  accepted: number;
  paid: number;
  failed: number;
  rejected: number;
}
