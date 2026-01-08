"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Slider,
  Typography,
  Box
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { statePropsType } from "@/interface/common.interface";

// Define module form interface
interface IModuleForm {
  moduleName: string;
  moduleCode: string;
  category: string;
  tier: string;
  price: number;
  maxUsers: number;
  description: string;
}

// Mock dropdown data
const categoryOptions = [
  { value: "HR", label: "Human Resources" },
  { value: "Finance", label: "Finance" },
  { value: "Operations", label: "Operations" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Legal", label: "Legal" },
  { value: "IT", label: "IT" },
];

const tierOptions = [
  { value: "Basic", label: "Basic" },
  { value: "Pro", label: "Pro" },
  { value: "Enterprise", label: "Enterprise" },
  { value: "Custom", label: "Custom" },
];

const AddModuleModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IModuleForm>();
  
  const [userLimit, setUserLimit] = useState<number>(50);
  
  const handleToggle = () => setOpen(!open);

  // Handle submit form
  const onSubmit = async (data: IModuleForm) => {
    try {
      // Simulate API call
      toast.success("Module added successfully!");
      reset();
      setTimeout(() => setOpen(false), 2000);
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while adding the module. Please try again!"
      );
    }
  };

  const marks = [
    { value: 10, label: '10' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 200, label: '200' },
    { value: 500, label: '500' },
  ];

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Add New Module</h5>
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
                  label="Module Name"
                  id="moduleName"
                  type="text"
                  register={register("moduleName", {
                    required: "Module name is required",
                  })}
                  error={errors.moduleName}
                />
              </div>
              
             <div className="col-span-12 md:col-span-6">
  <InputField
    label="Module Code"
    id="moduleCode"
    type="text"
    register={register("moduleCode", {
      required: "Module code is required",
      pattern: {
        value: /^MOD-\d{3}$/,
        message: "Format: MOD-001",
      },
    })}
    error={errors.moduleCode}
  />

  {/* ✅ helper text handled OUTSIDE InputField */}
  {!errors.moduleCode && (
    <small className="form-text text-muted">
      Format: MOD-001
    </small>
  )}
</div>

              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="category"
                  label="Category"
                  options={categoryOptions}
                  control={control}
                  error={errors.category}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="tier"
                  label="Tier Level"
                  options={tierOptions}
                  control={control}
                  error={errors.tier}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Monthly Price ($)"
                  id="price"
                  type="number"
                  register={register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Price must be positive" }
                  })}
                  error={errors.price}
                />
              </div>
              
              <div className="col-span-12">
                <Typography id="user-limit-slider" gutterBottom>
                  Maximum Users: {userLimit}
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={userLimit}
                    onChange={(_, value) => setUserLimit(value as number)}
                    aria-labelledby="user-limit-slider"
                    step={10}
                    marks={marks}
                    min={10}
                    max={500}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <input
                  type="hidden"
                  {...register("maxUsers", { value: userLimit })}
                />
              </div>
              
              <div className="col-span-12">
                <InputField
                  label="Module Description"
                  id="description"
                  isTextArea={true}
                  register={register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters"
                    }
                  })}
                  error={errors.description}
                />
              </div>
            </div>
          </div>
          
          <div className="submit__btn text-center mt-6">
            <button type="submit" className="btn btn-primary">
              Add Module
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModuleModal;