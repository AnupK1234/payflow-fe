export type ConcernStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface Concern {
  id: number;
  employeeId: number;
  organizationId: number;
  description: string;
  attachmentUrl?: string;
  status: ConcernStatus;
  createdAt: string;
  updatedAt: string;
}