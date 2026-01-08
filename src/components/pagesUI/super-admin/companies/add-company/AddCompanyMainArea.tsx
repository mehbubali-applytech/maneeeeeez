"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Autocomplete,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Types
interface ICompanyRegistration {
  // Step 1: Company Details
  companyName: string;
  registrationNumber: string;
  domain: string;
  logo: File | null;
  logoPreview: string;
  employeeLimit: number | "";
  notes: string;

  // Step 2: Owner Details
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;

  // Step 3: Modules & Plan
  modules: {
    attendance: boolean;
    leaveManagement: boolean;
    payroll: boolean;
    offerLetters: boolean;
    compliance: boolean;
  };
  attendanceLevel: "basic" | "advanced";
  payrollLevel: "basic" | "advanced";
  subscriptionPlan: "free" | "pro" | "enterprise";
  timezone: string;
  currency: string;

  // Step 4: Confirm
  acceptTerms: boolean;
  sendActivationEmail: boolean;
  finalComments: string;
}

interface ModuleOption {
  id: keyof ICompanyRegistration['modules'];
  label: string;
  description: string;
  note?: string;
  hasLevel?: boolean;
}

interface PlanOption {
  id: ICompanyRegistration['subscriptionPlan'];
  label: string;
  description: string;
  limits: string[];
}

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

// Mock data
const timezones: TimezoneOption[] = [
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
  { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6" },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8" },
  { value: "Europe/London", label: "GMT/BST", offset: "UTC+0" },
  { value: "Europe/Paris", label: "Central European Time", offset: "UTC+1" },
  { value: "Asia/Dubai", label: "Gulf Standard Time", offset: "UTC+4" },
  { value: "Asia/Kolkata", label: "India Standard Time", offset: "UTC+5:30" },
  { value: "Asia/Singapore", label: "Singapore Time", offset: "UTC+8" },
  { value: "Australia/Sydney", label: "Australian Eastern Time", offset: "UTC+10" },
];

const currencies: CurrencyOption[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
];

const modules: ModuleOption[] = [
  {
    id: "attendance",
    label: "Attendance",
    description: "Track employee attendance and working hours",
    hasLevel: true
  },
  {
    id: "leaveManagement",
    label: "Leave Management",
    description: "Manage employee leave requests and balances"
  },
  {
    id: "payroll",
    label: "Payroll",
    description: "Process salaries, deductions, and tax calculations",
    hasLevel: true,
    note: "Payroll requires bank configuration later"
  },
  {
    id: "offerLetters",
    label: "Offer Letters",
    description: "Create and send employment offer letters"
  },
  {
    id: "compliance",
    label: "Compliance",
    description: "Ensure regulatory compliance and reporting"
  },
];

const plans: PlanOption[] = [
  {
    id: "free",
    label: "Free",
    description: "Basic features for small teams",
    limits: ["Up to 10 employees", "Basic support", "1GB storage"],
  },
  {
    id: "pro",
    label: "Pro",
    description: "Advanced features for growing businesses",
    limits: ["Up to 100 employees", "Priority support", "10GB storage", "Custom reports"],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "Full suite for large organizations",
    limits: ["Unlimited employees", "24/7 support", "100GB storage", "API access", "Custom integrations"],
  },
];

const RegisterCompanyWizard: React.FC = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
    getValues,
  } = useForm<ICompanyRegistration>({
    defaultValues: {
      companyName: "",
      registrationNumber: "",
      domain: "",
      logo: null,
      logoPreview: "",
      employeeLimit: "",
      notes: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      modules: {
        attendance: true,
        leaveManagement: true,
        payroll: false,
        offerLetters: false,
        compliance: false,
      },
      attendanceLevel: "basic",
      payrollLevel: "basic",
      subscriptionPlan: "pro",
      timezone: "Asia/Kolkata",
      currency: "USD",
      acceptTerms: false,
      sendActivationEmail: true,
      finalComments: "",
    },
    mode: "onChange",
  });

  const steps = [
    { label: "Company Details", description: "Enter basic company information" },
    { label: "Owner Details", description: "Provide owner/admin information" },
    { label: "Modules & Plan", description: "Select modules and subscription plan" },
    { label: "Confirm & Submit", description: "Review and complete registration" },
  ];

  const companyName = watch("companyName");
  const modulesSelected = watch("modules");
  const selectedModules = Object.values(modulesSelected).filter(Boolean).length;
  const payrollSelected = watch("modules.payroll");

  // Auto-suggest domain
  useEffect(() => {
    if (companyName && !watch("domain")) {
      const suggestedDomain = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("domain", `${suggestedDomain}.myhrms.com`);
    }
  }, [companyName, setValue, watch]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.match(/image\/(png|jpeg|jpg|svg\+xml)/)) {
        toast.error("Only PNG, JPG, and SVG files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("logo", file);
        setValue("logoPreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Verify email uniqueness
  const verifyEmail = async () => {
    const email = watch("ownerEmail");
    if (!email || errors.ownerEmail) {
      toast.error("Please enter a valid email address first");
      return;
    }

    setIsVerifyingEmail(true);
    // Mock API call
    setTimeout(() => {
      setIsVerifyingEmail(false);
      const isAvailable = Math.random() > 0.3; // 70% chance available
      if (isAvailable) {
        setEmailVerified(true);
        toast.success("Email is available!");
      } else {
        toast.error("Email already in use");
      }
    }, 1000);
  };

  const handleNextStep = async () => {
    const currentStepFields = getStepFields(activeStep);
    const isValid = await trigger(currentStepFields as any);

    if (isValid) {
      if (activeStep === 1 && !emailVerified) {
        toast.warning("Please verify the email address before proceeding");
        return;
      }
      if (activeStep === 2 && selectedModules === 0) {
        toast.warning("Please select at least one module");
        return;
      }
      setActiveStep(activeStep + 1);
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepFields = (step: number): (keyof ICompanyRegistration)[] => {
    switch (step) {
      case 0:
        return ["companyName"];
      case 1:
        return ["ownerName", "ownerEmail"];
      case 2:
        return ["subscriptionPlan", "timezone", "currency"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: ICompanyRegistration) => {
    if (!data.acceptTerms) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "logo" && value instanceof File) {
        formData.append(key, value);
      } else if (key === "modules") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Mock API call
    toast.loading("Creating company...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Company created successfully!");

      if (data.sendActivationEmail) {
        toast.success("Activation email sent to owner");
      }

      // Navigate to success page
      setTimeout(() => {
        router.push("/super-admin/companies");
      }, 1500);
    }, 2000);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={150}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("companyName", {
                  required: "Company name is required",
                  maxLength: {
                    value: 150,
                    message: "Maximum 150 characters allowed",
                  },
                })}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
              )}
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">
                  Max 150 characters
                </span>
                <span className="text-sm text-gray-500">
                  {companyName?.length || 0}/150
                </span>
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incorporation / Registration Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("registrationNumber")}
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain / Sub-Domain
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("domain", {
                  pattern: {
                    value: /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myhrms\.com$/,
                    message: "Must be in format: yourcompany.myhrms.com",
                  },
                })}
              />
              {errors.domain && (
                <p className="text-red-500 text-sm mt-1">{errors.domain.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                e.g. acme.myhrms.com
              </p>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {watch("logoPreview") ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={watch("logoPreview")}
                        alt="Logo preview"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                      Upload Logo
                    </div>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, SVG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Employee Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Employee Limit
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("employeeLimit", {
                  min: { value: 0, message: "Must be positive number" },
                  valueAsNumber: true,
                })}
              />
              {errors.employeeLimit && (
                <p className="text-red-500 text-sm mt-1">{errors.employeeLimit.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Leave blank for unlimited (based on plan)
              </p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("notes")}
              />
              <p className="text-sm text-gray-500 mt-1">
                For internal remarks or setup notes
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  This person will be assigned as Company Admin after activation.
                </p>
              </div>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("ownerName", {
                  required: "Owner name is required",
                })}
              />
              {errors.ownerName && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerName.message}</p>
              )}
            </div>

            {/* Owner Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Email Address <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("ownerEmail", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                    onChange: () => setEmailVerified(false),
                  })}
                />
                <button
                  type="button"
                  onClick={verifyEmail}
                  disabled={isVerifyingEmail || !!errors.ownerEmail || !watch("ownerEmail")}
                  className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifyingEmail ? "Verifying..." : emailVerified ? "✓ Verified" : "Verify"}
                </button>
              </div>
              {errors.ownerEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerEmail.message}</p>
              )}
              {emailVerified && (
                <p className="text-green-600 text-sm mt-1">✓ Email is available</p>
              )}
            </div>

            {/* Owner Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("ownerPhone")}
                placeholder="+91 99999 99999"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Modules */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Modules</h3>
              <div className="space-y-4">
                {modules.map((moduleItem) => (
                  <div key={moduleItem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Controller
                        name={`modules.${moduleItem.id}`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        )}
                      />
                      <div className="flex-1">
                        <label className="block font-medium text-gray-700">
                          {moduleItem.label}
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          {moduleItem.description}
                        </p>

                        {moduleItem.note && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            🛈 {moduleItem.note}
                          </div>
                        )}

                        {moduleItem.hasLevel && watch(`modules.${moduleItem.id}`) && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Level
                            </label>
                            <Controller
                              name={
                                moduleItem.id === "attendance"
                                  ? "attendanceLevel"
                                  : "payrollLevel"
                              }
                              control={control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                  <option value="basic">Basic</option>
                                  <option value="advanced">Advanced</option>
                                </select>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
              <div className="mt-4 text-sm text-gray-600">
                Selected: {selectedModules} module{selectedModules !== 1 ? "s" : ""}
                {selectedModules === 0 && (
                  <span className="text-red-500 ml-2">(At least one required)</span>
                )}
              </div>
            </div>

            {/* Right: Plan & Defaults */}
            <div className="space-y-6">
              {/* Subscription Plan */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription Plan</h3>
                <Controller
                  name="subscriptionPlan"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${field.value === plan.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                            }`}
                          onClick={() => field.onChange(plan.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <Radio
                              checked={field.value === plan.id}
                              onChange={() => field.onChange(plan.id)}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-800">{plan.label}</h4>
                                  <p className="text-sm text-gray-600">{plan.description}</p>
                                </div>
                                <span className="text-lg font-semibold text-primary">
                                  {plan.id === "free" ? "$0" : plan.id === "pro" ? "$29" : "Custom"}
                                </span>
                              </div>
                              <ul className="mt-3 space-y-1">
                                {plan.limits.map((limit, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {limit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Default Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Timezone <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={timezones.find(tz => tz.value === field.value) || timezones[0]}
                      options={timezones}
                      getOptionLabel={(option) => `${option.label} (${option.offset})`}
                      onChange={(_, newValue) => field.onChange(newValue?.value || "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select timezone"
                        />
                      )}
                    />
                  )}
                />
              </div>

              {/* Default Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={currencies.find(c => c.code === field.value) || currencies[0]}
                      options={currencies}
                      getOptionLabel={(option) => `${option.code} - ${option.name} (${option.symbol})`}
                      onChange={(_, newValue) => field.onChange(newValue?.code || "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select currency"
                        />
                      )}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        const formData = getValues();
        return (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Review Summary</h3>
                <button
                  type="button"
                  onClick={() => setActiveStep(0)}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Edit
                </button>
              </div>

              {/* Company Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Company Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{formData.companyName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Domain:</span>
                    <span className="ml-2 font-medium">{formData.domain || "Not set"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Registration:</span>
                    <span className="ml-2 font-medium">{formData.registrationNumber || "Not set"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Employee Limit:</span>
                    <span className="ml-2 font-medium">
                      {formData.employeeLimit || "Unlimited (based on plan)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-700 mb-2">Owner Details</h4>
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{formData.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium">{formData.ownerEmail}</span>
                    {emailVerified && (
                      <span className="ml-2 text-green-600">✓ Verified</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 font-medium">{formData.ownerPhone || "Not set"}</span>
                  </div>
                </div>
              </div>

              {/* Modules & Plan */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-700 mb-2">Modules & Plan</h4>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Selected Modules:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                   {Object.entries(formData.modules)
  .filter(([_, selected]) => selected)
  .map(([key]) => {
    const moduleItem = modules.find(m => m.id === key);
    return (
      <span
        key={key}
        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
      >
        {moduleItem?.label}
      </span>
    );
  })}

                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Subscription Plan:</span>
                    <span className="ml-2 font-medium">
                      {plans.find(p => p.id === formData.subscriptionPlan)?.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Timezone:</span>
                      <span className="ml-2 font-medium">
                        {timezones.find(tz => tz.value === formData.timezone)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Currency:</span>
                      <span className="ml-2 font-medium">
                        {currencies.find(c => c.code === formData.currency)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Controller
                  name="acceptTerms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  )}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Accept Terms & Conditions <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-primary hover:text-primary/80 font-medium"
                      onClick={() => toast.info("Terms & Conditions modal would open here")}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-primary hover:text-primary/80 font-medium"
                      onClick={() => toast.info("Privacy Policy modal would open here")}
                    >
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm mt-2">You must accept the Terms & Conditions</p>
              )}
            </div>

            {/* Activation Email Toggle */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">Send Activation Email Now</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {watch("sendActivationEmail")
                      ? "Invitation email will be sent immediately to the owner"
                      : "Company will remain in 'Pending Activation' status"}
                  </p>
                </div>
                <Controller
                  name="sendActivationEmail"
                  control={control}
                  render={({ field }) => (
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="sr-only"
                        id="activation-toggle"
                      />
                      <label
                        htmlFor="activation-toggle"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${field.value ? "bg-primary" : "bg-gray-300"
                          }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${field.value ? "transform translate-x-6" : ""
                            }`}
                        />
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Final Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Comments / Notes
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="e.g., 'Custom branding requested', 'Special pricing applied', etc."
                {...register("finalComments")}
              />
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
      <div className="breadcrumb__wrapper mb-6">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/super-admin">Super Admin</Link>
            </li>
            <li className="breadcrumb-item active">Register Company</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Register New Company</h1>
        <p className="text-gray-600 mt-2">Onboard a new company step by step</p>
      </div>

      {/* Wizard Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Stepper Header */}
        <div className="px-8 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Step {activeStep + 1} of {steps.length}: {steps[activeStep].label}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{steps[activeStep].description}</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {Math.round(((activeStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${index <= activeStep
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${index <= activeStep ? "text-primary" : "text-gray-500"
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${index < activeStep ? "bg-primary" : "bg-gray-200"
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-8 py-6">
            {renderStepContent(activeStep)}
          </div>

          {/* Navigation Buttons */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                {activeStep === 3 && (
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Save as Draft
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {activeStep > 0 ? (
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => router.push("/super-admin/companies")}
                  >
                    Cancel
                  </button>
                )}

                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={handleNextStep}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center"
                    disabled={!watch("acceptTerms")}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Company & Invite Owner
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
            <h4 className="font-medium text-blue-800">Onboarding Tips</h4>
            <ul className="mt-2 text-blue-700 text-sm space-y-1">
              <li>• Company domain must end with <code>.myhrms.com</code></li>
              <li>• Verify owner email to ensure uniqueness before proceeding</li>
              <li>• At least one module must be selected for company setup</li>
              <li>• Timezone and currency settings affect payroll and attendance calculations</li>
              <li>• Activation emails include temporary credentials for owner login</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompanyWizard;