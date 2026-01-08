"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  Divider
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { vendorStatePropsType } from "./vendor.interface";

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

const EditVendorModal = ({ 
  open, 
  setOpen, 
  editData 
}: vendorStatePropsType & { editData: IVendorForm | any }) => {
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IVendorForm>();
  
  const [creditLimit, setCreditLimit] = useState<number>(editData?.creditLimit || 10000);
  
  const handleToggle = () => setOpen(!open);

  // Handle updated form submit
  const onSubmit = async (data: IVendorForm) => {
    try {
      // Simulate API call
      toast.success("Vendor updated successfully!");
      setTimeout(() => setOpen(false), 2000);
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating the vendor. Please try again!"
      );
    }
  };

  if (!editData) return null;

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Update Vendor</h5>
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
                  defaultValue={editData.vendorName}
                  required={false}
                  register={register("vendorName")}
                  error={errors.vendorName}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Contact Person"
                  id="contactPerson"
                  type="text"
                  defaultValue={editData.contactPerson}
                  required={false}
                  register={register("contactPerson")}
                  error={errors.contactPerson}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  defaultValue={editData.email}
                  required={false}
                  register={register("email", {
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
                  defaultValue={editData.phone}
                  required={false}
                  register={register("phone")}
                  error={errors.phone}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="vendorType"
                  label="Vendor Type"
                  isRequired={false}
                  defaultValue={editData.vendorType}
                  options={vendorTypeOptions}
                  control={control}
                  error={errors.vendorType}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="status"
                  label="Status"
                  isRequired={false}
                  defaultValue={editData.status}
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
                  defaultValue={editData.address}
                  required={false}
                  register={register("address")}
                  error={errors.address}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="City"
                  id="city"
                  type="text"
                  defaultValue={editData.city}
                  required={false}
                  register={register("city")}
                  error={errors.city}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="State/Province"
                  id="state"
                  type="text"
                  defaultValue={editData.state}
                  required={false}
                  register={register("state")}
                  error={errors.state}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="ZIP/Postal Code"
                  id="zipCode"
                  type="text"
                  defaultValue={editData.zipCode}
                  required={false}
                  register={register("zipCode")}
                  error={errors.zipCode}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="country"
                  label="Country"
                  isRequired={false}
                  defaultValue={editData.country}
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
                  defaultValue={editData.taxId}
                  required={false}
                  register={register("taxId")}
                  error={errors.taxId}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="paymentTerms"
                  label="Payment Terms"
                  isRequired={false}
                  defaultValue={editData.paymentTerms}
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
                defaultValue={editData.notes}
                required={false}
                register={register("notes")}
                error={errors.notes}
              />
            </div>
          </div>
          
          <div className="submit__btn text-center mt-6">
            <button type="submit" className="btn btn-primary">
              Update Vendor
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVendorModal;