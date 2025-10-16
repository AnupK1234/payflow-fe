

export interface EmployeeSalaryStructureResponseDTO {
  id: number;
  basic: number;
  hra: number;
  da: number; 
  other_allowances: number; 
  pf: number; 
  deductions?: number; 
  netSalary?: number; 
  effectiveFrom: string; 
  effectiveTo: string; 
  isCurrent: boolean;
  employee_id: number;
}