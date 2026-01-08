// EmployeeProfile.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
  MenuItem
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Cake,
  Home,
  Work,
  Business,
  LocationOn,
  AccessTime,
  AttachMoney,
  Description,
  Security,
  Edit,
  Download,
  Send,
  Share,
  Print,
  MoreVert,
  Male,
  Female,
  Transgender,
  VerifiedUser,
  Error
} from "@mui/icons-material";
import { IEmployee } from "../EmployeeTypes";

interface EmployeeProfileProps {
  employee: IEmployee;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: () => void;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ 
  employee, 
  onEdit, 
  onDelete,
  onStatusChange 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [sendEmailDialog, setSendEmailDialog] = useState(false);
  const [emailType, setEmailType] = useState<'welcome' | 'credentials' | 'update'>('welcome');

  const tabs = [
    { label: 'Overview', icon: <Person /> },
    { label: 'Job Details', icon: <Work /> },
    { label: 'Salary', icon: <AttachMoney /> },
    { label: 'Documents', icon: <Description /> },
    { label: 'Access', icon: <Security /> }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'success';
      case 'On Probation': return 'warning';
      case 'Resigned': return 'info';
      case 'Terminated': return 'error';
      case 'Draft': return 'default';
      default: return 'default';
    }
  };

  const getGenderIcon = (gender?: string) => {
    switch(gender) {
      case 'Male': return <Male />;
      case 'Female': return <Female />;
      case 'Other': return <Transgender />;
      default: return null;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateExperience = () => {
    if (!employee.dateOfJoining) return '-';
    const joiningDate = new Date(employee.dateOfJoining);
    const today = new Date();
    
    const years = today.getFullYear() - joiningDate.getFullYear();
    const months = today.getMonth() - joiningDate.getMonth();
    
    let totalMonths = years * 12 + months;
    if (today.getDate() < joiningDate.getDate()) {
      totalMonths--;
    }
    
    const expYears = Math.floor(totalMonths / 12);
    const expMonths = totalMonths % 12;
    
    return `${expYears} year${expYears !== 1 ? 's' : ''} ${expMonths} month${expMonths !== 1 ? 's' : ''}`;
  };

  const handleSendEmail = (type: 'welcome' | 'credentials' | 'update') => {
    setEmailType(type);
    setSendEmailDialog(true);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 0: // Overview
        return (
          <Grid container spacing={3}>
            {/* Personal Info */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    Personal Information
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={employee.email}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone" 
                        secondary={employee.phoneNumber || 'Not provided'}
                      />
                    </ListItem>
                    
                    {employee.dateOfBirth && (
                      <ListItem>
                        <ListItemIcon>
                          <Cake />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Date of Birth" 
                          secondary={formatDate(employee.dateOfBirth)}
                        />
                      </ListItem>
                    )}
                    
                    {employee.gender && (
                      <ListItem>
                        <ListItemIcon>
                          {getGenderIcon(employee.gender)}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Gender" 
                          secondary={employee.gender}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Address Info */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Home sx={{ mr: 1 }} />
                    Address Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Present Address
                    </Typography>
                    <Typography variant="body2">
                      {employee.presentAddress.addressLine1}
                    </Typography>
                    {employee.presentAddress.addressLine2 && (
                      <Typography variant="body2">
                        {employee.presentAddress.addressLine2}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      {employee.presentAddress.city}, {employee.presentAddress.state}
                    </Typography>
                    <Typography variant="body2">
                      {employee.presentAddress.country} - {employee.presentAddress.zipCode}
                    </Typography>
                  </Box>
                  
                  {!employee.sameAsPresentAddress && employee.permanentAddress && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Permanent Address
                      </Typography>
                      <Typography variant="body2">
                        {employee.permanentAddress.addressLine1}
                      </Typography>
                      {employee.permanentAddress.addressLine2 && (
                        <Typography variant="body2">
                          {employee.permanentAddress.addressLine2}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        {employee.permanentAddress.city}, {employee.permanentAddress.state}
                      </Typography>
                      <Typography variant="body2">
                        {employee.permanentAddress.country} - {employee.permanentAddress.zipCode}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Emergency Contact
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2">Contact Name</Typography>
                      <Typography variant="body1">
                        {employee.emergencyContactName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2">Relation</Typography>
                      <Typography variant="body1">
                        {employee.emergencyContactRelation}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2">Phone Number</Typography>
                      <Typography variant="body1">
                        {employee.emergencyContactPhone}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 1: // Job Details
        return (
          <Grid container spacing={3}>
            {/* Employment Details */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Work sx={{ mr: 1 }} />
                    Employment Details
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Date of Joining" 
                        secondary={formatDate(employee.dateOfJoining)}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Experience" 
                        secondary={calculateExperience()}
                      />
                    </ListItem>
                    
                    {employee.probationEndDate && (
                      <ListItem>
                        <ListItemText 
                          primary="Probation End Date" 
                          secondary={formatDate(employee.probationEndDate)}
                        />
                      </ListItem>
                    )}
                    
                    <ListItem>
                      <ListItemText 
                        primary="Work Type" 
                        secondary={
                          <Chip 
                            label={employee.workType} 
                            size="small" 
                            variant="outlined" 
                          />
                        }
                      />
                    </ListItem>
                    
                    {employee.contractStartDate && employee.contractEndDate && (
                      <ListItem>
                        <ListItemText 
                          primary="Contract Period" 
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {formatDate(employee.contractStartDate)} to {formatDate(employee.contractEndDate)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Organizational Details */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Business sx={{ mr: 1 }} />
                    Organizational Details
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Work />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Role" 
                        secondary={employee.roleName}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Business />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Department" 
                        secondary={employee.departmentName}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Work Location" 
                        secondary={employee.workLocationName}
                      />
                    </ListItem>
                    
                    {employee.reportingManagerName && (
                      <ListItem>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Reporting Manager" 
                          secondary={employee.reportingManagerName}
                        />
                      </ListItem>
                    )}
                    
                    {employee.shiftName && (
                      <ListItem>
                        <ListItemIcon>
                          <AccessTime />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Assigned Shift" 
                          secondary={employee.shiftName}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Employment Timeline */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Employment Timeline
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Joining Date
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(employee.dateOfJoining)}
                      </Typography>
                    </Box>
                    
                    <Divider orientation="vertical" flexItem />
                    
                    {employee.probationEndDate && (
                      <>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Probation End
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatDate(employee.probationEndDate)}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                      </>
                    )}
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Current Status
                      </Typography>
                      <Chip 
                        label={employee.employmentStatus} 
                        size="small" 
                        color={getStatusColor(employee.employmentStatus) as any}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 2: // Salary
        return (
          <Grid container spacing={3}>
            {/* Salary Summary */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoney sx={{ mr: 1 }} />
                    Salary Summary
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Cost to Company (CTC)" 
                        secondary={formatCurrency(employee.costToCompany)}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Pay Frequency" 
                        secondary={employee.payFrequency}
                      />
                    </ListItem>
                    
                    {employee.salaryGrade && (
                      <ListItem>
                        <ListItemText 
                          primary="Salary Grade" 
                          secondary={
                            <Chip label={employee.salaryGrade} size="small" variant="outlined" />
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                  
                  {employee.bankDetails && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Bank Details
                      </Typography>
                      <Typography variant="body2">
                        {employee.bankDetails.accountName}
                      </Typography>
                      <Typography variant="body2">
                        Account: XXXXXX{employee.bankDetails.accountNumber?.slice(-4)}
                      </Typography>
                      <Typography variant="body2">
                        {employee.bankDetails.bankName} • {employee.bankDetails.ifscCode}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Salary Components */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Salary Components
                  </Typography>
                  
                  {employee.salaryStructure ? (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Basic Pay</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(employee.salaryStructure.basicPay)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">HRA</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(employee.salaryStructure.hra)}
                        </Typography>
                      </Box>
                      
                      {employee.salaryStructure.allowances.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Allowances
                          </Typography>
                          {employee.salaryStructure.allowances.map((allowance, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">{allowance.name}</Typography>
                              <Typography variant="body2">
                                {formatCurrency(allowance.amount)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      {employee.salaryStructure.deductions.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Deductions
                          </Typography>
                          {employee.salaryStructure.deductions.map((deduction, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">{deduction.name}</Typography>
                              <Typography variant="body2" color="error.main">
                                -{formatCurrency(deduction.amount)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Alert severity="info">
                      <Typography variant="body2">
                        Salary structure not defined
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 3: // Documents
        return (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} />
                Documents & Attachments
              </Typography>
              
              {employee.documents.length > 0 ? (
                <Grid container spacing={2}>
                  {employee.documents.map((doc, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Description color="primary" />
                            <Box>
                              <Typography variant="subtitle2">
                                {doc.fileName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {doc.type} • {new Date(doc.uploadedDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {doc.verified ? (
                              <Tooltip title="Verified">
                                <VerifiedUser fontSize="small" color="success" />
                              </Tooltip>
                            ) : (
                              <Tooltip title="Pending Verification">
                                <Error fontSize="small" color="warning" />
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary" display="block">
                          {doc.documentNumber && `ID: ${doc.documentNumber} • `}
                          Size: {(doc.fileSize / 1024).toFixed(2)} KB
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              // Download document
                              const link = document.createElement('a');
                              link.href = doc.fileUrl;
                              link.download = doc.fileName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            Download
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    No documents uploaded for this employee
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 4: // Access
        return (
          <Grid container spacing={3}>
            {/* System Access */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ mr: 1 }} />
                    System Access
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="System Access" 
                        secondary={
                          <Chip 
                            label={employee.systemUserEnabled ? 'Enabled' : 'Disabled'} 
                            size="small" 
                            color={employee.systemUserEnabled ? 'success' : 'default'}
                          />
                        }
                      />
                    </ListItem>
                    
                    {employee.systemUserEnabled && (
                      <>
                        <ListItem>
                          <ListItemText 
                            primary="Username" 
                            secondary={employee.username || 'Not set'}
                          />
                        </ListItem>
                        
                        <ListItem>
                          <ListItemText 
                            primary="Roles" 
                            secondary={
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                {(employee.roles || []).map((role, index) => (
                                  <Chip key={index} label={role} size="small" variant="outlined" />
                                ))}
                              </Box>
                            }
                          />
                        </ListItem>
                        
                        {employee.temporaryAccessUntil && (
                          <ListItem>
                            <ListItemText 
                              primary="Access Valid Until" 
                              secondary={formatDate(employee.temporaryAccessUntil)}
                            />
                          </ListItem>
                        )}
                      </>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Settings */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1 }} />
                    Attendance Settings
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Attendance Type" 
                        secondary={
                          <Chip label={employee.attendanceType} size="small" variant="outlined" />
                        }
                      />
                    </ListItem>
                    
                    {employee.attendanceType === 'GPS' && employee.geoFence && (
                      <ListItem>
                        <ListItemText 
                          primary="Geo-fence Location" 
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {employee.geoFence.latitude.toFixed(6)}, {employee.geoFence.longitude.toFixed(6)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Radius: {employee.geoFence.radius} meters
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Info */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={employee.profilePhoto}
                sx={{ 
                  width: 100, 
                  height: 100,
                  border: '3px solid',
                  borderColor: 'primary.light'
                }}
              >
                <Person sx={{ fontSize: 48 }} />
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h4">
                    {employee.preferredName || `${employee.firstName} ${employee.lastName}`}
                  </Typography>
                  <Chip 
                    label={employee.employmentStatus} 
                    color={getStatusColor(employee.employmentStatus) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="h6" color="primary" gutterBottom>
                  {employee.roleName}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<Business />} 
                    label={employee.departmentName}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<LocationOn />} 
                    label={employee.workLocationName}
                    size="small"
                    variant="outlined"
                  />
                  {employee.employeeCode && (
                    <Chip 
                      label={`ID: ${employee.employeeCode}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {onEdit && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={onEdit}
                    fullWidth
                  >
                    Edit Profile
                  </Button>
                )}
                
                <IconButton onClick={(e) => setActionMenuAnchor(e.currentTarget)}>
                  <MoreVert />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Send />}
                  onClick={() => handleSendEmail('welcome')}
                  fullWidth
                >
                  Send Email
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => {
                    // Export profile
                    const dataStr = JSON.stringify(employee, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const link = document.createElement('a');
                    link.href = dataUri;
                    link.download = `employee_${employee.employeeId}.json`;
                    link.click();
                  }}
                >
                  Export
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => {
                    // Share profile
                    console.log("Share profile");
                  }}
                >
                  Share
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={() => window.print()}
                >
                  Print
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index} 
              icon={tab.icon} 
              iconPosition="start"
              label={tab.label} 
            />
          ))}
        </Tabs>
        
        <Divider />
        
        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {renderTabContent()}
        </Box>
      </Paper>

      {/* System Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography variant="caption" color="text.secondary">
              Employee ID
            </Typography>
            <Typography variant="body2">
              {employee.employeeId}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="caption" color="text.secondary">
              Created On
            </Typography>
            <Typography variant="body2">
              {formatDate(employee.createdAt)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="caption" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body2">
              {formatDate(employee.updatedAt)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="caption" color="text.secondary">
              Updated By
            </Typography>
            <Typography variant="body2">
              {employee.updatedBy}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Send Email Dialog */}
      <Dialog open={sendEmailDialog} onClose={() => setSendEmailDialog(false)}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Send email to {employee.email}
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Email Type</InputLabel>
            <Select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value as any)}
              label="Email Type"
            >
              <MenuItem value="welcome">Welcome Email</MenuItem>
              <MenuItem value="credentials">Login Credentials</MenuItem>
              <MenuItem value="update">Profile Update</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            {emailType === 'welcome' && 'Welcome email with company introduction and next steps'}
            {emailType === 'credentials' && 'Email with system login credentials'}
            {emailType === 'update' && 'Notification about recent profile updates'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendEmailDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              console.log(`Sending ${emailType} email to ${employee.email}`);
              setSendEmailDialog(false);
              alert(`Email sent to ${employee.email}`);
            }} 
            variant="contained"
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeProfile;