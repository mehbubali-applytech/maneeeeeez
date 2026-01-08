export interface IStaff {
  [key: string]: any;
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  mobile?: string;
  position: string;
  department: string;
  company: string;
  companyId: number;
  location: string;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave" | "Terminated";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  salary: number;
  currency: string;
  supervisor?: string;
  profileImage?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  emergencyContact?: string;
  skills?: string[];
  education?: string;
  experience?: number;
  performanceRating?: number;
  attendanceRate?: number;
  projectsCompleted?: number;
  lastLogin?: string;
  notes?: string;
}

export interface IStaffForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  position: string;
  department: string;
  company: string;
  companyId: number;
  location: string;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave" | "Terminated";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  salary: number;
  currency: string;
  supervisor?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  emergencyContact?: string;
  skills?: string[];
  education?: string;
  experience?: number;
  notes?: string;
  [key: string]: any;
}

export interface StaffStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  staffData?: IStaff | null;
}

export interface StaffDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  staffData?: IStaff | null;
}