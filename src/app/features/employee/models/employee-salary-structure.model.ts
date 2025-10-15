

export interface EmployeeSalaryStructureResponseDTO {
  id: number;
  basic: number;
  hra: number;
  da: number; 
  other_allowances: number; 
  pf: number; 
  deductions?: number; 
  netSalary?: number; 
  effective_from: string; 
  effective_to: string; 
  is_current: boolean;
  employee_id: number;
}