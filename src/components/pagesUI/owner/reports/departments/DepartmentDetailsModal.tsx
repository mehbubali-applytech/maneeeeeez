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
  LinearProgress
} from "@mui/material";
import { DepartmentDetailsStatePropsType } from "./departments.interface";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShareIcon from "@mui/icons-material/Share";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface IDepartment {
  id: number;
  departmentName: string;
  departmentCode: string;
  departmentType: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  location: string;
  creationDate: string;
  status: string;
  employeeCount: number;
  budget: number;
  actualSpending: number;
  currency: string;
  projectsCount: number;
  description?: string;
  keyMetrics?: Array<{label: string; value: string; change?: number}>;
}

const DepartmentDetailsModal = ({ 
  open, 
  setOpen, 
  departmentData 
}: DepartmentDetailsStatePropsType) => {
  
  const handleToggle = () => setOpen(!open);

  if (!departmentData) return null;

  const getDepartmentTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "sales":
        return "success-badge";
      case "marketing":
        return "primary-badge";
      case "engineering":
        return "info-badge";
      case "operations":
        return "warning-badge";
      case "finance":
        return "danger-badge";
      case "human resources":
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
    alert(`Downloading ${departmentData.departmentName} report...`);
  };

  const handleShare = () => {
    alert(`Sharing ${departmentData.departmentName} information...`);
  };

  // Calculate budget utilization
  const budgetUtilization = departmentData.budget > 0 
    ? (departmentData.actualSpending / departmentData.budget) * 100 
    : 0;

  // Sample key metrics for department
  const sampleMetrics = departmentData.keyMetrics || [
    { label: "Productivity", value: "87%", change: 5 },
    { label: "Budget Utilization", value: `${Math.round(budgetUtilization)}%`, change: budgetUtilization > 90 ? -3 : 2 },
    { label: "Employee Satisfaction", value: "4.2/5", change: 8 },
    { label: "Project Completion", value: "92%", change: 12 },
    { label: "Revenue Contribution", value: formatCurrency(departmentData.budget * 0.3, departmentData.currency), change: 15 },
    { label: "Cost Efficiency", value: "78%", change: 3 },
  ];

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5 className="modal-title">Department Details</h5>
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
                  <BusinessIcon className="mr-3 text-primary" fontSize="large" />
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {departmentData.departmentName}
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip 
                        label={departmentData.departmentType} 
                        className={getDepartmentTypeClass(departmentData.departmentType)}
                        size="small"
                      />
                      <Chip 
                        label={departmentData.status} 
                        className={getTableStatusClass(departmentData.status)}
                        size="small"
                      />
                      <Chip 
                        label={`Code: ${departmentData.departmentCode}`}
                        variant="outlined"
                        size="small"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="body2" color="text.secondary">
                    Budget vs Actual
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    <span className="text-success">{formatCurrency(departmentData.actualSpending, departmentData.currency)}</span>
                    <span className="text-gray-500"> / </span>
                    <span>{formatCurrency(departmentData.budget, departmentData.currency)}</span>
                  </Typography>
                </div>
              </div>
            </div>
            
            <Divider className="col-span-12 my-2" />
            
            <Grid container spacing={2} className="col-span-12">
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <PersonIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Department Manager</span>
                  </div>
                  <h6 className="label__title">{departmentData.managerName}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Creation Date</span>
                  </div>
                  <h6 className="label__title">{departmentData.creationDate}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <EmailIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Manager Email</span>
                  </div>
                  <h6 className="label__title">{departmentData.managerEmail}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <PhoneIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Manager Phone</span>
                  </div>
                  <h6 className="label__title">{departmentData.managerPhone}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <LocationOnIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Location</span>
                  </div>
                  <h6 className="label__title">{departmentData.location}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <PeopleIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Employee Count</span>
                  </div>
                  <h6 className="label__title">{departmentData.employeeCount} employees</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <GroupsIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Active Projects</span>
                  </div>
                  <h6 className="label__title">{departmentData.projectsCount} projects</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <AttachMoneyIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Budget Utilization</span>
                  </div>
                  <div className="mt-2">
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(budgetUtilization, 100)}
                      color={budgetUtilization > 90 ? "error" : budgetUtilization > 75 ? "warning" : "success"}
                      className="h-2 rounded"
                    />
                    <Typography variant="body2" className="mt-1 text-right">
                      {Math.round(budgetUtilization)}% of budget used
                    </Typography>
                  </div>
                </div>
              </Grid>
            </Grid>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Department Performance Metrics
              </Typography>
              <Paper variant="outlined" className="p-3">
                <Grid container spacing={2}>
                  {sampleMetrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper className="p-3" elevation={0}>
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          {metric.label}
                        </Typography>
                        <div className="flex items-center justify-between">
                          <Typography variant="h6" className="font-semibold">
                            {metric.value}
                          </Typography>
                          {metric.change !== undefined && (
                            <Chip
                              label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                              color={metric.change > 0 ? "success" : "error"}
                              size="small"
                              icon={metric.change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            />
                          )}
                        </div>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </div>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Department Description
              </Typography>
              <Box className="p-3 bg-gray-50 rounded-lg">
                <Typography variant="body2">
                  {departmentData.description || 
                    `The ${departmentData.departmentName} department is responsible for ${departmentData.departmentType.toLowerCase()} operations. 
                    With ${departmentData.employeeCount} employees led by ${departmentData.managerName}, the department manages a budget of 
                    ${formatCurrency(departmentData.budget, departmentData.currency)} and is currently working on ${departmentData.projectsCount} active projects.`}
                </Typography>
              </Box>
            </div>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  Download Report
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleDownload}
                >
                  Export as PDF
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
                  startIcon={<GroupsIcon />}
                  onClick={() => alert("Viewing team structure...")}
                >
                  View Team Structure
                </Button>
                {departmentData.status === "Active" && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => alert("Editing department...")}
                  >
                    Edit Department
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

export default DepartmentDetailsModal;