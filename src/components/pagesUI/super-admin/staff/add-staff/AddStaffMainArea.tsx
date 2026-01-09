"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { IStaffForm, IStaff } from "../staff.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

// Mock data for dropdowns (same as before)
const positions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Project Manager",
  "Product Manager",
  "UI/UX Designer",
  "System Administrator",
  "Network Engineer",
  "Data Analyst",
  "Data Scientist",
  "Business Analyst",
  "HR Manager",
  "Recruiter",
  "Marketing Specialist",
  "Sales Executive",
  "Accountant",
  "Finance Manager",
  "Operations Manager",
  "CEO",
  "CTO",
  "CFO",
];

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Support",
  "Research & Development",
  "IT",
  "Legal",
  "Administration",
];

const employmentTypes = ["Full-time", "Part-time", "Contract", "Intern"] as const;
const statusOptions = ["Active", "Inactive", "On Leave", "Terminated"] as const;

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
];

const genders = ["Male", "Female", "Other", "Prefer not to say"];

const skillsList = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Git",
  "CI/CD",
  "Agile",
  "Scrum",
  "Project Management",
  "UI/UX Design",
  "Figma",
  "Adobe Creative Suite",
  "SEO",
  "Digital Marketing",
  "Salesforce",
  "Data Analysis",
  "Machine Learning",
  "AI",
];

const companies = [
  { id: 1, name: "TechCorp Inc." },
  { id: 2, name: "Innovate Solutions" },
  { id: 3, name: "Global Systems" },
  { id: 4, name: "Digital Ventures" },
  { id: 5, name: "Future Tech" },
  { id: 6, name: "Cloud Networks" },
  { id: 7, name: "Data Insights" },
  { id: 8, name: "Mobile First" },
];

const supervisors = [
  "John Smith",
  "Emma Johnson",
  "Michael Brown",
  "Sarah Davis",
  "Robert Wilson",
  "Jennifer Miller",
  "David Taylor",
  "Lisa Anderson",
];

const locations = [
  "New York Office",
  "London Office",
  "Tokyo Office",
  "Sydney Office",
  "Berlin Office",
  "Singapore Office",
  "Toronto Office",
  "Remote",
  "Hybrid",
];

interface AddStaffMainAreaProps {
  mode?: "add" | "edit";
  staffData?: IStaff | null;
}

const AddStaffMainArea: React.FC<AddStaffMainAreaProps> = ({
  mode = "add",
  staffData = null,
}) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{ id: number; name: string } | null>(null);
  const [formData, setFormData] = useState<Partial<IStaffForm>>({});
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
  } = useForm<IStaffForm>({
    defaultValues: {
      salary: 0,
      experience: 0,
      status: "Active",
      employmentType: "Full-time",
      currency: "USD",
      ...(mode === "edit" && staffData ? {
        firstName: staffData.firstName || "",
        lastName: staffData.lastName || "",
        email: staffData.email || "",
        phone: staffData.phone || "",
        mobile: staffData.mobile || "",
        position: staffData.position || "",
        department: staffData.department || "",
        company: staffData.company || "",
        companyId: staffData.companyId || 0,
        location: staffData.location || "",
        joinDate: staffData.joinDate || "",
        status: staffData.status || "Active",
        employmentType: staffData.employmentType || "Full-time",
        salary: staffData.salary || 0,
        currency: staffData.currency || "USD",
        supervisor: staffData.supervisor || "",
        gender: staffData.gender || "",
        dateOfBirth: staffData.dateOfBirth || "",
        address: staffData.address || "",
        city: staffData.city || "",
        country: staffData.country || "",
        zipCode: staffData.zipCode || "",
        emergencyContact: staffData.emergencyContact || "",
        education: staffData.education || "",
        experience: staffData.experience || 0,
        notes: staffData.notes || "",
      } : {}),
    },
  });

  const steps = [
    {
      label: "Personal Information",
      fields: ["firstName", "lastName", "email", "phone", "mobile", "gender", "dateOfBirth"],
    },
    {
      label: "Employment Details",
      fields: ["position", "department", "company", "companyId", "location", "joinDate", "employmentType", "supervisor"],
    },
    {
      label: "Compensation",
      fields: ["salary", "currency"],
    },
    {
      label: "Additional Information",
      fields: ["address", "city", "country", "zipCode", "emergencyContact", "skills", "education", "experience", "notes"],
    },
    {
      label: "Review & Status",
      fields: ["status"],
    },
  ];

  // Initialize form with staff data in edit mode
  useEffect(() => {
    if (mode === "edit" && staffData) {
      // Set form values
      const formValues: Partial<IStaffForm> = {
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        phone: staffData.phone,
        mobile: staffData.mobile,
        position: staffData.position,
        department: staffData.department,
        company: staffData.company,
        companyId: staffData.companyId,
        location: staffData.location,
        joinDate: staffData.joinDate,
        status: staffData.status,
        employmentType: staffData.employmentType,
        salary: staffData.salary,
        currency: staffData.currency,
        supervisor: staffData.supervisor,
        gender: staffData.gender,
        dateOfBirth: staffData.dateOfBirth,
        address: staffData.address,
        city: staffData.city,
        country: staffData.country,
        zipCode: staffData.zipCode,
        emergencyContact: staffData.emergencyContact,
        education: staffData.education,
        experience: staffData.experience,
        notes: staffData.notes,
      };

      // Set form values
      Object.entries(formValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const formKey = key as Extract<keyof IStaffForm, string>;
          setValue(formKey, value as any);
        }
      });

      // Set selected skills
      if (staffData.skills) {
        setSelectedSkills(staffData.skills);
        setValue("skills", staffData.skills);
      }

      // Set selected company
      if (staffData.companyId && staffData.company) {
        const company = companies.find(c => c.id === staffData.companyId) || 
                      { id: staffData.companyId, name: staffData.company };
        setSelectedCompany(company);
      }

      // Load into formData state
      setFormData(formValues);
    }
  }, [mode, staffData, setValue]);

  const handleNextStep = async () => {
    const currentStepFields = steps[activeIndex].fields;
    const isValid = await trigger(currentStepFields as any);

    if (isValid) {
      const currentValues = getValues();
      setFormData((prev) => ({ ...prev, ...currentValues }));

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
      setFormData((prev) => ({ ...prev, ...currentValues }));
      setActiveIndex(activeIndex - 1);
    }
  };

  const onSubmit = async (data: IStaffForm) => {
    setIsSubmitting(true);

    try {
      const payload: IStaffForm = {
        ...formData,
        ...data,
        skills: selectedSkills,
        company: selectedCompany?.name || data.company || "",
        companyId: selectedCompany?.id || data.companyId || 0,
      };

      console.log("Staff Payload:", payload);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (mode === "add") {
        toast.success("Staff member added successfully!");
      } else {
        toast.success("Staff member updated successfully!");
      }
      
      setTimeout(() => {
        router.push("/super-admin/staff");
      }, 500);
    } catch (error) {
      console.error("Error saving staff:", error);
      toast.error(mode === "add" ? "Failed to add staff member" : "Failed to update staff member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/super-admin/staff");
      }
    } else {
      router.push("/super-admin/staff");
    }
  };

  const renderStepContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* First Name */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="firstName"
                label="First Name"
                required
                register={register("firstName", {
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces allowed",
                  },
                })}
                error={errors.firstName}
              />
            </div>

            {/* Last Name */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="lastName"
                label="Last Name"
                required
                register={register("lastName", {
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces allowed",
                  },
                })}
                error={errors.lastName}
              />
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
                    value: /^[0-9]{6,15}$/,
                    message: "Phone number must contain only digits",
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
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
                register={register("mobile", {
                  pattern: {
                    value: /^[0-9]{0,15}$/,
                    message: "Mobile number must contain only digits",
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
                error={errors.mobile}
              />
            </div>

            {/* Gender - Searchable Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={genders}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select gender"
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

            {/* Date of Birth */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                register={register("dateOfBirth")}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Position - Searchable Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <Controller
                name="position"
                control={control}
                rules={{ required: "Position is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={positions}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Search or type position"
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

            {/* Department - Searchable Dropdown */}
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
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Search or type department"
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

            {/* Company - Searchable Dropdown */}
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
                    value={selectedCompany}
                    options={companies}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, newValue) => {
                      setSelectedCompany(newValue);
                      field.onChange(newValue?.name || "");
                      if (newValue) {
                        setValue("companyId", newValue.id);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Search or select company"
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

            {/* Location - Searchable Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <Controller
                name="location"
                control={control}
                rules={{ required: "Location is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={locations}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Search or type location"
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

            {/* Join Date */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="joinDate"
                label="Join Date"
                required
                type="date"
                register={register("joinDate", {
                  required: "Join date is required",
                })}
                error={errors.joinDate}
              />
            </div>

            {/* Employment Type - Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <Controller
                name="employmentType"
                control={control}
                rules={{ required: "Employment type is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={employmentTypes}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select employment type"
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

            {/* Supervisor - Searchable Dropdown */}
            <div className="col-span-12">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supervisor
              </label>
              <Controller
                name="supervisor"
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={supervisors}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Search or type supervisor name"
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
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Salary */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="salary"
                label="Salary"
                required
                type="number"
                register={register("salary", {
                  required: "Salary is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Salary cannot be negative" },
                })}
                error={errors.salary}
              />
            </div>

            {/* Currency - Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <Controller
                name="currency"
                control={control}
                rules={{ required: "Currency is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={currencies}
                    getOptionLabel={(option) => `${option.code} - ${option.name} (${option.symbol})`}
                    value={currencies.find(c => c.code === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.code || "USD");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select currency"
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

            {/* Compensation Info Card */}
            <div className="col-span-12">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Compensation Information</h4>
                <p className="text-gray-600 text-sm">
                  Salary information is confidential and will only be visible to HR and management.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-500">Annual Salary</p>
                    <p className="text-lg font-semibold">
                      {watch("currency") === "USD" ? "$" : 
                       watch("currency") === "EUR" ? "€" :
                       watch("currency") === "GBP" ? "£" :
                       watch("currency") === "JPY" ? "¥" : "$"}
                      {watch("salary")?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-500">Monthly</p>
                    <p className="text-lg font-semibold">
                      {watch("currency") === "USD" ? "$" : 
                       watch("currency") === "EUR" ? "€" :
                       watch("currency") === "GBP" ? "£" :
                       watch("currency") === "JPY" ? "¥" : "$"}
                      {Math.round((watch("salary") || 0) / 12).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="text-lg font-semibold">{watch("employmentType") || "Full-time"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Address */}
            <div className="col-span-12">
              <InputField
                id="address"
                label="Address"
                register={register("address")}
              />
            </div>

            {/* City */}
            <div className="col-span-12 lg:col-span-4">
              <InputField
                id="city"
                label="City"
                register={register("city")}
              />
            </div>

            {/* Country */}
            <div className="col-span-12 lg:col-span-4">
              <InputField
                id="country"
                label="Country"
                register={register("country")}
              />
            </div>

            {/* Zip Code */}
            <div className="col-span-12 lg:col-span-4">
              <InputField
                id="zipCode"
                label="Zip/Postal Code"
                register={register("zipCode")}
              />
            </div>

            {/* Emergency Contact */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="emergencyContact"
                label="Emergency Contact"
                register={register("emergencyContact")}
              />
            </div>

            {/* Experience */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="experience"
                label="Experience (years)"
                type="number"
                register={register("experience", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Experience cannot be negative" },
                  max: { value: 50, message: "Experience cannot exceed 50 years" },
                })}
                error={errors.experience}
              />
            </div>

            {/* Skills - Multi-select Searchable Dropdown */}
            <div className="col-span-12">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={skillsList}
                    value={selectedSkills}
                    onChange={(_, newValue) => {
                      setSelectedSkills(newValue);
                      field.onChange(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
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
                        placeholder="Search and select skills"
                        className="w-full"
                      />
                    )}
                    className="w-full"
                  />
                )}
              />
              <p className="text-gray-500 text-xs mt-2">
                Type to search and select skills. Use delete key to remove selections.
              </p>
            </div>

            {/* Education */}
            <div className="col-span-12">
              <InputField
                id="education"
                label="Education"
                register={register("education")}
              />
            </div>

            {/* Notes */}
            <div className="col-span-12">
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
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
                  <h4 className="font-medium text-gray-800">Staff Status</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Set the current status of this staff member
                  </p>
                </div>
                <div className="w-48">
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status is required" }}
                    render={({ field, fieldState }) => (
                      <Autocomplete
                        options={statusOptions}
                        value={field.value || "Active"}
                        onChange={(_, newValue) => {
                          field.onChange(newValue || "Active");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
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
              </div>

              <div className={`mt-4 px-4 py-3 rounded-md ${
                watch("status") === "Active"
                  ? "bg-green-50 border border-green-200"
                  : watch("status") === "On Leave"
                  ? "bg-yellow-50 border border-yellow-200"
                  : watch("status") === "Terminated"
                  ? "bg-red-50 border border-red-200"
                  : "bg-gray-100 border border-gray-200"
              }`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    watch("status") === "Active"
                      ? "bg-green-500"
                      : watch("status") === "On Leave"
                      ? "bg-yellow-500"
                      : watch("status") === "Terminated"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}></div>
                  <span className={`text-sm ${
                    watch("status") === "Active"
                      ? "text-green-700"
                      : watch("status") === "On Leave"
                      ? "text-yellow-700"
                      : watch("status") === "Terminated"
                      ? "text-red-700"
                      : "text-gray-600"
                  }`}>
                    {watch("status") === "Active"
                      ? "✓ Staff member is active and can access all systems."
                      : watch("status") === "On Leave"
                      ? "⚠ Staff member is on leave. Limited system access."
                      : watch("status") === "Terminated"
                      ? "✗ Staff member is terminated. All access is revoked."
                      : "Staff member is inactive."}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-4">
                {mode === "add" ? "Ready to Create Staff Record" : "Ready to Update Staff Record"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Personal Information</p>
                  <p className="text-blue-600 text-sm">
                    {watch("firstName")} {watch("lastName")}
                    <br />
                    {watch("email")}
                    <br />
                    {watch("phone")}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 text-sm font-medium">Employment Details</p>
                  <p className="text-blue-600 text-sm">
                    {watch("position")}
                    <br />
                    {watch("department")}
                    <br />
                    {watch("company")}
                  </p>
                </div>
              </div>
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
                  Contact information is verified
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Employment details are set
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
              <Link href="/super-admin/staff">Staff</Link>
            </li>
            <li className="breadcrumb-item active">
              {mode === "add" ? "Add Staff" : "Edit Staff"}
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "add" ? "Add New Staff Member" : `Edit Staff Member: ${staffData?.firstName} ${staffData?.lastName}`}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === "add" ? "Fill in the staff details step by step" : "Update staff information as needed"}
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
              {mode === "edit" && staffData && (
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  ID: {staffData.employeeId || staffData.id}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= activeIndex
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      index <= activeIndex ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      index < activeIndex ? "bg-primary" : "bg-gray-200"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{steps[activeIndex].label}</h2>
              <p className="text-gray-600 text-sm">
                {activeIndex === 0 && "Enter personal information and contact details"}
                {activeIndex === 1 && "Provide employment and organizational details"}
                {activeIndex === 2 && "Set compensation and salary information"}
                {activeIndex === 3 && "Add additional information and skills"}
                {activeIndex === 4 && "Review and set staff status"}
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
                        {mode === "add" ? "Adding..." : "Updating..."}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {mode === "add" ? "Add Staff Member" : "Update Staff Member"}
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-800">
              {mode === "add" ? "Tips for adding a new staff member" : "Tips for editing staff information"}
            </h4>
            <ul className="mt-2 text-blue-700 text-sm space-y-1">
              <li>• Use the searchable dropdowns for position, department, and company</li>
              <li>• Start typing in dropdowns to filter options quickly</li>
              <li>• You can select multiple skills by typing and pressing Enter</li>
              <li>• Salary information is confidential and encrypted</li>
              <li>• Set appropriate status based on employment situation</li>
              <li>• All fields marked with * are required</li>
              {mode === "edit" && (
                <li>• Some fields may be disabled if they cannot be changed after creation</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaffMainArea;