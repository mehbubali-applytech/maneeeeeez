"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Divider
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { statePropsType } from "@/interface/common.interface";

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

// Mock dropdown data
const vendorTypeOptions = [
  { value: "IT Equipment", label: "IT Equipment" },
  { value: "Furniture", label: "Furniture" },
  { value: "Software", label: "Software" },
  { value: "Services", label: "Services" },
  { value: "Marketing", label: "Marketing" },
  { value: "Legal", label: "Legal" },
  { value: "Printing", label: "Printing" },
  { value: "Security", label: "Security" },
  { value: "Consulting", label: "Consulting" },
  { value: "Logistics", label: "Logistics" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Pending", label: "Pending" },
  { value: "Rejected", label: "Rejected" },
];

const paymentTermsOptions = [
  { value: "Net 30", label: "Net 30 Days" },
  { value: "Net 60", label: "Net 60 Days" },
  { value: "Net 90", label: "Net 90 Days" },
  { value: "Due on Receipt", label: "Due on Receipt" },
  { value: "50% Advance", label: "50% Advance, 50% on Delivery" },
  { value: "Custom", label: "Custom Terms" },
];

const countryOptions = [
  { value: "USA", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "India", label: "India" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
];

const AddVendorModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IVendorForm>();
  
  const [creditLimit, setCreditLimit] = useState<number>(10000);
  
  const handleToggle = () => setOpen(!open);

  // Handle submit form
  const onSubmit = async (data: IVendorForm) => {
    try {
      // Simulate API call
      toast.success("Vendor added successfully!");
      reset();
      setTimeout(() => setOpen(false), 2000);
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while adding the vendor. Please try again!"
      );
    }
  };

  const marks = [
    { value: 0, label: '$0' },
    { value: 10000, label: '$10K' },
    { value: 50000, label: '$50K' },
    { value: 100000, label: '$100K' },
    { value: 200000, label: '$200K' },
  ];

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Add New Vendor</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card__wrapper">
            <Typography variant="h6" className="font-medium mb-4">
              Basic Information
            </Typography>
            
            <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0 justify-center items-center">
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Vendor Name"
                  id="vendorName"
                  type="text"
                  register={register("vendorName", {
                    required: "Vendor name is required",
                  })}
                  error={errors.vendorName}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Contact Person"
                  id="contactPerson"
                  type="text"
                  register={register("contactPerson", {
                    required: "Contact person is required",
                  })}
                  error={errors.contactPerson}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  error={errors.email}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  register={register("phone", {
                    required: "Phone number is required",
                  })}
                  error={errors.phone}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="vendorType"
                  label="Vendor Type"
                  options={vendorTypeOptions}
                  control={control}
                  error={errors.vendorType}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="status"
                  label="Status"
                  options={statusOptions}
                  control={control}
                  error={errors.status}
                />
              </div>
            </div>
            
            <Divider className="my-6" />
            
            <Typography variant="h6" className="font-medium mb-4">
              Address Information
            </Typography>
            
            <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0 justify-center items-center">
              <div className="col-span-12">
                <InputField
                  label="Street Address"
                  id="address"
                  type="text"
                  register={register("address", {
                    required: "Address is required",
                  })}
                  error={errors.address}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="City"
                  id="city"
                  type="text"
                  register={register("city", {
                    required: "City is required",
                  })}
                  error={errors.city}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="State/Province"
                  id="state"
                  type="text"
                  register={register("state", {
                    required: "State is required",
                  })}
                  error={errors.state}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="ZIP/Postal Code"
                  id="zipCode"
                  type="text"
                  register={register("zipCode", {
                    required: "ZIP code is required",
                  })}
                  error={errors.zipCode}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="country"
                  label="Country"
                  options={countryOptions}
                  control={control}
                  error={errors.country}
                />
              </div>
            </div>
            
            <Divider className="my-6" />
            
            <Typography variant="h6" className="font-medium mb-4">
              Financial Information
            </Typography>
            
            <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0 justify-center items-center">
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Tax ID/VAT Number"
                  id="taxId"
                  type="text"
                  register={register("taxId")}
                  error={errors.taxId}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="paymentTerms"
                  label="Payment Terms"
                  options={paymentTermsOptions}
                  control={control}
                  error={errors.paymentTerms}
                />
              </div>
              
              <div className="col-span-12">
                <Typography id="credit-limit-slider" gutterBottom className="mb-2">
                  Credit Limit: ${creditLimit.toLocaleString()}
                </Typography>
                <Box sx={{ px: 2 }}>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$50K</span>
                    <span>$100K</span>
                    <span>$150K</span>
                    <span>$200K</span>
                  </div>
                </Box>
                <input
                  type="hidden"
                  {...register("creditLimit", { value: creditLimit })}
                />
              </div>
            </div>
            
            <Divider className="my-6" />
            
            <div className="col-span-12">
              <InputField
                label="Additional Notes"
                id="notes"
                isTextArea={true}

                register={register("notes")}
                error={errors.notes}

              />
            </div>
          </div>
          
          <div className="submit__btn text-center mt-6">
            <button type="submit" className="btn btn-primary">
              Add Vendor
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorModal;