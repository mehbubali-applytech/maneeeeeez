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
  IconButton
} from "@mui/material";
import { CompanyDetailsStatePropsType } from "./companies.interface";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import PublicIcon from "@mui/icons-material/Public";
import FactoryIcon from "@mui/icons-material/Factory";
import FlagIcon from "@mui/icons-material/Flag";
import { StaticImageData } from "next/image";

interface ICompany {
  [key: string]: any;
  id: number;
  name: string;
  location: string; 
  phone?: string;
  mobile?: string;
  fax?: string;
  websites?: string;
  industry?: string;
  currencyType?: string;
  source?: string;
  description?: string;
  language?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  state?: string;
  address?: string;
  email: string;
  owner: string;
  rating: number;
  tag: string; 
  status: "Active" | "Inactive" | "Pending";
  companyImg?: StaticImageData;
  employees?: number;
  departments?: number;
  projects?: number;
  revenue?: number;
  established?: string;
  licenseNumber?: string;
  taxId?: string;
}

const CompanyDetailsModal = ({ 
  open, 
  setOpen, 
  companyData 
}: CompanyDetailsStatePropsType) => {
  
  const handleToggle = () => setOpen(!open);

  if (!companyData) return null;

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success-badge";
      case "inactive":
        return "danger-badge";
      case "pending":
        return "warning-badge";
      default:
        return "default-badge";
    }
  };

  const getIndustryClass = (industry?: string) => {
    if (!industry) return "default-badge";
    switch (industry.toLowerCase()) {
      case "technology":
        return "primary-badge";
      case "finance":
        return "success-badge";
      case "healthcare":
        return "info-badge";
      case "manufacturing":
        return "warning-badge";
      case "retail":
        return "danger-badge";
      case "education":
        return "secondary-badge";
      default:
        return "default-badge";
    }
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownload = () => {
    alert(`Downloading ${companyData.name} details...`);
  };

  const handleShare = () => {
    alert(`Sharing ${companyData.name} information...`);
  };

  // Sample metrics for company
  const companyMetrics = [
    { label: "Total Employees", value: companyData.employees || "N/A", icon: "👥" },
    { label: "Departments", value: companyData.departments || "N/A", icon: "🏢" },
    { label: "Active Projects", value: companyData.projects || "N/A", icon: "📋" },
    { label: "Annual Revenue", value: formatCurrency(companyData.revenue, companyData.currencyType), icon: "💰" },
    { label: "Industry Rating", value: `${companyData.rating}/5`, icon: "⭐" },
    { label: "Established", value: companyData.established || "N/A", icon: "📅" },
  ];

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5 className="modal-title">Company Details</h5>
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
                  {companyData.companyImg ? (
                    <Avatar
                      src={companyData.companyImg.src}
                      alt={companyData.name}
                      className="mr-4 w-16 h-16"
                    />
                  ) : (
                    <BusinessIcon className="mr-4 text-primary" sx={{ fontSize: 64 }} />
                  )}
                  <div>
                    <Typography variant="h5" className="font-bold">
                      {companyData.name}
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip 
                        label={companyData.status} 
                        className={getStatusClass(companyData.status)}
                        size="small"
                      />
                      {companyData.industry && (
                        <Chip 
                          label={companyData.industry} 
                          className={getIndustryClass(companyData.industry)}
                          size="small"
                        />
                      )}
                      <Chip 
                        label={companyData.tag}
                        variant="outlined"
                        size="small"
                      />
                    </div>
                    <div className="flex items-center mt-2">
                      <Rating value={companyData.rating} readOnly size="small" />
                      <Typography variant="body2" className="ml-2 text-gray-600">
                        ({companyData.rating}/5)
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="body2" color="text.secondary">
                    Company ID
                  </Typography>
                  <Typography variant="h6" className="font-bold text-primary">
                    #{companyData.id.toString().padStart(5, '0')}
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
                    <span className="label__subtitle">Owner/CEO</span>
                  </div>
                  <h6 className="label__title">{companyData.owner}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <EmailIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Email</span>
                  </div>
                  <h6 className="label__title">{companyData.email}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <LocationOnIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Location</span>
                  </div>
                  <h6 className="label__title">{companyData.location}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <PhoneIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Phone</span>
                  </div>
                  <h6 className="label__title">{companyData.phone || "N/A"}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <LanguageIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Website</span>
                  </div>
                  <h6 className="label__title">
                    {companyData.websites ? (
                      <a 
                        href={companyData.websites.startsWith('http') ? companyData.websites : `https://${companyData.websites}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {companyData.websites}
                      </a>
                    ) : "N/A"}
                  </h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <AttachMoneyIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Currency</span>
                  </div>
                  <h6 className="label__title">{companyData.currencyType || "USD"}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <FlagIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Country</span>
                  </div>
                  <h6 className="label__title">{companyData.country || "N/A"}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <FactoryIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Industry</span>
                  </div>
                  <h6 className="label__title">{companyData.industry || "N/A"}</h6>
                </div>
              </Grid>
              
              {companyData.address && (
                <Grid item xs={12}>
                  <div className="label__content-wrapper">
                    <div className="flex items-center gap-2">
                      <LocationOnIcon fontSize="small" color="action" />
                      <span className="label__subtitle">Full Address</span>
                    </div>
                    <h6 className="label__title">{companyData.address}</h6>
                  </div>
                </Grid>
              )}
            </Grid>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Company Statistics
              </Typography>
              <Paper variant="outlined" className="p-4">
                <Grid container spacing={2}>
                  {companyMetrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
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
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Company Description
              </Typography>
              <Box className="p-3 bg-gray-50 rounded-lg">
                <Typography variant="body2">
                  {companyData.description || 
                    `${companyData.name} is a leading company in the ${companyData.industry || 'various'} industry, 
                    based in ${companyData.location}. Founded in ${companyData.established || 'recent years'}, 
                    the company has established itself as a key player in its market.`}
                </Typography>
              </Box>
            </div>
            
            {(companyData.licenseNumber || companyData.taxId) && (
              <>
                <Divider className="col-span-12 my-4" />
                <div className="col-span-12">
                  <Typography variant="subtitle1" className="font-medium mb-3">
                    Legal Information
                  </Typography>
                  <Box className="p-3 bg-green-50 rounded-lg">
                    <Grid container spacing={2}>
                      {companyData.licenseNumber && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>License Number:</strong> {companyData.licenseNumber}
                          </Typography>
                        </Grid>
                      )}
                      {companyData.taxId && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Tax ID:</strong> {companyData.taxId}
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
                  startIcon={<EditIcon />}
                  onClick={() => alert(`Editing ${companyData.name}...`)}
                >
                  Edit Company
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
                  startIcon={<PublicIcon />}
                  onClick={() => window.open(`/super-admin/company/${companyData.id}`, '_blank')}
                >
                  View Dashboard
                </Button>
                {companyData.status === "Active" && (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => alert("Deactivating company...")}
                  >
                    Deactivate
                  </Button>
                )}
                {companyData.status === "Inactive" && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => alert("Activating company...")}
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

export default CompanyDetailsModal;