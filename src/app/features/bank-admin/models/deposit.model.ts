export interface DepositRequest {
  id: number;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  approvedAt: string | null;
  createdBy: string | null;
  approvedBy: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface DepositFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
  sort?: string;
}
