export interface IFinanceReport {
  id: number;
  reportName: string;
  reportType: string;
  period: string;
  generatedBy: string;
  generationDate: string;
  status: string;
  fileSize: string;
  totalAmount: number;
  currency: string;
  recordCount: number;
  downloadCount: number;
  description?: string;
  parameters?: Record<string, any>;
  keyMetrics?: Array<{label: string; value: string; change?: number}>;
  [key: string]: any;
}

export interface IFinanceReportForm {
  reportName: string;
  reportType: string;
  format: string;
  periodType: string;
  customStartDate?: Date;
  customEndDate?: Date;
  currency: string;
  includeCharts: boolean;
  includeComparative: boolean;
  includeForecast: boolean;
  scheduleType: string;
  scheduleFrequency?: string;
  emailRecipients?: string;
  department?: string;
  profitCenter?: string;
  [key: string]: any;
}

export interface FinanceReportStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData?: IFinanceReport | null;
}

export interface FinanceReportDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData?: IFinanceReport | null;
}