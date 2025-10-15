export interface BankAccountDetails {
  accountNumber: string;
  ifsc: string;
  status: 'ACTIVE'; // Assuming status is fixed for registration
}

export interface OrganizationRequest {
  name: string;
  registrationNumber: string;
  address: string;
  adminUsername: string;
  adminEmail: string;
  tempPassword: string;
}
