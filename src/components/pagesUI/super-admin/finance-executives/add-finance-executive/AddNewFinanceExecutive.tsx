"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { IFinanceExecutiveForm } from "../finance-executives.interface";
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

const AddNewFinanceExecutive: React.FC = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"Active" | "Inactive" | "On Leave" | "Pending">("Active");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [formData, setFormData] = useState<Partial<IFinanceExecutiveForm>>({});
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<IFinanceExecutiveForm>({
    defaultValues: {
      accuracyRating: 0,
      yearsOfExperience: 0,
      managedBudget: 0,
      qualifications: [],
      certifications: [],
      specializations: [],
      role: "",
      company: "",
      department: ""
    },
    mode: "onChange"
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

  const handleNextStep = async () => {
    const currentStepFields = steps[activeIndex].fields;
    
    // Trigger validation only for current step fields
    const fieldNames = currentStepFields as Array<keyof IFinanceExecutiveForm>;
    
    // Get validation result for each field
    const validationResults = await Promise.all(
      fieldNames.map(field => trigger(field))
    );
    
    // Check if all fields passed validation
    const isValid = validationResults.every(result => result === true);
    
    if (isValid) {
      // Get all current form values
      const currentValues = getValues();
      
      // Update formData with current values
      setFormData(prev => ({ 
        ...prev, 
        ...currentValues,
        qualifications: selectedQualifications,
        certifications: selectedCertifications,
        specializations: selectedSpecializations
      }));

      if (activeIndex < steps.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } else {
      // Find which fields failed
      const failedFields = fieldNames.filter((_, index) => !validationResults[index]);
      console.log('Failed fields:', failedFields);
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handlePreviousStep = () => {
    if (activeIndex > 0) {
      // Get all current form values
      const currentValues = getValues();
      
      // Update formData with current values
      setFormData(prev => ({ 
        ...prev, 
        ...currentValues,
        qualifications: selectedQualifications,
        certifications: selectedCertifications,
        specializations: selectedSpecializations
      }));
      
      setActiveIndex(activeIndex - 1);
    }
  };

  useEffect(() => {
    // Sync formData with react-hook-form values
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const formKey = key as Extract<keyof IFinanceExecutiveForm, string>;
        setValue(formKey, value as any);
      }
    });
    
    // Also sync the array states
    if (formData.qualifications) {
      setSelectedQualifications(formData.qualifications);
    }
    if (formData.certifications) {
      setSelectedCertifications(formData.certifications);
    }
    if (formData.specializations) {
      setSelectedSpecializations(formData.specializations);
    }
  }, [activeIndex, formData, setValue]);

  const onSubmit = (data: IFinanceExecutiveForm) => {
    const payload = {
      ...formData,
      ...data,
      qualifications: selectedQualifications.length > 0 ? selectedQualifications : data.qualifications || [],
      certifications: selectedCertifications.length > 0 ? selectedCertifications : data.certifications || [],
      specializations: selectedSpecializations.length > 0 ? selectedSpecializations : data.specializations || [],
      status: status,
      accuracyRating: data.accuracyRating || formData.accuracyRating || 0,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Finance Executive Payload:", payload);
    toast.success("Finance Executive added successfully!");
    setTimeout(() => {
      router.push("/super-admin/finance-executives");
    }, 500);
  };

  const handleQualificationDelete = (qualificationToDelete: string) => {
    setSelectedQualifications(qualifications => 
      qualifications.filter(qualification => qualification !== qualificationToDelete)
    );
  };

  const handleCertificationDelete = (certificationToDelete: string) => {
    setSelectedCertifications(certifications => 
      certifications.filter(certification => certification !== certificationToDelete)
    );
  };

  const handleSpecializationDelete = (specializationToDelete: string) => {
    setSelectedSpecializations(specializations => 
      specializations.filter(specialization => specialization !== specializationToDelete)
    );
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
                defaultValue={"FE-"}
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
                register={register("mobile", {
                  pattern: {
                    value: /^[0-9+\-\s()]{0,20}$/,
                    message: "Valid phone number required",
                  },
                })}
                error={errors.mobile}
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
                    onBlur={field.onBlur}
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
                    onBlur={field.onBlur}
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
                    onBlur={field.onBlur}
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
                    className="w-full"
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
                    className="w-full"
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
                    className="w-full"
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
                register={register("emergencyPhone", {
                  pattern: {
                    value: /^[0-9+\-\s()]{0,20}$/,
                    message: "Valid phone number required",
                  },
                })}
                error={errors.emergencyPhone}
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
              <h4 className="font-medium text-blue-800 mb-4">Ready to Create Finance Executive</h4>
              <p className="text-blue-700 text-sm mb-3">
                Review all information before submitting. You can edit any step by going back.
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

  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/super-admin">Super Admin</Link>
            </li>
            <li className="breadcrumb-item active">Add Finance Executive</li>
          </ol>
        </nav>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Finance Executive</h1>
        <p className="text-gray-600 mt-2">Fill in the finance executive details step by step</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Step {activeIndex + 1} of {steps.length}: {steps[activeIndex].label}
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {Math.round(((activeIndex + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
          </div>

          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${index <= activeIndex
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${index <= activeIndex ? "text-primary" : "text-gray-500"
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${index < activeIndex ? "bg-primary" : "bg-gray-200"
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{steps[activeIndex].label}</h2>
              <p className="text-gray-600 text-sm">
                {activeIndex === 0 && "Enter basic finance executive information"}
                {activeIndex === 1 && "Provide company and department details"}
                {activeIndex === 2 && "Add professional qualifications and financial details"}
                {activeIndex === 3 && "Enter additional personal information"}
                {activeIndex === 4 && "Review and set finance executive status"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8">
            {renderStepContent(activeIndex)}

            <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/super-admin/finance-executives")}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>

              <div className="flex items-center space-x-4">
                {activeIndex > 0 && (
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                )}

                {activeIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={handleNextStep}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Finance Executive
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-800">Tips for adding a new finance executive</h4>
            <ul className="mt-2 text-blue-700 text-sm space-y-1">
              <li>• Ensure all required certifications are listed for compliance</li>
              <li>• Verify financial authority levels and managed budget amounts</li>
              <li>• Double-check contact information for financial communications</li>
              <li>• Set appropriate access levels based on role and responsibilities</li>
              <li>• All fields marked with * are required for audit trail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewFinanceExecutive;