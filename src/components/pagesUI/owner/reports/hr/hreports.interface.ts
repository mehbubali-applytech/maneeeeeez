export interface IHrReport {
  id: number;
  reportName: string;
  reportType: string;
  generatedBy: string;
  generationDate: string;
  period: string;
  status: string;
  fileSize: string;
  recordCount: number;
  downloadCount: number;
  description?: string;
  parameters?: Record<string, any>;
  [key: string]: any;
}

export interface IReportForm {
  reportName: string;
  reportType: string;
  format: string;
  dateRange: string;
  customStartDate?: Date;
  customEndDate?: Date;
  department?: string;
  includeCharts: boolean;
  includeDetails: boolean;
  scheduleType: string;
  scheduleFrequency?: string;
  emailRecipients?: string;
  [key: string]: any;
}

export interface reportStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData?: IHrReport | null;
}

export interface reportDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData?: IHrReport | null;
}