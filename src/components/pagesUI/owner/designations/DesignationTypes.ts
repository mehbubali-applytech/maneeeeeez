export interface IDesignation {
  id: number;
  [key: string]: any;
  designationId: string;
  name: string;
  description?: string;
  created_at: string;
  status: "Active" | "Inactive";
}
