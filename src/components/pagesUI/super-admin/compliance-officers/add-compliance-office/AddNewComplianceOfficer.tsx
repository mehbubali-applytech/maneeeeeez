"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { IComplianceOfficerForm, IComplianceOfficer } from "../compliance-officers.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

// Mock data
const qualificationOptions = [
  "JD (Juris Doctor)",
  "LLM in Corporate Law",
  "MBA",
  "BS in Business Administration",
  "MS in Risk Management",
  "BA in Legal Studies",
  "LLB (Bachelor of Laws)",
  "MBA Compliance",
  "MS in Regulatory Affairs",
  "Certified Compliance Professional",
  "Certified AML Specialist",
  "Certified Privacy Professional"
];

const certificationOptions = [
  "CAMS (Certified Anti-Money Laundering Specialist)",
  "CRCM (Certified Regulatory Compliance Manager)",
  "CIPP (Certified Information Privacy Professional)",
  "CIPM (Certified Information Privacy Manager)",
  "CISA (Certified Information Systems Auditor)",
  "CFE (Certified Fraud Examiner)",
  "CPA (Certified Public Accountant)",
  "CEBS (Certified Employee Benefit Specialist)",
  "CCEP (Certified Compliance & Ethics Professional)",
  "CCEP-I (Certified Compliance & Ethics Professional - International)",
  "CCB (Certified Compliance Banker)",
  "CRCP (Certified Regulatory Compliance Professional)",
  "FCPA (Foreign Corrupt Practices Act Certification)"
];

const specializationOptions = [
  "Anti-Money Laundering (AML)",
  "Know Your Customer (KYC)",
  "Data Privacy & GDPR",
  "Financial Regulations",
  "Risk Assessment & Management",
  "Compliance Training",
  "Corporate Governance",
  "Ethics & Code of Conduct",
  "Whistleblower Programs",
  "Regulatory Affairs",
  "Internal Audit",
  "Transaction Monitoring",
  "Sanctions Compliance",
  "Financial Crime Prevention",
  "Environmental Compliance",
  "Healthcare Compliance",
  "Banking Regulations",
  "Insurance Compliance",
  "Securities Compliance",
  "International Trade Compliance"
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
  "Legal & Compliance",
  "Risk & Compliance",
  "AML Compliance",
  "Data Privacy",
  "Regulatory Affairs",
  "Ethics & Compliance",
  "Corporate Governance",
  "Environmental Compliance",
  "Quality Assurance",
  "Internal Audit"
];

const roles = [
  "Chief Compliance Officer (CCO)",
  "Compliance Director",
  "Compliance Manager",
  "Compliance Officer",
  "Compliance Specialist",
  "Compliance Analyst",
  "AML Officer",
  "Privacy Officer",
  "Risk Manager",
  "Regulatory Affairs Manager",
  "Ethics Officer",
  "Compliance Auditor",
  "Compliance Coordinator",
  "Compliance Consultant"
];

const genderOptions = ["Male", "Female", "Other"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
const statusOptions = ["Active", "Inactive", "On Leave", "Pending"];

interface AddEditComplianceOfficerMainAreaProps {
  mode?: "add" | "edit";
  complianceOfficerData?: IComplianceOfficer | null;
}

const AddEditComplianceOfficerMainArea: React.FC<AddEditComplianceOfficerMainAreaProps> = ({
  mode = "add",
  complianceOfficerData = null,
}) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [status, setStatus] = useState<"Active" | "Inactive" | "On Leave" | "Pending">("Active");
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<IComplianceOfficerForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm<IComplianceOfficerForm>({
    defaultValues: {
      complianceScore: 0,
      yearsOfExperience: 0,
      managedAudits: 0,
      qualifications: [],
      certifications: [],
      specializations: [],
      role: "Compliance Officer",
      status: "Active",
      gender: undefined,
      maritalStatus: undefined,
    },
  });

  const steps = [
    {
      label: "Basic Information",
      fields: ['officerName', 'officerCode', 'email', 'phone', 'mobile', 'jobTitle', 'role']
    },
    {
      label: "Company & Location",
      fields: ['company', 'department', 'location', 'reportingTo', 'hireDate']
    },
    {
      label: "Professional Details",
      fields: ['yearsOfExperience', 'managedAudits', 'qualifications', 'certifications', 'specializations', 'complianceScore']
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

  // Load compliance officer data in edit mode
  useEffect(() => {
    if (mode === "edit" && complianceOfficerData) {
      // Transform compliance officer data to form data
      const formValues: Partial<IComplianceOfficerForm> = {
        officerName: complianceOfficerData.officerName,
        officerCode: complianceOfficerData.officerCode,
        email: complianceOfficerData.email,
        phone: complianceOfficerData.phone,
        mobile: complianceOfficerData.mobile || "",
        jobTitle: complianceOfficerData.jobTitle,
        role: complianceOfficerData.role,
        company: complianceOfficerData.company,
        department: complianceOfficerData.department,
        location: complianceOfficerData.location,
        reportingTo: complianceOfficerData.reportingTo || "",
        hireDate: complianceOfficerData.hireDate,
        tag: complianceOfficerData.tag || "",
        yearsOfExperience: complianceOfficerData.yearsOfExperience || 0,
        managedAudits: complianceOfficerData.managedAudits || 0,
        complianceScore: complianceOfficerData.complianceScore || 0,
        dateOfBirth: complianceOfficerData.dateOfBirth || "",
        gender: complianceOfficerData.gender || undefined,
        maritalStatus: complianceOfficerData.maritalStatus || undefined,
        address: complianceOfficerData.address || "",
        emergencyContact: complianceOfficerData.emergencyContact || "",
        emergencyPhone: complianceOfficerData.emergencyPhone || "",
        notes: complianceOfficerData.notes || "",
        extension: complianceOfficerData.extension || "",
        status: complianceOfficerData.status,
      };

      // Set form values
      Object.entries(formValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const formKey = key as Extract<keyof IComplianceOfficerForm, string>;
          setValue(formKey, value as any);
        }
      });

      // Set selected arrays
      if (complianceOfficerData.qualifications) {
        setSelectedQualifications(complianceOfficerData.qualifications);
        setValue("qualifications", complianceOfficerData.qualifications);
      }

      if (complianceOfficerData.certifications) {
        setSelectedCertifications(complianceOfficerData.certifications);
        setValue("certifications", complianceOfficerData.certifications);
      }

      if (complianceOfficerData.specializations) {
        setSelectedSpecializations(complianceOfficerData.specializations);
        setValue("specializations", complianceOfficerData.specializations);
      }

      // Set status
      setStatus(complianceOfficerData.status);

      // Load into formData state
      setFormData(formValues);
    }
  }, [mode, complianceOfficerData, setValue]);

  const handleNextStep = async () => {
    const currentStepFields = steps[activeIndex].fields;
    const isValid = await trigger(currentStepFields as any);

    if (isValid) {
      const currentValues = getValues();
      setFormData(prev => ({ ...prev, ...currentValues }));

      if (activeIndex < steps.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handlePreviousStep = () => {
    if (activeIndex > 0) {
      const currentValues = getValues();
      setFormData(prev => ({ ...prev, ...currentValues }));
      setActiveIndex(activeIndex - 1);
    }
  };

  const onSubmit = async (data: IComplianceOfficerForm) => {
    setIsSubmitting(true);

    try {
      const payload: IComplianceOfficerForm = {
        ...formData,
        ...data,
        qualifications: selectedQualifications,
        certifications: selectedCertifications,
        specializations: selectedSpecializations,
        status: status,
        complianceScore: data.complianceScore || formData.complianceScore || 0,
      };

      // Add mode-specific data
      if (mode === "add") {
        (payload as any).id = Date.now();
        (payload as any).createdAt = new Date().toISOString();
        (payload as any).updatedAt = new Date().toISOString();
      } else if (mode === "edit" && complianceOfficerData) {
        (payload as any).id = complianceOfficerData.id;
        (payload as any).createdAt = complianceOfficerData.createdAt;
        (payload as any).updatedAt = new Date().toISOString();
      }

      console.log("Compliance Officer Payload:", payload);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(mode === "add" ? "Compliance Officer added successfully!" : "Compliance Officer updated successfully!");

      setTimeout(() => {
        router.push("/super-admin/compliance-officers");
      }, 500);
    } catch (error) {
      console.error(`Error ${mode === "add" ? "adding" : "updating"} compliance officer:`, error);
      toast.error(mode === "add" ? "Failed to add compliance officer" : "Failed to update compliance officer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/super-admin/compliance-officers");
      }
    } else {
      router.push("/super-admin/compliance-officers");
    }
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
            {/* Officer Name */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="officerName"
                label="Compliance Officer Name"
                required
                register={register("officerName", {
                  required: "Compliance officer name is required",
                })}
                error={errors.officerName}
              />
            </div>

            {/* Officer Code */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="officerCode"
                label="Officer Code"
                required
                defaultValue={mode === "add" ? "CO-" : watch("officerCode")}
                register={register("officerCode", {
                  required: "Officer Code is required",
                  pattern: {
                    value: /^CO-\d{3,4}$/,
                    message: "Officer Code format: CO-001, CO-1234",
                  },
                  disabled: mode === "edit",
                })}
                error={errors.officerCode}
              />

              {mode === "edit" && (
                <p className="text-gray-500 text-xs mt-1">Officer Code cannot be changed after creation</p>
              )}
            </div>

            {/* Email */}
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

            {/* Phone */}
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

            {/* Mobile */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="mobile"
                label="Mobile Number"
                type="tel"
                register={register("mobile")}
              />
            </div>

            {/* Job Title */}
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

            {/* Role */}
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

            {/* Extension */}
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
            {/* Company */}
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

            {/* Department */}
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

            {/* Location */}
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

            {/* Reporting To */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="reportingTo"
                label="Reporting To"
                register={register("reportingTo")}
              />
            </div>

            {/* Hire Date */}
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

            {/* Tag */}
            <div className="col-span-12 lg:col-span-6">
              <div className="mb-4">
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <input
                  id="tag"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("tag")}
                  placeholder="e.g., Senior Compliance, AML Expert"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Years of Experience */}
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

            {/* Audits Managed */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="managedAudits"
                label="Audits Managed"
                type="number"
                register={register("managedAudits", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Minimum 0 audits" },
                })}
                error={errors.managedAudits}
              />
            </div>

            {/* Compliance Score */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="complianceScore"
                label="Compliance Score (0-5)"
                type="number"
                register={register("complianceScore", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Minimum score is 0" },
                  max: { value: 5, message: "Maximum score is 5" },
                })}
                error={errors.complianceScore}
              />
            </div>

            {/* Qualifications */}
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
                          size="small"
                          className="m-1"
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

            {/* Certifications */}
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
                          size="small"
                          className="m-1"
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

            {/* Specializations */}
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
                          size="small"
                          className="m-1"
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
            {/* Date of Birth */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                register={register("dateOfBirth")}
              />
            </div>

            {/* Gender */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={genderOptions}
                    value={field.value || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select gender"
                        className="w-full"
                      />
                    )}
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* Marital Status */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status
              </label>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={maritalStatusOptions}
                    value={field.value || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select marital status"
                        className="w-full"
                      />
                    )}
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* Address */}
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

            {/* Emergency Contact */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="emergencyContact"
                label="Emergency Contact Name"
                register={register("emergencyContact")}
              />
            </div>

            {/* Emergency Phone */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="emergencyPhone"
                label="Emergency Contact Phone"
                type="tel"
                register={register("emergencyPhone")}
              />
            </div>

            {/* Notes */}
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
            {/* Status Selection */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Compliance Officer Status</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Set the current status of this compliance officer
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <select
                        value={status}
                        onChange={(e) => {
                          const newStatus = e.target.value as "Active" | "Inactive" | "On Leave" | "Pending";
                          setStatus(newStatus);
                          field.onChange(newStatus);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  />
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
                      ? '✓ Compliance officer is active and can perform all compliance functions.'
                      : status === "On Leave"
                        ? '⚠ Compliance officer is on temporary leave. Access will be limited.'
                        : status === "Pending"
                          ? '⏳ Compliance officer is pending review and requires approval.'
                          : '✗ Compliance officer is inactive and cannot perform compliance functions.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-4">
                {mode === "add" ? "Ready to Create Compliance Officer" : "Ready to Update Compliance Officer"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Basic Information</p>
                  <p className="text-blue-600 text-sm">
                    {watch("officerName")}
                    <br />
                    {watch("officerCode")}
                    <br />
                    {watch("email")}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 text-sm font-medium">Professional Details</p>
                  <p className="text-blue-600 text-sm">
                    {watch("company")}
                    <br />
                    {watch("department")}
                    <br />
                    {watch("role")}
                    <br />
                    {watch("yearsOfExperience")} years experience
                  </p>
                </div>
              </div>

              {/* Qualifications Summary */}
              {selectedQualifications.length > 0 && (
                <div className="mb-3">
                  <p className="text-blue-700 text-sm font-medium">Qualifications</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedQualifications.slice(0, 3).map((qual, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {qual}
                      </span>
                    ))}
                    {selectedQualifications.length > 3 && (
                      <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                        +{selectedQualifications.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Certifications Summary */}
              {selectedCertifications.length > 0 && (
                <div className="mb-3">
                  <p className="text-blue-700 text-sm font-medium">Certifications</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCertifications.slice(0, 3).map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {cert}
                      </span>
                    ))}
                    {selectedCertifications.length > 3 && (
                      <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                        +{selectedCertifications.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-blue-700 text-sm mb-3">
                {mode === "add"
                  ? "Review all information before submitting. You can edit any step by going back."
                  : "Review all changes before updating. You can edit any step by going back."}
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
                  Compliance certifications are verified
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Access levels are set appropriately for compliance systems
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
            <li className="breadcrumb-item">
              <Link href="/super-admin/compliance-officers">Compliance Officers</Link>
            </li>
            <li className="breadcrumb-item active">
              {mode === "add" ? "Add Compliance Officer" : `Edit Compliance Officer`}
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "add" ? "Add New Compliance Officer" : `Edit Compliance Officer`}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === "add" ? "Fill in the compliance officer details step by step" : "Update compliance officer information"}
          {mode === "edit" && complianceOfficerData && (
            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
              ID: {complianceOfficerData.officerCode}
            </span>
          )}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Stepper */}
        <div className="p-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Step {activeIndex + 1} of {steps.length}: {steps[activeIndex].label}
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {Math.round(((activeIndex + 1) / steps.length) * 100)}% Complete
              </span>
              {mode === "edit" && complianceOfficerData && (
                <span className={`ml-2 px-2 py-1 rounded text-xs ${complianceOfficerData.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : complianceOfficerData.status === "Inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                  {complianceOfficerData.status}
                </span>
              )}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{steps[activeIndex].label}</h2>
              <p className="text-gray-600 text-sm">
                {activeIndex === 0 && "Enter basic compliance officer information"}
                {activeIndex === 1 && "Provide company and location details"}
                {activeIndex === 2 && "Add professional qualifications and compliance details"}
                {activeIndex === 3 && "Enter additional personal information"}
                {activeIndex === 4 && "Review and set compliance officer status"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8">
            {renderStepContent(activeIndex)}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <div className="flex items-center space-x-4">
                {activeIndex > 0 && (
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={handlePreviousStep}
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}

                {activeIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {mode === "add" ? "Creating..." : "Updating..."}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {mode === "add" ? "Create Compliance Officer" : "Update Compliance Officer"}
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-800">
              {mode === "add" ? "Tips for adding a new compliance officer" : "Tips for editing compliance officer"}
            </h4>
            <ul className="mt-2 text-blue-700 text-sm space-y-1">
              <li>• Ensure all required certifications are listed for regulatory compliance</li>
              <li>• Verify compliance score based on previous performance or assessments</li>
              <li>• Include all relevant specializations for accurate role assignment</li>
              <li>• Set appropriate access levels based on compliance responsibilities</li>
              <li>• All fields marked with * are required for audit trail</li>
              {mode === "edit" && (
                <li>• Officer Code cannot be changed after creation</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditComplianceOfficerMainArea;