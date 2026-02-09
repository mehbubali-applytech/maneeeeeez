export interface IAttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  shiftId: number;
  shiftName: string;
  shiftStartTime: string;
  shiftEndTime: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLocation?: string;
  checkOutLocation?: string;
  totalHours?: number;
  attendanceStatus: 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'On Leave';
  lateMinutes?: number;
  correctionRequest?: {
    status: 'Pending' | 'Approved' | 'Rejected';
    requestedBy: string;
    requestedAt: string; 
    reason: string;
    correctedCheckIn?: string;
    correctedCheckOut?: string;
    approvedBy?: string;
    approvedAt?: string;
    notes?: string;
  };
  isManualEntry: boolean;
  manualOverrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendanceCorrectionRequest {
  id: string;
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  currentCheckIn?: string;
  currentCheckOut?: string;
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  type: 'Missing In' | 'Missing Out' | 'Incorrect Time' | 'Absent';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  supportingDocuments?: string[];
  attachmentUrl?: string;
}

export interface IAttendanceSummary {
  employeeId: string;
  employeeName: string;
  department: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  leavesTaken: number;
  totalWorkHours: number;
  averageHoursPerDay: number;
}

export interface ICompanyAttendanceSummary {
  client_id: number;
  date: string; // YYYY-MM-DD

  totalEmployees: number;
  present: number;
  absent: number;
  late: number;

  attendanceRate: number; // percentage (0–100)

  totalWorkedMinutes: number;
  totalWorkedHours: number; // decimal hours (e.g. 720.83)
}


// Mock data
export const ATTENDANCE_STATUS = {
  PRESENT: { label: 'Present', color: 'success', icon: '✓' },
  ABSENT: { label: 'Absent', color: 'error', icon: '✗' },
  LATE: { label: 'Late', color: 'warning', icon: '⏰' },
  HALF_DAY: { label: 'Half-Day', color: 'info', icon: '½' },
  ON_LEAVE: { label: 'On Leave', color: 'default', icon: '🏖️' }
};

export const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Support'
];

export const SHIFTS = [
  { id: 1, name: 'Morning Shift', startTime: '09:00', endTime: '18:00' },
  { id: 2, name: 'Evening Shift', startTime: '14:00', endTime: '22:00' },
  { id: 3, name: 'Night Shift', startTime: '21:00', endTime: '06:00' },
  { id: 4, name: 'Flexi Shift', startTime: '10:00', endTime: '19:00' }
];

export const CORRECTION_TYPES = [
  { value: 'Missing In', label: 'Missing Check-In' },
  { value: 'Missing Out', label: 'Missing Check-Out' },
  { value: 'Incorrect Time', label: 'Incorrect Time' },
  { value: 'Absent', label: 'Marked Absent' }
];

// Helper functions
export const calculateTotalHours = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  
  const start = new Date(`2000-01-01T${checkIn}`);
  const end = new Date(`2000-01-01T${checkOut}`);
  
  // Handle next day check-out (for night shifts)
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

export const calculateLateMinutes = (checkIn: string, shiftStart: string, gracePeriod: number = 15): number => {
  if (!checkIn) return 0;
  
  const checkInTime = new Date(`2000-01-01T${checkIn}`);
  const shiftStartTime = new Date(`2000-01-01T${shiftStart}`);
  const graceTime = new Date(shiftStartTime.getTime() + gracePeriod * 60000);
  
  if (checkInTime > graceTime) {
    return Math.round((checkInTime.getTime() - graceTime.getTime()) / 60000);
  }
  
  return 0;
};

export const determineAttendanceStatus = (
  checkIn?: string,
  checkOut?: string,
  shiftStart?: string,
  shiftEnd?: string,
  gracePeriod: number = 15
): string => {
  if (!checkIn && !checkOut) return 'Absent';
  
  if (checkIn && checkOut) {
    const totalHours = calculateTotalHours(checkIn, checkOut);
    if (totalHours < 4) return 'Half-Day';
    
    if (shiftStart) {
      const lateMinutes = calculateLateMinutes(checkIn, shiftStart, gracePeriod);
      if (lateMinutes > 0) return 'Late';
    }
    
    return 'Present';
  }
  
  // Only check-in or only check-out
  return 'Half-Day';
};

export interface IHRManualEditData {
  attendanceId: string;
  date: string;
  employeeName: string;
  checkInTime: string;
  checkOutTime: string;
  overrideReason: string;
  changedBy: string;
  changedAt: string;
}


export interface ICorrectedAttendance {
  corrected_attendance_id: number;
  employee_id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  designation: string;
  attendance_date: string;
  check_in: string;
  check_out: string;
  shift_id: number;
  location?: string;
  source: string;
  reason: string;
  status: 'Need Approval' | 'Approved' | 'Rejected';
  approved_by?: number;
  approved_at?: string;
  actions: any;
  created_at: string;
  updated_at: string;
}

export interface ICorrectionRequestPayload {
  attendance_id?: number;
  employee_id: number;
  attendance_date: string;
  check_in_time: string;
  check_out_time: string;
  shift_id: number;
  location?: string;
  reason: string;
  source?: string;
}

export interface ICorrectionActionPayload {
  corrected_attendance_id: number;
  status: 'Approved' | 'Rejected';
  approved_by: number;
  notes?: string;
}

export interface IAbsentCorrectionPayload {
  employee_id: number;
  attendance_date: string;
  shift_id: number;
  check_in_time: string;
  check_out_time: string;
  location?: string;
  reason: string;
  source?: string;
}


export interface ILeaveRequest {
  leave_id: number;
  employee_id: number;
  employee_code: string;
  employee_name: string;
  designation: string;
  department: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approved_by?: number;
  approved_by_name?: string;
  approved_on?: string;
  created_at: string;
  updated_at: string;
  duration_days?: number;
  applied_on?: string;
  applier?: {
    user_id: number;
    username: string;
    employee_code: string;
  };
  approver?: {
    user_id: number;
    username: string;
    employee_code: string;
  };
}

export interface ILeaveBalance {
  employee_id: number;
  employee_name: string;
  leave_balances: {
    leave_type: number;
    leave_identifier: string;
    leave_type_name: string;
    consumed: number;
    total: number;
    balance: number;
  }[];
}

export interface ILeavePolicy {
  id: number;
  leave_identifier: string;
  leave_type: string;
  no_of_days: number;
  description?: string;
  is_active: boolean;
}

export interface ILeaveStats {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  onLeaveToday: number;
}