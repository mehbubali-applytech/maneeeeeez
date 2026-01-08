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
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
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

  // Toggle permission group expansion
  const toggleGroup = (category: string) => {
    setExpandedGroups(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

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
      // Select all - Fixed: Use Array.from to convert Set to array properly
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
        permissions: permissions, // Ensure permissions is always an array
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
        router.push("/owner/roles");
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
        router.push("/owner/roles");
      }, 500);
      
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        router.push("/admin/roles");
      }
    } else {
      router.push("/owner/roles");
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
      setSelectedPermissions(permissions as string[]); // Explicitly cast to string[]
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
                                <Link href="/owner">Owner</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                Add Role
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
          <Alert severity="info" sx={{ mt: 2 }}>
            Editing role: <strong>{watchRoleName || "Unnamed Role"}</strong>
            <br />
            <small>Changes will affect all users assigned to this role.</small>
          </Alert>
        )}
      </Box>

      {/* Form Card */}
      <Paper elevation={0} sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 2, 
        overflow: 'hidden',
        mb: 3
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
            Configure role properties and assign permissions
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 3 }}>
            {/* Two-column layout for desktop */}
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Role Name */}
                  <Controller
                    name="roleName"
                    control={control}
                    rules={{ required: "Role name is required" }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Role Name"
                        required
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || "e.g., HR Manager, Finance Executive, Software Engineer"}
                        placeholder="Enter role name"
                      />
                    )}
                  />

                  {/* Role Code */}
                  <Controller
                    name="roleCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Role Code"
                        fullWidth
                        helperText="Optional internal code for reporting (e.g., HRMGR, FINEXE, ENG1)"
                        placeholder="Enter role code"
                      />
                    )}
                  />

                  {/* Description */}
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        helperText="Optional summary of role responsibilities (max 250 characters)"
                        placeholder="Describe the role's main responsibilities..."
                        inputProps={{ maxLength: 250 }}
                      />
                    )}
                  />

                  {/* Default Salary Grade */}
                  <Controller
                    name="defaultSalaryGrade"
                    control={control}
                    render={({ field }) => (
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
                            label="Default Salary Grade"
                            helperText="Optional: Auto-assign salary range for employees"
                            placeholder="Select salary grade"
                          />
                        )}
                        fullWidth
                      />
                    )}
                  />

                  {/* Active Status */}
                  <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Active Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {watchIsActive 
                            ? "This role is active and available for assignment" 
                            : "This role is inactive and hidden from assignment"}
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
                            label={
                              <Chip
                                label={field.value ? "ACTIVE" : "INACTIVE"}
                                size="small"
                                color={field.value ? "success" : "default"}
                                variant={field.value ? "filled" : "outlined"}
                              />
                            }
                          />
                        )}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Grid>

              {/* Right Column - Permissions */}
              <Grid item xs={12} md={6}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    maxHeight: 600,
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    bgcolor: 'grey.50'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Permissions
                        <Chip
                          label="Required"
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ ml: 1, fontSize: '0.7rem' }}
                        />
                      </Typography>
                      <Button
                        size="small"
                        onClick={selectAllPermissions}
                        startIcon={isAllSelected ? 
                          <CheckBox /> : <CheckBoxOutlineBlank />}
                      >
                        {isAllSelected ? "Deselect All" : "Select All"}
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Select permissions to grant for this role
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`${currentPermissions.length} permissions selected`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {permissionGroups.map((group) => {
                      const groupPermissionIds = group.permissions.map(p => p.id);
                      const selectedInGroup = groupPermissionIds.filter(id => 
                        currentPermissions.includes(id)
                      );
                      const allSelected = selectedInGroup.length === groupPermissionIds.length;
                      
                      return (
                        <Card 
                          key={group.category} 
                          variant="outlined" 
                          sx={{ mb: 2, borderColor: 'divider' }}
                        >
                          <CardContent sx={{ p: '12px !important' }}>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                cursor: 'pointer'
                              }}
                              onClick={() => toggleGroup(group.category)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {group.category}
                                </Typography>
                                <Badge 
                                  badgeContent={group.badge} 
                                  color={group.badgeColor}
                                  sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16 } }}
                                />
                                <Chip
                                  label={`${selectedInGroup.length}/${group.permissions.length}`}
                                  size="small"
                                  variant="outlined"
                                  color={allSelected ? "success" : "default"}
                                />
                              </Box>
                              <IconButton size="small">
                                {expandedGroups.includes(group.category) ? 
                                  <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            </Box>

                            <Collapse in={expandedGroups.includes(group.category)}>
                              <Box sx={{ mt: 2, pl: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                  <Button
                                    size="small"
                                    onClick={() => selectAllInCategory(group.category)}
                                    startIcon={allSelected ? <CheckBox /> : <CheckBoxOutlineBlank />}
                                  >
                                    {allSelected ? "Deselect All" : "Select All"}
                                  </Button>
                                </Box>
                                
                                <FormGroup>
                                  {group.permissions.map((permission) => (
                                    <FormControlLabel
                                      key={permission.id}
                                      control={
                                        <Controller
                                          name="permissions"
                                          control={control}
                                          render={({ field }) => {
                                            const fieldValue = field.value || [];
                                            return (
                                              <Checkbox
                                                checked={fieldValue.includes(permission.id)}
                                                onChange={(e) => {
                                                  const newValue = e.target.checked
                                                    ? [...fieldValue, permission.id]
                                                    : fieldValue.filter((id: string) => id !== permission.id);
                                                  field.onChange(newValue);
                                                }}
                                              />
                                            );
                                          }}
                                        />
                                      }
                                      label={
                                        <Box columnGap={10}>
                                          <Typography variant="body2">
                                            {permission.label}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {permission.description}
                                          </Typography>
                                        </Box>
                                      }
                                      sx={{ 
                                        alignItems: 'flex-start',
                                        mb: 1,
                                        '&:last-child': { mb: 0 }
                                      }}
                                    />
                                  ))}
                                </FormGroup>
                              </Box>
                            </Collapse>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>

                  {/* Permissions Validation Error */}
                  {currentPermissions.length === 0 && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        m: 2, 
                        mt: 0,
                        '& .MuiAlert-icon': { alignItems: 'center' }
                      }}
                    >
                      <Typography variant="body2">
                        At least one permission must be selected
                      </Typography>
                    </Alert>
                  )}
                </Paper>
              </Grid>
            </Grid>

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
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={isSubmitting}
                  className="!text-white"
                >
                  {isSubmitting ? "Saving..." : "Save Role"}
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Tips Card */}
      <Paper elevation={0} sx={{ 
        border: '1px solid', 
        borderColor: 'info.light', 
        borderRadius: 2, 
        bgcolor: 'info.50',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            bgcolor: 'info.light', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mr: 2,
            flexShrink: 0
          }}>
            <Typography variant="h6" sx={{ color: 'info.main' }}>💡</Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'info.dark', fontWeight: 600 }}>
              Role Management Best Practices
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
              <li>
                <Typography variant="body2">
                  <strong>Role Naming:</strong> Use clear, descriptive names that reflect responsibilities {`(e.g., "HR Manager" not just "Manager").`}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Principle of Least Privilege:</strong> Grant only the permissions necessary for the {`role's`} responsibilities.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Permission Groups:</strong> Use category badges to organize permissions by functional area.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Active Status:</strong> Set roles to inactive when not in use instead of deleting them.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Testing:</strong> Always test new roles with a test user before deploying to production.
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Role
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this role? 
            <br />
            <strong>This action cannot be undone.</strong>
            <br />
            <br />
            <strong>Role:</strong> {watchRoleName}
            <br />
            <strong>Permissions:</strong> {currentPermissions.length} assigned
            <br />
            <br />
            <Alert severity="warning">
              This will remove the role from all assigned users. Consider marking as inactive instead.
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Users Dialog */}
      <Dialog
        open={assignUsersOpen}
        onClose={() => setAssignUsersOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Assign Role to Users
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select users to assign the role: <strong>{watchRoleName}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              This feature would show a list of users to assign this role to. In a real implementation,
              you would see checkboxes next to each user with search and filter options.
            </Alert>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <AssignmentInd sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                User assignment interface would appear here
              </Typography>
              <Typography variant="caption" color="text.secondary">
                In a real implementation, this would be a comprehensive user selector
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignUsersOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            setAssignUsersOpen(false);
            toast.success("Users assigned successfully!");
          }} variant="contained">
            Assign Selected Users
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddEditRole;