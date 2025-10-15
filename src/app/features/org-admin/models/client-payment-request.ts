


export type PaymentStatus = 'PENDING' | 'ACCEPTED' | 'PAID' | 'FAILED' | 'REJECTED';

export interface ClientPaymentRequest {
  id: number;                   
  amount: number;                
  status: PaymentStatus;         
  createdAt: string;             
  acceptedAt?: string;           
  reason?: string;              
  metadata?: string;            
  clientBankAccountId?: number;  
}
