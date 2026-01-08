export interface IVendor {
  id: number;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  vendorType: string;
  status: string;
  totalPurchases: number;
  outstandingBalance: number;
  lastTransaction: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  notes?: string;
  [key: string]: any;
}

export interface IVendorForm {
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  vendorType: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  paymentTerms: string;
  creditLimit: number;
  notes: string;
  [key: string]: any;
}

export interface vendorStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData?: IVendor | null;
}

export interface vendorDetailsStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData?: IVendor | null;
}