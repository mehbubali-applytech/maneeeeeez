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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  Divider
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
  Visibility,
  Send,
  Info,
  BugReport
} from "@mui/icons-material";
import { useForm, FormProvider, FieldErrors } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// Import Tab Components
import PositionDetailsTab from "./tabs/PositionDetailsTab";
import CompensationTab from "./tabs/CompensationTab";
import TemplateSelectionTab from "./tabs/TemplateSelectionTab";
import ReviewTab from "./tabs/ReviewTab";
import CandidateInfoTab from "./tabs/CandidateInfoTab";
import { IOfferLetterForm, IOfferLetter } from "../OfferLetterTypes";

interface AddEditOfferLetterProps {
  offer?: IOfferLetter;
  mode: 'add' | 'edit';
}

const steps = [
  { label: 'Candidate Info', icon: <Person /> },
  { label: 'Position Details', icon: <Work /> },
  { label: 'Compensation', icon: <AttachMoney /> },
  { label: 'Template', icon: <Description /> },
  { label: 'Review & Send', icon: <Visibility /> }
];

// Logger utility function
const logStepData = (stepName: string, data: any, action: string = 'Step Data') => {
  console.group(`📋 ${action} - ${stepName}`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Data:', data);
  
  if (data && typeof data === 'object') {
    const totalFields = Object.keys(data).length;
    const filledFields = Object.values(data).filter(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (typeof value === 'number' && value === 0) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }).length;
    
    const completionPercentage = Math.round((filledFields / totalFields) * 100);
    console.log(`📊 Completion: ${completionPercentage}% (${filledFields}/${totalFields} fields filled)`);
    
    console.log('🔍 Field Details:');
    Object.entries(data).forEach(([key, value]) => {
      const isEmpty = 
        value === null || 
        value === undefined || 
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'number' && value === 0) ||
        (Array.isArray(value) && value.length === 0);
      
      console.log(`  ${key}:`, {
        value,
        status: isEmpty ? '❌ Empty' : '✅ Filled',
        type: typeof value
      });
    });
  }
  console.groupEnd();
  
  if (action.includes('Navigating')) {
    toast.info(`Moving to ${stepName}`);
  }
};

// Log form validation status with proper typing
const logValidationStatus = (isValid: boolean, errors: FieldErrors<IOfferLetterForm>, stepName: string) => {
  console.group(`🔍 Validation Status - ${stepName}`);
  console.log('Overall Valid:', isValid ? '✅' : '❌');
  
  if (!isValid && errors) {
    console.log('Validation Errors:');
    Object.entries(errors).forEach(([field, error]: [string, any]) => {
      console.log(`  ${field}: ${error?.message || 'Invalid'}`);
    });
  }
  console.groupEnd();
};

// Helper to safely check if a field has an error
const hasError = (errors: FieldErrors<IOfferLetterForm>, field: string): boolean => {
  return !!errors[field as keyof IOfferLetterForm];
};

// Helper to get error message
const getErrorMessage = (errors: FieldErrors<IOfferLetterForm>, field: string): string | undefined => {
  const error = errors[field as keyof IOfferLetterForm];
  return error?.message as string | undefined;
};

const AddEditOfferLetter: React.FC<AddEditOfferLetterProps> = ({ offer, mode = 'add' }) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [stepLogs, setStepLogs] = useState<Array<{
    step: string;
    timestamp: string;
    data: any;
    action: string;
  }>>([]);
  const [validationDebug, setValidationDebug] = useState<any>(null);
  const pathname = usePathname();

  const baseOffersRoute = React.useMemo(() => {
    if (pathname.startsWith("/super-admin")) {
      return "/super-admin/offers";
    }
    return "/owner/offers";
  }, [pathname]);

  const methods = useForm<IOfferLetterForm>({
    defaultValues: {
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      position: '',
      department: '',
      jobType: 'Full-time',
      location: '',
      reportingManager: '',
      hrContact: '',
      offerDate: new Date().toISOString().split('T')[0],
      joiningDate: '',
      probationPeriod: 6,
      baseSalary: 0,
      ctc: 0,
      bonus: 0,
      benefits: [],
      offerStatus: 'Draft',
      attachments: []
    },
    mode: 'onChange'
  });

  const { handleSubmit, trigger, watch, reset, formState: { isDirty, isValid, errors } } = methods;

  // Watch values
  const watchJobType = watch('jobType');
  const watchBaseSalary = watch('baseSalary');
  
  // Watch all form values for logging
  const allFormValues = watch();

  // Log form changes in real-time
  useEffect(() => {
    if (Object.keys(allFormValues).length > 0) {
      console.log('🔄 Form Updated - Step:', steps[activeStep].label);
      console.log('Current Values:', allFormValues);
    }
  }, [allFormValues, activeStep]);

  // Calculate CTC automatically
  useEffect(() => {
    const base = watchBaseSalary || 0;
    const bonus = watch('bonus') || 0;
    const ctc = base + bonus + (base * 0.25);
    methods.setValue('ctc', Math.round(ctc), { shouldValidate: true });
    
    console.log('💰 CTC Calculation:', {
      baseSalary: base,
      bonus: bonus,
      calculatedCTC: ctc,
      finalCTC: Math.round(ctc)
    });
  }, [watchBaseSalary, watch, methods]);

  // Load offer data in edit mode
  useEffect(() => {
    if (offer && mode === 'edit') {
      console.group('📝 Loading Edit Mode Data');
      console.log('Original Offer:', offer);
      
      const resetData = {
        candidateName: offer.candidateName,
        candidateEmail: offer.candidateEmail,
        candidatePhone: offer.candidatePhone,
        position: offer.position,
        department: offer.department,
        jobType: offer.jobType,
        location: offer.location,
        reportingManager: offer.reportingManager,
        hrContact: offer.hrContact,
        offerDate: offer.offerDate,
        joiningDate: offer.joiningDate,
        probationPeriod: offer.probationPeriod,
        baseSalary: offer.baseSalary,
        ctc: offer.ctc,
        bonus: offer.bonus,
        benefits: offer.benefits,
        offerStatus: offer.offerStatus,
        attachments: []
      };
      
      console.log('Form Reset Data:', resetData);
      reset(resetData);
      console.groupEnd();
      
      addStepLog('Edit Mode Loaded', resetData, 'Data Loaded');
    }
  }, [offer, mode, reset]);

  // Profile image upload handler
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.group('🖼️ Profile Image Upload');
    console.log('File Details:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });

    if (file.size > 5 * 1024 * 1024) {
      console.error('File too large:', file.size);
      toast.error("Image must be under 5MB");
      console.groupEnd();
      return;
    }

    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      toast.error("Please upload an image file");
      console.groupEnd();
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
      console.log('📤 Starting file read...');
    };
    reader.onloadend = () => {
      console.log('✅ File read completed');
      console.log('Image Data URL length:', (reader.result as string).length);
      
      setProfileImage(reader.result as string);
      toast.success("Profile picture uploaded successfully");
      
      addStepLog('Profile Image Upload', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        imageSet: true
      }, 'Image Upload');
      
      console.groupEnd();
    };
    reader.onerror = (error) => {
      console.error('❌ File read error:', error);
      toast.error("Failed to upload image");
      console.groupEnd();
    };
    reader.readAsDataURL(file);
  };

  // Add step log to history
  const addStepLog = (step: string, data: any, action: string) => {
    const newLog = {
      step,
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(data)),
      action
    };
    
    setStepLogs(prev => [...prev, newLog]);
    logStepData(step, data, action);
  };

  // Debug validation function
  const debugValidation = async () => {
    console.group('🔍 Debug Validation');
    console.log('Active Step:', activeStep);
    console.log('Step Name:', steps[activeStep].label);
    console.log('Step Fields:', getStepFields(activeStep));
    
    const currentData = methods.getValues();
    console.log('Current Form Values:', currentData);
    console.log('Form State:', methods.formState);
    
    const fieldsToValidate = getStepFields(activeStep);
    const validationResults: any[] = [];
    
    for (const field of fieldsToValidate) {
      const value = methods.getValues(field as any);
      const error = methods.formState.errors[field as keyof IOfferLetterForm];
      const isValid = await trigger(field as any);
      
      validationResults.push({
        field,
        value,
        isValid,
        error: error ? {
          type: error.type,
          message: error.message
        } : null
      });
    }
    
    console.log('Validation Results:', validationResults);
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      step: steps[activeStep].label,
      stepIndex: activeStep,
      formValues: currentData,
      formState: {
        isValid: methods.formState.isValid,
        isDirty: methods.formState.isDirty,
        errors: methods.formState.errors
      },
      validationResults
    };
    
    setValidationDebug(debugInfo);
    console.log('Debug Info:', debugInfo);
    console.groupEnd();
    
    toast.info('Validation debug info logged to console');
  };

const handleNext = async () => {
  const currentStepName = steps[activeStep].label;
  const fieldsToValidate = getStepFields(activeStep);
  
  console.group(`➡️ Navigating from ${currentStepName}`);
  console.log('Active Step:', activeStep);
  console.log('Step Name:', currentStepName);
  console.log('Fields to Validate:', fieldsToValidate);
  
  // Get current values for debugging
  const currentData = methods.getValues();
  console.log('Current Form Values:', currentData);
  console.log('Current Form State:', {
    isValid: methods.formState.isValid,
    isDirty: methods.formState.isDirty,
    errors: methods.formState.errors
  });
  
  if (fieldsToValidate.length === 0) {
    // No validation needed for this step
    console.log('⚠️ No validation required for this step');
    
    if (activeStep < steps.length - 1) {
      const nextStepName = steps[activeStep + 1].label;
      console.log(`Moving to next step: ${nextStepName}`);
      
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      addStepLog(nextStepName, {}, `Navigating from ${currentStepName}`);
      toast.success(`Moving to ${nextStepName}`);
    }
    console.groupEnd();
    return;
  }
  
  // Get current step data
  const stepData = extractStepData(activeStep, currentData);
  addStepLog(currentStepName, stepData, 'Before Validation');
  
  // Clear previous validation results
  setValidationDebug(null);
  
  // MANUAL VALIDATION APPROACH
  let validationPassed = true;
  const failedFields: string[] = [];
  const validationResults: Array<{field: string, isValid: boolean, error?: string, value: any}> = [];
  
  // Manual validation logic for each field
  for (const field of fieldsToValidate) {
    const fieldValue = methods.getValues(field as any);
    console.log(`🔍 Validating ${field}:`, fieldValue);
    
    let isValidField = true;
    let errorMessage = '';
    
    // Basic required field validation
    if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
      isValidField = false;
      errorMessage = 'This field is required';
    } else if (typeof fieldValue === 'string') {
      const trimmedValue = fieldValue.trim();
      if (trimmedValue === '') {
        isValidField = false;
        errorMessage = 'This field is required';
      }
      
      // Email validation
      if (field === 'candidateEmail' && trimmedValue !== '') {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(trimmedValue)) {
          isValidField = false;
          errorMessage = 'Invalid email address';
        }
      }
      
      // Phone validation
      if (field === 'candidatePhone' && trimmedValue !== '') {
        const phoneRegex = /^[0-9+\-\s]+$/;
        if (!phoneRegex.test(trimmedValue)) {
          isValidField = false;
          errorMessage = 'Invalid phone number';
        }
      }
    } else if (typeof fieldValue === 'number') {
      if (fieldValue <= 0) {
        isValidField = false;
        errorMessage = 'Value must be greater than 0';
      }
    }
    
    // Set error manually if validation failed
    if (!isValidField) {
      validationPassed = false;
      failedFields.push(field);
      
      // Manually set the error
      methods.setError(field as any, {
        type: 'manual',
        message: errorMessage
      });
    } else {
      // Clear any existing error
      methods.clearErrors(field as any);
    }
    
    validationResults.push({
      field,
      isValid: isValidField,
      error: errorMessage,
      value: fieldValue
    });
    
    console.log(`  ${field} validation:`, {
      isValid: isValidField,
      error: errorMessage,
      value: fieldValue
    });
  }
  
  // Trigger validation one more time to update form state
  await trigger(fieldsToValidate as any);
  
  console.log('Validation Results Summary:', validationResults);
  console.log('Failed Fields:', failedFields);
  console.log('All validation passed?', validationPassed);
  console.log('Current Errors (after manual validation):', methods.formState.errors);
  
  if (validationPassed && failedFields.length === 0) {
    console.log('✅ Validation passed - Moving to next step');
    
    // Log successful validation
    addStepLog(currentStepName, {
      ...stepData,
      validationResults
    }, 'Validation Passed');
    
    if (activeStep < steps.length - 1) {
      const nextStepName = steps[activeStep + 1].label;
      console.log(`Moving to next step: ${nextStepName}`);
      
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Log navigation
      addStepLog(nextStepName, {}, `Navigating from ${currentStepName}`);
      
      toast.success(`Moving to ${nextStepName}`);
    }
  } else {
    console.error('❌ Validation failed');
    console.error('Failed fields:', failedFields);
    console.error('Validation results:', validationResults);
    
    // Create detailed error information
    const errorDetails = failedFields.map(field => {
      const result = validationResults.find(r => r.field === field);
      return {
        field,
        message: result?.error || 'This field is required',
        value: result?.value
      };
    });
    
    console.error('Error details:', errorDetails);
    
    addStepLog(currentStepName, {
      ...stepData,
      validationFailed: true,
      validationResults,
      failedFields,
      errors: errorDetails,
      currentErrors: methods.formState.errors
    }, 'Validation Failed');
    
    // Show specific error messages
    if (failedFields.length === 1) {
      const field = failedFields[0];
      const errorDetail = errorDetails.find(e => e.field === field);
      toast.error(`${field}: ${errorDetail?.message || 'Please fill this field'}`);
    } else if (failedFields.length > 0) {
      const errorMessages = errorDetails.map(e => `${e.field}: ${e.message}`).join(', ');
      toast.error(`Please fix ${failedFields.length} errors: ${errorMessages}`);
    } else {
      toast.error(`Validation failed. Please check all required fields in ${currentStepName}`);
    }
    
    // Focus on the first invalid field
    if (failedFields.length > 0) {
      setTimeout(() => {
        const firstField = failedFields[0];
        const element = document.getElementById(firstField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
    }
  }
  console.groupEnd();
};

  const handleBack = () => {
    if (activeStep > 0) {
      const currentStepName = steps[activeStep].label;
      const prevStepName = steps[activeStep - 1].label;
      
      console.group(`⬅️ Navigating back from ${currentStepName} to ${prevStepName}`);
      
      // Log current data before going back
      const currentData = methods.getValues();
      const stepData = extractStepData(activeStep, currentData);
      addStepLog(currentStepName, stepData, 'Before Going Back');
      
      setActiveStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Log navigation
      addStepLog(prevStepName, {}, `Navigated back from ${currentStepName}`);
      
      toast.info(`Returning to ${prevStepName}`);
      console.groupEnd();
    }
  };

  // Helper to extract step-specific data
  const extractStepData = (step: number, allData: IOfferLetterForm) => {
    switch (step) {
      case 0: // Candidate Info
        return {
          candidateName: allData.candidateName,
          candidateEmail: allData.candidateEmail,
          candidatePhone: allData.candidatePhone,
          hrContact: allData.hrContact,
          profileImage: profileImage ? 'Uploaded' : 'Not uploaded'
        };
      case 1: // Position Details
        return {
          position: allData.position,
          department: allData.department,
          jobType: allData.jobType,
          location: allData.location,
          probationPeriod: allData.probationPeriod,
          reportingManager: allData.reportingManager,
          offerDate: allData.offerDate,
          joiningDate: allData.joiningDate
        };
      case 2: // Compensation
        return {
          baseSalary: allData.baseSalary,
          bonus: allData.bonus,
          ctc: allData.ctc,
          benefits: allData.benefits,
          benefitsCount: allData.benefits?.length || 0
        };
      case 3: // Template
        return {
          selectedTemplate: selectedTemplate,
          templateName: selectedTemplate ? `Template-${selectedTemplate}` : 'Custom',
          hasCustomContent: !!allData.customContent
        };
      case 4: // Review
        return {
          allData: allData,
          isComplete: isValid,
          totalFields: Object.keys(allData).length,
          previewMode: previewMode
        };
      default:
        return {};
    }
  };

  const getStepFields = (step: number): (keyof IOfferLetterForm)[] => {
    const fields: Record<number, (keyof IOfferLetterForm)[]> = {
      0: ['candidateName', 'candidateEmail', 'candidatePhone'],
      1: ['position', 'department', 'jobType', 'joiningDate'],
      2: ['baseSalary', 'ctc'],
      3: [], // Optional
      4: []
    };
    
    console.log(`🔍 Step ${step} validation fields:`, fields[step]);
    return fields[step] || [];
  };

  const handleSaveDraft = async () => {
    const formData = methods.getValues();
    
    console.group('💾 Saving Draft');
    console.log('Form Data to Save:', formData);
    console.log('Form Valid:', isValid);
    console.log('Form Dirty:', isDirty);
    
    addStepLog('Save Draft', {
      ...formData,
      isValid,
      isDirty,
      timestamp: new Date().toISOString()
    }, 'Draft Saved');
    
    localStorage.setItem('offer_draft', JSON.stringify(formData));
    localStorage.setItem('offer_draft_timestamp', new Date().toISOString());
    
    console.log('✅ Draft saved to localStorage');
    console.groupEnd();
    
    toast.success("Progress saved as draft");
  };

  const handleFinalSubmit = async (data: IOfferLetterForm) => {
    setIsSubmitting(true);
    
    console.group('🚀 Final Submission');
    console.log('Submission Mode:', mode);
    console.log('Form Data:', data);
    console.log('Selected Template:', selectedTemplate);
    console.log('Profile Image:', profileImage ? 'Uploaded' : 'Not uploaded');

    try {
      const offerData = {
        ...data,
        id: mode === 'add' ? `OFFER-${Date.now()}` : offer!.id,
        offerId: mode === 'add' ? `OFF${Math.floor(1000 + Math.random() * 9000)}` : offer!.offerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Owner',
        updatedBy: 'Owner',
        version: mode === 'add' ? 1 : (offer?.version || 1) + 1,
        templateId: selectedTemplate,
        profileImage: profileImage
      };

      console.log('📦 Final Offer Data:', offerData);
      
      // Log all step history
      console.log('📊 Step History:', stepLogs);
      
      addStepLog('Final Submission', offerData, `${mode === 'add' ? 'Create' : 'Update'} Offer`);

      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('✅ Offer saved successfully');
      toast.success(mode === 'add' ? "Offer created successfully!" : "Offer updated successfully!");

      localStorage.removeItem('offer_draft');
      localStorage.removeItem('offer_draft_timestamp');

      setTimeout(() => {
        router.push(baseOffersRoute);
      }, 1000);

    } catch (error) {
      console.error('❌ Error saving offer:', error);
      addStepLog('Error', { error: error instanceof Error ? error.message : 'Unknown error' }, 'Submission Failed');
      toast.error("Failed to save offer");
    } finally {
      setIsSubmitting(false);
      console.groupEnd();
    }
  };

  const handleSaveAndSend = async (data: IOfferLetterForm) => {
    console.log('📤 Save & Send triggered');
    
    const finalData: IOfferLetterForm = {
      ...data,
      offerStatus: 'Sent'
    };

    addStepLog('Save & Send', finalData, 'Offer Sent');
    
    await handleFinalSubmit(finalData);
    toast.info("Offer email will be sent to the candidate");
  };

  const handleExit = () => {
    console.log('🚪 Exit triggered');
    console.log('Is Dirty:', isDirty);
    
    if (isDirty) {
      addStepLog('Exit', { isDirty, activeStep }, 'Exit with Unsaved Changes');
      setShowExitConfirm(true);
    } else {
      addStepLog('Exit', { isDirty, activeStep }, 'Exit without Changes');
      router.push(baseOffersRoute);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    console.log('📄 Template Selected:', templateId);
    setSelectedTemplate(templateId);
    
    addStepLog('Template Selection', { templateId }, 'Template Changed');
  };

  const renderStepContent = (step: number) => {
    const stepName = steps[step].label;
    console.log(`🎨 Rendering step ${step}: ${stepName}`);
    
    switch (step) {
      case 0:
        return (
          <CandidateInfoTab
            profileImage={profileImage}
            onProfileImageUpload={handleProfileImageUpload}
          />
        );
      case 1:
        return <PositionDetailsTab watchJobType={watchJobType} />;
      case 2:
        return <CompensationTab />;
      case 3:
        return (
          <TemplateSelectionTab
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleTemplateSelect}
          />
        );
      case 4:
        return <ReviewTab data={methods.getValues()} />;
      default:
        return null;
    }
  };

  // Calculate form completion percentage
  const calculateCompletion = (): number => {
    const values = methods.getValues();
    const totalFields = Object.keys(values).length;
    const filledFields = Object.values(values).filter(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (typeof value === 'number' && value === 0) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }).length;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <FormProvider {...methods}>
      <div className="app__slide-wrapper">
        {/* Debug Panel Toggle */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<Info />}
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        >
          {showDebugPanel ? 'Hide Logs' : 'Show Logs'}
        </Button>

        {/* Debug Panel */}
        {showDebugPanel && (
          <Paper elevation={3} sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 400,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1000,
            p: 2,
            bgcolor: 'grey.900',
            color: 'white'
          }}>
            <Typography variant="subtitle2" gutterBottom>
              📊 Debug Logs
            </Typography>
            <Box sx={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
              <Typography variant="caption" sx={{ color: 'grey.400' }}>
                Active Step: {steps[activeStep].label} ({activeStep + 1}/{steps.length})
              </Typography>
              <br />
              <Typography variant="caption" sx={{ color: 'grey.400' }}>
                Form Valid: {isValid ? '✅' : '❌'}
              </Typography>
              <br />
              <Typography variant="caption" sx={{ color: 'grey.400' }}>
                Completion: {calculateCompletion()}%
              </Typography>
              <br />
              <Typography variant="caption" sx={{ color: 'grey.400' }}>
                Current Errors: {Object.keys(errors).length}
              </Typography>
              {validationDebug && (
                <>
                  <Divider sx={{ my: 1, borderColor: 'grey.700' }} />
                  <Typography variant="caption" sx={{ color: 'primary.light' }}>
                    Last Validation Debug:
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ color: 'grey.300' }}>
                    Step: {validationDebug.step}
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ color: 'grey.300' }}>
                    Time: {new Date(validationDebug.timestamp).toLocaleTimeString()}
                  </Typography>
                </>
              )}
              <Divider sx={{ my: 1, borderColor: 'grey.700' }} />
              {stepLogs.slice(-5).reverse().map((log, index) => (
                <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.800', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.300' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ 
                    color: log.action.includes('Failed') ? 'error.light' : 
                           log.action.includes('Passed') ? 'success.light' : 'primary.light' 
                  }}>
                    {log.step} - {log.action}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

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
                <Link href={baseOffersRoute}>Offers</Link>
              </li>
              <li className="breadcrumb-item active">
                {mode === 'add' ? 'Create New Offer' : 'Edit Offer'}
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

        {/* Progress Summary with Completion */}
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
              <Typography sx={{ color: 'info.main', fontWeight: 'bold' }}>📝</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
                Offer Creation Checklist
              </Typography>
              <Typography variant="caption" sx={{ color: 'info.main' }}>
                Overall Completion: {calculateCompletion()}%
              </Typography>
            </Box>
            <Alert severity="info" sx={{ p: 1, fontSize: '0.75rem' }}>
              Step {activeStep + 1} of {steps.length}
            </Alert>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            {steps.map((step, index) => {
              const stepData = extractStepData(index, methods.getValues());
              const stepFields = Object.keys(stepData).length;
              const filledFields = Object.values(stepData).filter(v => {
                if (v === null || v === undefined) return false;
                if (typeof v === 'string' && v.trim() === '') return false;
                if (typeof v === 'number' && v === 0) return false;
                if (Array.isArray(v) && v.length === 0) return false;
                return true;
              }).length;
              const stepCompletion = stepFields > 0 ? Math.round((filledFields / stepFields) * 100) : 0;

              return (
                <Box
                  key={step.label}
                  sx={{
                    p: 2,
                    bgcolor: index <= activeStep ? 'white' : 'grey.100',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: index <= activeStep ? 'info.light' : 'divider',
                    cursor: index <= activeStep ? 'pointer' : 'default',
                    '&:hover': index <= activeStep ? { borderColor: 'primary.main' } : {}
                  }}
                  onClick={() => index <= activeStep && setActiveStep(index)}
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
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    {getStepDescription(index)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1, height: 4, bgcolor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
                      <Box sx={{
                        width: `${stepCompletion}%`,
                        height: '100%',
                        bgcolor: stepCompletion >= 100 ? 'success.main' : 
                                 stepCompletion >= 50 ? 'warning.main' : 'error.main',
                        borderRadius: 2
                      }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                      {stepCompletion}%
                    </Typography>
                  </Box>
                </Box>
              );
            })}
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
                  <StepLabel>
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
              <Button
                variant="outlined"
                size="small"
                startIcon={<BugReport />}
                onClick={debugValidation}
              >
                Debug Validation
              </Button>
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
                <>
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
                      mode === 'add' ? 'Save as Draft' : 'Update Offer'
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Send />}
                    onClick={methods.handleSubmit(handleSaveAndSend)}
                    disabled={isSubmitting}
                    className="!text-white"
                  >
                    Save & Send Offer
                  </Button>
                </>
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
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Current progress: {calculateCompletion()}% complete
              <br />
              Active step: {steps[activeStep].label}
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitConfirm(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              await handleSaveDraft();
              setShowExitConfirm(false);
              router.push(baseOffersRoute);
            }}
            color="primary"
          >
            Save Draft & Exit
          </Button>
          <Button
            onClick={() => {
              console.log('❌ Exiting without saving');
              addStepLog('Exit', { saved: false }, 'Exit Without Saving');
              setShowExitConfirm(false);
              router.push(baseOffersRoute);
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
    case 0: return "Candidate's personal information and contact details";
    case 1: return "Job position, department, location, and reporting structure";
    case 2: return "Salary, bonuses, benefits, and compensation package";
    case 3: return "Select and customize offer letter template";
    case 4: return "Review all details before sending the offer";
    default: return "";
  }
};

export default AddEditOfferLetter;