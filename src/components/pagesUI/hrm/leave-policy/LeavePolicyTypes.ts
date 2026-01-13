export type ExpiresOnType = 'Year End' | 'Specific Month';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type GenderType = 'Male' | 'Female' | 'All';
export type ProrationCalculationType = 'Monthly' | 'Daily';
export type LeaveCategoryType = 'Paid' | 'Unpaid' | 'Sick' | 'Maternity' | 'Paternity' | 'Compensatory' | 'Casual' | 'Special';
export type AccrualMethodType = 'Monthly' | 'Yearly' | 'Quarterly';
// Leave Policy Types and Interfaces

export interface ILeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  category: LeaveCategoryType;
  annualEntitlement: number;
  maxContinuousDays: number;
  minServiceDays: number;
  accrualMethod: AccrualMethodType;
  carryForward: {
    allowed: boolean;
    maxDays: number;
    validity: number;
    expiresOn: ExpiresOnType;
  };
  encashment: {
    allowed: boolean;
    maxDays: number;
    rate: number;
  };
  noticePeriod: number;
  requiresApproval: boolean;
  approvalWorkflow: string[];
  supportingDocuments: boolean;
  eligibleGender?: GenderType[];
  eligibility: {
    employmentType: EmploymentType[];
    probationCompleted: boolean;
    department: string[];
    location: string[];
    designation: string[];
  };
  prorate: {
    onJoining: boolean;
    onExit: boolean;
    calculation: ProrationCalculationType;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ILeavePolicy {
  id: string;
  name: string;
  description: string;
  leaveTypes: string[];
  applicableTo: {
    employmentType: EmploymentType[];
    departments: string[];
    locations: string[];
    designations: string[];
    tenure: {
      minMonths: number;
      maxMonths?: number;
    };
  };
  entitlements: {
    [leaveTypeId: string]: {
      annualEntitlement: number;
      accrualRate: number;
      maxAccumulation: number;
    };
  };
  carryForwardRules: {
    allowed: boolean;
    maxDays: number;
    validityPeriod: number;
  };
  encashmentRules: {
    allowed: boolean;
    maxDays: number;
    applicablePeriod: string;
  };
  approvalMatrix: {
    levels: IApprovalLevel[];
    autoApproveDays: number;
  };
  blackoutDates: {
    periods: IBlackoutPeriod[];
    holidays: string[];
  };
  active: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface IApprovalLevel {
  level: number;
  approverRole: string;
  minDaysRequired: number;
  maxDaysAuthority: number;
  mandatory: boolean;
  sequential: boolean;
}

export interface IBlackoutPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  reason: string;
  departments: string[];
  leaveTypes: string[];
}

export interface ILeaveBalance {
  employeeId: string;
  leaveTypeId: string;
  totalEntitled: number;
  accrued: number;
  availed: number;
  balance: number;
  carryForward: number;
  encashed: number;
  lapsed: number;
  fiscalYear: string;
  lastUpdated: string;
}

export interface ILeaveRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  active: boolean;
}

export interface IHoliday {
  id: string;
  name: string;
  date: string;
  type: 'National' | 'Regional' | 'Company' | 'Optional';
  locations: string[];
  departments: string[];
  recurring: boolean;
  description?: string;
  createdAt: string;
  createdBy: string;
}

// Leave Policy Configuration
export const LEAVE_CATEGORIES = [
  { value: 'Paid', label: 'Paid Leave', color: 'success' },
  { value: 'Unpaid', label: 'Unpaid Leave', color: 'warning' },
  { value: 'Sick', label: 'Sick Leave', color: 'info' },
  { value: 'Maternity', label: 'Maternity Leave', color: 'primary' },
  { value: 'Paternity', label: 'Paternity Leave', color: 'primary' },
  { value: 'Compensatory', label: 'Compensatory Off', color: 'secondary' },
  { value: 'Casual', label: 'Casual Leave', color: 'default' },
  { value: 'Special', label: 'Special Leave', color: 'error' }
];

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'];

export const ACCRUAL_METHODS = [
  { value: 'Monthly', label: 'Monthly Accrual' },
  { value: 'Yearly', label: 'Yearly Credit' },
  { value: 'Quarterly', label: 'Quarterly Accrual' }
];

export const GENDER_OPTIONS = [
  { value: 'All', label: 'All Genders' },
  { value: 'Male', label: 'Male Only' },
  { value: 'Female', label: 'Female Only' }
];

export const APPROVAL_WORKFLOW_TYPES = [
  { value: 'manager_only', label: 'Manager Only' },
  { value: 'two_level', label: 'Two Level (Manager → HR)' },
  { value: 'three_level', label: 'Three Level (Manager → Department Head → HR)' },
  { value: 'custom', label: 'Custom Workflow' }
];

// Mock data generators
export const createMockLeaveType = (overrides?: Partial<ILeaveType>): ILeaveType => ({
  id: `LT${Math.floor(Math.random() * 1000)}`,
  name: 'Casual Leave',
  code: 'CL',
  description: 'Casual leave for personal work',
  category: 'Casual',
  annualEntitlement: 12,
  maxContinuousDays: 3,
  minServiceDays: 90,
  accrualMethod: 'Monthly',
  carryForward: {
    allowed: true,
    maxDays: 6,
    validity: 3,
    expiresOn: 'Year End'
  },
  encashment: {
    allowed: false,
    maxDays: 0,
    rate: 0
  },
  noticePeriod: 2,
  requiresApproval: true,
  approvalWorkflow: ['manager_only'],
  supportingDocuments: false,
  eligibleGender: ['All'],
  eligibility: {
    employmentType: ['Full-time', 'Part-time'],
    probationCompleted: true,
    department: ['All'],
    location: ['All'],
    designation: ['All']
  },
  prorate: {
    onJoining: true,
    onExit: true,
    calculation: 'Monthly'
  },
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'HR Manager',
  ...overrides
});

export const createMockLeavePolicy = (overrides?: Partial<ILeavePolicy>): ILeavePolicy => ({
  id: `POL${Math.floor(Math.random() * 1000)}`,
  name: 'Standard Leave Policy',
  description: 'Standard leave policy for full-time employees',
  leaveTypes: ['LT001', 'LT002', 'LT003'],
  applicableTo: {
    employmentType: ['Full-time'],
    departments: ['All'],
    locations: ['All'],
    designations: ['All'],
    tenure: {
      minMonths: 0,
      maxMonths: undefined
    }
  },
  entitlements: {
    'LT001': { annualEntitlement: 12, accrualRate: 1, maxAccumulation: 18 },
    'LT002': { annualEntitlement: 7, accrualRate: 0.583, maxAccumulation: 21 },
    'LT003': { annualEntitlement: 5, accrualRate: 0.416, maxAccumulation: 15 }
  },
  carryForwardRules: {
    allowed: true,
    maxDays: 30,
    validityPeriod: 3
  },
  encashmentRules: {
    allowed: true,
    maxDays: 15,
    applicablePeriod: 'Year End'
  },
  approvalMatrix: {
    levels: [
      { level: 1, approverRole: 'Manager', minDaysRequired: 1, maxDaysAuthority: 5, mandatory: true, sequential: true },
      { level: 2, approverRole: 'HR', minDaysRequired: 6, maxDaysAuthority: 30, mandatory: true, sequential: true }
    ],
    autoApproveDays: 1
  },
  blackoutDates: {
    periods: [],
    holidays: []
  },
  active: true,
  effectiveFrom: new Date().toISOString(),
  priority: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'HR Manager',
  ...overrides
});

// Default leave types
export const DEFAULT_LEAVE_TYPES: ILeaveType[] = [
  {
    id: 'LT001',
    name: 'Casual Leave',
    code: 'CL',
    description: 'For personal work or emergencies',
    category: 'Casual',
    annualEntitlement: 12,
    maxContinuousDays: 3,
    minServiceDays: 90,
    accrualMethod: 'Monthly',
    carryForward: { allowed: true, maxDays: 6, validity: 3, expiresOn: 'Year End' },
    encashment: { allowed: false, maxDays: 0, rate: 0 },
    noticePeriod: 2,
    requiresApproval: true,
    approvalWorkflow: ['manager_only'],
    supportingDocuments: false,
    eligibleGender: ['All'],
    eligibility: {
      employmentType: ['Full-time', 'Part-time'],
      probationCompleted: true,
      department: ['All'],
      location: ['All'],
      designation: ['All']
    },
    prorate: { onJoining: true, onExit: true, calculation: 'Monthly' },
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System'
  },
  {
    id: 'LT002',
    name: 'Sick Leave',
    code: 'SL',
    description: 'For medical reasons',
    category: 'Sick',
    annualEntitlement: 7,
    maxContinuousDays: 15,
    minServiceDays: 30,
    accrualMethod: 'Monthly',
    carryForward: { allowed: true, maxDays: 14, validity: 12, expiresOn: 'Year End' },
    encashment: { allowed: false, maxDays: 0, rate: 0 },
    noticePeriod: 0,
    requiresApproval: false,
    approvalWorkflow: [],
    supportingDocuments: true,
    eligibleGender: ['All'],
    eligibility: {
      employmentType: ['Full-time', 'Part-time', 'Contract'],
      probationCompleted: false,
      department: ['All'],
      location: ['All'],
      designation: ['All']
    },
    prorate: { onJoining: true, onExit: true, calculation: 'Monthly' },
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System'
  },
  {
    id: 'LT003',
    name: 'Earned Leave',
    code: 'EL',
    description: 'Paid time off earned through service',
    category: 'Paid',
    annualEntitlement: 15,
    maxContinuousDays: 30,
    minServiceDays: 180,
    accrualMethod: 'Monthly',
    carryForward: { allowed: true, maxDays: 45, validity: 12, expiresOn: 'Year End' },
    encashment: { allowed: true, maxDays: 30, rate: 100 },
    noticePeriod: 15,
    requiresApproval: true,
    approvalWorkflow: ['two_level'],
    supportingDocuments: false,
    eligibleGender: ['All'],
    eligibility: {
      employmentType: ['Full-time', 'Part-time'],
      probationCompleted: true,
      department: ['All'],
      location: ['All'],
      designation: ['All']
    },
    prorate: { onJoining: true, onExit: true, calculation: 'Monthly' },
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System'
  }
];


