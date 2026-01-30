import { StaticImageData } from "next/image";

export interface ICompany {
  [key: string]: any;
  id: number;
  company_name: string;
  GSTIN?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  company_details?: {
    industry_type?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postal_code?: string;
    };
    tax_id?: string;
    bank_details?: {
      bank_name?: string;
      account_number?: string;
      account_holder_name?: string;
      ifsc_code?: string;
      branch_name?: string;
      account_type?: string;
    };
    payment_terms?: string;
    role_name?: "Super Admin" | "Owner" | "Admin";
    [key: string]: any;
  };
  contract_start_date: string;
  contract_end_date?: string;
  status: "Active" | "Inactive" | "Suspended" | "Pending";
  created_at: string;
  updated_at: string;
  
  // Legacy fields for backward compatibility
  name?: string;
  location?: string;
  email?: string;
  owner?: string;
  rating?: number;
  tag?: string;
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
  companyImg?: StaticImageData;
  employees?: number;
  departments?: number;
  projects?: number;
  revenue?: number;
  established?: string;
  licenseNumber?: string;
  taxId?: string;
}

export interface ICompanyForm {
  // Company Details
  company_name: string;
  GSTIN?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  
  // Company Details JSON fields
  industry_type?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  tax_id?: string;
  
  // Bank Details
  bank_name?: string;
  account_number?: string;
  account_holder_name?: string;
  ifsc_code?: string;
  branch_name?: string;
  account_type?: string;
  
  // Other
  payment_terms?: string;
  role_name?: "Super Admin" | "Owner" | "Admin";
  
  // Contract Dates
  contract_start_date: string;
  contract_end_date?: string;
  
  // Status
  status: "Active" | "Inactive" | "Suspended" | "Pending";
  
  // Additional fields
  logo: File | null;
  logoPreview: string;
  notes: string;
  acceptTerms: boolean;
  sendActivationEmail: boolean;
  finalComments: string;
  
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

interface PinCodeResponseItem {
  Message: string;
  Status: string;
  PostOffice: Array<{
    Name: string;
    Description: string;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
  }>;
}