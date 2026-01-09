"use client";
import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Chip, 
  Box, 
  Divider, 
  Grid,
  Button,
  Paper,
  Avatar,
  Rating,
  Badge
} from "@mui/material";
import { StaffDetailsStatePropsType } from "./staff.interface";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningIcon from "@mui/icons-material/Warning";

interface IStaff {
  [key: string]: any;
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
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
  profileImage?: string;
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
  performanceRating?: number;
  attendanceRate?: number;
  projectsCompleted?: number;
  lastLogin?: string;
  notes?: string;
}

const StaffDetailsModal = ({ 
  open, 
  setOpen, 
  staffData 
}: StaffDetailsStatePropsType) => {
  
  const handleToggle = () => setOpen(!open);

  if (!staffData) return null;

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success-badge";
      case "inactive":
        return "danger-badge";
      case "on leave":
        return "warning-badge";
      case "terminated":
        return "error-badge";
      default:
        return "default-badge";
    }
  };

  const getEmploymentTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "primary-badge";
      case "part-time":
        return "info-badge";
      case "contract":
        return "warning-badge";
      case "intern":
        return "secondary-badge";
      default:
        return "default-badge";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownload = () => {
    alert(`Downloading ${staffData.fullName} details...`);
  };

  const handleShare = () => {
    alert(`Sharing ${staffData.fullName} information...`);
  };

  // Calculate experience
  const calculateExperience = () => {
    if (!staffData.experience) {
      const joinDate = new Date(staffData.joinDate);
      const today = new Date();
      const diffYears = today.getFullYear() - joinDate.getFullYear();
      const diffMonths = today.getMonth() - joinDate.getMonth();
      return diffYears + (diffMonths / 12);
    }
    return staffData.experience;
  };

  // Staff metrics
  const staffMetrics = [
    { label: "Performance Rating", value: `${staffData.performanceRating || 0}/5`, icon: "⭐", color: "bg-yellow-50" },
    { label: "Attendance Rate", value: `${staffData.attendanceRate || 0}%`, icon: "📊", color: "bg-green-50" },
    { label: "Projects Completed", value: staffData.projectsCompleted || 0, icon: "✅", color: "bg-blue-50" },
    { label: "Experience", value: `${calculateExperience().toFixed(1)} years`, icon: "🎯", color: "bg-purple-50" },
    { label: "Monthly Salary", value: formatCurrency(staffData.salary, staffData.currency), icon: "💰", color: "bg-emerald-50" },
    { label: "Employment Type", value: staffData.employmentType, icon: "📝", color: "bg-orange-50" },
  ];

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5 className="modal-title">Staff Details</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        <div className="card__wrapper">
          <div className="grid grid-cols-12 gap-y-5">
            <div className="col-span-12">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  {staffData.profileImage ? (
                    <Avatar
                      src={staffData.profileImage}
                      alt={staffData.fullName}
                      className="mr-4 w-16 h-16"
                    />
                  ) : (
                    <Avatar className="mr-4 bg-primary" sx={{ width: 64, height: 64 }}>
                      <PersonIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                  )}
                  <div>
                    <Typography variant="h5" className="font-bold">
                      {staffData.fullName}
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip 
                        label={staffData.status} 
                        className={getStatusClass(staffData.status)}
                        size="small"
                      />
                      <Chip 
                        label={staffData.employmentType} 
                        className={getEmploymentTypeClass(staffData.employmentType)}
                        size="small"
                      />
                      <Chip 
                        label={`ID: ${staffData.employeeId}`}
                        variant="outlined"
                        size="small"
                      />
                    </div>
                    <Typography variant="body1" className="mt-2 text-gray-600">
                      {staffData.position} • {staffData.department}
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="body2" color="text.secondary">
                    Employee ID
                  </Typography>
                  <Typography variant="h6" className="font-bold text-primary">
                    {staffData.employeeId}
                  </Typography>
                  <div className="mt-2">
                    <Typography variant="body2" color="text.secondary">
                      Company
                    </Typography>
                    <Typography variant="body1" className="font-medium">
                      {staffData.company}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            
            <Divider className="col-span-12 my-2" />
            
            <Grid container spacing={2} className="col-span-12">
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <EmailIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Email</span>
                  </div>
                  <h6 className="label__title">{staffData.email}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <PhoneIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Phone</span>
                  </div>
                  <h6 className="label__title">{staffData.phone}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <BusinessIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Company</span>
                  </div>
                  <h6 className="label__title">{staffData.company}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <GroupsIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Department</span>
                  </div>
                  <h6 className="label__title">{staffData.department}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <WorkIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Position</span>
                  </div>
                  <h6 className="label__title">{staffData.position}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Join Date</span>
                  </div>
                  <h6 className="label__title">{staffData.joinDate}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <LocationOnIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Location</span>
                  </div>
                  <h6 className="label__title">{staffData.location}</h6>
                </div>
              </Grid>
              
              {staffData.supervisor && (
                <Grid item xs={12} md={6}>
                  <div className="label__content-wrapper">
                    <div className="flex items-center gap-2">
                      <PersonIcon fontSize="small" color="action" />
                      <span className="label__subtitle">Supervisor</span>
                    </div>
                    <h6 className="label__title">{staffData.supervisor}</h6>
                  </div>
                </Grid>
              )}
              
              {staffData.lastLogin && (
                <Grid item xs={12}>
                  <div className="label__content-wrapper">
                    <div className="flex items-center gap-2">
                      <CalendarTodayIcon fontSize="small" color="action" />
                      <span className="label__subtitle">Last Login</span>
                    </div>
                    <h6 className="label__title">{staffData.lastLogin}</h6>
                  </div>
                </Grid>
              )}
            </Grid>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Staff Performance Metrics
              </Typography>
              <Paper variant="outlined" className="p-4">
                <Grid container spacing={2}>
                  {staffMetrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <div className={`text-center p-3 ${metric.color} rounded-lg`}>
                        <div className="text-2xl mb-2">{metric.icon}</div>
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          {metric.label}
                        </Typography>
                        <Typography variant="h6" className="font-bold">
                          {metric.value}
                        </Typography>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </div>
            
            {staffData.skills && staffData.skills.length > 0 && (
              <>
                <Divider className="col-span-12 my-4" />
                <div className="col-span-12">
                  <Typography variant="subtitle1" className="font-medium mb-3">
                    Skills & Expertise
                  </Typography>
                  <Box className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {staffData.skills.map((skill: string, index: number) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          className="mb-1"
                        />
                      ))}
                    </div>
                  </Box>
                </div>
              </>
            )}
            
            {(staffData.education || staffData.notes) && (
              <>
                <Divider className="col-span-12 my-4" />
                <div className="col-span-12">
                  <Typography variant="subtitle1" className="font-medium mb-3">
                    Additional Information
                  </Typography>
                  <Box className="p-3 bg-gray-50 rounded-lg">
                    {staffData.education && (
                      <div className="mb-3">
                        <Typography variant="body2" className="font-medium">Education:</Typography>
                        <Typography variant="body2">{staffData.education}</Typography>
                      </div>
                    )}
                    {staffData.notes && (
                      <div>
                        <Typography variant="body2" className="font-medium">Notes:</Typography>
                        <Typography variant="body2">{staffData.notes}</Typography>
                      </div>
                    )}
                  </Box>
                </div>
              </>
            )}
            
            {staffData.address && (
              <>
                <Divider className="col-span-12 my-4" />
                <div className="col-span-12">
                  <Typography variant="subtitle1" className="font-medium mb-3">
                    Contact Information
                  </Typography>
                  <Box className="p-3 bg-green-50 rounded-lg">
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Address:</strong> {staffData.address}
                        </Typography>
                      </Grid>
                      {staffData.city && staffData.country && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>City/Country:</strong> {staffData.city}, {staffData.country}
                          </Typography>
                        </Grid>
                      )}
                      {staffData.zipCode && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>ZIP Code:</strong> {staffData.zipCode}
                          </Typography>
                        </Grid>
                      )}
                      {staffData.emergencyContact && (
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            <strong>Emergency Contact:</strong> {staffData.emergencyContact}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </div>
              </>
            )}
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="contained"
                  color="primary"
                  className="!text-white"
                  startIcon={<EditIcon />}
                  onClick={() => alert(`Editing ${staffData.fullName}...`)}
                >
                  Edit Staff
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  Download Details
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                >
                  Share Details
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  className="!text-white"
                  startIcon={<VerifiedIcon />}
                  onClick={() => alert("Viewing attendance records...")}
                >
                  View Attendance
                </Button>
                {staffData.status === "Active" && (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => alert("Assigning to new project...")}
                  >
                    Assign Project
                  </Button>
                )}
                {staffData.status === "Inactive" && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => alert("Activating staff...")}
                  >
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsModal;