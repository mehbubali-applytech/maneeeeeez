export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface ILeave {
  id: number;
  [key: string]: any;
  leaveId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
  appliedOn: string;
  status: LeaveStatus;
}
