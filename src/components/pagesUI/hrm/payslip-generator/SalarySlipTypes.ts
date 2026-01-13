// app/hr/salary-slip/SalarySlipTypes.ts (Updated)
import { ISalaryComponent, ISalaryGrade } from "../../owner/grade/SalaryGradeTypes";

export interface IEmployeeSalaryInfo {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  bankAccount: string;
  bankName: string;
  bankIFSC: string;
  panNumber?: string;
  uanNumber?: string;
  salaryGradeId: string;
  salaryGrade: ISalaryGrade;
  basicSalary: number;
  grossSalary: number;
  ctc: number;
}

export interface IAttendanceInfo {
  totalWorkingDays: number;
  presentDays: number;
  paidLeaves: number;
  unpaidLeaves: number;
  holidays: number;
  overtimeHours: number;
  lateDays: number;
  earlyDepartures: number;
}

export interface ISalaryCalculation {
  month: string;
  year: number;
  basic: number;
  hra: number;
  da: number;
  specialAllowance: number;
  conveyance: number;
  medical: number;
  lta: number;
  otherAllowances: number;
  totalEarnings: number;
  
  // Deductions
  pf: number;
  esic: number;
  professionalTax: number;
  tds: number;
  loanAdvance: number;
  otherDeductions: number;
  totalDeductions: number;
  
  netSalary: number;
  inWords: string;
}

export interface ISalarySlipData {
  slipId: string;
  employeeInfo: IEmployeeSalaryInfo;
  attendance: IAttendanceInfo;
  calculation: ISalaryCalculation;
  components: ISalaryComponent[];
  generatedOn: string;
  generatedBy: string;
  paymentDate: string;
  remarks?: string;
}

export interface ISalarySlipForm {
  employeeId: string;
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  paidLeaves: number;
  holidays: number;
  overtimeHours: number;
  adjustments?: {
    bonus?: number;
    incentive?: number;
    advanceDeduction?: number;
    otherAdjustments?: number;
    remarks?: string;
  };
}

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero Rupees';
  
  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };
  
  return convert(Math.floor(num)) + ' Rupees Only';
};

export const calculateDays = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
};

export const getMonthList = (): Array<{value: number, label: string}> => {
  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month,
      label: getMonthName(month)
    };
  });
};

export const getYearList = (yearsBack: number = 2, yearsForward: number = 2): Array<{value: number, label: string}> => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let i = -yearsBack; i <= yearsForward; i++) {
    const year = currentYear + i;
    years.push({
      value: year,
      label: year.toString()
    });
  }
  
  return years;
};