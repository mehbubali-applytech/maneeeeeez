export interface SessionResponseData {
  user: User;
  company: Company | null;
}

export interface User {
  user_id: number;
  username: string;
  role: string;
}

export interface Company {
  client_id: number;
  company_name: string;
  GSTIN: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  contract_start_date: string; // ISO date
  contract_end_date: string;   // ISO date
  company_details: CompanyDetails;
}

export interface CompanyDetails {
  address: Address;
  tax_id: string;
  bank_details: BankDetails;
  payment_terms: string;
  access_level: string;
  role_name: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface BankDetails {
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  ifsc_code: string;
  branch_name: string;
  account_type: string;
}
