"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Autocomplete,
  TextField,
  Radio,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import debounce from "lodash/debounce";

// Types
interface ICompany {
  id: number;
  company_name: string;
  GSTIN?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  company_details?: {
    industry_type?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postal_code?: string;
    };
    tax_id?: string;
    bank_details?: {
      bank_name?: string;
      account_number?: string;
      account_holder_name?: string;
      ifsc_code?: string;
      branch_name?: string;
      account_type?: string;
    };
    payment_terms?: string;
    role_name?: "Super Admin" | "Owner" | "Admin";
    [key: string]: any;
  };
  contract_start_date: string;
  contract_end_date?: string;
  status: "Active" | "Inactive" | "Suspended" | "Pending";
  created_at: string;
  updated_at: string;
}

interface ICompanyForm {
  // Step 1: Company Details
  company_name: string;
  GSTIN: string;
  industry_type: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  tax_id: string;

  // Step 2: Bank Details
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  ifsc_code: string;
  branch_name: string;
  account_type: string;
  payment_terms: string;
  role_name: "Super Admin" | "Owner" | "Admin";

  // Step 3: Contact Details
  contact_person: string;
  contact_email: string;
  contact_phone: string;

  // Step 4: Contract & Status
  contract_start_date: string;
  contract_end_date: string;
  status: "Active" | "Inactive" | "Suspended" | "Pending";

  // Additional fields
  logo: File | null;
  logoPreview: string;
  notes: string;
  acceptTerms: boolean;
  finalComments: string;
}

// PIN Code API Response Interface
interface PinCodeResponse {
  Message: string;
  Status: string;
  PostOffice: Array<{
    Name: string;
    Description: string;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
  }>;
}

interface AddEditCompanyMainAreaProps {
  mode?: "add" | "edit";
  companyData?: ICompany | null;
  loading?: boolean;
}

// Mock data for dropdowns
const countries = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "AE", label: "UAE" },
  { value: "SG", label: "Singapore" },
];

const industryTypes = [
  "IT Services",
  "Manufacturing",
  "Healthcare",
  "Finance",
  "Retail",
  "Education",
  "Construction",
  "Transportation",
  "Hospitality",
  "Real Estate",
  "Telecommunications",
  "Others"
];

const paymentTerms = [
  "Net 30 Days",
  "Net 45 Days",
  "Net 60 Days",
  "Due on Receipt",
  "50% Advance, 50% on Completion",
  "Custom"
];

const accountTypes = [
  "Savings",
  "Current",
  "Salary",
  "NRI",
  "Joint"
];

const accessLevels = [
  { value: "Super Admin", label: "Super Admin" },
  { value: "Owner", label: "Owner" },
  { value: "Admin", label: "Admin" }
];

const AddEditCompanyMainArea: React.FC<AddEditCompanyMainAreaProps> = ({
  mode = "add",
  companyData = null,
  loading = false
}) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState<number | null>(null);
  const [loadingPinCode, setLoadingPinCode] = useState(false);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<{
    bank_name?: string;
    branch_name?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isDirty },
    getValues,
  } = useForm<ICompanyForm>({
    defaultValues: {
      company_name: "",
      GSTIN: "",
      industry_type: "IT Services",
      street: "",
      city: "",
      state: "",
      country: "IN",
      postal_code: "",
      tax_id: "",
      bank_name: "",
      account_number: "",
      account_holder_name: "",
      ifsc_code: "",
      branch_name: "",
      account_type: "Current",
      payment_terms: "Net 30 Days",
      role_name: "Owner",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      contract_start_date: new Date().toISOString().split('T')[0],
      contract_end_date: "",
      status: "Active",
      logo: null,
      logoPreview: "",
      notes: "",
      acceptTerms: false,
      finalComments: "",
    },
    mode: "onChange",
  });

  const steps = [
    { label: "Company Details", description: "Enter company information and address" },
    { label: "Bank Details", description: "Provide banking information" },
    { label: "Contact Details", description: "Add contact person information" },
    { label: "Contract & Status", description: "Set contract dates and status" },
    { label: "Confirm & Submit", description: "Review and complete" },
  ];

  // Watch postal code for auto-fill
  const postalCode = watch("postal_code");
  const ifscCode = watch("ifsc_code");
  const country = watch("country");

// PIN Code Lookup API
const fetchAddressByPinCode = useCallback(
  debounce(async (pincode: string) => {
    if (!pincode || pincode.length !== 6 || country !== "IN") return;
    
    setLoadingPinCode(true);
    try {
      const response = await axios.get<PinCodeResponse>(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      
      // Check if response is an array and has data
      if (Array.isArray(response.data) && response.data.length > 0) {
        const data = response.data[0];
        
        if (data.Status === "Success" && data.PostOffice?.length > 0) {
          const postOffice = data.PostOffice[0];
          
          setValue("city", postOffice.District || postOffice.Name, { shouldValidate: true });
          setValue("state", postOffice.State, { shouldValidate: true });
          setValue("country", "IN", { shouldValidate: true });
          
          toast.success("Address auto-filled from PIN code!");
        } else {
          toast.error("Invalid PIN code or no data found");
        }
      } else {
        toast.error("Invalid response from PIN code API");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("Failed to fetch address details");
    } finally {
      setLoadingPinCode(false);
    }
  }, 1000),
  [setValue, country]
);

  // IFSC Code Lookup API
  const fetchBankDetailsByIFSC = useCallback(
    debounce(async (ifsc: string) => {
      if (!ifsc || ifsc.length !== 11) return;

      setIfscLoading(true);
      try {
        const response = await axios.get(
          `https://ifsc.razorpay.com/${ifsc}`
        );

        if (response.data) {
          setBankDetails({
            bank_name: response.data.BANK,
            branch_name: response.data.BRANCH
          });

          setValue("bank_name", response.data.BANK, { shouldValidate: true });
          setValue("branch_name", response.data.BRANCH, { shouldValidate: true });

          toast.success("Bank details auto-filled from IFSC!");
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
        toast.error("Invalid IFSC code");
      } finally {
        setIfscLoading(false);
      }
    }, 1000),
    [setValue]
  );

  // Effect for PIN code lookup
  useEffect(() => {
    if (postalCode && postalCode.length === 6 && country === "IN") {
      fetchAddressByPinCode(postalCode);
    }
  }, [postalCode, country, fetchAddressByPinCode]);

  // Effect for IFSC code lookup
  useEffect(() => {
    if (ifscCode && ifscCode.length === 11) {
      fetchBankDetailsByIFSC(ifscCode);
    }
  }, [ifscCode, fetchBankDetailsByIFSC]);

  // Load company data in edit mode
  useEffect(() => {
    if (mode === "edit" && companyData) {
      const formData: Partial<ICompanyForm> = {
        company_name: companyData.company_name,
        GSTIN: companyData.GSTIN || "",
        contact_person: companyData.contact_person,
        contact_email: companyData.contact_email,
        contact_phone: companyData.contact_phone || "",
        contract_start_date: companyData.contract_start_date.split('T')[0],
        contract_end_date: companyData.contract_end_date ? companyData.contract_end_date.split('T')[0] : "",
        status: companyData.status,
        notes: "",
        acceptTerms: true,
        finalComments: "",
      };

      // Extract company_details fields
      if (companyData.company_details) {
        formData.industry_type = companyData.company_details.industry_type || "";
        formData.tax_id = companyData.company_details.tax_id || "";
        formData.payment_terms = companyData.company_details.payment_terms || "Net 30 Days";
        formData.role_name = companyData.company_details.role_name || "Owner";

        // Extract bank details
        if (companyData.company_details.bank_details) {
          formData.bank_name = companyData.company_details.bank_details.bank_name || "";
          formData.account_number = companyData.company_details.bank_details.account_number || "";
          formData.account_holder_name = companyData.company_details.bank_details.account_holder_name || "";
          formData.ifsc_code = companyData.company_details.bank_details.ifsc_code || "";
          formData.branch_name = companyData.company_details.bank_details.branch_name || "";
          formData.account_type = companyData.company_details.bank_details.account_type || "Current";
        }

        // Extract address
        if (companyData.company_details.address) {
          formData.street = companyData.company_details.address.street || "";
          formData.city = companyData.company_details.address.city || "";
          formData.state = companyData.company_details.address.state || "";
          formData.country = companyData.company_details.address.country || "IN";
          formData.postal_code = companyData.company_details.address.postal_code || "";
        }
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const formKey = key as Extract<keyof ICompanyForm, string>;
          setValue(formKey, value as any);
        }
      });

      setClientId(companyData.id);
    }
  }, [mode, companyData, setValue]);

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



  // Handle step navigation with validation
  const handleNextStep = async () => {
    const currentStepFields = getStepFields(activeStep);
    const isValid = await trigger(currentStepFields as any);

    if (!isValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      const formValues = getValues();

      switch (activeStep) {
        case 0: // Company Details
          const companyData = {
            company_name: formValues.company_name,
            GSTIN: formValues.GSTIN,
            company_details: {
              industry_type: formValues.industry_type,
              address: {
                street: formValues.street,
                city: formValues.city,
                state: formValues.state,
                country: formValues.country,
                postal_code: formValues.postal_code
              },
              tax_id: formValues.tax_id
            }
          };

          const resData1 = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/super-admin/company/step1`,
            companyData
          );

          if (resData1.data) {
            setClientId(resData1.data.data.client_id);
            localStorage.setItem("idTocreateCompany",resData1.data.data.client_id);
            toast.success("Company details saved successfully!");
          }
          break;

        case 1: // Bank Details
          const bankData = {
            companyId: clientId,
            company_details: {
              bank_details: {
                bank_name: formValues.bank_name,
                account_number: formValues.account_number,
                account_holder_name: formValues.account_holder_name,
                ifsc_code: formValues.ifsc_code,
                branch_name: formValues.branch_name,
                account_type: formValues.account_type
              },
              payment_terms: formValues.payment_terms,
              role_name: formValues.role_name
            }
          };

          const resData2 = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/super-admin/company/step2`,
            bankData
          );

          if (resData2.data.success) {
            toast.success("Bank details saved successfully!");
          }
          break;

        case 2: // Contact Details
           const contactData = {
    companyId: clientId,
    contact_person: formValues.contact_person,
    contact_email: formValues.contact_email,
    contact_phone: formValues.contact_phone
  };

  const resData3 = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/super-admin/company/step3`,
    contactData
  );

  if (resData3.data.success) {
    toast.success("Contact details saved successfully!");
  }
  break;

        case 3: // Contract & Status
          const contractData = {
            companyId: clientId,
            contract_start_date: formValues.contract_start_date,
            contract_end_date: formValues.contract_end_date || null,
            status: formValues.status
          };

          const resData4 = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/super-admin/company/step4`,
            contractData
          );

          if (resData4.data.success) {
            toast.success("Contract details saved successfully!");
          }
          break;

        default:
          break;
      }

      setActiveStep(activeStep + 1);

    } catch (error: any) {
      console.error(`Error saving step ${activeStep + 1}:`, error);

      if (error.response) {
        const errorData = error.response.data;
        toast.error(errorData.message || `Failed to save step ${activeStep + 1}`);
      } else {
        toast.error(`Failed to save step ${activeStep + 1}. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepFields = (step: number): (keyof ICompanyForm)[] => {
    switch (step) {
      case 0:
        return ["company_name", "industry_type", "country", "city", "postal_code"];
      case 1:
        return ["bank_name", "account_number", "account_holder_name", "ifsc_code"];
      case 2:
        return ["contact_person", "contact_email"];
      case 3:
        return ["contract_start_date", "status"];
      default:
        return [];
    }
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/super-admin/companies");
      }
    } else {
      router.push("/super-admin/companies");
    }
  };

  const onSubmit = async (data: ICompanyForm) => {
    if (mode === "add" && !data.acceptTerms) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare company details object
      const companyDetails = {
        industry_type: data.industry_type,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postal_code
        },
        tax_id: data.tax_id,
        bank_details: {
          bank_name: data.bank_name,
          account_number: data.account_number,
          account_holder_name: data.account_holder_name,
          ifsc_code: data.ifsc_code,
          branch_name: data.branch_name,
          account_type: data.account_type
        },
        payment_terms: data.payment_terms,
        role_name: data.role_name
      };

      const finalData = {
        client_id:clientId,
        company_name: data.company_name,
        GSTIN: data.GSTIN || null,
        contact_person: data.contact_person,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        company_details: JSON.stringify(companyDetails),
        contract_start_date: data.contract_start_date,
        contract_end_date: data.contract_end_date || null,
        status: data.status
      };

      let response;
      if (mode === "add") {
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/company/create`, finalData);
      } else {
        response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/company/${clientId}`, finalData);
      }

      if (response.data.data) {
        localStorage.removeItem('idTocreateCompany')
        toast.success(
          mode === "add"
            ? "Company created successfully!"
            : "Company updated successfully!"
        );

        setTimeout(() => {
          router.push("/super-admin/companies");
        }, 1500);
      }

    } catch (error: any) {
      console.error(`Error ${mode === "add" ? "creating" : "updating"} company:`, error);

      if (error.response) {
        const errorData = error.response.data;
        toast.error(errorData.message || `Failed to ${mode === "add" ? "create" : "update"} company`);
      } else {
        toast.error(`Failed to ${mode === "add" ? "create" : "update"} company. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("company_name", {
                  required: "Company name is required",
                  maxLength: {
                    value: 255,
                    message: "Maximum 255 characters allowed",
                  },
                })}
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>
              )}
            </div>

            {/* GSTIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GSTIN
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("GSTIN", {
                  pattern: {
                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                    message: "Invalid GSTIN format",
                  },
                })}
                placeholder="e.g., 27AABCU9603R1Z2"
              />
              {errors.GSTIN && (
                <p className="text-red-500 text-sm mt-1">{errors.GSTIN.message}</p>)}
              <p className="text-sm text-gray-500 mt-1">
                Format: 27AABCU9603R1Z2 (15 characters)
              </p>
            </div>

            {/* Industry Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Type <span className="text-red-500">*</span>
              </label>
              <Controller
                name="industry_type"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={field.value}
                    options={industryTypes}
                    onChange={(_, newValue) => field.onChange(newValue || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select industry type"
                      />
                    )}
                  />
                )}
              />
              {errors.industry_type && (
                <p className="text-red-500 text-sm mt-1">{errors.industry_type.message}</p>
              )}
            </div>

            {/* Tax ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax ID / PAN Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                {...register("tax_id", {
                  pattern: {
                    value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                    message: "Invalid PAN format (e.g., ABCDE1234F)",
                  },
                })}
              />
              {errors.tax_id && (
                <p className="text-red-500 text-sm mt-1">{errors.tax_id.message}</p>
              )}
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Address Details</h3>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("street")}
                />
              </div>

              {/* Postal Code with Auto-fill */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal / PIN Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    {...register("postal_code", {
                      required: "Postal code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "6-digit PIN code required",
                      },
                    })}
                    placeholder="Enter 6-digit PIN code"
                  />
                  {loadingPinCode && (
                    <div className="absolute right-3 top-3">
                      <CircularProgress size={20} />
                    </div>
                  )}
                </div>
                {errors.postal_code && (
                  <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
                )}
                {country === "IN" && (
                  <p className="text-sm text-gray-500 mt-1">
                    Enter 6-digit PIN code to auto-fill city and state
                  </p>
                )}
              </div>

              {/* City & State (auto-filled from PIN) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    {...register("state", { required: "State is required" })}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={countries.find(c => c.value === field.value) || countries[0]}
                      options={countries}
                      getOptionLabel={(option) => option.label}
                      onChange={(_, newValue) => field.onChange(newValue?.value || "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select country"
                        />
                      )}
                    />
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  Bank details are required for payment processing and payroll.
                </p>
              </div>
            </div>

            {/* Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("bank_name", {
                    required: "Bank name is required",
                  })}
                />
                {errors.bank_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.bank_name.message}</p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("account_number", {
                    required: "Account number is required",
                    pattern: {
                      value: /^[0-9]{9,18}$/,
                      message: "Invalid account number (9-18 digits)",
                    },
                  })}
                />
                {errors.account_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.account_number.message}</p>
                )}
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("account_holder_name", {
                    required: "Account holder name is required",
                  })}
                />
                {errors.account_holder_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.account_holder_name.message}</p>
                )}
              </div>

              {/* IFSC Code with Auto-fill */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={11}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    {...register("ifsc_code", {
                      required: "IFSC code is required",
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                        message: "Invalid IFSC format (e.g., SBIN0001234)",
                      },
                    })}
                    placeholder="e.g., SBIN0001234"
                  />
                  {ifscLoading && (
                    <div className="absolute right-3 top-3">
                      <CircularProgress size={20} />
                    </div>
                  )}
                </div>
                {errors.ifsc_code && (
                  <p className="text-red-500 text-sm mt-1">{errors.ifsc_code.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  11-character IFSC code (e.g., SBIN0001234)
                </p>
              </div>

              {/* Branch Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("branch_name")}
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <Controller
                  name="account_type"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={field.value}
                      options={accountTypes}
                      onChange={(_, newValue) => field.onChange(newValue || "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select account type"
                        />
                      )}
                    />
                  )}
                />
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <Controller
                name="payment_terms"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={field.value}
                    options={paymentTerms}
                    onChange={(_, newValue) => field.onChange(newValue || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select payment terms"
                      />
                    )}
                  />
                )}
              />
            </div>

            {/* Access Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level <span className="text-red-500">*</span>
              </label>
              <Controller
                name="role_name"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {accessLevels.map((level) => (
                      <div
                        key={level.value}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${field.value === level.value
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => field.onChange(level.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <Radio
                            checked={field.value === level.value}
                            onChange={() => field.onChange(level.value)}
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">{level.label}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {level.value === "Super Admin" && "Full system access with all permissions"}
                              {level.value === "Owner" && "Complete company access and management"}
                              {level.value === "Admin" && "Limited access for day-to-day operations"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        );

case 2:
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
            {mode === "add"
              ? "This person will be the primary contact for the company."
              : "Contact person details."
            }
          </p>
        </div>
      </div>

      {/* Contact Person */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Person <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
          {...register("contact_person", {
            required: "Contact person is required",
          })}
        />
        {errors.contact_person && (
          <p className="text-red-500 text-sm mt-1">{errors.contact_person.message}</p>
        )}
      </div>

      {/* Contact Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${mode === "edit" ? "bg-gray-100" : ""}`}
          {...register("contact_email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          disabled={mode === "edit"}
        />
        {errors.contact_email && (
          <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>
        )}
        {mode === "edit" && (
          <p className="text-gray-500 text-sm mt-1">Email cannot be changed after creation</p>
        )}
      </div>

      {/* Contact Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Phone
        </label>
        <input
          type="tel"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
          {...register("contact_phone", {
            pattern: {
              value: /^[+]?[0-9]{10,15}$/,
              message: "Invalid phone number",
            },
          })}
          placeholder="+91 99999 99999"
        />
        {errors.contact_phone && (
          <p className="text-red-500 text-sm mt-1">{errors.contact_phone.message}</p>
        )}
      </div>
    </div>
  );
      case 3:
        return (
          <div className="space-y-6">
            {/* Contract Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("contract_start_date", {
                    required: "Contract start date is required",
                  })}
                />
                {errors.contract_start_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.contract_start_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract End Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  {...register("contract_end_date")}
                />
                <p className="text-sm text-gray-500 mt-1">Leave blank for ongoing contract</p>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {["Active", "Inactive", "Suspended", "Pending"].map((option) => (
                      <div
                        key={option}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${field.value === option
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => field.onChange(option)}
                      >
                        <div className="flex items-center space-x-3">
                          <Radio
                            checked={field.value === option}
                            onChange={() => field.onChange(option)}
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">{option}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {option === "Active" && "Company is active and operational"}
                              {option === "Inactive" && "Company account is inactive"}
                              {option === "Suspended" && "Company account is suspended"}
                              {option === "Pending" && "Awaiting activation"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        );

      case 4:
        const formData = getValues();
        return (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {mode === "add" ? "Review Summary" : "Update Summary"}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveStep(0)}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Edit All
                </button>
              </div>

              {/* Company Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-700">Company Information</h4>
                  <button
                    type="button"
                    onClick={() => setActiveStep(0)}
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Company Name:</span>
                    <span className="ml-2 font-medium">{formData.company_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">GSTIN:</span>
                    <span className="ml-2 font-medium">{formData.GSTIN || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Industry Type:</span>
                    <span className="ml-2 font-medium">{formData.industry_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tax ID:</span>
                    <span className="ml-2 font-medium">{formData.tax_id || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-700">Bank Details</h4>
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Bank Name:</span>
                    <span className="ml-2 font-medium">{formData.bank_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Account Holder:</span>
                    <span className="ml-2 font-medium">{formData.account_holder_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Account Number:</span>
                    <span className="ml-2 font-medium">{formData.account_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">IFSC Code:</span>
                    <span className="ml-2 font-medium">{formData.ifsc_code}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Branch:</span>
                    <span className="ml-2 font-medium">{formData.branch_name || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Account Type:</span>
                    <span className="ml-2 font-medium">{formData.account_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Terms:</span>
                    <span className="ml-2 font-medium">{formData.payment_terms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Access Level:</span>
                    <span className="ml-2 font-medium">{formData.role_name}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-700">Contact Details</h4>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Contact Person:</span>
                    <span className="ml-2 font-medium">{formData.contact_person}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium">{formData.contact_email}</span>
               
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 font-medium">{formData.contact_phone || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Contract Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-700">Contract Details</h4>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Start Date:</span>
                    <span className="ml-2 font-medium">{formData.contract_start_date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">End Date:</span>
                    <span className="ml-2 font-medium">
                      {formData.contract_end_date || "Ongoing"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 font-medium">{formData.status}</span>
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Address Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Street:</span>
                    <span className="ml-2 font-medium">{formData.street || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">City:</span>
                    <span className="ml-2 font-medium">{formData.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">State:</span>
                    <span className="ml-2 font-medium">{formData.state}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Country:</span>
                    <span className="ml-2 font-medium">
                      {countries.find(c => c.value === formData.country)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Postal Code:</span>
                    <span className="ml-2 font-medium">{formData.postal_code}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions (only for add mode) */}
            {mode === "add" && (
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
                      I agree to the company terms and policies
                    </p>
                  </div>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-sm mt-2">You must accept the Terms & Conditions</p>
                )}
              </div>
            )}

            {/* Final Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === "add" ? "Final Comments / Notes" : "Update Notes"}
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder={
                  mode === "add"
                    ? "e.g., 'Special requirements', 'Custom setup needed', etc."
                    : "Describe the changes made..."
                }
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
            <li className="breadcrumb-item">
              <Link href="/super-admin/companies">Companies</Link>
            </li>
            <li className="breadcrumb-item active">
              {mode === "add" ? "Add Company" : `Edit Company`}
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "add" ? "Add New Company" : `Edit Company: ${companyData?.company_name}`}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === "add" ? "Add a new company to the system" : "Update company information"}
          {mode === "edit" && companyData && (
            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
              ID: {companyData.id}
            </span>
          )}
        </p>
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
              {mode === "edit" && companyData && (
                <span className={`ml-2 px-2 py-1 rounded text-xs ${companyData.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : companyData.status === "Inactive"
                      ? "bg-red-100 text-red-800"
                      : companyData.status === "Suspended"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}>
                  {companyData.status}
                </span>
              )}
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
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
              <div className="flex items-center space-x-4">
                {activeStep > 0 && (
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={handlePreviousStep}
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}

                {activeStep < steps.length - 1 ? (
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
                    disabled={isSubmitting || (mode === "add" && !watch("acceptTerms"))}
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
                        {mode === "add" ? "Create Company" : "Update Company"}
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
              {mode === "add" ? "Important Notes" : "Editing Guidelines"}
            </h4>
            <ul className="mt-2 text-blue-700 text-sm space-y-1">
              {mode === "add" ? (
                <>
                  <li>• All fields marked with * are required</li>
                  <li>• Enter 6-digit PIN code to auto-fill city and state (India only)</li>
                  <li>• Enter 11-character IFSC code to auto-fill bank details</li>
                  <li>• Verify contact email before proceeding</li>
                  <li>• Access level defines user permissions for the company</li>
                </>
              ) : (
                <>
                  <li>• Contact email cannot be changed after creation</li>
                  <li>• PIN code auto-fill works for Indian addresses only</li>
                  <li>• IFSC code validation available for Indian banks</li>
                  <li>• Status changes may affect user access</li>
                  <li>• Changes are logged for audit purposes</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditCompanyMainArea;