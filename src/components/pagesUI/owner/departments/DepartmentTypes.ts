// DepartmentTypes.ts
export interface IDepartment {
  // Backend fields
  dept_id: number;
  client_id: number;
  dept_name: string;
  status: string; // '0' = Inactive, '1' = Active
  parent_id: number | null;
  is_parent: number; // 0 or 1
  created_at: string;
  
  // Frontend display fields
  id: number; // Alias for dept_id
  departmentName: string; // Alias for dept_name
  statusText: string; // 'Active' or 'Inactive'
  children?: IDepartment[];
  level?: number; // For indentation in table
  [key: string]: any;
}

export interface DepartmentFormData {
  dept_name: string;
  status?: string;
  is_parent?: number;
  sub_departments?: SubDepartmentFormData[];
}

export interface SubDepartmentFormData {
  dept_name: string;
  status?: string;
  temp_id?: string; // For frontend only
  dept_id?: number; // For existing sub-departments during update
}

export interface DepartmentStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  departmentData?: IDepartment | null;
}

// Extended types for update operations
export interface ExtendedSubDepartmentFormData extends SubDepartmentFormData {
  dept_id?: number;
}

export interface ExtendedDepartmentFormData extends Omit<DepartmentFormData, 'sub_departments'> {
  sub_departments?: ExtendedSubDepartmentFormData[];
}