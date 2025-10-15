// export interface CreateDepositRequest {
//   amount: number;
//   reason: string;
// }

// export interface DepositResponse {
//   id: number;
//   amount: number;
//   reason: string;
//   status: 'PENDING' | 'APPROVED' | 'REJECTED';
//   createdAt: string; // ISO date string
//   updatedAt?: string; // ISO date string
// }

// models/deposit-request.model.ts

export interface CreateDepositRequest {
  amount: number;
  reason: string;
}

export interface DepositResponse {
  id: number;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export type DepositStatus = 'PENDING' | 'APPROVED' | 'REJECTED';