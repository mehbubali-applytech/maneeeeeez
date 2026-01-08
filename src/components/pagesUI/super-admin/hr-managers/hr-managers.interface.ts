export interface IHrManager {
  [key: string]: any;
  id: number;
  hrName: string;
  hrCode: string;
  department: string;
  company: string;
  companyId?: string;
  email: string;
  phone: string;
  mobile?: string;
  extension?: string;
  jobTitle: string;
  location: string;
  status: "Active" | "Inactive" | "On Leave" | "Pending";
  hireDate: string;
  yearsOfExperience: number;
  qualifications: string[];
  certifications?: string[];
  specializations: string[];
  managedEmployees: number;
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
  rating: number;
  tag: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHrManagerForm {
  hrName: string;
  hrCode: string;
  department: string;
  company: string;
  email: string;
  phone: string;
  mobile?: string;
  extension?: string;
  jobTitle: string;
  location: string;
  status: "Active" | "Inactive" | "On Leave" | "Pending";
  hireDate: string;
  yearsOfExperience: number;
  qualifications: string[];
  certifications?: string[];
  specializations: string[];
  managedEmployees: number;
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
  rating: number;
  tag: string;
  notes?: string;
}

export interface HrManagerDetailsStatePropsType {
  open: boolean;
  setOpen: (open: boolean) => void;
  hrManagerData: IHrManager | null;
}