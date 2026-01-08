export interface ISalaryComponent {
  id: string;
  name: string;
  calculationType: 'Percentage' | 'Flat';
  calculated: 'Monthly' | 'Annually' | 'One-time';
  value: number;
  order: number;
  isActive: boolean;
  description?: string;
  appliesTo?: 'All' | 'Specific';
  conditions?: string;
  taxExempt?: boolean;
  maxLimit?: number;
  minLimit?: number;
}


export interface IPayrollRun {
  id: string;
  name: string;
  month: string;
  year: number;
  status: 'Draft' | 'Processing' | 'Completed' | 'Failed';
  totalEmployees: number;
  totalAmount: number;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}


export interface IPayrollRunItem {
  id: string;
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  salaryGrade: string;
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Pending' | 'Paid' | 'Failed' | 'Verified';
  bankAccount: string;
  paymentMethod: string;
  processedAt?: string;
  notes?: string;
}

export interface IPayrollVerification {
  id: string;
  payrollItemId: string;
  verifiedBy: string;
  verificationDate: string;
  status: 'Approved' | 'Rejected' | 'Needs Review';
  notes?: string;
  corrections?: {
    basic?: number;
    hra?: number;
    allowances?: number;
    deductions?: number;
    notes: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ISalaryGrade {
  id: string;
  name: string;
  code: string;
  description?: string;
  components: ISalaryComponent[];
  totalCTC: number;
  monthlyGross: number;
  annualGross: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}


export type SalaryComponentForm = Omit<ISalaryComponent, 'id'>;

export interface ISalaryGradeForm {
  name: string;
  code: string;
  description?: string;
  components: SalaryComponentForm[];
  isActive: boolean;
}


// Mock data for components
export const DEFAULT_COMPONENTS: Partial<ISalaryComponent>[] = [
  {
    name: 'Basic Salary',
    calculationType: 'Percentage',
    calculated: 'Monthly',
    value: 50,
    order: 1,
    isActive: true,
    description: 'Basic salary component',
    appliesTo: 'All',
    taxExempt: false
  },
  {
    name: 'House Rent Allowance',
    calculationType: 'Percentage',
    calculated: 'Monthly',
    value: 50,
    order: 2,
    isActive: true,
    description: 'House rent allowance',
    appliesTo: 'All',
    taxExempt: true,
    maxLimit: 50000
  },
  {
    name: 'Leave Travel Allowance',
    calculationType: 'Flat',
    calculated: 'Monthly',
    value: 5,
    order: 3,
    isActive: true,
    description: 'Leave travel allowance',
    appliesTo: 'All',
    taxExempt: true
  },
  {
    name: 'Medical Allowance',
    calculationType: 'Flat',
    calculated: 'Monthly',
    value: 6,
    order: 4,
    isActive: true,
    description: 'Medical allowance',
    appliesTo: 'All',
    taxExempt: true,
    maxLimit: 15000
  },
  {
    name: 'ESIC',
    calculationType: 'Flat',
    calculated: 'Monthly',
    value: 500,
    order: 5,
    isActive: true,
    description: 'Employee State Insurance',
    appliesTo: 'All'
  },
  {
    name: 'Professional Tax',
    calculationType: 'Flat',
    calculated: 'Monthly',
    value: 7,
    order: 6,
    isActive: true,
    description: 'Professional tax deduction',
    appliesTo: 'All'
  },
  {
    name: 'Special Allowance',
    calculationType: 'Flat',
    calculated: 'Monthly',
    value: 8,
    order: 7,
    isActive: true,
    description: 'Special allowance',
    appliesTo: 'All'
  },
  {
    name: 'Statutory Bonus',
    calculationType: 'Flat',
    calculated: 'Monthly',
    value: 9,
    order: 8,
    isActive: true,
    description: 'Statutory bonus',
    appliesTo: 'All'
  }
];

export type SalaryComponentForCalculation = Omit<ISalaryComponent, 'id'> & { id?: string };

// Helper functions
export const calculateMonthlyGross = (
  components: (ISalaryComponent | SalaryComponentForm)[], 
  baseCTC: number = 0
): number => {
  return components.reduce((total, component) => {
    if (!component.isActive) return total;
    
    let amount = 0;
    if (component.calculationType === 'Percentage') {
      amount = (baseCTC * component.value) / 100;
    } else {
      amount = component.value;
    }
    
    // Convert annual to monthly if needed
    if (component.calculated === 'Annually') {
      amount = amount / 12;
    }
    
    return total + amount;
  }, 0);
};

export const calculateAnnualGross = (
  components: (ISalaryComponent | SalaryComponentForm)[], 
  baseCTC: number = 0
): number => {
  return components.reduce((total, component) => {
    if (!component.isActive) return total;
    
    let amount = 0;
    if (component.calculationType === 'Percentage') {
      amount = (baseCTC * component.value) / 100;
    } else {
      amount = component.value;
    }
    
    // Convert monthly to annual if needed
    if (component.calculated === 'Monthly') {
      amount = amount * 12;
    }
    
    return total + amount;
  }, 0);
};

export const calculateTotalCTC = (
  components: (ISalaryComponent | SalaryComponentForm)[], 
  baseCTC: number = 0
): number => {
  return calculateAnnualGross(components, baseCTC);
};

export const validateSalaryGrade = (data: ISalaryGradeForm): string[] => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) {
    errors.push('Salary grade name is required');
  }
  
  if (!data.code?.trim()) {
    errors.push('Salary grade code is required');
  }
  
  if (data.components.length === 0) {
    errors.push('At least one salary component is required');
  }
  
  // Check for duplicate component names
  const componentNames = data.components.map(c => c.name.toLowerCase());
  const uniqueNames = new Set(componentNames);
  if (componentNames.length !== uniqueNames.size) {
    errors.push('Duplicate component names found');
  }
  
  // Validate component values
  data.components.forEach((component, index) => {
    if (!component.name?.trim()) {
      errors.push(`Component ${index + 1}: Name is required`);
    }
    
    if (component.value <= 0) {
      errors.push(`Component ${index + 1}: Value must be greater than 0`);
    }
    
    if (component.calculationType === 'Percentage' && component.value > 100) {
      errors.push(`Component ${index + 1}: Percentage cannot exceed 100%`);
    }
  });
  
  return errors;
};