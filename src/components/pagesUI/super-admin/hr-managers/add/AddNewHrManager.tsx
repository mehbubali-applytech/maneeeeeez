"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { IHrManagerForm } from "../hr-managers.interface";

const qualificationOptions = [
  "MBA",
  "MS in HR",
  "BS in HR",
  "PHR Certification",
  "SHRM-CP",
  "SPHR",
  "GPHR",
  "MBA Finance",
  "MS in Psychology",
  "BA in Business",
  "LLB",
  "MA in Industrial Relations",
  "Certified Trainer",
  "CPA",
  "PMP"
];

const certificationOptions = [
  "SHRM-CP",
  "SHRM-SCP",
  "PHR",
  "SPHR",
  "GPHR",
  "HRIP",
  "CPLP",
  "ATD Master Trainer",
  "Certified Compliance Professional",
  "PMP",
  "Six Sigma",
  "Professional Coach"
];

const specializationOptions = [
  "Talent Acquisition",
  "Recruitment",
  "Employee Relations",
  "Compensation & Benefits",
  "HR Analytics",
  "Performance Management",
  "Learning & Development",
  "Training & Development",
  "HR Compliance",
  "Legal Compliance",
  "HR Information Systems",
  "HR Software",
  "Employee Engagement",
  "Wellness Programs",
  "International HR",
  "Expat Management",
  "Diversity & Inclusion",
  "Succession Planning",
  "Labor Relations",
  "HR Strategy"
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
  "Human Resources",
  "HR Operations",
  "Talent Acquisition",
  "Recruitment",
  "Employee Relations",
  "Learning & Development",
  "Compensation & Benefits",
  "HR Compliance",
  "HR Information Systems",
  "Wellness & Engagement",
  "International HR"
];

const AddNewHrManager: React.FC = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"Active" | "Inactive" | "On Leave" | "Pending">("Active");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [formData, setFormData] = useState<Partial<IHrManagerForm>>({});
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
  } = useForm<IHrManagerForm>({
    defaultValues: {
      rating: 0,
      yearsOfExperience: 0,
      managedEmployees: 0,
      qualifications: [],
      certifications: [],
      specializations: [],
    }
  });

  const steps = [
    {
      label: "Basic Information",
      fields: ['hrName', 'hrCode', 'email', 'phone', 'mobile', 'jobTitle']
    },
    {
      label: "Company & Department",
      fields: ['company', 'department', 'location', 'reportingTo', 'hireDate']
    },
    {
      label: "Professional Details",
      fields: ['yearsOfExperience', 'qualifications', 'certifications', 'specializations', 'managedEmployees']
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

  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const formKey = key as Extract<keyof IHrManagerForm, string>;
        setValue(formKey, value as any);
      }
    });
  }, [activeIndex, formData, setValue]);

  const onSubmit = (data: IHrManagerForm) => {
    const payload = {
      ...formData,
      ...data,
      qualifications: selectedQualifications,
      certifications: selectedCertifications,
      specializations: selectedSpecializations,
      status: status,
      rating: data.rating || formData.rating || 0,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("HR Manager Payload:", payload);
    toast.success("HR Manager added successfully!");
    setTimeout(() => {
      router.push("/super-admin/hr-managers");
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
                id="hrName"
                label="HR Manager Name"
                required
                register={register("hrName", {
                  required: "HR Manager name is required",
                })}
                error={errors.hrName}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="hrCode"
                label="HR Code"
                required
                register={register("hrCode", {
                  required: "HR Code is required",
                  pattern: {
                    value: /^HR-\d{3,4}$/,
                    message: "HR Code format: HR-001, HR-1234"
                  }
                })}
                error={errors.hrCode}
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

            <div className="col-span-12">
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
                  placeholder="e.g., Senior HR, Recruitment Expert"
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
                id="managedEmployees"
                label="Managed Employees"
                type="number"
                register={register("managedEmployees", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Minimum 0" },
                })}
                error={errors.managedEmployees}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="rating"
                label="Rating (0-5)"
                type="number"
                register={register("rating", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Minimum rating is 0" },
                  max: { value: 5, message: "Maximum rating is 5" },
                })}
                error={errors.rating}
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
                  <h4 className="font-medium text-gray-800">HR Manager Status</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {status === "Active"
                      ? "This HR manager will be active and can manage employees"
                      : status === "On Leave"
                        ? "This HR manager will be on leave and temporarily inactive"
                        : status === "Pending"
                          ? "This HR manager will be pending review and activation"
                          : "This HR manager will be inactive and cannot manage employees"}
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
                      ? '✓ HR Manager is active and can perform all HR functions.'
                      : status === "On Leave"
                        ? '⚠ HR Manager is on temporary leave. Access will be limited.'
                        : status === "Pending"
                          ? '⏳ HR Manager is pending review and requires approval.'
                          : '✗ HR Manager is inactive and cannot access the system.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-4">Ready to Create HR Manager</h4>
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
                  Contact information is verified
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Professional details are added
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
            <li className="breadcrumb-item active">Add HR Manager</li>
          </ol>
        </nav>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New HR Manager</h1>
        <p className="text-gray-600 mt-2">Fill in the HR manager details step by step</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{steps[activeIndex].label}</h2>
              <p className="text-gray-600 text-sm">
                {activeIndex === 0 && "Enter basic HR manager information"}
                {activeIndex === 1 && "Provide company and department details"}
                {activeIndex === 2 && "Add professional qualifications and experience"}
                {activeIndex === 3 && "Enter additional personal information"}
                {activeIndex === 4 && "Review and set HR manager status"}
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
                onClick={() => router.push("/super-admin/hr-managers")}
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
                      Create HR Manager
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
            <h4 className="font-medium text-blue-800">Tips for adding a new HR manager</h4>
            <ul className="mt-2 text-blue-700 text-sm space-y-1">
              <li>• Use the auto-suggest dropdowns for consistent data entry</li>
              <li>• Add relevant qualifications and certifications for better profile</li>
              <li>• Ensure contact information is accurate for communication</li>
              <li>• Set appropriate status based on HR {`manager's`} availability</li>
              <li>• All fields marked with * are required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewHrManager;