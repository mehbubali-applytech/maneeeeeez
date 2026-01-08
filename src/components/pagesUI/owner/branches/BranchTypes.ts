// BranchTypes.ts
export interface IBranch {
  [key: string]: any; // <-- ADD THIS
  id: number;
  branchName: string;
  branchCode?: string;
  country?: string;
  state?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  managerName?: string;
  managerEmail?: string;
  totalEmployees?: number;
  status?: "Active" | "Inactive" | "Closed";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
