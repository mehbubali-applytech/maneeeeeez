import { StaticImageData } from "next/image";

export interface ICompany {
  [key: string]: any;

  id: number;
  name: string;
  location: string; 
  phone?: string;
  mobile?: string;
  fax?: string;
  websites?: string;
  industry?: string;
  currencyType?: string;
  source?: string;
  description?: string;
  language?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  state?: string;
  address?: string;
  email: string;
  owner: string;
  rating: number;
  tag: string; 
  status: "Active" | "Inactive" | "Pending";
  companyImg?: StaticImageData;
  
  // Additional optional fields
  employees?: number;
  departments?: number;
  projects?: number;
  revenue?: number;
  established?: string;
  licenseNumber?: string;
  taxId?: string;
}

export interface ICompanyForm {
  name: string;
  email: string;
  phone: string;
  mobile?: string;
  fax?: string;
  websites: string;
  industry: string;
  currencyType: string;
  source: string;
  description: string;
  language: string;
  country: string;
  city: string;
  zipCode: string;
  state: string;
  address: string;
  owner: string;
  rating: number;
  tag: string;
  status: "Active" | "Inactive" | "Pending";
  employees?: number;
  departments?: number;
  projects?: number;
  revenue?: number;
  established: string;
  licenseNumber?: string;
  taxId?: string;
  [key: string]: any;
}

export interface CompanyStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  companyData?: ICompany | null;
}

export interface CompanyDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  companyData?: ICompany | null;
}