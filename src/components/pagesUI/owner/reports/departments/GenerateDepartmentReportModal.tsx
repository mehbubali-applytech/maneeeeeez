"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Avatar,
  Stack
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { statePropsType } from "@/interface/common.interface";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";

// Define department form interface
interface IDepartmentForm {
  departmentName: string;
  departmentCode: string;
  departmentType: string;
  managerId: string;
  location: string;
  description: string;
  budget: number;
  currency: string;
  parentDepartment?: string;
  startDate: Date;
  status: string;
  emailDomain: string;
  phoneExtension: string;
  teamLeadIds: string[];
  workingHours: string;
  officeAddress: string;
}

// Mock dropdown data
const departmentTypeOptions = [
  { value: "Sales", label: "Sales Department" },
  { value: "Marketing", label: "Marketing Department" },
  { value: "Engineering", label: "Engineering Department" },
  { value: "Operations", label: "Operations Department" },
  { value: "Finance", label: "Finance Department" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "IT", label: "IT Department" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Research & Development", label: "Research & Development" },
  { value: "Legal", label: "Legal Department" },
  { value: "Quality Assurance", label: "Quality Assurance" },
  { value: "Product Management", label: "Product Management" },
];

const managerOptions = [
  { value: "1", label: "John Smith" },
  { value: "2", label: "Sarah Johnson" },
  { value: "3", label: "Mike Williams" },
  { value: "4", label: "Emily Brown" },
  { value: "5", label: "David Miller" },
  { value: "6", label: "Lisa Taylor" },
  { value: "7", label: "Robert Davis" },
  { value: "8", label: "Amanda Wilson" },
];

const parentDepartmentOptions = [
  { value: "none", label: "No Parent Department" },
  { value: "ENG-001", label: "Engineering (ENG-001)" },
  { value: "SAL-002", label: "Sales (SAL-002)" },
  { value: "MKT-003", label: "Marketing (MKT-003)" },
  { value: "OPS-004", label: "Operations (OPS-004)" },
];

const currencyOptions = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "INR", label: "Indian Rupee (₹)" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Under Review", label: "Under Review" },
  { value: "Consolidating", label: "Consolidating" },
];

const workingHoursOptions = [
  { value: "9-5", label: "9:00 AM - 5:00 PM" },
  { value: "8-4", label: "8:00 AM - 4:00 PM" },
  { value: "flexible", label: "Flexible Hours" },
  { value: "24/7", label: "24/7 Operations" },
  { value: "remote", label: "Remote Flexible" },
];

const teamLeadOptions = [
  { value: "1", label: "John Doe" },
  { value: "2", label: "Jane Smith" },
  { value: "3", label: "Bob Johnson" },
  { value: "4", label: "Alice Williams" },
  { value: "5", label: "Charlie Brown" },
];

const GenerateDepartmentReportModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IDepartmentForm>({
    defaultValues: {
      departmentName: "",
      departmentCode: "",
      departmentType: "Engineering",
      managerId: "1",
      location: "",
      description: "",
      budget: 0,
      currency: "USD",
      parentDepartment: "none",
      startDate: new Date(),
      status: "Active",
      emailDomain: "",
      phoneExtension: "",
      teamLeadIds: [],
      workingHours: "9-5",
      officeAddress: "",
    }
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTeamLeads, setSelectedTeamLeads] = useState<string[]>([]);
  
  const handleToggle = () => setOpen(!open);

  // Handle submit form
  const onSubmit = async (data: IDepartmentForm) => {
    setIsCreating(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        setIsCreating(false);
        toast.success("Department created successfully!");
        reset();
        setOpen(false);
      }, 2000);
      
      console.log("Creating department with data:", data);
    } catch (error: any) {
      setIsCreating(false);
      toast.error(
        error?.message || "An error occurred while creating the department. Please try again!"
      );
    }
  };

  const handleTeamLeadSelect = (value: string) => {
    setSelectedTeamLeads(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Create New Department</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        {isCreating ? (
          <div className="card__wrapper text-center py-8">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="h6" className="font-medium mb-2">
                Creating Department...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we set up the new department
              </Typography>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card__wrapper">
              <Typography variant="h6" className="font-medium mb-4">
                Basic Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Department Name"
                    id="departmentName"
                    type="text"
                    register={register("departmentName", {
                      required: "Department name is required",
                    })}
                    error={errors.departmentName}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Department Code"
                    id="departmentCode"
                    type="text"
                    register={register("departmentCode", {
                      required: "Department code is required",
                    })}
                    error={errors.departmentCode}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="departmentType"
                    label="Department Type"
                    options={departmentTypeOptions}
                    control={control}
                    error={errors.departmentType}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="managerId"
                    label="Department Manager"
                    options={managerOptions}
                    control={control}
                    error={errors.managerId}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Location"
                    id="location"
                    type="text"
                    register={register("location", {
                      required: "Location is required",
                    })}
                    error={errors.location}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Office Address"
                    id="officeAddress"
                    type="text"
                    register={register("officeAddress")}
                    error={errors.officeAddress}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Department Hierarchy
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="parentDepartment"
                    label="Parent Department"
                    options={parentDepartmentOptions}
                    control={control}
                    error={errors.parentDepartment}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <div className="form__input-box">
                        <FormLabel label="Start Date" id="startDate" />
                        <div className="datepicker-style">
                          <input
                            type="date"
                            id="startDate"
                            className="form-control"
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </div>
                      </div>
                    )}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Financial Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Annual Budget"
                    id="budget"
                    type="number"
                    register={register("budget", {
                      required: "Budget is required",
                      min: { value: 0, message: "Budget must be positive" }
                    })}
                    error={errors.budget}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="currency"
                    label="Currency"
                    options={currencyOptions}
                    control={control}
                    error={errors.currency}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Department Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="status"
                    label="Status"
                    options={statusOptions}
                    control={control}
                    error={errors.status}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="workingHours"
                    label="Working Hours"
                    options={workingHoursOptions}
                    control={control}
                    error={errors.workingHours}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Email Domain"
                    id="emailDomain"
                    type="text"
                    register={register("emailDomain")}
                    error={errors.emailDomain}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Phone Extension"
                    id="phoneExtension"
                    type="text"
                    register={register("phoneExtension")}
                    error={errors.phoneExtension}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Team Leadership
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" className="mb-2">
                    Select Team Leads (optional)
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {teamLeadOptions.map((lead) => (
                      <Chip
                        key={lead.value}
                        label={lead.label}
                        onClick={() => handleTeamLeadSelect(lead.value)}
                        color={selectedTeamLeads.includes(lead.value) ? "primary" : "default"}
                        variant={selectedTeamLeads.includes(lead.value) ? "filled" : "outlined"}
                        avatar={<Avatar>{lead.label.charAt(0)}</Avatar>}
                        className="mb-1"
                      />
                    ))}
                  </Stack>
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Description
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div className="form__input-box">
                        <FormLabel label="Department Description" id="description" />
                        <textarea
                          id="description"
                          className="form-control min-h-[100px]"
                          placeholder="Describe the department's purpose, responsibilities, and goals..."
                          {...field}
                        />
                      </div>
                    )}
                  />
                </Grid>
              </Grid>
            </div>
            
            <div className="submit__btn text-center mt-6 flex gap-3 justify-center">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleToggle}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Department
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDepartmentReportModal;