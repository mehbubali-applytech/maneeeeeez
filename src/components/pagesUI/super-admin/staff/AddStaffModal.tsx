"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { statePropsType } from "@/interface/common.interface";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Define staff form interface
interface IStaffForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  position: string;
  department: string;
  company: string;
  companyId: number;
  location: string;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave" | "Terminated";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  salary: number;
  currency: string;
  supervisor?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  emergencyContact?: string;
  skills?: string[];
  education?: string;
  experience?: number;
  notes?: string;
}

// Mock dropdown data
const companyOptions = [
  { value: "1", label: "TechNova Solutions" },
  { value: "2", label: "Global Finance Group" },
  { value: "3", label: "MediCare Innovations" },
  { value: "4", label: "EcoManufacture Inc" },
  { value: "5", label: "RetailMax Corporation" },
  { value: "6", label: "EduTech Solutions" },
  { value: "7", label: "RealEstate Pro" },
  { value: "8", label: "LogiTrans Global" },
  { value: "9", label: "EnergyPlus Corp" },
  { value: "10", label: "TeleConnect Ltd" },
];

const departmentOptions = [
  { value: "Engineering", label: "Engineering" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "IT", label: "IT" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Research & Development", label: "Research & Development" },
  { value: "Legal", label: "Legal" },
  { value: "Administration", label: "Administration" },
  { value: "Medical", label: "Medical" },
  { value: "Design", label: "Design" },
  { value: "Logistics", label: "Logistics" },
];

const positionOptions = [
  { value: "Software Engineer", label: "Software Engineer" },
  { value: "Senior Software Engineer", label: "Senior Software Engineer" },
  { value: "Team Lead", label: "Team Lead" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "Product Manager", label: "Product Manager" },
  { value: "UX Designer", label: "UX Designer" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Sales Executive", label: "Sales Executive" },
  { value: "Sales Manager", label: "Sales Manager" },
  { value: "Marketing Specialist", label: "Marketing Specialist" },
  { value: "HR Manager", label: "HR Manager" },
  { value: "Finance Analyst", label: "Finance Analyst" },
  { value: "Operations Manager", label: "Operations Manager" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Network Engineer", label: "Network Engineer" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "On Leave", label: "On Leave" },
  { value: "Terminated", label: "Terminated" },
];

const employmentTypeOptions = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Intern", label: "Intern" },
];

const currencyOptions = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "AED", label: "UAE Dirham (د.إ)" },
];

const countryOptions = [
  { value: "USA", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Japan", label: "Japan" },
  { value: "China", label: "China" },
  { value: "India", label: "India" },
  { value: "UAE", label: "United Arab Emirates" },
  { value: "Singapore", label: "Singapore" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const skillOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "SQL",
  "MongoDB",
  "UI/UX Design",
  "Project Management",
  "Sales",
  "Marketing",
  "Financial Analysis",
  "HR Management",
  "Customer Service",
  "Data Analysis",
  "Machine Learning"
];

const AddStaffModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IStaffForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "Software Engineer",
      department: "Engineering",
      company: "1",
      companyId: 1,
      location: "",
      joinDate: new Date().toISOString().split('T')[0],
      status: "Active",
      employmentType: "Full-time",
      salary: 0,
      currency: "USD",
      gender: "Male",
    }
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const handleToggle = () => setOpen(!open);

  // Handle submit form
  const onSubmit = async (data: IStaffForm) => {
    setIsCreating(true);
    
    try {
      // Generate employee ID
      const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Simulate API call
      setTimeout(() => {
        setIsCreating(false);
        toast.success(`Staff added successfully! Employee ID: ${employeeId}`);
        reset();
        setProfilePreview(null);
        setSelectedSkills([]);
        setOpen(false);
      }, 2000);
      
      console.log("Adding staff with data:", {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        employeeId,
        skills: selectedSkills,
        profileImage: profilePreview
      });
    } catch (error: any) {
      setIsCreating(false);
      toast.error(
        error?.message || "An error occurred while adding the staff. Please try again!"
      );
    }
  };

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const selectAllSkills = () => {
    if (selectedSkills.length === skillOptions.length) {
      setSelectedSkills([]);
    } else {
      setSelectedSkills([...skillOptions]);
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Add New Staff</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        {isCreating ? (
          <div className="card__wrapper text-center py-8">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="h6" className="font-medium mb-2">
                Adding Staff...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we create the staff profile
              </Typography>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card__wrapper">
              <Typography variant="h6" className="font-medium mb-4">
                Personal Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <div className="flex flex-col items-center">
                    <Avatar
                      src={profilePreview || undefined}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    >
                      <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      size="small"
                    >
                      Upload Photo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleProfileUpload}
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary" className="mt-2">
                      Recommended: 300x300px, PNG or JPG
                    </Typography>
                  </div>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <InputField
                        label="First Name *"
                        id="firstName"
                        type="text"
                        register={register("firstName", {
                          required: "First name is required",
                        })}
                        error={errors.firstName}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <InputField
                        label="Last Name *"
                        id="lastName"
                        type="text"
                        register={register("lastName", {
                          required: "Last name is required",
                        })}
                        error={errors.lastName}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <SelectBox
                        id="gender"
                        label="Gender"
                        options={genderOptions}
                        control={control}
                        error={errors.gender}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <InputField
                        label="Date of Birth"
                        id="dateOfBirth"
                        type="date"
                        register={register("dateOfBirth")}
                        error={errors.dateOfBirth}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Email Address *"
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
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Phone Number *"
                    id="phone"
                    type="tel"
                    register={register("phone", {
                      required: "Phone number is required",
                    })}
                    error={errors.phone}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Mobile Number"
                    id="mobile"
                    type="tel"
                    register={register("mobile")}
                    error={errors.mobile}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Emergency Contact"
                    id="emergencyContact"
                    type="tel"
                    register={register("emergencyContact")}
                    error={errors.emergencyContact}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Employment Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="company"
                    label="Company *"
                    options={companyOptions}
                    control={control}
                    error={errors.company}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="department"
                    label="Department *"
                    options={departmentOptions}
                    control={control}
                    error={errors.department}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="position"
                    label="Position *"
                    options={positionOptions}
                    control={control}
                    error={errors.position}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Supervisor"
                    id="supervisor"
                    type="text"
                    register={register("supervisor")}
                    error={errors.supervisor}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="employmentType"
                    label="Employment Type *"
                    options={employmentTypeOptions}
                    control={control}
                    error={errors.employmentType}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="status"
                    label="Status *"
                    options={statusOptions}
                    control={control}
                    error={errors.status}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Join Date *"
                    id="joinDate"
                    type="date"
                    register={register("joinDate", {
                      required: "Join date is required",
                    })}
                    error={errors.joinDate}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Years of Experience"
                    id="experience"
                    type="number"
                    register={register("experience", {
                      min: { value: 0, message: "Cannot be negative" }
                    })}
                    error={errors.experience}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Monthly Salary *"
                    id="salary"
                    type="number"
                    register={register("salary", {
                      required: "Salary is required",
                      min: { value: 0, message: "Cannot be negative" }
                    })}
                    error={errors.salary}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="currency"
                    label="Currency *"
                    options={currencyOptions}
                    control={control}
                    error={errors.currency}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Location Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="country"
                    label="Country"
                    options={countryOptions}
                    control={control}
                    error={errors.country}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="City"
                    id="city"
                    type="text"
                    register={register("city")}
                    error={errors.city}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Address"
                    id="address"
                    type="text"
                    register={register("address")}
                    error={errors.address}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputField
                    label="ZIP/Postal Code"
                    id="zipCode"
                    type="text"
                    register={register("zipCode")}
                    error={errors.zipCode}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <InputField
                    label="Location (Office)"
                    id="location"
                    type="text"
                    register={register("location")}
                    error={errors.location}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Skills & Education
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Typography variant="subtitle2">Select Skills</Typography>
                      <Button size="small" onClick={selectAllSkills}>
                        {selectedSkills.length === skillOptions.length ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          onClick={() => handleSkillToggle(skill)}
                          color={selectedSkills.includes(skill) ? "primary" : "default"}
                          variant={selectedSkills.includes(skill) ? "filled" : "outlined"}
                          size="small"
                          className="mb-1"
                        />
                      ))}
                    </div>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <div className="form__input-box">
                        <FormLabel label="Education" id="education" />
                        <textarea
                          id="education"
                          className="form-control min-h-[100px]"
                          placeholder="Enter educational background..."
                          {...field}
                        />
                      </div>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <div className="form__input-box">
                        <FormLabel label="Additional Notes" id="notes" />
                        <textarea
                          id="notes"
                          className="form-control min-h-[100px]"
                          placeholder="Any additional notes or information..."
                          {...field}
                        />
                      </div>
                    )}
                  />
                </Grid>
              </Grid>
            </div>
            
            <div className="submit__btn text-center mt-6 flex gap-3 justify-center">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleToggle}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Staff
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffModal;