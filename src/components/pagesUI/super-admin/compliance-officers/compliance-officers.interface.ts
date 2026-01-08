export interface IComplianceOfficer {
  [key: string]: any;
  id: number;
  officerName: string;
  officerCode: string;
  department: string;
  company: string;
  companyId?: string;
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
  managedAudits: number;
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
  complianceScore: number;
  tag: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IComplianceOfficerForm {
  officerName: string;
  officerCode: string;
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
  managedAudits: number;
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
  complianceScore: number;
  tag: string;
  notes?: string;
}

export interface ComplianceOfficerDetailsStatePropsType {
  open: boolean;
  setOpen: (open: boolean) => void;
  complianceOfficerData: IComplianceOfficer | null;
}