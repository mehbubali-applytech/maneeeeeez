"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Chip,
  Box,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { IFinanceExecutive } from "./finance-executives.interface";

interface FinanceExecutiveDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  financeExecutiveData: IFinanceExecutive | null;
}

const FinanceExecutiveDetailsModal: React.FC<FinanceExecutiveDetailsModalProps> = ({
  open,
  setOpen,
  financeExecutiveData,
}) => {
  if (!financeExecutiveData) return null;

  const getStatusClass = (status: string = "Active") => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("active")) return "success";
    if (statusLower.includes("inactive")) return "error";
    if (statusLower.includes("leave")) return "warning";
    if (statusLower.includes("pending")) return "info";
    return "default";
  };

  const getDepartmentClass = (department: string = "") => {
    const deptLower = department.toLowerCase();
    if (deptLower.includes("finance") || deptLower.includes("accounting")) return "primary";
    if (deptLower.includes("planning") || deptLower.includes("analysis")) return "info";
    if (deptLower.includes("payable")) return "secondary";
    if (deptLower.includes("receivable")) return "success";
    if (deptLower.includes("taxation") || deptLower.includes("tax")) return "warning";
    if (deptLower.includes("audit")) return "error";
    return "default";
  };

  const getInitials = (name: string = "") => {
    if (!name.trim()) return "FE";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string = "") => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              Finance Executive Details
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                mr: 3
              }}
            >
              {getInitials(financeExecutiveData.executiveName)}
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {financeExecutiveData.executiveName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {financeExecutiveData.jobTitle} • {financeExecutiveData.department}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={financeExecutiveData.status}
                  color={getStatusClass(financeExecutiveData.status) as any}
                  size="small"
                />
                <Chip
                  label={financeExecutiveData.executiveCode}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Company & Contact Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Company & Contact Information
              </Typography>
              <Box sx={{ pl: 1 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <BusinessIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Company:</strong> {financeExecutiveData.company}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Location:</strong> {financeExecutiveData.location}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Email:</strong> {financeExecutiveData.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Phone:</strong> {financeExecutiveData.phone}
                  </Typography>
                </Box>
                {financeExecutiveData.mobile && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>Mobile:</strong> {financeExecutiveData.mobile}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Professional Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Professional Details
              </Typography>
              <Box sx={{ pl: 1 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <WorkIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Role:</strong> {financeExecutiveData.role}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Hire Date:</strong> {formatDate(financeExecutiveData.hireDate)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Experience:</strong> {financeExecutiveData.yearsOfExperience} years
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Managed Budget:</strong> {formatCurrency(financeExecutiveData.managedBudget)}
                  </Typography>
                </Box>
                {financeExecutiveData.reportingTo && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>Reports To:</strong> {financeExecutiveData.reportingTo}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Qualifications & Certifications */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Qualifications
            </Typography>
            <Box sx={{ pl: 1 }}>
              {financeExecutiveData.qualifications && financeExecutiveData.qualifications.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {financeExecutiveData.qualifications.map((qualification, index) => (
                    <Chip
                      key={index}
                      label={qualification}
                      size="small"
                      icon={<SchoolIcon />}
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No qualifications listed
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Certifications
            </Typography>
            <Box sx={{ pl: 1 }}>
              {financeExecutiveData.certifications && financeExecutiveData.certifications.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {financeExecutiveData.certifications.map((certification, index) => (
                    <Chip
                      key={index}
                      label={certification}
                      size="small"
                      icon={<BadgeIcon />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No certifications listed
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Specializations
          </Typography>
          <Box sx={{ pl: 1 }}>
            {financeExecutiveData.specializations && financeExecutiveData.specializations.length > 0 ? (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {financeExecutiveData.specializations.map((specialization, index) => (
                  <Chip
                    key={index}
                    label={specialization}
                    size="small"
                    color="secondary"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No specializations listed
              </Typography>
            )}
          </Box>
        </Box>

        {/* Personal Information */}
        {(financeExecutiveData.dateOfBirth || financeExecutiveData.gender || financeExecutiveData.address) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2} sx={{ pl: 1 }}>
              {financeExecutiveData.dateOfBirth && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    <strong>Date of Birth:</strong> {formatDate(financeExecutiveData.dateOfBirth)}
                  </Typography>
                </Grid>
              )}
              {financeExecutiveData.gender && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    <strong>Gender:</strong> {financeExecutiveData.gender}
                  </Typography>
                </Grid>
              )}
              {financeExecutiveData.maritalStatus && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    <strong>Marital Status:</strong> {financeExecutiveData.maritalStatus}
                  </Typography>
                </Grid>
              )}
              {financeExecutiveData.address && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Address:</strong> {financeExecutiveData.address}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Emergency Contact */}
        {(financeExecutiveData.emergencyContact || financeExecutiveData.emergencyPhone) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Emergency Contact
            </Typography>
            <Grid container spacing={2} sx={{ pl: 1 }}>
              {financeExecutiveData.emergencyContact && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Contact Name:</strong> {financeExecutiveData.emergencyContact}
                  </Typography>
                </Grid>
              )}
              {financeExecutiveData.emergencyPhone && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Contact Phone:</strong> {financeExecutiveData.emergencyPhone}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Notes */}
        {financeExecutiveData.notes && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Additional Notes
            </Typography>
            <Box sx={{ pl: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                {financeExecutiveData.notes}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={() => setOpen(false)}
          variant="outlined"
          color="inherit"
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Handle edit action
            console.log('Edit finance executive:', financeExecutiveData);
          }}
        >
          Edit Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FinanceExecutiveDetailsModal;