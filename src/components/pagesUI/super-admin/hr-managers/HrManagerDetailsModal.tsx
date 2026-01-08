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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs
} from "@mui/material";
import { HrManagerDetailsStatePropsType } from "./hr-managers.interface";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import FlagIcon from "@mui/icons-material/Flag";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EmergencyIcon from "@mui/icons-material/Emergency";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hr-manager-tabpanel-${index}`}
      aria-labelledby={`hr-manager-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const HrManagerDetailsModal = ({
  open,
  setOpen,
  hrManagerData
}: HrManagerDetailsStatePropsType) => {
  
  const handleToggle = () => setOpen(!open);
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!hrManagerData) return null;

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success-badge";
      case "inactive":
        return "danger-badge";
      case "on leave":
        return "warning-badge";
      case "pending":
        return "info-badge";
      default:
        return "default-badge";
    }
  };

  const getGenderIcon = (gender?: string) => {
    if (!gender) return null;
    switch (gender.toLowerCase()) {
      case "male":
        return <MaleIcon fontSize="small" />;
      case "female":
        return <FemaleIcon fontSize="small" />;
      case "other":
        return <TransgenderIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const handleDownload = () => {
    alert(`Downloading ${hrManagerData.hrName} details...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert(`Sharing ${hrManagerData.hrName} information...`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#4caf50";
      case "inactive":
        return "#f44336";
      case "on leave":
        return "#ff9800";
      case "pending":
        return "#2196f3";
      default:
        return "#9e9e9e";
    }
  };

  const hrMetrics = [
    { label: "Managed Employees", value: hrManagerData.managedEmployees || "0", icon: "👥", color: "#3B93A5" },
    { label: "Years Experience", value: hrManagerData.yearsOfExperience || "0", icon: "📅", color: "#F7B844" },
    { label: "Departments", value: "1", icon: "🏢", color: "#EC3C65" },
    { label: "Active Projects", value: "5", icon: "📋", color: "#ADD8C7" },
    { label: "HR Rating", value: `${hrManagerData.rating}/5`, icon: "⭐", color: "#D43F97" },
    { label: "Employee Satisfaction", value: "92%", icon: "😊", color: "#1E5D8C" },
  ];

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <div>
            <h5 className="modal-title">HR Manager Details</h5>
            <Typography variant="caption" color="text.secondary">
              Complete profile and professional information
            </Typography>
          </div>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        <div className="card__wrapper">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    fontSize: 32,
                    bgcolor: getStatusColor(hrManagerData.status)
                  }}
                  className="mr-6 border-4 border-white shadow-lg"
                >
                  {getInitials(hrManagerData.hrName)}
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Typography variant="h4" className="font-bold text-gray-800">
                      {hrManagerData.hrName}
                    </Typography>
                    <Chip 
                      label={hrManagerData.status} 
                      className={getStatusClass(hrManagerData.status)}
                      size="small"
                    />
                  </div>
                  <Typography variant="h6" className="text-gray-600 font-medium">
                    {hrManagerData.jobTitle}
                  </Typography>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center">
                      <BusinessIcon fontSize="small" className="text-gray-500 mr-1" />
                      <Typography variant="body2">
                        {hrManagerData.company}
                      </Typography>
                    </div>
                    <div className="flex items-center">
                      <ApartmentIcon fontSize="small" className="text-gray-500 mr-1" />
                      <Typography variant="body2">
                        {hrManagerData.department}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Typography variant="body2" color="text.secondary">
                  HR Manager ID
                </Typography>
                <Typography variant="h5" className="font-bold text-primary">
                  {hrManagerData.hrCode}
                </Typography>
                <div className="flex items-center justify-end mt-2">
                  <Rating value={hrManagerData.rating} readOnly precision={0.1} />
                  <Typography variant="body2" className="ml-2 font-semibold">
                    {hrManagerData.rating.toFixed(1)}/5
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="hr manager details tabs">
              <Tab icon={<PersonIcon />} iconPosition="start" label="Profile" />
              <Tab icon={<WorkIcon />} iconPosition="start" label="Professional" />
              <Tab icon={<SchoolIcon />} iconPosition="start" label="Qualifications" />
              <Tab icon={<DescriptionIcon />} iconPosition="start" label="Additional" />
            </Tabs>
          </Box>

          {/* Tab 1: Profile */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Left Column - Contact Info */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" className="p-4 h-full">
                  <Typography variant="h6" className="font-semibold mb-4 pb-2 border-b">
                    <PersonIcon className="mr-2" fontSize="small" />
                    Contact Information
                  </Typography>
                  
                  <List disablePadding>
                    <ListItem disablePadding className="mb-3">
                      <ListItemIcon className="min-w-10">
                        <EmailIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={
                          <a 
                            href={`mailto:${hrManagerData.email}`}
                            className="text-primary hover:underline"
                          >
                            {hrManagerData.email}
                          </a>
                        }
                      />
                    </ListItem>
                    
                    <ListItem disablePadding className="mb-3">
                      <ListItemIcon className="min-w-10">
                        <PhoneIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone" 
                        secondary={
                          <div>
                            <div className="font-medium">{hrManagerData.phone}</div>
                            {hrManagerData.mobile && (
                              <div className="text-sm text-gray-600">Mobile: {hrManagerData.mobile}</div>
                            )}
                            {hrManagerData.extension && (
                              <div className="text-sm text-gray-600">Ext: {hrManagerData.extension}</div>
                            )}
                          </div>
                        }
                      />
                    </ListItem>
                    
                    <ListItem disablePadding className="mb-3">
                      <ListItemIcon className="min-w-10">
                        <LocationOnIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Location" 
                        secondary={hrManagerData.location}
                      />
                    </ListItem>
                    
                    <ListItem disablePadding className="mb-3">
                      <ListItemIcon className="min-w-10">
                        <CalendarTodayIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Hire Date" 
                        secondary={
                          <div>
                            <div className="font-medium">{formatDate(hrManagerData.hireDate)}</div>
                            <div className="text-sm text-gray-600">
                              {hrManagerData.yearsOfExperience} years of service
                            </div>
                          </div>
                        }
                      />
                    </ListItem>
                    
                    <ListItem disablePadding>
                      <ListItemIcon className="min-w-10">
                        <AssignmentIndIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Reporting To" 
                        secondary={hrManagerData.reportingTo || "Not specified"}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Right Column - Personal Info */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" className="p-4 h-full">
                  <Typography variant="h6" className="font-semibold mb-4 pb-2 border-b">
                    <AssignmentIndIcon className="mr-2" fontSize="small" />
                    Personal Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div className="mb-4">
                        <Typography variant="caption" color="text.secondary">
                          Date of Birth
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {formatDate(hrManagerData.dateOfBirth)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Age: {calculateAge(hrManagerData.dateOfBirth)}
                        </Typography>
                      </div>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <div className="mb-4">
                        <Typography variant="caption" color="text.secondary">
                          Gender
                        </Typography>
                        <div className="flex items-center">
                          {getGenderIcon(hrManagerData.gender)}
                          <Typography variant="body1" className="font-medium ml-2">
                            {hrManagerData.gender || "Not specified"}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <div className="mb-4">
                        <Typography variant="caption" color="text.secondary">
                          Marital Status
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {hrManagerData.maritalStatus || "Not specified"}
                        </Typography>
                      </div>
                    </Grid>
                    
                    {hrManagerData.address && (
                      <Grid item xs={12}>
                        <div className="mb-4">
                          <Typography variant="caption" color="text.secondary">
                            Address
                          </Typography>
                          <Typography variant="body1" className="font-medium">
                            {hrManagerData.address}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {[hrManagerData.city, hrManagerData.state, hrManagerData.country, hrManagerData.zipCode]
                              .filter(Boolean)
                              .join(', ')}
                          </Typography>
                        </div>
                      </Grid>
                    )}
                    
                    {hrManagerData.emergencyContact && (
                      <Grid item xs={12}>
                        <Divider className="my-2" />
                        <div className="mb-4">
                          <Typography variant="caption" color="text.secondary" className="flex items-center">
                            <EmergencyIcon fontSize="small" className="mr-1" />
                            Emergency Contact
                          </Typography>
                          <Typography variant="body1" className="font-medium">
                            {hrManagerData.emergencyContact}
                          </Typography>
                          {hrManagerData.emergencyPhone && (
                            <Typography variant="body2" className="text-gray-600">
                              {hrManagerData.emergencyPhone}
                            </Typography>
                          )}
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              {/* Metrics Cards */}
              <Grid item xs={12}>
                <Paper variant="outlined" className="p-4">
                  <Typography variant="h6" className="font-semibold mb-4">
                    <GroupsIcon className="mr-2" fontSize="small" />
                    HR Manager Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    {hrMetrics.map((metric, index) => (
                      <Grid item xs={6} sm={4} md={2} key={index}>
                        <div 
                          className="text-center p-4 rounded-lg"
                          style={{ backgroundColor: `${metric.color}15` }}
                        >
                          <div className="text-2xl mb-2">{metric.icon}</div>
                          <Typography variant="body2" color="text.secondary" className="mb-1">
                            {metric.label}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            className="font-bold"
                            style={{ color: metric.color }}
                          >
                            {metric.value}
                          </Typography>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Professional */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper variant="outlined" className="p-4">
                  <Typography variant="h6" className="font-semibold mb-4 pb-2 border-b">
                    <WorkIcon className="mr-2" fontSize="small" />
                    Professional Details
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="caption" color="text.secondary">
                            Years of Experience
                          </Typography>
                          <div className="flex items-center mt-1">
                            <AccessTimeIcon fontSize="small" className="text-primary mr-2" />
                            <Typography variant="h5" className="font-bold">
                              {hrManagerData.yearsOfExperience} years
                            </Typography>
                          </div>
                        </div>
                        
                        <div>
                          <Typography variant="caption" color="text.secondary">
                            Managed Employees
                          </Typography>
                          <div className="flex items-center mt-1">
                            <GroupsIcon fontSize="small" className="text-primary mr-2" />
                            <Typography variant="h5" className="font-bold">
                              {hrManagerData.managedEmployees?.toLocaleString() || "0"}
                            </Typography>
                          </div>
                        </div>
                        
                        <div>
                          <Typography variant="caption" color="text.secondary">
                            Current Role
                          </Typography>
                          <Typography variant="body1" className="font-medium">
                            {hrManagerData.jobTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {hrManagerData.department}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <div>
                        <Typography variant="caption" color="text.secondary" className="block mb-2">
                          Company Information
                        </Typography>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <BusinessIcon fontSize="small" className="text-blue-600 mr-2" />
                            <Typography variant="body1" className="font-bold text-blue-800">
                              {hrManagerData.company}
                            </Typography>
                          </div>
                          <div className="flex items-center mb-2">
                            <LocationOnIcon fontSize="small" className="text-blue-600 mr-2" />
                            <Typography variant="body2" className="text-blue-700">
                              {hrManagerData.location}
                            </Typography>
                          </div>
                          {hrManagerData.reportingTo && (
                            <div className="flex items-center">
                              <AssignmentIndIcon fontSize="small" className="text-blue-600 mr-2" />
                              <Typography variant="body2" className="text-blue-700">
                                Reports to: {hrManagerData.reportingTo}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                    </Grid>
                    
                    {hrManagerData.notes && (
                      <Grid item xs={12}>
                        <Divider className="my-2" />
                        <div>
                          <Typography variant="caption" color="text.secondary">
                            Additional Notes
                          </Typography>
                          <Paper variant="outlined" className="p-3 mt-2 bg-gray-50">
                            <Typography variant="body2">
                              {hrManagerData.notes}
                            </Typography>
                          </Paper>
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Qualifications */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" className="p-4 h-full">
                  <Typography variant="h6" className="font-semibold mb-4 pb-2 border-b">
                    <SchoolIcon className="mr-2" fontSize="small" />
                    Qualifications
                  </Typography>
                  
                  {hrManagerData.qualifications && hrManagerData.qualifications.length > 0 ? (
                    <List disablePadding>
                      {hrManagerData.qualifications.map((qualification, index) => (
                        <ListItem disablePadding key={index} className="mb-2">
                          <ListItemIcon className="min-w-10">
                            <SchoolIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={qualification} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" className="italic">
                      No qualifications added
                    </Typography>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" className="p-4 h-full">
                  <Typography variant="h6" className="font-semibold mb-4 pb-2 border-b">
                    <BadgeIcon className="mr-2" fontSize="small" />
                    Certifications
                  </Typography>
                  
                  {hrManagerData.certifications && hrManagerData.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {hrManagerData.certifications.map((certification, index) => (
                        <Chip
                          key={index}
                          label={certification}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </div>
                  ) : (
                    <Typography variant="body2" color="text.secondary" className="italic">
                      No certifications added
                    </Typography>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" className="p-4">
                  <Typography variant="h6" className="font-semibold mb-4 pb-2 border-b">
                    <EngineeringIcon className="mr-2" fontSize="small" />
                    Specializations & Skills
                  </Typography>
                  
                  {hrManagerData.specializations && hrManagerData.specializations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {hrManagerData.specializations.map((specialization, index) => (
                        <Chip
                          key={index}
                          label={specialization}
                          color="secondary"
                          variant="filled"
                          size="medium"
                          className="font-medium"
                        />
                      ))}
                    </div>
                  ) : (
                    <Typography variant="body2" color="text.secondary" className="italic">
                      No specializations added
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 4: Additional */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper variant="outlined" className="p-4">
                  <Typography variant="h6" className="font-semibold mb-4">
                    <DescriptionIcon className="mr-2" fontSize="small" />
                    Additional Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <div>
                        <Typography variant="subtitle2" className="font-medium mb-2">
                          Contact Preferences
                        </Typography>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>Email Notifications</span>
                            <Chip label="Enabled" color="success" size="small" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>SMS Alerts</span>
                            <Chip label="Disabled" color="default" size="small" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>System Notifications</span>
                            <Chip label="Enabled" color="success" size="small" />
                          </div>
                        </div>
                      </div>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <div>
                        <Typography variant="subtitle2" className="font-medium mb-2">
                          Access & Permissions
                        </Typography>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>Employee Management</span>
                            <Chip label="Full Access" color="primary" size="small" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>Payroll View</span>
                            <Chip label="Read Only" color="info" size="small" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>Reports Access</span>
                            <Chip label="Full Access" color="primary" size="small" />
                          </div>
                        </div>
                      </div>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider className="my-2" />
                      <div>
                        <Typography variant="subtitle2" className="font-medium mb-2">
                          System Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">
                              Created On
                            </Typography>
                            <Typography variant="body2" className="font-medium">
                              {hrManagerData.createdAt ? formatDate(hrManagerData.createdAt) : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">
                              Last Updated
                            </Typography>
                            <Typography variant="body2" className="font-medium">
                              {hrManagerData.updatedAt ? formatDate(hrManagerData.updatedAt) : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">
                              Last Login
                            </Typography>
                            <Typography variant="body2" className="font-medium">
                              Today, 09:45 AM
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">
                              Account Status
                            </Typography>
                            <Chip label={hrManagerData.status} className={getStatusClass(hrManagerData.status)} size="small" />
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Action Buttons */}
          <Divider className="my-6" />
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="contained"
              color="primary"
              className="!text-white"
              startIcon={<EditIcon />}
              onClick={() => {
                handleToggle();
                // You can add edit navigation here
                alert(`Editing ${hrManagerData.hrName}...`);
              }}
            >
              Edit HR Manager
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download Profile
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print Details
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              Share Profile
            </Button>
            {hrManagerData.status === "Active" && (
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  if (confirm(`Deactivate ${hrManagerData.hrName}?`)) {
                    alert("HR Manager deactivated successfully!");
                    handleToggle();
                  }
                }}
              >
                Deactivate
              </Button>
            )}
            {hrManagerData.status === "Inactive" && (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  if (confirm(`Activate ${hrManagerData.hrName}?`)) {
                    alert("HR Manager activated successfully!");
                    handleToggle();
                  }
                }}
              >
                Activate
              </Button>
            )}
            {hrManagerData.status === "On Leave" && (
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  if (confirm(`Mark ${hrManagerData.hrName} as returned from leave?`)) {
                    alert("HR Manager status updated!");
                    handleToggle();
                  }
                }}
              >
                Mark as Returned
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HrManagerDetailsModal;