"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Chip, Slider, Divider } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import InputField from "@/components/elements/SharedInputs/InputField";

// Define vendor form interface
interface IVendorForm {
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  vendorType: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  paymentTerms: string;
  creditLimit: number;
  notes: string;
}

// Vendor Type Options
const vendorTypeOptions = [
  "IT Equipment",
  "Furniture",
  "Software",
  "Services",
  "Marketing",
  "Legal",
  "Printing",
  "Security",
  "Consulting",
  "Logistics",
  "Cleaning",
  "Maintenance",
  "Food & Beverage",
  "Travel",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Construction",
  "Telecommunications",
  "Energy",
];

// Status Options
const statusOptions = ["Active", "Inactive", "Pending", "Rejected"];

// Payment Terms Options
const paymentTermsOptions = [
  "Net 30 Days",
  "Net 60 Days",
  "Net 90 Days",
  "Due on Receipt",
  "50% Advance, 50% on Delivery",
  "Custom Terms",
];

// Country Options
const countryOptions = [
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Singapore",
  "UAE",
  "Brazil",
  "Mexico",
  "Spain",
  "Italy",
];

// State/Province Options (for US as example)
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const AddVendorMainArea: React.FC = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [creditLimit, setCreditLimit] = useState<number>(10000);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<IVendorForm>>({});
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
  } = useForm<IVendorForm>({
    defaultValues: {
      vendorName: "",
      contactPerson: "",
      email: "",
      phone: "",
      vendorType: "",
      status: "Active",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      taxId: "",
      paymentTerms: "Net 30 Days",
      creditLimit: 10000,
      notes: "",
    },
  });

  const steps = [
    {
      label: "Basic Information",
      fields: ["vendorName", "contactPerson", "email", "phone", "vendorType", "status"],
    },
    {
      label: "Address Details",
      fields: ["address", "city", "state", "zipCode", "country"],
    },
    {
      label: "Financial Details",
      fields: ["taxId", "paymentTerms", "creditLimit"],
    },
    {
      label: "Review & Submit",
      fields: [],
    },
  ];

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

  const onSubmit = async (data: IVendorForm) => {
    setIsSubmitting(true);

    try {
      const payload: IVendorForm = {
        ...formData,
        ...data,
        creditLimit: creditLimit,
      };

      console.log("Vendor Payload:", payload);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Vendor added successfully!");
      
      setTimeout(() => {
        router.push("/admin/vendors");
      }, 500);
    } catch (error) {
      console.error("Error adding vendor:", error);
      toast.error("Failed to add vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/admin/vendors");
      }
    } else {
      router.push("/admin/vendors");
    }
  };

  const renderStepContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Vendor Name */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="vendorName"
                label="Vendor Name"
                required
                register={register("vendorName", {
                  required: "Vendor name is required",
                  minLength: {
                    value: 2,
                    message: "Vendor name must be at least 2 characters",
                  },
                })}
                error={errors.vendorName}
              />
            </div>

            {/* Contact Person */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="contactPerson"
                label="Contact Person"
                required
                register={register("contactPerson", {
                  required: "Contact person is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces allowed",
                  },
                })}
                error={errors.contactPerson}
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
                    value: /^[0-9]{10,15}$/,
                    message: "Phone number must be 10-15 digits",
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
                error={errors.phone}
              />
            </div>

            {/* Vendor Type - Searchable Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Type <span className="text-red-500">*</span>
              </label>
              <Controller
                name="vendorType"
                control={control}
                rules={{ required: "Vendor type is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={vendorTypeOptions}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Search or type vendor type"
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

            {/* Status - Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
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
                        placeholder="Select status"
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

      case 1:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Address */}
            <div className="col-span-12">
              <InputField
                id="address"
                label="Street Address"
                required
                register={register("address", {
                  required: "Address is required",
                  minLength: {
                    value: 5,
                    message: "Address must be at least 5 characters",
                  },
                })}
                error={errors.address}
              />
            </div>

            {/* City */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="city"
                label="City"
                required
                register={register("city", {
                  required: "City is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces allowed",
                  },
                })}
                error={errors.city}
              />
            </div>

            {/* State - Searchable Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province <span className="text-red-500">*</span>
              </label>
              <Controller
                name="state"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={usStates}
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Search or type state"
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

            {/* ZIP Code */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="zipCode"
                label="ZIP/Postal Code"
                required
                register={register("zipCode", {
                  required: "ZIP code is required",
                  pattern: {
                    value: /^[0-9]{5,10}$/,
                    message: "ZIP code must be 5-10 digits",
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
                error={errors.zipCode}
              />
            </div>

            {/* Country - Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={countryOptions}
                    value={field.value || "United States"}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "United States");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select country"
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

            {/* Map Preview */}
            <div className="col-span-12">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Location Preview</h4>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">
                      {watch("address") || "No address entered"}
                      <br />
                      {watch("city") || ""} {watch("state") ? `, ${watch("state")}` : ""} {watch("zipCode") || ""}
                      <br />
                      {watch("country") || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Tax ID */}
            <div className="col-span-12 lg:col-span-6">
              <InputField
                id="taxId"
                label="Tax ID/VAT Number"
                register={register("taxId")}
                error={errors.taxId}
              />
            </div>

            {/* Payment Terms - Dropdown */}
            <div className="col-span-12 lg:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms <span className="text-red-500">*</span>
              </label>
              <Controller
                name="paymentTerms"
                control={control}
                rules={{ required: "Payment terms are required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={paymentTermsOptions}
                    value={field.value || "Net 30 Days"}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "Net 30 Days");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select payment terms"
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

            {/* Credit Limit Slider */}
            <div className="col-span-12">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-800">Credit Limit</h4>
                    <p className="text-gray-600 text-sm">
                      Set the maximum credit amount for this vendor
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${creditLimit.toLocaleString()}
                  </div>
                </div>

                <Slider
                  value={creditLimit}
                  onChange={(_, value) => setCreditLimit(value as number)}
                  min={0}
                  max={200000}
                  step={1000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 50000, label: '$50K' },
                    { value: 100000, label: '$100K' },
                    { value: 150000, label: '$150K' },
                    { value: 200000, label: '$200K' },
                  ]}
                  className="my-8"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCreditLimit(10000)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      $10K
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCreditLimit(50000)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      $50K
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCreditLimit(100000)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      $100K
                    </button>
                  </div>
                </div>

                <input
                  type="hidden"
                  {...register("creditLimit", { value: creditLimit })}
                />
              </div>
            </div>

            {/* Financial Info Card */}
            <div className="col-span-12">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">Financial Information</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Based on your selection: <span className="font-semibold">{watch("paymentTerms")}</span> payment terms
                      with a credit limit of <span className="font-semibold">${creditLimit.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-4">Ready to Create Vendor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-blue-700 text-sm font-medium mb-2">Basic Information</p>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-gray-800 font-medium">{watch("vendorName")}</p>
                    <p className="text-gray-600 text-sm mt-1">{watch("contactPerson")}</p>
                    <p className="text-gray-600 text-sm">{watch("email")}</p>
                    <p className="text-gray-600 text-sm">{watch("phone")}</p>
                    <div className="flex items-center mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        watch("status") === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {watch("status")}
                      </span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {watch("vendorType")}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-blue-700 text-sm font-medium mb-2">Address & Financial</p>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-gray-600 text-sm">
                      {watch("address")}
                      <br />
                      {watch("city")}, {watch("state")} {watch("zipCode")}
                      <br />
                      {watch("country")}
                    </p>
                    <Divider className="my-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credit Limit:</span>
                      <span className="font-semibold">${creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Payment Terms:</span>
                      <span className="font-semibold">{watch("paymentTerms")}</span>
                    </div>
                    {watch("taxId") && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Tax ID:</span>
                        <span className="font-semibold">{watch("taxId")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Preview */}
              {watch("notes") && (
                <div className="mb-6">
                  <p className="text-blue-700 text-sm font-medium mb-2">Additional Notes</p>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{watch("notes")}</p>
                  </div>
                </div>
              )}

              {/* Confirmation */}
              <div className="border-t border-blue-200 pt-4">
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
                    Financial terms are set
                  </li>
                </ul>
              </div>
            </div>

            {/* Notes Input */}
            <div className="col-span-12">
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("notes")}
                  placeholder="Add any additional notes or instructions..."
                />
              </div>
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
              <Link href="/admin">Admin</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/admin/vendors">Vendors</Link>
            </li>
            <li className="breadcrumb-item active">Add Vendor</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Vendor</h1>
        <p className="text-gray-600 mt-2">Fill in the vendor details step by step</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{steps[activeIndex].label}</h2>
              <p className="text-gray-600 text-sm">
                {activeIndex === 0 && "Enter basic vendor information and contact details"}
                {activeIndex === 1 && "Provide address and location details"}
                {activeIndex === 2 && "Set financial terms and credit limit"}
                {activeIndex === 3 && "Review and submit vendor information"}
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
                        Adding Vendor...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Vendor
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
            <h4 className="font-medium text-blue-800">Tips for adding a new vendor</h4>
            <ul className="mt-2 text-blue-700 text-sm space-y-1">
              <li>• Use the searchable dropdowns for vendor type and location</li>
              <li>• Set appropriate credit limits based on vendor relationship</li>
              <li>• Choose payment terms that align with your {`company's`} policy</li>
              <li>• Always verify vendor contact information</li>
              <li>• Include Tax ID for proper documentation</li>
              <li>• All fields marked with * are required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVendorMainArea;