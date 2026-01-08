// RoleTypes.ts
export interface IRole {
  [key: string]: any;
  roleId: number;
  roleName: string;
  roleCode?: string;
  description?: string;
  defaultSalaryGrade?: string;
  permissions: string[];
  activeStatus: boolean;
  assignedUsers?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPermissionGroup {
  category: string;
  badge: string;
  permissions: {
    id: string;
    label: string;
    description?: string;
  }[];
}

export const PERMISSION_GROUPS: IPermissionGroup[] = [
  {
    category: "Attendance",
    badge: "Core",
    permissions: [
      { id: "attendance_view", label: "View Attendance" },
      { id: "attendance_edit", label: "Edit Attendance" },
      { id: "attendance_approve", label: "Approve Attendance" },
      { id: "attendance_delete", label: "Delete Attendance" }
    ]
  },
  {
    category: "Leave",
    badge: "Core",
    permissions: [
      { id: "leave_view", label: "View Leave" },
      { id: "leave_apply", label: "Apply Leave" },
      { id: "leave_approve", label: "Approve Leave" },
      { id: "leave_manage", label: "Manage Leave Policies" }
    ]
  },
  {
    category: "Payroll",
    badge: "Finance",
    permissions: [
      { id: "payroll_view", label: "View Payroll" },
      { id: "payroll_process", label: "Process Payroll" },
      { id: "payroll_approve", label: "Approve Payroll" },
      { id: "payroll_reports", label: "Payroll Reports" }
    ]
  },
  {
    category: "Compliance",
    badge: "Admin",
    permissions: [
      { id: "compliance_view", label: "View Compliance" },
      { id: "compliance_edit", label: "Edit Compliance" },
      { id: "compliance_reports", label: "Compliance Reports" }
    ]
  },
  {
    category: "Admin",
    badge: "Admin",
    permissions: [
      { id: "admin_users", label: "Manage Users" },
      { id: "admin_roles", label: "Manage Roles" },
      { id: "admin_settings", label: "System Settings" }
    ]
  },
  {
    category: "Reports",
    badge: "Admin",
    permissions: [
      { id: "reports_view", label: "View Reports" },
      { id: "reports_generate", label: "Generate Reports" },
      { id: "reports_export", label: "Export Reports" }
    ]
  },
  {
    category: "Performance",
    badge: "HR",
    permissions: [
      { id: "performance_view", label: "View Performance" },
      { id: "performance_manage", label: "Manage Reviews" },
      { id: "performance_approve", label: "Approve Reviews" }
    ]
  },
  {
    category: "Recruitment",
    badge: "HR",
    permissions: [
      { id: "recruitment_view", label: "View Recruitment" },
      { id: "recruitment_manage", label: "Manage Candidates" },
      { id: "recruitment_approve", label: "Approve Hiring" }
    ]
  }
];

export const SALARY_GRADES = [
  "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10",
  "M1", "M2", "M3", "M4", "M5",
  "E1", "E2", "E3", "E4", "E5"
];

export interface IRoleForm {
  roleName: string;
  roleCode?: string;
  description?: string;
  defaultSalaryGrade?: string;
  activeStatus: boolean;
  permissions: string[];
}

// Or you can use Partial<IRole> for form data
export type IRoleFormData = Partial<IRole>;