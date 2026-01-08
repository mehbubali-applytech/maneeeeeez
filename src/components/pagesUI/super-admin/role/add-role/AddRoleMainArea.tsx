"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Paper,
  Divider,
  Chip,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
  Autocomplete,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Badge,
  Tooltip,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Save,
  Cancel,
  Delete,
  AssignmentInd,
  ExpandMore,
  ExpandLess,
  CheckBoxOutlineBlank,
  CheckBox,
  Group,
  Visibility,
  Edit,
  Delete as DeleteIcon,
  CheckCircle,
  Warning,
  Lock,
  Security,
  Info,
} from "@mui/icons-material";

// Types
interface IRoleForm {
  roleName: string;
  roleCode: string;
  description: string;
  defaultSalaryGrade: string;
  isActive: boolean;
  permissions: string[];
}

interface PermissionGroup {
  category: string;
  badge: string;
  badgeColor: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default";
  permissions: {
    id: string;
    label: string;
    description: string;
  }[];
}

interface Role {
  roleId: string;
  roleName: string;
  roleCode: string;
  description: string;
  defaultSalaryGrade: string;
  isActive: boolean;
  permissions: string[];
  assignedUsers: number;
}

// Mock data
const salaryGrades = [
  { value: "G1", label: "Grade 1 (Entry Level)" },
  { value: "G2", label: "Grade 2 (Junior)" },
  { value: "G3", label: "Grade 3 (Intermediate)" },
  { value: "G4", label: "Grade 4 (Senior)" },
  { value: "G5", label: "Grade 5 (Lead)" },
  { value: "G6", label: "Grade 6 (Manager)" },
  { value: "G7", label: "Grade 7 (Director)" },
  { value: "G8", label: "Grade 8 (Executive)" },
];

const permissionGroups: PermissionGroup[] = [
  {
    category: "Attendance",
    badge: "Core",
    badgeColor: "primary",
    permissions: [
      { id: "att_view", label: "View Attendance", description: "View team attendance records" },
      { id: "att_edit", label: "Edit Attendance", description: "Modify attendance entries" },
      { id: "att_approve", label: "Approve Attendance", description: "Approve attendance requests" },
      { id: "att_reports", label: "Attendance Reports", description: "Generate attendance reports" },
    ],
  },
  {
    category: "Leave",
    badge: "Core",
    badgeColor: "primary",
    permissions: [
      { id: "leave_view", label: "View Leave", description: "View leave applications" },
      { id: "leave_apply", label: "Apply Leave", description: "Submit leave requests" },
      { id: "leave_approve", label: "Approve Leave", description: "Approve/reject leave requests" },
      { id: "leave_manage", label: "Manage Leave", description: "Manage leave types and policies" },
    ],
  },
  {
    category: "Payroll",
    badge: "Finance",
    badgeColor: "success",
    permissions: [
      { id: "pay_view", label: "View Payroll", description: "View payroll information" },
      { id: "pay_edit", label: "Edit Payroll", description: "Modify payroll data" },
      { id: "pay_process", label: "Process Payroll", description: "Run payroll processing" },
      { id: "pay_approve", label: "Approve Payroll", description: "Approve payroll runs" },
    ],
  },
  {
    category: "Compliance",
    badge: "Legal",
    badgeColor: "warning",
    permissions: [
      { id: "comp_view", label: "View Compliance", description: "View compliance records" },
      { id: "comp_edit", label: "Edit Compliance", description: "Update compliance data" },
      { id: "comp_reports", label: "Compliance Reports", description: "Generate compliance reports" },
    ],
  },
  {
    category: "Admin",
    badge: "Admin",
    badgeColor: "error",
    permissions: [
      { id: "admin_users", label: "Manage Users", description: "Add/edit/delete users" },
      { id: "admin_roles", label: "Manage Roles", description: "Create/edit roles and permissions" },
      { id: "admin_settings", label: "System Settings", description: "Modify system settings" },
      { id: "admin_audit", label: "Audit Logs", description: "View system audit logs" },
    ],
  },
  {
    category: "Reports",
    badge: "Analytics",
    badgeColor: "info",
    permissions: [
      { id: "rep_view", label: "View Reports", description: "Access all reports" },
      { id: "rep_generate", label: "Generate Reports", description: "Create custom reports" },
      { id: "rep_export", label: "Export Reports", description: "Export reports to various formats" },
    ],
  },
  {
    category: "Employee Management",
    badge: "HR",
    badgeColor: "secondary",
    permissions: [
      { id: "emp_view", label: "View Employees", description: "View employee profiles" },
      { id: "emp_edit", label: "Edit Employees", description: "Modify employee information" },
      { id: "emp_create", label: "Create Employees", description: "Add new employees" },
      { id: "emp_delete", label: "Delete Employees", description: "Remove employees from system" },
    ],
  },
];

const AddEditRole: React.FC<{ isEdit?: boolean; roleId?: string }> = ({
  isEdit = false,
  roleId
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignUsersOpen, setAssignUsersOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<IRoleForm>({
    defaultValues: {
      roleName: "",
      roleCode: "",
      description: "",
      defaultSalaryGrade: "",
      isActive: true,
      permissions: [],
    },
  });

  // Watch values
  const watchRoleName = watch("roleName");
  const watchIsActive = watch("isActive");
  const watchPermissions = watch("permissions");

  // Select all permissions in a category
  const selectAllInCategory = (category: string) => {
    const group = permissionGroups.find(g => g.category === category);
    if (!group) return;

    const currentPermissions = watchPermissions || [];
    const groupPermissionIds = group.permissions.map(p => p.id);
    const allSelected = groupPermissionIds.every(id => currentPermissions.includes(id));

    if (allSelected) {
      // Deselect all
      const newPermissions = currentPermissions.filter(id => !groupPermissionIds.includes(id));
      setValue("permissions", newPermissions);
    } else {
      // Select all
      const newPermissions = Array.from(new Set([...currentPermissions, ...groupPermissionIds]));
      setValue("permissions", newPermissions);
    }
  };

  // Select all permissions
  const selectAllPermissions = () => {
    const allPermissionIds = permissionGroups.flatMap(group =>
      group.permissions.map(p => p.id)
    );
    const currentPermissions = watchPermissions || [];

    if (currentPermissions.length === allPermissionIds.length) {
      // Deselect all
      setValue("permissions", []);
    } else {
      // Select all
      const newPermissions = Array.from(new Set([...currentPermissions, ...allPermissionIds]));
      setValue("permissions", newPermissions);
    }
  };

  const onSubmit = async (data: IRoleForm) => {
    // Validate required fields
    if (!data.roleName.trim()) {
      toast.error("Role Name is required");
      return;
    }

    const permissions = data.permissions || [];
    if (permissions.length === 0) {
      toast.error("At least one permission must be selected");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const payload = {
        ...data,
        permissions: permissions,
        roleId: isEdit ? roleId : `role_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedUsers: isEdit ? 0 : 0,
      };

      console.log("Role Payload:", payload);

      toast.success(
        isEdit
          ? "Role updated successfully!"
          : "Role created successfully!"
      );

      setTimeout(() => {
        router.push("/super-admin/role");
      }, 1000);

    } catch (error) {
      toast.error("Failed to save role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !roleId) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Role deleted successfully!");
      setDeleteDialogOpen(false);

      setTimeout(() => {
        router.push("/super-admin/role");
      }, 500);

    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        router.push("/super-admin/role");
      }
    } else {
      router.push("/super-admin/role");
    }
  };

  const handleAssignUsers = () => {
    setAssignUsersOpen(true);
  };

  // Load data for edit mode (mock)
  useEffect(() => {
    if (isEdit && roleId) {
      // Mock loading data
      const mockData: IRoleForm = {
        roleName: "HR Manager",
        roleCode: "HRMGR",
        description: "Manages HR operations including recruitment, employee relations, and compliance.",
        defaultSalaryGrade: "G6",
        isActive: true,
        permissions: [
          "att_view",
          "att_edit",
          "att_reports",
          "leave_view",
          "leave_approve",
          "pay_view",
          "comp_view",
          "comp_reports",
          "emp_view",
          "emp_edit",
          "rep_view",
        ],
      };
      reset(mockData);
      setSelectedPermissions(mockData.permissions);
    }
  }, [isEdit, roleId, reset]);

  // Update selectedPermissions when form value changes
  useEffect(() => {
    const subscription = watch((value) => {
      const permissions = value.permissions || [];
      setSelectedPermissions(permissions as string[]);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Calculate total permissions count
  const allPermissionIds = permissionGroups.flatMap(group => group.permissions.map(p => p.id));
  const currentPermissions = watchPermissions || [];
  const isAllSelected = currentPermissions.length === allPermissionIds.length;

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/super-admin">Super Admin</Link>
            </li>
            <li className="breadcrumb-item active">
              {isEdit ? "Edit Role" : "Add Role"}
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <Security sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {isEdit ? "Edit Role" : "Create New Role"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit
                ? "Modify role permissions and details"
                : "Define a new role with specific permissions and settings"}
            </Typography>
          </Box>
        </Box>

        {isEdit && (
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            Editing role: <strong>{watchRoleName || "Unnamed Role"}</strong>
            <br />
            <small>Changes will affect all users assigned to this role.</small>
          </Alert>
        )}
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Input Fields in 2 Rows */}
        <Paper elevation={0} sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4
        }}>
          <Box sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Role Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Basic information and configuration
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {/* First Row - Basic Information */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="roleName"
                  control={control}
                  rules={{ required: "Role name is required" }}
                  render={({ field, fieldState }) => (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Role Name <span style={{ color: '#f44336' }}>*</span>
                      </Typography>
                      <TextField
                        {...field}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || "e.g., HR Manager, Finance Executive"}
                        placeholder="Enter role name"
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper'
                          }
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="roleCode"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Role Code
                      </Typography>
                      <TextField
                        {...field}
                        fullWidth
                        helperText="Internal code for reporting (e.g., HRMGR, FINEXE)"
                        placeholder="Enter role code"
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper'
                          }
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>
            </Grid>

            {/* Second Row - Configuration */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="defaultSalaryGrade"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Default Salary Grade
                      </Typography>
                      <Autocomplete
                        value={salaryGrades.find(grade => grade.value === field.value) || null}
                        onChange={(event, newValue) => {
                          field.onChange(newValue ? newValue.value : "");
                        }}
                        options={salaryGrades}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select salary grade"
                            size="medium"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: 'background.paper'
                              }
                            }}
                          />
                        )}
                        fullWidth
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Auto-assign salary range for employees
                      </Typography>
                    </Box>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Status
                  </Typography>
                  <Paper variant="outlined" sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: watchIsActive ? 'success.50' : 'grey.50',
                    borderColor: watchIsActive ? 'success.light' : 'divider'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={500} gutterBottom>
                          {watchIsActive ? "Active" : "Inactive"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {watchIsActive
                            ? "Role is available for assignment"
                            : "Role is hidden from assignment"}
                        </Typography>
                      </Box>
                      <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.value}
                                onChange={field.onChange}
                                color="success"
                                size="medium"
                              />
                            }
                            label=""
                          />
                        )}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Grid>

            {/* Description Field (Full Width) */}
            <Box sx={{ mt: 4 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Description
                    </Typography>
                    <TextField
                      {...field}
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Describe the role's main responsibilities..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'background.paper'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Optional summary of role responsibilities
                    </Typography>
                  </Box>
                )}
              />
            </Box>
          </Box>
        </Paper>

        {/* Permissions Section - Always Expanded */}
        <Paper elevation={0} sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4
        }}>
          <Box sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Permissions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select permissions to grant for this role
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={`${currentPermissions.length}/${allPermissionIds.length} selected`}
                  size="medium"
                  color={currentPermissions.length > 0 ? "primary" : "default"}
                  variant="outlined"
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={selectAllPermissions}
                  startIcon={isAllSelected ? <CheckBox /> : <CheckBoxOutlineBlank />}
                >
                  {isAllSelected ? "Deselect All" : "Select All"}
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            {currentPermissions.length === 0 && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                <Typography variant="body2">
                  At least one permission must be selected
                </Typography>
              </Alert>
            )}

            {/* Permission Grid - Always Expanded */}
            <Grid container spacing={3}>
              {permissionGroups.map((group) => {
                const groupPermissionIds = group.permissions.map(p => p.id);
                const selectedInGroup = groupPermissionIds.filter(id =>
                  currentPermissions.includes(id)
                );
                const allSelected = selectedInGroup.length === groupPermissionIds.length;

                return (
                  <Grid item xs={12} md={6} key={group.category}>
                    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                      <CardContent sx={{ p: 3, paddingLeft: 5 }}>
                        {/* Group Header */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                          pb: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Badge
                              badgeContent={group.badge}
                              color={group.badgeColor}
                              sx={{
                                '& .MuiBadge-badge': {
                                  fontSize: '0.65rem',
                                  height: 20,
                                  minWidth: 20,
                                  borderRadius: 1
                                }
                              }}
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {group.category}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={`${selectedInGroup.length}/${group.permissions.length}`}
                              size="small"
                              color={allSelected ? "success" : "default"}
                              variant="outlined"
                            />
                            <Button
                              size="small"
                              onClick={() => selectAllInCategory(group.category)}
                              startIcon={allSelected ? <CheckBox /> : <CheckBoxOutlineBlank />}
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </Button>
                          </Box>
                        </Box>

                        {/* Permissions List - Always Expanded */}
                        <FormGroup sx={{ gap: 1.5 }}>
                          {group.permissions.map((permission) => (
                            <Box
                              key={permission.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                p: 1.5,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: currentPermissions.includes(permission.id) ? 'primary.50' : 'transparent',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: currentPermissions.includes(permission.id) ? 'primary.100' : 'grey.50',
                                  borderColor: currentPermissions.includes(permission.id) ? 'primary.main' : 'divider',
                                }
                              }}
                            >
                              <Controller
                                name="permissions"
                                control={control}
                                render={({ field }) => {
                                  const fieldValue = field.value || [];
                                  const isChecked = fieldValue.includes(permission.id);

                                  return (
                                    <Checkbox
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const newValue = e.target.checked
                                          ? [...fieldValue, permission.id]
                                          : fieldValue.filter((id: string) => id !== permission.id);
                                        field.onChange(newValue);
                                      }}
                                      sx={{
                                        mr: 2,
                                        mt: 0.5,
                                        '&.Mui-checked': {
                                          color: 'primary.main',
                                        }
                                      }}
                                    />
                                  );
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} gutterBottom>
                                  {permission.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {permission.description}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </FormGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Paper>

        {/* Tips Card */}
        <Paper elevation={0} sx={{
          border: '1px solid',
          borderColor: 'info.light',
          borderRadius: 3,
          bgcolor: 'info.50',
          p: 3,
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Info sx={{ color: 'info.main', mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'info.dark', fontWeight: 600 }}>
                Role Management Best Practices
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.800' }}>
                <li>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Role Naming:</strong> Use clear, descriptive names that reflect responsibilities
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Principle of Least Privilege:</strong> Grant only necessary permissions
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Testing:</strong> Always test new roles with a test user before deploying
                  </Typography>
                </li>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            {isEdit && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ mr: 2 }}
                >
                  Delete Role
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AssignmentInd />}
                  onClick={handleAssignUsers}
                >
                  Assign to Users
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="!text-white"
              startIcon={<Save />}
              disabled={isSubmitting}
              sx={{
                minWidth: 140,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {isSubmitting ? "Saving..." : (isEdit ? "Update Role" : "Create Role")}
            </Button>
          </Box>
        </Box>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ pb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Delete Role
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            This action cannot be undone
          </Alert>
          <DialogContentText>
            Are you sure you want to delete the role{" "}
            <strong>&quot;{watchRoleName}&quot;</strong>?
            <br /><br />
            This will remove the role from all assigned users. Consider marking as inactive instead.
          </DialogContentText>

        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ minWidth: 100 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Users Dialog */}
      <Dialog
        open={assignUsersOpen}
        onClose={() => setAssignUsersOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Assign Role to Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: <strong>{watchRoleName}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              This feature would show a list of users to assign this role to.
            </Alert>
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <AssignmentInd sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                User assignment interface would appear here
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setAssignUsersOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setAssignUsersOpen(false);
              toast.success("Users assigned successfully!");
            }}
            variant="contained"
          >
            Assign Selected Users
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddEditRole;