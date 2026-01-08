export interface IPayroll {
  id: number;
  [key: string]: any;
  
  // Employee Information
  employeeName: string;
  employeeId: string;
  department: string;
  
  // Payroll Period
  month: string;          // e.g., "December 2024"
  paymentDate: string;    // e.g., "2024-12-31"
  
  // Salary Components
  basic: number;
  hra: number;
  allowances: number;
  bonus?: number;
  overtime?: number;
  
  // Deductions
  deductions: number;
  taxDeductions?: number;
  
  // Totals
  totalEarnings?: number;
  totalDeductions?: number;
  netSalary: number;
  
  // Status
  status: "Paid" | "Pending" | "Failed" | "Verified" | "Needs Review";
  
  // Payment Information
  bankAccount: string;
  paymentMethod?: string;
  
  // Additional Fields
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPayrollVerificationForm {
  // Verification Details
  verifiedBy: string;
  verificationDate: string;
  status: "Verified" | "Rejected" | "Needs Correction";
  notes?: string;
  
  // Corrections (if needed)
  corrections?: {
    basic?: number;
    hra?: number;
    allowances?: number;
    deductions?: number;
    notes: string;
  };
}

// Mock data generator
export const generateMockPayrollData = (count: number): IPayroll[] => {
  const departments = ["Engineering", "Sales", "Marketing", "Operations", "Finance", "HR", "Customer Support"];
  const statuses: IPayroll["status"][] = ["Paid", "Pending", "Failed", "Verified", "Needs Review"];
  
  return Array.from({ length: count }, (_, i) => {
    const basic = Math.floor(Math.random() * 50000) + 30000;
    const hra = basic * 0.5;
    const allowances = Math.floor(Math.random() * 20000) + 5000;
    const deductions = Math.floor(Math.random() * 15000) + 3000;
    const netSalary = basic + hra + allowances - deductions;
    
    return {
      id: i + 1,
      employeeName: `Employee ${i + 1}`,
      employeeId: `EMP-${String(i + 1).padStart(3, '0')}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      month: "December 2024",
      paymentDate: "2024-12-31",
      basic,
      hra,
      allowances,
      deductions,
      netSalary,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      bankAccount: `XXXX-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      totalEarnings: basic + hra + allowances,
      totalDeductions: deductions,
      taxDeductions: Math.floor(deductions * 0.6),
      bonus: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) + 2000 : undefined,
      overtime: Math.random() > 0.7 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

// Helper functions
export const calculateNetSalary = (earnings: number, deductions: number): number => {
  return earnings - deductions;
};

export const calculateTotalEarnings = (components: {
  basic: number;
  hra: number;
  allowances: number;
  bonus?: number;
  overtime?: number;
}): number => {
  return components.basic + components.hra + components.allowances + 
         (components.bonus || 0) + (components.overtime || 0);
};

export const getStatusColor = (status: IPayroll["status"]): string => {
  switch (status) {
    case 'Paid':
    case 'Verified':
      return 'success';
    case 'Pending':
    case 'Needs Review':
      return 'warning';
    case 'Failed':
      return 'error';
    default:
      return 'default';
  }
};

export const formatCurrencyINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Validation functions
export const validatePayrollData = (data: Partial<IPayroll>): string[] => {
  const errors: string[] = [];
  
  if (!data.employeeName?.trim()) {
    errors.push('Employee name is required');
  }
  
  if (!data.employeeId?.trim()) {
    errors.push('Employee ID is required');
  }
  
  if (!data.department?.trim()) {
    errors.push('Department is required');
  }
  
  if (!data.month?.trim()) {
    errors.push('Payroll month is required');
  }
  
  if (data.basic === undefined || data.basic <= 0) {
    errors.push('Basic salary must be greater than 0');
  }
  
  if (data.hra === undefined || data.hra < 0) {
    errors.push('HRA cannot be negative');
  }
  
  if (data.allowances === undefined || data.allowances < 0) {
    errors.push('Allowances cannot be negative');
  }
  
  if (data.deductions === undefined || data.deductions < 0) {
    errors.push('Deductions cannot be negative');
  }
  
  if (data.netSalary === undefined || data.netSalary < 0) {
    errors.push('Net salary cannot be negative');
  }
  
  if (!data.status) {
    errors.push('Status is required');
  }
  
  return errors;
};