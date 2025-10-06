export interface Organization {
  bankAccount: any;
  id: number;
  name: string;
  address?: string | null;
  contactEmail?: string | null;
  documents: any;
  registrationNumber: any;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | string;
  adminUsername?: string | null;
  adminEmail?: string | null;
}
