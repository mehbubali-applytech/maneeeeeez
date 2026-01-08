"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { moduleStatePropsType } from "./module.interface";

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

const EditModuleModal = ({ 
  open, 
  setOpen, 
  editData 
}: moduleStatePropsType & { editData: IModuleForm | any }) => {
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IModuleForm>();
  
  const handleToggle = () => setOpen(!open);

  // Handle updated form submit
  const onSubmit = async (data: IModuleForm) => {
    try {
      // Simulate API call
      toast.success("Module updated successfully!");
      setTimeout(() => setOpen(false), 2000);
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating the module. Please try again!"
      );
    }
  };

  if (!editData) return null;

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Update Module</h5>
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
                  defaultValue={editData.moduleName}
                  required={false}
                  register={register("moduleName")}
                  error={errors.moduleName}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Module Code"
                  id="moduleCode"
                  type="text"
                  defaultValue={editData.moduleCode}
                  required={false}
                  register={register("moduleCode")}
                  error={errors.moduleCode}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="category"
                  label="Category"
                  isRequired={false}
                  defaultValue={editData.category}
                  options={categoryOptions}
                  control={control}
                  error={errors.category}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="tier"
                  label="Tier Level"
                  isRequired={false}
                  defaultValue={editData.tier}
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
                  defaultValue={editData.price}
                  required={false}
                  register={register("price", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Price must be positive" }
                  })}
                  error={errors.price}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Maximum Users"
                  id="maxUsers"
                  type="number"
                  defaultValue={editData.users}
                  required={false}
                  register={register("maxUsers", {
                    valueAsNumber: true,
                    min: { value: 1, message: "At least 1 user required" }
                  })}
                  error={errors.maxUsers}
                />
              </div>
              
              <div className="col-span-12">
                <InputField
                  label="Module Description"
                  id="description"
                  isTextArea={true}
                  defaultValue={editData.description}
                  required={false}
                  register={register("description")}
                  error={errors.description}
                />
              </div>
            </div>
          </div>
          
          <div className="submit__btn text-center mt-6">
            <button type="submit" className="btn btn-primary">
              Update Module
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModuleModal;