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
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import LanguageIcon from "@mui/icons-material/Language";
import { IComplianceOfficer } from "./compliance-officers.interface";

interface ComplianceOfficerDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  complianceOfficerData: IComplianceOfficer | null;
}

const ComplianceOfficerDetailsModal: React.FC<ComplianceOfficerDetailsModalProps> = ({
  open,
  setOpen,
  complianceOfficerData,
}) => {
  if (!complianceOfficerData) return null;

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
    if (deptLower.includes("legal") || deptLower.includes("compliance")) return "primary";
    if (deptLower.includes("risk")) return "warning";
    if (deptLower.includes("aml")) return "error";
    if (deptLower.includes("privacy")) return "info";
    if (deptLower.includes("regulatory")) return "secondary";
    if (deptLower.includes("ethics")) return "success";
    return "default";
  };



  const getInitials = (name: string = "") => {
    if (!name.trim()) return "CO";
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
      <DialogTitle sx={{ m: 0, p: 3, pb: 2, bgcolor: 'primary.50' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <GavelIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              Compliance Officer Details
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
              {getInitials(complianceOfficerData.officerName)}
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {complianceOfficerData.officerName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {complianceOfficerData.jobTitle} • {complianceOfficerData.department}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={complianceOfficerData.status}
                  color={getStatusClass(complianceOfficerData.status) as any}
                  size="small"
                />
                <Chip
                  label={complianceOfficerData.officerCode}
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
                    <strong>Company:</strong> {complianceOfficerData.company}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Location:</strong> {complianceOfficerData.location}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Email:</strong> {complianceOfficerData.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Phone:</strong> {complianceOfficerData.phone}
                  </Typography>
                </Box>
                {complianceOfficerData.mobile && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>Mobile:</strong> {complianceOfficerData.mobile}
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
                    <strong>Role:</strong> {complianceOfficerData.role}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Hire Date:</strong> {formatDate(complianceOfficerData.hireDate)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Experience:</strong> {complianceOfficerData.yearsOfExperience} years
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <GavelIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Audits Managed:</strong> {complianceOfficerData.managedAudits}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <SecurityIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Compliance Score:</strong> {complianceOfficerData.complianceScore}/5
                  </Typography>
                </Box>
                {complianceOfficerData.reportingTo && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>Reports To:</strong> {complianceOfficerData.reportingTo}
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
              {complianceOfficerData.qualifications && complianceOfficerData.qualifications.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {complianceOfficerData.qualifications.map((qualification, index) => (
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
              {complianceOfficerData.certifications && complianceOfficerData.certifications.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {complianceOfficerData.certifications.map((certification, index) => (
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
            {complianceOfficerData.specializations && complianceOfficerData.specializations.length > 0 ? (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {complianceOfficerData.specializations.map((specialization, index) => (
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
        {(complianceOfficerData.dateOfBirth || complianceOfficerData.gender || complianceOfficerData.address) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2} sx={{ pl: 1 }}>
              {complianceOfficerData.dateOfBirth && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    <strong>Date of Birth:</strong> {formatDate(complianceOfficerData.dateOfBirth)}
                  </Typography>
                </Grid>
              )}
              {complianceOfficerData.gender && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    <strong>Gender:</strong> {complianceOfficerData.gender}
                  </Typography>
                </Grid>
              )}
              {complianceOfficerData.maritalStatus && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    <strong>Marital Status:</strong> {complianceOfficerData.maritalStatus}
                  </Typography>
                </Grid>
              )}
              {complianceOfficerData.address && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Address:</strong> {complianceOfficerData.address}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Emergency Contact */}
        {(complianceOfficerData.emergencyContact || complianceOfficerData.emergencyPhone) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Emergency Contact
            </Typography>
            <Grid container spacing={2} sx={{ pl: 1 }}>
              {complianceOfficerData.emergencyContact && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Contact Name:</strong> {complianceOfficerData.emergencyContact}
                  </Typography>
                </Grid>
              )}
              {complianceOfficerData.emergencyPhone && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Contact Phone:</strong> {complianceOfficerData.emergencyPhone}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Notes */}
        {complianceOfficerData.notes && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Additional Notes
            </Typography>
            <Box sx={{ pl: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                {complianceOfficerData.notes}
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
            console.log('Edit compliance officer:', complianceOfficerData);
          }}
        >
          Edit Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComplianceOfficerDetailsModal;