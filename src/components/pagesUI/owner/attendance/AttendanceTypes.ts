// AttendanceTypes.ts
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
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  supportingDocuments?: string[];
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