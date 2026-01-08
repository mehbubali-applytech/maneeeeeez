"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  Chip,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";
import DatePicker from "react-datepicker";
import { statePropsType } from "@/interface/common.interface";
import { ISubscriptionForm } from "../subscription.interface";


// Mock dropdown data
const planOptions = [
  { value: "free", label: "Free" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "INR", label: "INR (₹)" },
];

const moduleOptions = ["CRM", "HR", "Projects", "Payroll", "Inventory", "Finance", "Support"];

const AddSubscriptionModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISubscriptionForm>();
  
  const [selectStartDate, setSelectStartDate] = useState<Date | null>(new Date());
  const [selectEndDate, setSelectEndDate] = useState<Date | null>(new Date());
  const [tags, setTags] = useState<string[]>(["CRM", "HR"]);
  const [inputValue, setInputValue] = useState<string>("");
  
  const handleToggle = () => setOpen(!open);

  // Handle submit form
  const onSubmit = async (data: ISubscriptionForm) => {
    try {
      // Simulate API call
      toast.success("Subscription added successfully!");
      reset();
      setTimeout(() => setOpen(false), 2000);
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while adding the subscription. Please try again!"
      );
    }
  };

  // Handle tags change
  const handleTagsChange = (event: any, newValue: string[]) => {
    const uniqueTags = Array.from(
      new Set(newValue.filter((tag) => tag.trim() !== ""))
    );
    setTags(uniqueTags);
  };
  
  const handleBlur = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      setTags((prevTags) => [...prevTags, trimmedValue]);
    }
    setInputValue("");
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Add New Subscription</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card__wrapper">
            <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0 justify-center items-center">
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Subscription Name"
                  id="subscriptionName"
                  type="text"
                  register={register("subscriptionName", {
                    required: "Subscription Name is required",
                  })}
                  error={errors.subscriptionName}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="plan"
                  label="Plan Type"
                  options={planOptions}
                  control={control}
                  error={errors.plan}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Amount"
                  id="amount"
                  type="number"
                  register={register("amount", {
                    required: "Amount is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Amount cannot be negative" }
                  })}
                  error={errors.amount}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="currency"
                  label="Currency"
                  options={currencyOptions}
                  control={control}
                  error={errors.currency}
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
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Number of Users"
                  id="users"
                  type="number"
                  register={register("users", {
                    required: "Number of users is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Minimum 1 user required" }
                  })}
                  error={errors.users}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <FormLabel label="Start Date" id="selectStartDate" />
                <div className="datepicker-style">
                  <DatePicker
                    id="selectStartDate"
                    selected={selectStartDate}
                    onChange={(date) => setSelectStartDate(date)}
                    showYearDropdown
                    showMonthDropdown
                    useShortMonthInDropdown
                    showPopperArrow={false}
                    peekNextMonth
                    dropdownMode="select"
                    isClearable
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Start date"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <FormLabel label="End Date" id="endDate" />
                <div className="datepicker-style">
                  <DatePicker
                    id="endDate"
                    selected={selectEndDate}
                    onChange={(date) => setSelectEndDate(date)}
                    showYearDropdown
                    showMonthDropdown
                    useShortMonthInDropdown
                    showPopperArrow={false}
                    peekNextMonth
                    dropdownMode="select"
                    isClearable
                    dateFormat="dd/MM/yyyy"
                    placeholderText="End date"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Owner Name"
                  id="owner"
                  type="text"
                  register={register("owner", {
                    required: "Owner name is required",
                  })}
                  error={errors.owner}
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
              
              <div className="col-span-12">
                <div className="from__input-box autocomplete-tags">
                  <div className="form__input-title">
                    <label htmlFor="TagifyBasic">Modules</label>
                  </div>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={moduleOptions}
                    value={tags}
                    onChange={handleTagsChange}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) =>
                      setInputValue(newInputValue)
                    }
                    renderTags={(value: string[], getTagProps) => {
                      return value.map((option, index) => {
                        const { key, ...rest } = getTagProps({ index });
                        return (
                          <Chip
                            key={index}
                            variant="outlined"
                            label={option}
                            {...rest}
                          />
                        );
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Add modules..."
                        onBlur={handleBlur}
                      />
                    )}
                  />
                </div>
              </div>
              
              <div className="col-span-12">
                <InputField
                  label="Description"
                  id="description"
                  isTextArea={true}
                  register={register("description")}
                  error={errors.description}
                />
              </div>
            </div>
          </div>
          
          <div className="submit__btn text-center mt-6">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;