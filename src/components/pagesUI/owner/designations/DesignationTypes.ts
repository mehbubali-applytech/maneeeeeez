// DesignationTypes.ts
export interface IDesignation {
  // Backend fields
  designation_id: number;
  client_id: number;
  department_id: number;
  designation_name: string;
  designation_code: string;
  description?: string;
  created_at: string;
  
  // Frontend display fields
  id: number; // Alias for designation_id
  name: string; // Alias for designation_name
  designationId: string; // Alias for designation_code
  status: string; // Not in backend but added for consistency
  departmentName?: string; // From include
  
  // For form
  department?: {
    dept_id: number;
    dept_name: string;
  };
  
  // Index signature to satisfy RowObject constraint
  [key: string]: any;
}

export interface DesignationFormData {
  department_id: number;
  designation_name: string;
  designation_code: string;
  description?: string;
}

export interface DesignationStatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  designationData?: IDesignation | null;
}