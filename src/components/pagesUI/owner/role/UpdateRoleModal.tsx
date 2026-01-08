// UpdateRoleModal.tsx
"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Switch,
  FormControlLabel,
  Chip,
  Box,
  Alert,
  Checkbox,
  FormGroup,
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Badge,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { IRole, IRoleForm, PERMISSION_GROUPS, SALARY_GRADES } from "./RoleTypes";
import InputField from "@/components/elements/SharedInputs/InputField";
import { ExpandMore, ExpandLess, CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";

interface UpdateRoleModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editData: IRole | null;
  onSave: (data: IRoleForm, roleId: number) => void;
  onDelete?: (roleId: number) => void;
  onAssignUsers?: (roleId: number) => void;
}

const UpdateRoleModal: React.FC<UpdateRoleModalProps> = ({
  open,
  setOpen,
  editData,
  onSave,
  onDelete,
  onAssignUsers,
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<IRoleForm>({
    defaultValues: {
      roleName: "",
      roleCode: "",
      description: "",
      defaultSalaryGrade: "",
      activeStatus: true,
      permissions: [],
    },
  });

  // Watch values
  const watchRoleName = watch("roleName");
  const watchActiveStatus = watch("activeStatus");
  const watchPermissions = watch("permissions");

  // Load data when editData changes
  useEffect(() => {
    if (editData && open) {
      reset({
        roleName: editData.roleName,
        roleCode: editData.roleCode || "",
        description: editData.description || "",
        defaultSalaryGrade: editData.defaultSalaryGrade || "",
        activeStatus: editData.activeStatus,
        permissions: editData.permissions || [],
      });
    }
  }, [editData, open, reset]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        roleName: "",
        roleCode: "",
        description: "",
        defaultSalaryGrade: "",
        activeStatus: true,
        permissions: [],
      });
      setExpandedGroups([]);
    }
  }, [open, reset]);

  const handleToggle = () => setOpen(!open);

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
    const group = PERMISSION_GROUPS.find(g => g.category === category);
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
    const allPermissionIds = PERMISSION_GROUPS.flatMap(group => 
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
    if (!data.roleName?.trim()) {
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
      if (!editData?.roleId) {
        toast.error("Role ID is missing");
        return;
      }

      // Prepare data for submission
      const submitData: IRoleForm = {
        roleName: data.roleName.trim(),
        roleCode: data.roleCode?.trim() || undefined,
        description: data.description?.trim() || undefined,
        defaultSalaryGrade: data.defaultSalaryGrade || undefined,
        activeStatus: data.activeStatus,
        permissions: permissions,
      };

      await onSave(submitData, editData.roleId);
      toast.success("Role updated successfully!");
      setOpen(false);
      
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total permissions count
  const allPermissionIds = PERMISSION_GROUPS.flatMap(group => group.permissions.map(p => p.id));
  const currentPermissions = watchPermissions || [];
  const isAllSelected = currentPermissions.length === allPermissionIds.length;

  // Helper function for badge colors
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Core": return "primary";
      case "Finance": return "success";
      case "HR": return "warning";
      case "Admin": return "error";
      default: return "default";
    }
  };

  return (
    <>
      <Dialog 
  open={open} 
  onClose={handleToggle} 
  fullWidth 
  maxWidth="md"
  sx={{
    '& .MuiDialog-paper': {
      maxWidth: 1200,
      maxHeight: '99vh',
    }
  }}
>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <h5 className="modal-title text-lg font-semibold">Edit Role</h5>
            <button
              onClick={handleToggle}
              type="button"
              className="bd-btn-close"
            >
              <i className="fa-solid fa-xmark-large"></i>
            </button>
          </div>
        </DialogTitle>
        <DialogContent className="common-scrollbar overflow-y-auto max-h-[95vh]">


          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-y-2.5 gap-x-5 maxXs:gap-x-0">
              {/* Left Column - Basic Info */}
              <div className="col-span-12 md:col-span-6">
                <div className="card__wrapper">
                  <h6 className="card__sub-title mb-4">Role Information</h6>
                  
                  <div className="grid grid-cols-12 gap-y-5 gap-x-5 maxXs:gap-x-0">
                    <div className="col-span-12">
                      <InputField
                        label="Role Name *"
                        id="roleName"
                        type="text"
                        required={true}
                        register={register("roleName", { 
                          required: "Role name is required" 
                        })}
                        error={errors.roleName}
                      />
                    </div>

                    <div className="col-span-12">
                      <InputField
                        label="Role Code"
                        id="roleCode"
                        type="text"
                        required={false}
                        register={register("roleCode")}
                        error={errors.roleCode}
                      />
                    </div>

                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                          rows={3}
                          maxLength={250}
                          placeholder="Describe the role's main responsibilities..."
                          {...register("description")}
                        />
                        <div className="form-text">
                          Optional summary of role responsibilities (max 250 characters)
                        </div>
                        {errors.description && (
                          <div className="invalid-feedback">{errors.description.message}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">Default Salary Grade</label>
                        <Controller
                          name="defaultSalaryGrade"
                          control={control}
                          render={({ field }) => (
                            <select
                              className={`form-control ${errors.defaultSalaryGrade ? 'is-invalid' : ''}`}
                              {...field}
                            >
                              <option value="">None</option>
                              {SALARY_GRADES.map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        <div className="form-text">
                          Optional: Used to auto-assign salary range for employees in this role
                        </div>
                        {errors.defaultSalaryGrade && (
                          <div className="invalid-feedback">{errors.defaultSalaryGrade.message}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-12">
                      <div className="card__wrapper !border !border-gray-200 !rounded-lg !p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-medium mb-1">Active Status</h6>
                            <p className="text-sm text-gray-600">
                              {watchActiveStatus 
                                ? "Role is active and appears in employee assignment list" 
                                : "Role is inactive and hidden from assignment"}
                            </p>
                          </div>
                          <Controller
                            name="activeStatus"
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={field.value}
                                    onChange={field.onChange}
                                    color="success"
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Permissions */}
              <div className="col-span-12 md:col-span-6">
                <div className="card__wrapper">
                  <div className="flex justify-between items-center mb-4">
                    <h6 className="card__sub-title mb-0">Permissions *</h6>
                    <Button
                      size="small"
                      onClick={selectAllPermissions}
                      startIcon={isAllSelected ? 
                        <CheckBox fontSize="small" /> : <CheckBoxOutlineBlank fontSize="small" />}
                      className="!text-sm"
                    >
                      {isAllSelected ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  
                  <div className="mb-3">
                    <Chip
                      label={`${currentPermissions.length} permissions selected`}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                    {currentPermissions.length === 0 && (
                      <Alert severity="error" className="mt-2">
                        At least one permission must be selected
                      </Alert>
                    )}
                  </div>

                  <div className="permissions-scroll" style={{ maxHeight: '570px', overflowY: 'auto' }}>
                    {PERMISSION_GROUPS.map((group) => {
                      const groupPermissionIds = group.permissions.map(p => p.id);
                      const selectedInGroup = groupPermissionIds.filter(id => 
                        currentPermissions.includes(id)
                      );
                      const allSelected = selectedInGroup.length === groupPermissionIds.length;
                      
                      return (
                        <Card 
                          key={group.category} 
                          variant="outlined" 
                          className="mb-3 border-gray-200"
                        >
                          <CardContent className="!p-3">
                            <div 
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleGroup(group.category)}
                            >
                              <div className="flex items-center gap-6">
                                <Typography variant="subtitle2" className="font-semibold">
                                  {group.category}
                                </Typography>
                                <Badge 
                                  badgeContent={group.badge} 
                                  color={getBadgeColor(group.badge) as any}
                                  className="[&_.MuiBadge-badge]:text-[0.6rem] [&_.MuiBadge-badge]:h-4"
                                />
                                <Chip
                                  label={`${selectedInGroup.length}/${group.permissions.length}`}
                                  size="small"
                                  variant="outlined"
                                  color={allSelected ? "success" : "default"}
                                  className="text-xs h-5"
                                />
                              </div>
                              <IconButton size="small">
                                {expandedGroups.includes(group.category) ? 
                                  <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                              </IconButton>
                            </div>

                            <Collapse in={expandedGroups.includes(group.category)}>
                              <div className="mt-3 pl-1">
                                <div className="flex justify-end mb-2">
                                  <Button
                                    size="small"
                                    onClick={() => selectAllInCategory(group.category)}
                                    startIcon={allSelected ? 
                                      <CheckBox fontSize="small" /> : <CheckBoxOutlineBlank fontSize="small" />}
                                    className="!text-xs"
                                  >
                                    {allSelected ? "Deselect All" : "Select All"}
                                  </Button>
                                </div>
                                
                                <div className="space-y-1">
                                  <Controller
                                    name="permissions"
                                    control={control}
                                    render={({ field }) => (
                                      <FormGroup>
                                        {group.permissions.map((permission) => {
                                          const fieldValue = field.value || [];
                                          const isChecked = fieldValue.includes(permission.id);
                                          
                                          return (
                                            <FormControlLabel
                                              key={permission.id}
                                              control={
                                                <Checkbox
                                                  checked={isChecked}
                                                  onChange={(e) => {
                                                    const newValue = e.target.checked
                                                      ? [...fieldValue, permission.id]
                                                      : fieldValue.filter((id: string) => id !== permission.id);
                                                    field.onChange(newValue);
                                                  }}
                                                  size="small"
                                                />
                                              }
                                              label={
                                                <div>
                                                  <Typography variant="body2" className="text-sm">
                                                    {permission.label}
                                                  </Typography>
                                                  {permission.description && (
                                                    <Typography variant="caption" className="text-gray-600">
                                                      {permission.description}
                                                    </Typography>
                                                  )}
                                                </div>
                                              }
                                              className="!m-0 !items-start"
                                            />
                                          );
                                        })}
                                      </FormGroup>
                                    )}
                                  />
                                </div>
                              </div>
                            </Collapse>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="submit__btn text-center mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  {onDelete && editData && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this role?")) {
                          onDelete(editData.roleId);
                          setOpen(false);
                        }
                      }}
                    >
                      <i className="fa-regular fa-trash mr-2"></i>
                      Delete Role
                    </button>
                  )}
                  {onAssignUsers && editData && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => onAssignUsers(editData.roleId)}
                    >
                      <i className="fa-regular fa-user-plus mr-2"></i>
                      Assign to Users
                    </button>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleToggle}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !watchRoleName?.trim() || currentPermissions.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fa-regular fa-save mr-2"></i>
                        Update Role
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateRoleModal;