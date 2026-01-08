// LeaveTypes.ts
export interface ILeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Escalated' | 'Cancelled';
  emergencyContact?: string;
  attachments?: string[];
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  workflowLevel?: number;
  escalationTo?: string;
}

export interface ILeavePolicy {
  id: string;
  name: string;
  leaveType: LeaveType;
  description: string;
  eligibility: {
    minMonthsOfService: number;
    eligibleRoles: string[];
    maxConsecutiveDays?: number;
  };
  accrual: {
    method: 'Monthly' | 'Quarterly' | 'Annual' | 'Custom';
    daysPerPeriod: number;
    maxAccumulation: number;
  };
  carryForward: {
    allowed: boolean;
    maxDays: number;
    expiresAfterMonths?: number;
  };
  encashment: {
    allowed: boolean;
    maxDays: number;
  };
  approvalWorkflow: string[]; // Roles in order
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface IHoliday {
  id: string;
  date: string;
  name: string;
  type: 'Public' | 'Optional' | 'Company' | 'Regional';
  applicableLocations: string[];
  description?: string;
  isActive: boolean;
  year: number;
}

export interface ILeaveBalance {
  employeeId: string;
  employeeName: string;
  department: string;
  annualLeave: {
    total: number;
    used: number;
    balance: number;
    pending: number;
  };
  sickLeave: {
    total: number;
    used: number;
    balance: number;
  };
  casualLeave: {
    total: number;
    used: number;
    balance: number;
  };
  maternityLeave?: {
    total: number;
    used: number;
    balance: number;
  };
  paternityLeave?: {
    total: number;
    used: number;
    balance: number;
  };
  unpaidLeave: {
    used: number;
  };
  lastUpdated: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Compensatory';

export const LEAVE_TYPES = {
  ANNUAL: { label: 'Annual Leave', color: 'success', icon: '🏖️' },
  SICK: { label: 'Sick Leave', color: 'info', icon: '🏥' },
  CASUAL: { label: 'Casual Leave', color: 'primary', icon: '🎉' },
  MATERNITY: { label: 'Maternity Leave', color: 'secondary', icon: '🤰' },
  PATERNITY: { label: 'Paternity Leave', color: 'primary', icon: '👨‍👧' },
  UNPAID: { label: 'Unpaid Leave', color: 'default', icon: '💼' },
  COMPENSATORY: { label: 'Compensatory Leave', color: 'warning', icon: '⚖️' }
};

export const LEAVE_STATUS = {
  PENDING: { label: 'Pending', color: 'warning', icon: '⏳' },
  APPROVED: { label: 'Approved', color: 'success', icon: '✅' },
  REJECTED: { label: 'Rejected', color: 'error', icon: '❌' },
  ESCALATED: { label: 'Escalated', color: 'info', icon: '📤' },
  CANCELLED: { label: 'Cancelled', color: 'default', icon: '🚫' }
};

export const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Support', 'Product', 'Design'
];

export const LOCATIONS = [
  'Bangalore', 'Delhi', 'Mumbai', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Remote'
];

// Helper functions
export const calculateLeaveDays = (startDate: string, endDate: string, holidays: string[] = []): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let days = 0;
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    // Skip weekends
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = d.toISOString().split('T')[0];
      // Skip holidays
      if (!holidays.includes(dateStr)) {
        days++;
      }
    }
  }
  
  return days;
};

export const getLeaveTypeColor = (type: LeaveType): string => {
  switch(type) {
    case 'Annual': return 'success';
    case 'Sick': return 'info';
    case 'Casual': return 'primary';
    case 'Maternity': return 'secondary';
    case 'Paternity': return 'primary';
    case 'Compensatory': return 'warning';
    default: return 'default';
  }
};

export const getStatusColor = (status: string): string => {
  switch(status) {
    case 'Pending': return 'warning';
    case 'Approved': return 'success';
    case 'Rejected': return 'error';
    case 'Escalated': return 'info';
    case 'Cancelled': return 'default';
    default: return 'default';
  }
};