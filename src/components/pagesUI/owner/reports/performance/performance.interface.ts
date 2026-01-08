export interface IPerformanceReport {
  id: number;
  reportName: string;
  reportType: string;
  generatedBy: string;
  generationDate: string;
  evaluationPeriod: string;
  status: string;
  fileSize: string;
  employeeCount: number;
  department?: string;
  averageScore?: number;
  downloadCount: number;
  description?: string;
  parameters?: Record<string, any>;
  keyMetrics?: Array<{label: string; value: string | number; change?: number; target?: number}>;
  [key: string]: any;
}

export interface IPerformanceReportForm {
  reportName: string;
  reportType: string;
  format: string;
  evaluationPeriod: string;
  customStartDate?: Date;
  customEndDate?: Date;
  department?: string;
  employeeLevel?: string;
  include360Feedback: boolean;
  includeCompetencies: boolean;
  includeDevelopmentPlans: boolean;
  includeComparativeData: boolean;
  ratingScale: string;
  scheduleType: string;
  scheduleFrequency?: string;
  emailRecipients?: string;
  [key: string]: any;
}

export interface PerformanceReportStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData?: IPerformanceReport | null;
}

export interface PerformanceReportDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData?: IPerformanceReport | null;
}