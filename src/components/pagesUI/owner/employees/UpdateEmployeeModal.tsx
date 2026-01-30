"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Save,
  Cancel,
  ArrowBack,
  ArrowForward,
  Person,
  Work,
  AttachMoney,
  Description,
  AccessTime,
  Email,
  Send,
  CloudUpload,
  Delete,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

// Import Tab Components
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import JobDetailsTab from "./tabs/JobDetailsTab";
import SalaryTab from "./tabs/SalaryTab";
import DocumentsTab from "./tabs/DocumentsTab";
import AccessTab from "./tabs/AccessTab";

import { IEmployeeForm, IEmployee, EMPLOYMENT_STATUS_OPTIONS } from "./EmployeeTypes";
import Link from "next/link";

interface AddEditEmployeeProps {
  employee?: IEmployee;
  mode: 'add' | 'edit';
}

const steps = [
  { label: 'Personal Info', icon: <Person /> },
  { label: 'Job Details', icon: <Work /> },
  { label: 'Salary & Compensation', icon: <AttachMoney /> },
  { label: 'Documents', icon: <Description /> },
  { label: 'Attendance & Access', icon: <AccessTime /> }
];

const AddEditEmployee: React.FC<AddEditEmployeeProps> = ({ employee, mode = 'add' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const baseEmployeesRoute = React.useMemo(() => {
    if (pathname.startsWith("/super-admin")) {
      return "/super-admin/employees";
    }
    return "/owner/employees";
  }, [pathname]);

  const methods = useForm<IEmployeeForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      workType: 'Full-time',
      employmentStatus: 'Draft',
      attendanceType: 'Biometric',
      systemUserEnabled: false,
      payFrequency: 'Monthly',
      roleId: 0,
      departmentId: 0,
      workLocationId: 0,
      designation: '',
      presentAddress: {
        addressLine1: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: ''
      },
      sameAsPresentAddress: true,
      emergencyContactName: '',
      emergencyContactRelation: '',
      emergencyContactPhone: '',
      allowances: [],
      deductions: [],
      documents: [],
      newDocuments: [],
      salary_structure: {},
      roleIds: []
    }
  });

  const { handleSubmit, trigger, watch, reset, formState: { isDirty, isValid } } = methods;

  // Watch values for conditional rendering
  const watchWorkType = watch('workType');
  const watchSystemUserEnabled = watch('systemUserEnabled');
  const watchSameAsPresentAddress = watch('sameAsPresentAddress');

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch departments
        const deptResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/department`,
          { withCredentials: true }
        );
        if (deptResponse.data?.data) {
          setDepartments(deptResponse.data.data);
        }

        // Fetch designations
        const desigResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/designation`,
          { withCredentials: true }
        );
        if (desigResponse.data?.data) {
          setDesignations(desigResponse.data.data);
        }

        // Fetch branches
        const branchResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/branch/client`,
          { withCredentials: true }
        );
        if (branchResponse.data?.data) {
          setBranches(branchResponse.data.data);
        }

        // Fetch roles - create this endpoint or use existing one
        try {
          const rolesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/roles`,
            { withCredentials: true }
          );
          if (rolesResponse.data?.data) {
            setRoles(rolesResponse.data.data);
          }
        } catch (rolesError) {
          console.warn("Roles endpoint not available, using default roles");
          // Use default roles if endpoint doesn't exist
          setRoles([
            { role_id: 1, role_name: "Employee", description: "Basic employee access" },
            { role_id: 2, role_name: "Manager", description: "Department management access" },
            { role_id: 3, role_name: "Admin", description: "Full system access" },
            { role_id: 4, role_name: "HR", description: "HR management access" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInitialData();
  }, []);

  // Load employee data in edit mode
  useEffect(() => {
    const loadEmployeeData = async () => {
      if (mode === 'edit' && params.id) {
        setIsLoadingData(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/owner/employee/byId?employee_id=${params.id}`,
            { withCredentials: true }
          );

          if (response.data?.data) {
            const emp = response.data.data;
            
            // Transform API data to form data
            const formData: IEmployeeForm = {
              firstName: emp.first_name,
              lastName: emp.last_name,
              email: emp.email,
              phoneNumber: emp.phone,
              dateOfJoining: emp.date_of_joining,
              workType: 'Full-time', // Default
              employmentStatus: emp.is_active === 1 ? 'Active' : 'Inactive',
              attendanceType: 'Biometric', // Default
              systemUserEnabled: !!emp.User?.username,
              payFrequency: 'Monthly', // Default
              roleId: emp.User?.userRoles?.[0]?.role?.role_id || 0,
              departmentId: emp.department_id || 0,
              workLocationId: emp.branch_id || 0,
              designation: emp.designation,
              
              presentAddress: {
                addressLine1: '',
                city: '',
                state: '',
                country: 'India',
                zipCode: ''
              },
              
              sameAsPresentAddress: true,
              emergencyContactName: '',
              emergencyContactRelation: '',
              emergencyContactPhone: '',
              
              salary_structure: emp.EmployeeSalaryStructure?.[0]?.salary_structure || {},
              
              allowances: [],
              deductions: [],
              documents: emp.documents || [],
              newDocuments: [],
              
              roleIds: emp.User?.userRoles?.map((ur: any) => ur.role_id) || []
            };
            
            reset(formData);
            
            if (emp.profilePhoto) {
              setProfileImage(emp.profilePhoto);
            }
          }
        } catch (error) {
          console.error("Error loading employee data:", error);
          toast.error("Failed to load employee data");
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadEmployeeData();
  }, [mode, params.id, reset]);

  const handleNext = async () => {
    const fieldsToValidate = getStepFields(activeStep);
    const isValidStep = await trigger(fieldsToValidate as any);

    if (isValidStep) {
      if (activeStep < steps.length - 1) {
        setActiveStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 0: // Personal Info
        return ['firstName', 'lastName', 'email', 'phoneNumber'];
      case 1: // Job Details
        return ['dateOfJoining', 'designation', 'departmentId'];
      case 2: // Salary
        return []; // Optional
      case 3: // Documents
        return []; // Optional
      case 4: // Access
        return []; // Optional
      default:
        return [];
    }
  };

  const handleFinalSubmit: SubmitHandler<IEmployeeForm> = async (data) => {
    setIsSubmitting(true);

    try {
      // Prepare payload based on API requirements
      const payload = {
        // Personal Info
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phoneNumber,
        designation: data.designation,
        date_of_joining: data.dateOfJoining,
        
        // Job Details
        department_id: data.departmentId,
        branch_id: data.workLocationId,
        
        // Salary Structure
        salary_structure: data.salary_structure,
        
        // Attributes (custom fields)
        attributes: [
          // Add any custom attributes here
        ],
        
        // Roles
        roleIds: data.roleIds,
        
        // System User
        systemUserEnabled: data.systemUserEnabled,
        username: data.systemUserEnabled ? data.email.split('@')[0] : undefined,
        
        // Address
        address: data.presentAddress
      };

      let response;
      
      if (mode === 'add') {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/employee`,
          payload,
          { withCredentials: true }
        );
        
        toast.success("Employee created successfully!");
      } else {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/employee/${params.id}`,
          payload,
          { withCredentials: true }
        );
        
        toast.success("Employee updated successfully!");
      }

      // Navigate to employee list
      setTimeout(() => {
        router.push(baseEmployeesRoute);
      }, 1000);

    } catch (error: any) {
      console.error('Error saving employee:', error);
      
      let errorMessage = "Failed to save employee";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndActivate: SubmitHandler<IEmployeeForm> = async (data) => {
    const finalData: IEmployeeForm = {
      ...data,
      employmentStatus: 'Active'
    };

    await handleFinalSubmit(finalData);
  };

  const handleExit = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      router.push(baseEmployeesRoute);
    }
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error("Only JPG and PNG files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        methods.setValue('profilePhoto', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoTab
            profileImage={profileImage}
            onProfileImageUpload={handleProfileImageUpload}
            watchSameAsPresentAddress={watchSameAsPresentAddress}
          />
        );
      case 1:
        return (
          <JobDetailsTab 
            watchWorkType={watchWorkType}
            departments={departments}
            designations={designations}
            branches={branches}
            isLoading={isLoadingData}
          />
        );
      case 2:
        return <SalaryTab />;
      case 3:
        return <DocumentsTab />;
      case 4:
        return (
          <AccessTab 
            watchSystemUserEnabled={watchSystemUserEnabled}
            roles={roles}
            isLoading={isLoadingData}
          />
        );
      default:
        return null;
    }
  };

  if (isLoadingData && mode === 'edit') {
    return (
      <div className="app__slide-wrapper">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <CircularProgress />
            <p className="mt-2 text-gray-600">Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
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
              <li className="breadcrumb-item">
                <Link href={baseEmployeesRoute}>Employees</Link>
              </li>
              <li className="breadcrumb-item active">
                {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
              </li>
            </ol>
          </nav>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleExit}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
          </div>
        </div>

        {/* Progress Summary */}
        <Paper elevation={0} sx={{
          border: '1px solid',
          borderColor: 'info.light',
          borderRadius: 2,
          bgcolor: 'info.50',
          p: 3,
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'info.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Typography sx={{ color: 'info.main', fontWeight: 'bold' }}>💡</Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
              Employee Onboarding Checklist
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            {steps.map((step, index) => (
              <Box
                key={step.label}
                sx={{
                  p: 2,
                  bgcolor: index <= activeStep ? 'white' : 'grey.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: index <= activeStep ? 'info.light' : 'divider'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2" sx={{
                    color: index <= activeStep ? 'info.main' : 'text.secondary',
                    fontWeight: index <= activeStep ? 600 : 400
                  }}>
                    {step.label}
                  </Typography>
                  {index < activeStep && (
                    <Chip label="✓" size="small" sx={{ bgcolor: 'success.main', color: 'white' }} />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {getStepDescription(index)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Main Content */}
        <Paper elevation={0} sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3
        }}>
          {/* Stepper */}
          <Box sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '& .MuiStepIcon-root': {
                          color: index < activeStep ? 'primary.main' : 'grey.400'
                        },
                        '& .MuiStepIcon-active': {
                          color: 'primary.main'
                        },
                        '& .MuiStepIcon-completed': {
                          color: 'success.main'
                        }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {step.icon}
                    </Box>
                    {step.label}
                    {index < activeStep && (
                      <Chip
                        label="✓"
                        size="small"
                        sx={{
                          mt: 0.5,
                          fontSize: '0.7rem',
                          height: 16,
                          bgcolor: 'success.main',
                          color: 'white'
                        }}
                      />
                    )}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step Content */}
          <Box sx={{ p: 3, minHeight: '500px' }}>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{
            p: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {mode === 'add' && (
                <Button
                  variant="contained"
                  color="success"
                  className="!text-white"
                  startIcon={<Send />}
                  onClick={methods.handleSubmit(handleSaveAndActivate)}
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Saving...
                    </>
                  ) : (
                    'Save & Activate'
                  )}
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={methods.handleSubmit(handleFinalSubmit)}
                  disabled={isSubmitting}
                  className="!text-white"
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      {mode === 'add' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    mode === 'add' ? 'Create Employee' : 'Update Employee'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  className="!text-white"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </div>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitConfirm} onClose={() => setShowExitConfirm(false)}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to leave?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitConfirm(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setShowExitConfirm(false);
              router.push(baseEmployeesRoute);
            }}
            color="error"
          >
            Exit Without Saving
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

const getStepDescription = (step: number): string => {
  switch (step) {
    case 0: return "Personal details, contact information, and emergency contacts";
    case 1: return "Job role, department, reporting structure, and employment type";
    case 2: return "Salary structure, bank details, and compensation components";
    case 3: return "Upload ID proofs, offer letters, and other documents";
    case 4: return "System access, attendance settings, and permissions";
    default: return "";
  }
};

export default AddEditEmployee;