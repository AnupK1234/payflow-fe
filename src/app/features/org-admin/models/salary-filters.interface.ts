export interface SalaryDisbursementRequest {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  requestDate: string;
  organizationId: number;
  createdById: number | null;
  approvedById: number | null;
  approvedAt: string | null;
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

export interface SalaryRequestFilters {
  status?: string;
  page: number;
  size: number;
}