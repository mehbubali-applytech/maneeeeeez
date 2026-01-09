// AddEditEmployee.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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
  Tooltip,
  CircularProgress,
  Snackbar
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
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const pathname = usePathname();

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
      newDocuments: []
    }
  });

  const { handleSubmit, trigger, watch, reset, formState: { isDirty, isValid } } = methods;

  // Watch values for conditional rendering
  const watchWorkType = watch('workType');
  const watchSystemUserEnabled = watch('systemUserEnabled');
  const watchSameAsPresentAddress = watch('sameAsPresentAddress');

  // Load employee data in edit mode
  useEffect(() => {
    if (employee && mode === 'edit') {
      // Transform employee data to form data
      const formData: Partial<IEmployeeForm> = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        // ... map all fields
      };
      reset(formData);
      if (employee.profilePhoto) {
        setProfileImage(employee.profilePhoto);
      }
    }
  }, [employee, mode, reset]);

  const handleNext = async () => {
    const fieldsToValidate = getStepFields(activeStep);
    const isValidStep = await trigger(fieldsToValidate as any);

    if (isValidStep) {
      // Auto-save current step
      await handleSaveDraft();

      if (activeStep < steps.length - 1) {
        setActiveStep(prev => prev + 1);
        // Scroll to top
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
        return ['firstName', 'lastName', 'email', 'dateOfBirth', 'emergencyContactName'];
      case 1: // Job Details
        return ['dateOfJoining', 'roleId', 'departmentId', 'workLocationId', 'workType'];
      case 2: // Salary
        return ['costToCompany', 'payFrequency'];
      case 3: // Documents
        return []; // Documents are optional
      case 4: // Access
        return ['attendanceType'];
      default:
        return [];
    }
  };

  const handleSaveDraft = async () => {
    const formData = methods.getValues();
    // Save to localStorage or API
    localStorage.setItem('employee_draft', JSON.stringify(formData));
    toast.success("Progress saved as draft");
  };

  const handleFinalSubmit = async (data: IEmployeeForm) => {
    setIsSubmitting(true);

    try {
      // Transform data
      const employeeData = {
        ...data,
        employeeId: mode === 'add' ? `EMP${Date.now()}` : employee!.employeeId,
        employeeCode: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Owner', // Replace with actual user
        updatedBy: 'Owner'
      };

      // API call would go here
      console.log('Submitting employee:', employeeData);

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      toast.success(mode === 'add' ? "Employee added successfully!" : "Employee updated successfully!");

      // Clear draft
      localStorage.removeItem('employee_draft');

      // Navigate to employee list
      setTimeout(() => {
        router.push(baseEmployeesRoute);
      }, 1000);

    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error("Failed to save employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndActivate = async (data: IEmployeeForm) => {
    const finalData: IEmployeeForm = {
      ...data,
      employmentStatus: 'Active'
    };

    await handleFinalSubmit(finalData);


    // Send onboarding email if system user is enabled
    if (data.systemUserEnabled) {
      toast.info("Onboarding email will be sent to the employee");
    }
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
        return <JobDetailsTab watchWorkType={watchWorkType} />;
      case 2:
        return <SalaryTab />;
      case 3:
        return <DocumentsTab />;
      case 4:
        return <AccessTab watchSystemUserEnabled={watchSystemUserEnabled} />;
      default:
        return null;
    }
  };

  const getStepValidation = async (step: number) => {
    const fields = getStepFields(step);
    return await trigger(fields as any);
  };

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
              <Button
                variant="outlined"
                startIcon={<Save />}

                onClick={handleSaveDraft}
                disabled={isSubmitting || !isDirty}
              >
                Save Draft
              </Button>

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
            You have unsaved changes. Do you want to save them as draft before leaving?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitConfirm(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              await handleSaveDraft();
              setShowExitConfirm(false);
              router.push(baseEmployeesRoute);

            }}
            color="primary"
          >
            Save Draft & Exit
          </Button>
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