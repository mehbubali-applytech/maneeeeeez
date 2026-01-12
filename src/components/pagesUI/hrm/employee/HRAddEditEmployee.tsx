// HRAddEditEmployee.tsx - Fixed version
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
  Checklist,
  School,
  Security,
  Send,
  Email
} from "@mui/icons-material";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Import HR Tab Components
import PersonalInfoTab from "../../owner/employees/tabs/PersonalInfoTab";
import JobDetailsTab from "../../owner/employees/tabs/JobDetailsTab";
import SalaryTab from "../../owner/employees/tabs/SalaryTab";
import DocumentsTab from "../../owner/employees/tabs/DocumentsTab";
import AccessTab from "../../owner/employees/tabs/AccessTab";
import OnboardingTab from "./tabs/OnboardingTab"; // HR-specific tab

import { IHREmployeeForm, IHREmployee, createHRMockEmployees } from "./HREmployeeTypes";
import Link from "next/link";

interface HRAddEditEmployeeProps {
  employee?: IHREmployee|null;
  mode: 'add' | 'edit';
}

const steps = [
  { label: 'Personal Info', icon: <Person /> },
  { label: 'Job Details', icon: <Work /> },
  { label: 'Salary & Compensation', icon: <AttachMoney /> },
  { label: 'Documents', icon: <Description /> },
  { label: 'Access & Onboarding', icon: <Checklist /> }, // Combined for HR
  { label: 'HR Setup', icon: <Security /> }
];

const HRAddEditEmployee: React.FC<HRAddEditEmployeeProps> = ({ employee, mode = 'add' }) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mockEmployees, setMockEmployees] = useState<IHREmployee[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Load some mock employees for the OnboardingTab
    setMockEmployees(createHRMockEmployees(5));
  }, []);

  const baseEmployeesRoute = React.useMemo(() => {
    if (pathname.startsWith("/hrm")) {
      return "/hrm/employee";
    }
    return "/owner/employees";
  }, [pathname]);

  const methods = useForm<IHREmployeeForm>({
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
      newDocuments: [],
      // HR-specific defaults
      onboardingStatus: 'Pending',
      backgroundCheckStatus: 'Pending',
      orientationSchedule: '',
      equipmentRequired: false,
      probationDuration: 6, // months
      orientationCompleted: false,
      equipmentIssued: false,
      systemAccessCreated: false,
      hrNotes: '',
      mandatoryTraining: ['Orientation', 'Code of Conduct'],
      referenceCheckStatus: 'Pending',
      medicalCheckStatus: 'Pending'
    }
  });

  const { handleSubmit, trigger, watch, reset, formState: { isDirty, isValid } } = methods;

  // Load employee data in edit mode
  useEffect(() => {
    if (employee && mode === 'edit') {
      // Transform employee data to form data
      const formData: Partial<IHREmployeeForm> = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        dateOfJoining: employee.dateOfJoining,
        workType: employee.workType,
        employmentStatus: employee.employmentStatus,
        attendanceType: employee.attendanceType,
        systemUserEnabled: employee.systemUserEnabled,
        onboardingStatus: employee.onboardingStatus,
        backgroundCheckStatus: employee.backgroundCheckStatus,
        orientationCompleted: employee.orientationCompleted,
        equipmentIssued: employee.equipmentIssued,
        systemAccessCreated: employee.systemAccessCreated,
        hrNotes: employee.hrNotes || '',
        mandatoryTraining: employee.trainingCompleted || ['Orientation', 'Code of Conduct'],
        referenceCheckStatus: 'Pending', // Default values
        medicalCheckStatus: 'Pending',
        equipmentRequired: employee.equipmentIssued || false,
        probationDuration: 6,
        orientationSchedule: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
      case 4: // Access & Onboarding
        return ['attendanceType', 'systemUserEnabled'];
      case 5: // HR Setup
        return ['onboardingStatus', 'probationDuration'];
      default:
        return [];
    }
  };

  const handleSaveDraft = async () => {
    const formData = methods.getValues();
    // Save to localStorage or API
    localStorage.setItem('hr_employee_draft', JSON.stringify(formData));
    toast.success("Progress saved as draft");
  };

  const handleFinalSubmit = async (data: IHREmployeeForm) => {
    setIsSubmitting(true);

    try {
      // Transform data with HR-specific fields
      const employeeData = {
        ...data,
        employeeId: mode === 'add' ? `EMP${Date.now()}` : employee!.employeeId,
        employeeCode: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'HR', // HR user
        updatedBy: 'HR',
        // HR-specific calculated fields
        workflowStatus: data.onboardingStatus === 'Completed' ? 'Active' : 'New Hire',
        hrManagerId: 'HR001', // Current HR user ID
        hrManagerName: 'HR Manager', // Current HR user name
        trainingCompleted: data.mandatoryTraining || [],
        leaveBalance: 12, // Default leave balance
        attendanceCompliance: 100, // Default for new employees
        performanceRating: undefined // Not rated yet
      };

      // API call would go here
      console.log('Submitting HR employee:', employeeData);

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      toast.success(mode === 'add' ? "Employee added successfully!" : "Employee updated successfully!");

      // Send onboarding email if requested
      if (data.systemUserEnabled) {
        toast.info("Onboarding email sent to employee");
      }

      // Clear draft
      localStorage.removeItem('hr_employee_draft');

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

  const handleSaveAndSendOnboarding = async (data: IHREmployeeForm) => {
    const finalData: IHREmployeeForm = {
      ...data,
      onboardingStatus: 'In Progress'
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
            watchSameAsPresentAddress={watch('sameAsPresentAddress')}
          />
        );
      case 1:
        return <JobDetailsTab watchWorkType={watch('workType')} />;
      case 2:
        return <SalaryTab />;
      case 3:
        return <DocumentsTab />;
      case 4:
        return <AccessTab watchSystemUserEnabled={watch('systemUserEnabled')} />;
      case 5:
        return <OnboardingTab employees={mockEmployees} />; // ✅ Pass the employees prop
      default:
        return null;
    }
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
                <Link href="/hr">HR Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href={baseEmployeesRoute}>Employees</Link>
              </li>
              <li className="breadcrumb-item active">
                {mode === 'add' ? 'Add New Employee (HR)' : 'Edit Employee (HR)'}
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
          </div>
        </div>

        {/* HR-specific Header */}
        <Paper elevation={0} sx={{
          border: '1px solid',
          borderColor: 'primary.light',
          borderRadius: 2,
          bgcolor: 'primary.50',
          p: 3,
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>HR</Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                {mode === 'add' ? 'New Employee Onboarding' : 'Employee Update'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mode === 'add' 
                  ? 'Complete all steps to onboard new employee' 
                  : 'Update employee information and HR records'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">Onboarding Status</Typography>
              <Typography variant="body2" fontWeight={600}>
                {watch('onboardingStatus')}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">Probation Period</Typography>
              <Typography variant="body2" fontWeight={600}>
                {watch('probationDuration')} months
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">Background Check</Typography>
              <Typography variant="body2" fontWeight={600}>
                {watch('backgroundCheckStatus')}
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">System Access</Typography>
              <Typography variant="body2" fontWeight={600}>
                {watch('systemUserEnabled') ? 'Yes' : 'No'}
              </Typography>
            </Box>
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
                  color="info"
                  startIcon={<Email />}
                  onClick={methods.handleSubmit(handleSaveAndSendOnboarding)}
                  disabled={isSubmitting || !isValid}
                  className="!text-white"
                >
                  Save & Send Onboarding
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
                      {mode === 'add' ? 'Onboarding...' : 'Updating...'}
                    </>
                  ) : (
                    mode === 'add' ? 'Complete Onboarding' : 'Update Employee'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="!text-white"
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* HR-specific Alerts */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>HR Note:</strong> Ensure all compliance documents are uploaded before completing onboarding.
          </Typography>
        </Alert>
        
        {watch('onboardingStatus') === 'Pending' && (
          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Action Required:</strong> This employee is pending onboarding. Complete all steps to activate.
            </Typography>
          </Alert>
        )}
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

export default HRAddEditEmployee;