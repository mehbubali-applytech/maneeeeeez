export interface IFinanceExecutive {
  [key: string]: any;
  id: number;
  executiveName: string;
  executiveCode: string;
  department: string;
  company: string;
  companyId?: string; // Add companyId
  email: string;
  phone: string;
  mobile?: string;
  extension?: string;
  jobTitle: string;
  role: string;
  location: string;
  status: "Active" | "Inactive" | "On Leave" | "Pending";
  hireDate: string;
  yearsOfExperience: number;
  qualifications: string[];
  certifications?: string[];
  specializations: string[];
  managedBudget: number;
  reportingTo?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed";
  emergencyContact?: string;
  emergencyPhone?: string;
  profileImage?: string;
  accuracyRating: number;
  tag: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFinanceExecutiveForm {
  executiveName: string;
  executiveCode: string;
  department: string;
  company: string;
  email: string;
  phone: string;
  mobile?: string;
  extension?: string;
  jobTitle: string;
  role: string;
  location: string;
  status: "Active" | "Inactive" | "On Leave" | "Pending";
  hireDate: string;
  yearsOfExperience: number;
  qualifications: string[];
  certifications?: string[];
  specializations: string[];
  managedBudget: number;
  reportingTo?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed";
  emergencyContact?: string;
  emergencyPhone?: string;
  profileImage?: string;
  accuracyRating: number;
  tag: string;
  notes?: string;
}

export interface FinanceExecutiveDetailsStatePropsType {
  open: boolean;
  setOpen: (open: boolean) => void;
  financeExecutiveData: IFinanceExecutive | null;
}