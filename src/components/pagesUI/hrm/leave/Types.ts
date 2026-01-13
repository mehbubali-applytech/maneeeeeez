export interface ILeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  designation: string;
  leaveType: string;
  leaveTypeCode: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: string;
  lastModified?: string;
  approverNotes?: string;
  supportingDocuments?: string[];
  contactDuringLeave?: string;
  workflowStage: number;
  totalStages: number;
  currentApprover?: string;
  previousApprovers: string[];
  emergencyContact?: string;
  leaveBalance: number;
  isHalfDay?: boolean;
  halfDayType?: 'first' | 'second';
  attachments?: { name: string; url: string }[];
}

export interface ILeaveStats {
  totalPending: number;
  pendingToday: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  avgProcessingTime: number;
  teamsWithPending: number;
}

export interface IApprovalWorkflow {
  stage: number;
  approverRole: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected';
  actionDate?: string;
  notes?: string;
}