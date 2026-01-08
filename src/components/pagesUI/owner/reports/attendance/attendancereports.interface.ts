export interface IAttendanceReport {
  id: number;
  reportName: string;
  reportType: string;
  period: string;
  generatedBy: string;
  generationDate: string;
  status: string;
  fileSize: string;
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  earlyLeaveCount: number;
  leaveCount: number;
  averageHours: number;
  overtimeHours: number;
  attendanceRate: number;
  description?: string;
  keyMetrics?: Array<{label: string; value: string; change?: number}>;
  parameters?: Record<string, any>;
  [key: string]: any;
}

export interface IAttendanceReportForm {
  reportName: string;
  reportType: string;
  format: string;
  periodType: string;
  customStartDate?: Date;
  customEndDate?: Date;
  includeDepartments: boolean;
  includeEmployees: boolean;
  includeSummary: boolean;
  includeCharts: boolean;
  includeComparative: boolean;
  exportType: string;
  scheduleType: string;
  scheduleFrequency?: string;
  emailRecipients?: string;
  selectedDepartments: string[];
  selectedEmployees: string[];
  attendanceMetrics: string[];
  [key: string]: any;
}

export interface AttendanceReportStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData?: IAttendanceReport | null;
}

export interface AttendanceReportDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData?: IAttendanceReport | null;
}