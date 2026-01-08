export interface IPayroll {
  id: number;
  [key: string]: any;
  
  employeeName: string;
  month: string;          // e.g., "January 2025"
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "Paid" | "Pending" | "Failed";
}
