export interface IDepartment {
  id: number;
  departmentName: string;
  departmentCode: string;
  departmentType: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  location: string;
  creationDate: string;
  status: string;
  employeeCount: number;
  budget: number;
  actualSpending: number;
  currency: string;
  projectsCount: number;
  description?: string;
  keyMetrics?: Array<{label: string; value: string; change?: number}>;
  [key: string]: any;
}

export interface IDepartmentForm {
  departmentName: string;
  departmentCode: string;
  departmentType: string;
  managerId: string;
  location: string;
  description: string;
  budget: number;
  currency: string;
  parentDepartment?: string;
  startDate: Date;
  status: string;
  emailDomain: string;
  phoneExtension: string;
  teamLeadIds: string[];
  workingHours: string;
  officeAddress: string;
  [key: string]: any;
}

export interface DepartmentStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  departmentData?: IDepartment | null;
}

export interface DepartmentDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  departmentData?: IDepartment | null;
}