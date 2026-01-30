// BranchTypes.ts
export interface IBranch {
  [key: string]: any;
  id: number;
  branch_name: string;
  branch_code?: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  manager_email?: string;
  total_employees?: number;
  is_active?: "Active" | "Inactive" | "Closed";
  created_at?: string;
  updated_at?: string;
  address?: {
    country?: string;
    state?: string;
    city?: string;
    addressLine1?: string;
    addressLine2?: string;
    zipCode?: string;
  };
}

// Helper function to map API response to component format
export const mapApiBranchToComponent = (apiBranch: any): IBranch => {
  return {
    id: apiBranch.id,
    branch_name: apiBranch.branch_name,
    branch_code: apiBranch.branch_code,
    phone: apiBranch.phone,
    email: apiBranch.email,
    manager_name: apiBranch.manager_name,
    manager_email: apiBranch.manager_email,
    total_employees: apiBranch.total_employees,
    is_active: apiBranch.is_active,
    created_at: apiBranch.created_at,
    updated_at: apiBranch.updated_at,
    address: apiBranch.address || {},
    // Aliases for backward compatibility
    branchName: apiBranch.branch_name,
    managerName: apiBranch.manager_name,
    status: apiBranch.is_active,
    country: apiBranch.address?.country,
    state: apiBranch.address?.state,
    city: apiBranch.address?.city,
    addressLine1: apiBranch.address?.addressLine1,
    addressLine2: apiBranch.address?.addressLine2,
    zipCode: apiBranch.address?.zipCode,
  };
};

// Helper function to map component format to API payload
export const mapComponentToApiBranch = (componentBranch: IBranch): any => {
  return {
    branch_name: componentBranch.branch_name || componentBranch.branchName,
    branch_code: componentBranch.branch_code,
    phone: componentBranch.phone,
    email: componentBranch.email,
    manager_name: componentBranch.manager_name || componentBranch.managerName,
    manager_email: componentBranch.manager_email,
    total_employees: componentBranch.total_employees || componentBranch.totalEmployees,
    is_active: componentBranch.is_active || componentBranch.status,
    address: {
      country: componentBranch.address?.country || componentBranch.country,
      state: componentBranch.address?.state || componentBranch.state,
      city: componentBranch.address?.city || componentBranch.city,
      addressLine1: componentBranch.address?.addressLine1 || componentBranch.addressLine1,
      addressLine2: componentBranch.address?.addressLine2 || componentBranch.addressLine2,
      zipCode: componentBranch.address?.zipCode || componentBranch.zipCode,
    }
  };
};