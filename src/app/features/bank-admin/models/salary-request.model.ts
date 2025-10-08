export interface SalaryDisbursementRequest {
  id: number;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  organizationId: number;
  createdById: number | null;
  approvedById: number | null;
  approvedAt: string | null;
}

export interface PageResponse {
  content: SalaryDisbursementRequest[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
