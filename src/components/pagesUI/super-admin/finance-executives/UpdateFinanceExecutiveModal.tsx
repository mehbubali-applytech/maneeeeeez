"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Autocomplete,
  TextField,
  Chip,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { IFinanceExecutiveForm, IFinanceExecutive } from "./finance-executives.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

const qualificationOptions = [
  "MBA Finance",
  "MS in Accounting",
  "BS in Finance",
  "CPA",
  "CFA",
  "CMA",
  "ACCA",
  "CA",
  "MBA",
  "BBA Accounting",
  "MS Taxation",
  "MBA Economics"
];

const certificationOptions = [
  "CPA",
  "CFA",
  "CMA",
  "ACCA",
  "CA",
  "CIA",
  "CISA",
  "EA",
  "FP&A",
  "FRM",
  "CGMA",
  "CPP",
  "CEBS"
];

const specializationOptions = [
  "Financial Analysis",
  "Budgeting & Forecasting",
  "Financial Reporting",
  "Cost Accounting",
  "Tax Planning",
  "Internal Audit",
  "Risk Management",
  "Treasury Management",
  "M&A",
  "Financial Modeling",
  "Accounts Payable",
  "Accounts Receivable",
  "Payroll Management",
  "Compliance",
  "Financial Strategy",
  "Investment Analysis",
  "Credit Analysis",
  "Financial Planning"
];

const companies = [
  "TechNova Solutions",
  "Global Finance Group",
  "MediCare Innovations",
  "EcoManufacture Inc",
  "RetailMax Corporation",
  "EduTech Solutions",
  "RealEstate Pro",
  "LogiTrans Global",
  "EnergyPlus Corp",
  "TeleConnect Ltd"
];

const departments = [
  "Finance & Accounting",
  "Financial Planning & Analysis",
  "Accounts Payable",
  "Accounts Receivable",
  "Taxation",
  "Internal Audit",
  "Treasury",
  "Financial Reporting",
  "Cost Accounting",
  "Corporate Finance"
];

const roles = [
  "CFO",
  "Finance Director",
  "Finance Manager",
  "Financial Controller",
  "Senior Accountant",
  "Accountant",
  "Financial Analyst",
  "Tax Manager",
  "Audit Manager",
  "Treasury Manager",
  "Cost Accountant",
  "AR Specialist",
  "AP Specialist",
  "Financial Planning Manager"
];

interface UpdateFinanceExecutiveModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  financeExecutiveData: IFinanceExecutive | null;
  onUpdate?: (updatedData: IFinanceExecutive) => void;
}

const UpdateFinanceExecutiveModal: React.FC<UpdateFinanceExecutiveModalProps> = ({
  open,
  setOpen,
  financeExecutiveData,
  onUpdate,
}) => {
  const [status, setStatus] = useState<"Active" | "Inactive" | "On Leave" | "Pending">("Active");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IFinanceExecutiveForm>({
    defaultValues: {
      executiveName: "",
      executiveCode: "",
      email: "",
      phone: "",
      mobile: "",
      extension: "",
      jobTitle: "",
      role: "Financial Analyst",
      company: "",
      department: "",
      location: "",
      reportingTo: "",
      hireDate: "",
      yearsOfExperience: 0,
      managedBudget: 0,
      accuracyRating: 0,
      qualifications: [],
      certifications: [],
      specializations: [],
      dateOfBirth: "",
      gender: "Male",
      maritalStatus: "Married",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      tag: "",
      notes: "",
    }
  });

  const steps = [
    {
      label: "Basic Information",
      fields: ['executiveName', 'executiveCode', 'email', 'phone', 'mobile', 'jobTitle', 'role']
    },
    {
      label: "Company & Department",
      fields: ['company', 'department', 'location', 'reportingTo', 'hireDate']
    },
    {
      label: "Professional Details",
      fields: ['yearsOfExperience', 'managedBudget', 'qualifications', 'certifications', 'specializations', 'accuracyRating']
    },
    {
      label: "Additional Information",
      fields: ['dateOfBirth', 'gender', 'maritalStatus', 'address', 'emergencyContact']
    },
    {
      label: "Review & Status",
      fields: []
    },
  ];

  // Load data when component opens or data changes
  useEffect(() => {
    if (open && financeExecutiveData) {
      // Set status
      setStatus(financeExecutiveData.status);
      
      // Set form values
      const fields: (keyof IFinanceExecutiveForm)[] = [
        'executiveName', 'executiveCode', 'email', 'phone', 'mobile', 'extension',
        'jobTitle', 'role', 'company', 'department', 'location', 'reportingTo',
        'hireDate', 'yearsOfExperience', 'managedBudget', 'accuracyRating',
        'dateOfBirth', 'gender', 'maritalStatus', 'address', 'emergencyContact',
        'emergencyPhone', 'tag', 'notes'
      ];
      
      fields.forEach(field => {
        const value = financeExecutiveData[field];
        if (value !== undefined && value !== null) {
          setValue(field, value as any);
        }
      });
      
      // Set arrays
      if (financeExecutiveData.qualifications) {
        setSelectedQualifications(financeExecutiveData.qualifications);
        setValue('qualifications', financeExecutiveData.qualifications);
      }
      
      if (financeExecutiveData.certifications) {
        setSelectedCertifications(financeExecutiveData.certifications);
        setValue('certifications', financeExecutiveData.certifications);
      }
      
      if (financeExecutiveData.specializations) {
        setSelectedSpecializations(financeExecutiveData.specializations);
        setValue('specializations', financeExecutiveData.specializations);
      }
    }
  }, [open, financeExecutiveData, setValue]);

  const handleNextStep = async () => {
    const currentStepFields = steps[activeIndex].fields;
    const isValid = await trigger(currentStepFields as any);

    if (isValid) {
      if (activeIndex < steps.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handlePreviousStep = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const onSubmit = (data: IFinanceExecutiveForm) => {
    if (!financeExecutiveData) return;

    const payload: IFinanceExecutive = {
      ...financeExecutiveData,
      ...data,
      qualifications: selectedQualifications,
      certifications: selectedCertifications,
      specializations: selectedSpecializations,
      status: status,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated Finance Executive Payload:", payload);
    toast.success("Finance Executive updated successfully!");
    
    if (onUpdate) {
      onUpdate(payload);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setActiveIndex(0);
    reset();
    setSelectedQualifications([]);
    setSelectedCertifications([]);
    setSelectedSpecializations([]);
  };

  const handleQualificationDelete = (qualificationToDelete: string) => {
    setSelectedQualifications(qualifications => 
      qualifications.filter(qualification => qualification !== qualificationToDelete)
    );
    setValue('qualifications', selectedQualifications.filter(q => q !== qualificationToDelete));
  };

  const handleCertificationDelete = (certificationToDelete: string) => {
    setSelectedCertifications(certifications => 
      certifications.filter(certification => certification !== certificationToDelete)
    );
    setValue('certifications', selectedCertifications.filter(c => c !== certificationToDelete));
  };

  const handleSpecializationDelete = (specializationToDelete: string) => {
    setSelectedSpecializations(specializations => 
      specializations.filter(specialization => specialization !== specializationToDelete)
    );
    setValue('specializations', selectedSpecializations.filter(s => s !== specializationToDelete));
  };

  const renderStepContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="executiveName"
                label="Finance Executive Name"
                required
                register={register("executiveName", {
                  required: "Finance executive name is required",
                })}
                error={errors.executiveName}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="executiveCode"
                label="Employee Code"
                required
                register={register("executiveCode", {
                  required: "Employee Code is required",
                  pattern: {
                    value: /^FE-\d{3,4}$/,
                    message: "Employee Code format: FE-001, FE-1234"
                  }
                })}
                error={errors.executiveCode}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="email"
                label="Email Address"
                required
                type="email"
                register={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="phone"
                label="Phone Number"
                required
                type="tel"
                register={register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]{10,20}$/,
                    message: "Valid phone number required",
                  },
                })}
                error={errors.phone}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="mobile"
                label="Mobile Number"
                type="tel"
                register={register("mobile")}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="jobTitle"
                label="Job Title"
                required
                register={register("jobTitle", {
                  required: "Job title is required",
                })}
                error={errors.jobTitle}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={roles}
                    value={field.value || ''}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select or type role"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        className="w-full"
                      />
                    )}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="extension"
                label="Extension"
                register={register("extension")}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <Controller
                name="company"
                control={control}
                rules={{ required: "Company is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={companies}
                    value={field.value || ''}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select or type company"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        className="w-full"
                      />
                    )}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={departments}
                    value={field.value || ''}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select or type department"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        className="w-full"
                      />
                    )}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="location"
                label="Location"
                required
                register={register("location", {
                  required: "Location is required",
                })}
                error={errors.location}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="reportingTo"
                label="Reporting To"
                register={register("reportingTo")}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="hireDate"
                label="Hire Date"
                required
                type="date"
                register={register("hireDate", {
                  required: "Hire date is required",
                })}
                error={errors.hireDate}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <div className="mb-4">
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <input
                  id="tag"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("tag")}
                  placeholder="e.g., Senior Finance, Tax Expert"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="yearsOfExperience"
                label="Years of Experience"
                required
                type="number"
                register={register("yearsOfExperience", {
                  required: "Experience is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Minimum 0 years" },
                  max: { value: 50, message: "Maximum 50 years" },
                })}
                error={errors.yearsOfExperience}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="managedBudget"
                label="Managed Budget ($)"
                type="number"
                register={register("managedBudget", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Minimum $0" },
                })}
                error={errors.managedBudget}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="accuracyRating"
                label="Accuracy Rating (0-5)"
                type="number"
                register={register("accuracyRating", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Minimum rating is 0" },
                  max: { value: 5, message: "Maximum rating is 5" },
                })}
                error={errors.accuracyRating}
              />
            </div>

            <div className="col-span-12">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications
              </label>
              <Controller
                name="qualifications"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={qualificationOptions}
                    value={selectedQualifications}
                    onChange={(_, newValue) => {
                      setSelectedQualifications(newValue);
                      field.onChange(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          onDelete={() => handleQualificationDelete(option)}
                          key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Add qualifications"
                        className="w-full"
                      />
                    )}
                  />
                )}
              />
            </div>

            <div className="col-span-12">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              <Controller
                name="certifications"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={certificationOptions}
                    value={selectedCertifications}
                    onChange={(_, newValue) => {
                      setSelectedCertifications(newValue);
                      field.onChange(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          onDelete={() => handleCertificationDelete(option)}
                          key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Add certifications"
                        className="w-full"
                      />
                    )}
                  />
                )}
              />
            </div>

            <div className="col-span-12">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations
              </label>
              <Controller
                name="specializations"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={specializationOptions}
                    value={selectedSpecializations}
                    onChange={(_, newValue) => {
                      setSelectedSpecializations(newValue);
                      field.onChange(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                        label={option}
                        {...getTagProps({ index })}
                        onDelete={() => handleSpecializationDelete(option)}
                        key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Add specializations"
                        className="w-full"
                      />
                    )}
                  />
                )}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                register={register("dateOfBirth")}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors bg-white"
                {...register("gender")}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors bg-white"
                {...register("maritalStatus")}
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div className="col-span-12">
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("address")}
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="emergencyContact"
                label="Emergency Contact Name"
                register={register("emergencyContact")}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="emergencyPhone"
                label="Emergency Contact Phone"
                type="tel"
                register={register("emergencyPhone")}
              />
            </div>

            <div className="col-span-12">
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("notes")}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Finance Executive Status</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {status === "Active"
                      ? "This finance executive will be active and can manage financial operations"
                      : status === "On Leave"
                        ? "This finance executive will be on leave and temporarily inactive"
                        : status === "Pending"
                          ? "This finance executive will be pending review and activation"
                          : "This finance executive will be inactive and cannot access financial systems"}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive" | "On Leave" | "Pending")}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className={`mt-4 px-4 py-3 rounded-md ${status === "Active"
                ? "bg-green-50 border border-green-200"
                : status === "On Leave"
                  ? "bg-yellow-50 border border-yellow-200"
                  : status === "Pending"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-100 border border-gray-200"
                }`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${status === "Active"
                    ? "bg-green-500"
                    : status === "On Leave"
                      ? "bg-yellow-500"
                      : status === "Pending"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    }`}></div>
                  <span className={`text-sm ${status === "Active"
                    ? "text-green-700"
                    : status === "On Leave"
                      ? "text-yellow-700"
                      : status === "Pending"
                        ? "text-blue-700"
                        : "text-gray-600"
                    }`}>
                    {status === "Active"
                      ? '✓ Finance executive is active and can perform all financial functions.'
                      : status === "On Leave"
                        ? '⚠ Finance executive is on temporary leave. Access will be limited.'
                        : status === "Pending"
                          ? '⏳ Finance executive is pending review and requires approval.'
                          : '✗ Finance executive is inactive and cannot access financial systems.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-4">Review Changes</h4>
              <p className="text-blue-700 text-sm mb-3">
                Review all information before updating. You can edit any step by going back.
              </p>
              <ul className="text-blue-700 text-sm space-y-2">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All required fields are completed
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Professional qualifications are verified
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Financial access levels are set appropriately
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!financeExecutiveData) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 2, bgcolor: 'primary.50' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Box>
            <Box>
              <Typography variant="h6" component="div">
                Update Finance Executive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {financeExecutiveData.executiveName} • {financeExecutiveData.executiveCode}
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Stepper */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Stepper activeStep={activeIndex} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Current Step Indicator */}
        <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Step {activeIndex + 1}: {steps[activeIndex].label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeIndex === 0 && "Update basic finance executive information"}
                {activeIndex === 1 && "Update company and department details"}
                {activeIndex === 2 && "Update professional qualifications and financial details"}
                {activeIndex === 3 && "Update additional personal information"}
                {activeIndex === 4 && "Review changes and update status"}
              </Typography>
            </Box>
            <Box sx={{
              px: 2,
              py: 1,
              bgcolor: 'primary.50',
              borderRadius: '20px',
              color: 'primary.main',
              fontWeight: 'medium',
              fontSize: '0.875rem'
            }}>
              {Math.round(((activeIndex + 1) / steps.length) * 100)}% Complete
            </Box>
          </Box>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 4 }}>
          <form id="update-finance-executive-form" onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeIndex)}
          </form>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeIndex > 0 && (
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={handlePreviousStep}
            >
              Previous
            </Button>
          )}

          {activeIndex < steps.length - 1 ? (
            <Button
              type="button"
              variant="contained"
              color="primary"
              className="!text-white"
              onClick={handleNextStep}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="submit"
              form="update-finance-executive-form"
              variant="contained"
              color="primary"
              className="!text-white"
              sx={{
                bgcolor: 'success.main',
                '&:hover': {
                  bgcolor: 'success.dark',
                }
              }}
            >
              <Box display="flex" alignItems="center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Finance Executive
              </Box>
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateFinanceExecutiveModal;