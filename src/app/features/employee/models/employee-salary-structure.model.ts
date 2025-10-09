export interface EmployeeSalaryStructureResponseDTO {
  id: number;
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  startDate: string; // ISO date
  endDate?: string;  // optional
}
