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
import { BankAccount } from '../models/bank-account.model';

export interface ClientPaymentRequest {
  id: number;
  amount: number;
  senderName: string;
  clientBankAccountId?: number;       // selected account
  clientBankAccounts?: BankAccount[]; // list of accounts
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
  description?: string;
}
