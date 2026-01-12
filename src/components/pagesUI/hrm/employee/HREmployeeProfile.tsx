// HREmployeeProfile.tsx
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
  LinearProgress,
  Badge,
  FormControl,
  MenuItem,
  Select
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
  Checklist,
  Assessment,
  School,
  ExitToApp,
  CalendarToday,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Add
} from "@mui/icons-material";
import { IHREmployee } from "./HREmployeeTypes";

interface HREmployeeProfileProps {
  employee: IHREmployee;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: () => void;
}

const HREmployeeProfile: React.FC<HREmployeeProfileProps> = ({ 
  employee, 
  onEdit, 
  onDelete,
  onStatusChange 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [sendEmailDialog, setSendEmailDialog] = useState(false);
  const [emailType, setEmailType] = useState<'welcome' | 'probation' | 'appraisal' | 'exit'>('welcome');

  const tabs = [
    { label: 'Overview', icon: <Person /> },
    { label: 'HR Details', icon: <Checklist /> },
    { label: 'Performance', icon: <Assessment /> },
    { label: 'Attendance', icon: <AccessTime /> },
    { label: 'Training', icon: <School /> },
    { label: 'Documents', icon: <Description /> }
  ];

  const getWorkflowStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'success';
      case 'On Probation': return 'warning';
      case 'New Hire': return 'info';
      case 'On Leave': return 'info';
      case 'Notice Period': return 'error';
      case 'Exit': return 'error';
      default: return 'default';
    }
  };

  const getOnboardingStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'error';
      case 'On Hold': return 'default';
      default: return 'default';
    }
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

  const handleSendEmail = (type: 'welcome' | 'probation' | 'appraisal' | 'exit') => {
    setEmailType(type);
    setSendEmailDialog(true);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 0: // Overview (same as before but with HR data)
        return (
          <Grid container spacing={3}>
            {/* Personal Info Card */}
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
                    
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Date of Joining" 
                        secondary={formatDate(employee.dateOfJoining)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* HR Status Card */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checklist sx={{ mr: 1 }} />
                    HR Status
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Workflow Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip 
                          label={employee.workflowStatus} 
                          size="small" 
                          color={getWorkflowStatusColor(employee.workflowStatus) as any}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Onboarding Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip 
                          label={employee.onboardingStatus} 
                          size="small" 
                          color={getOnboardingStatusColor(employee.onboardingStatus) as any}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        HR Manager
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {employee.hrManagerName || 'Not assigned'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {calculateExperience()}
                      </Typography>
                    </Grid>
                    
                    {employee.probationReviewDate && (
                      <Grid item xs={12}>
                        <Alert severity="warning" icon={<Warning />}>
                          <Typography variant="body2">
                            Probation review due on {formatDate(employee.probationReviewDate)}
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Job Details Card */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Work sx={{ mr: 1 }} />
                    Job Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Role
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {employee.roleName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Department
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {employee.departmentName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Work Location
                      </Typography>
                      <Typography variant="body2">
                        {employee.workLocationName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Work Type
                      </Typography>
                      <Typography variant="body2">
                        {employee.workType}
                      </Typography>
                    </Grid>
                    
                    {employee.reportingManagerName && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Reporting Manager
                        </Typography>
                        <Typography variant="body2">
                          {employee.reportingManagerName}
                        </Typography>
                      </Grid>
                    )}
                    
                    {employee.shiftName && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Shift
                        </Typography>
                        <Typography variant="body2">
                          {employee.shiftName}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 1: // HR Details
        return (
          <Grid container spacing={3}>
            {/* Onboarding Progress */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checklist sx={{ mr: 1 }} />
                    Onboarding Progress
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        {employee.onboardingStatus === 'Completed' ? 
                          <CheckCircle color="success" /> : 
                          <Error color="warning" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Onboarding Status" 
                        secondary={employee.onboardingStatus}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        {employee.orientationCompleted ? 
                          <CheckCircle color="success" /> : 
                          <Error color="warning" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Orientation" 
                        secondary={employee.orientationCompleted ? 'Completed' : 'Pending'}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        {employee.equipmentIssued ? 
                          <CheckCircle color="success" /> : 
                          <Error color="warning" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Equipment" 
                        secondary={employee.equipmentIssued ? 'Issued' : 'Pending'}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        {employee.systemAccessCreated ? 
                          <CheckCircle color="success" /> : 
                          <Error color="warning" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="System Access" 
                        secondary={employee.systemAccessCreated ? 'Created' : 'Pending'}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        {employee.backgroundCheckStatus === 'Completed' ? 
                          <CheckCircle color="success" /> : 
                          <Error color={employee.backgroundCheckStatus === 'Failed' ? "error" : "warning"} />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Background Check" 
                        secondary={employee.backgroundCheckStatus}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Compliance Status */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ mr: 1 }} />
                    Compliance Status
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Overall Compliance
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {employee.attendanceCompliance || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={employee.attendanceCompliance || 0} 
                      color={employee.attendanceCompliance >= 95 ? "success" : "warning"}
                    />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Leave Balance
                      </Typography>
                      <Typography variant="h6">
                        {employee.leaveBalance || 0} days
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Training Completed
                      </Typography>
                      <Typography variant="h6">
                        {employee.trainingCompleted?.length || 0}
                      </Typography>
                    </Grid>
                    
                    {employee.certificationExpiry && (
                      <Grid item xs={12}>
                        <Alert severity="warning">
                          <Typography variant="body2">
                            {Object.keys(employee.certificationExpiry).length} certification(s) expiring soon
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Probation & Appraisal */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1 }} />
                    Probation & Appraisal
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom color="warning.dark">
                          Probation Details
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText 
                              primary="Status" 
                              secondary={
                                <Chip 
                                  label={employee.employmentStatus} 
                                  size="small" 
                                  color="warning"
                                />
                              }
                            />
                          </ListItem>
                          {employee.probationReviewDate && (
                            <ListItem>
                              <ListItemText 
                                primary="Review Date" 
                                secondary={formatDate(employee.probationReviewDate)}
                              />
                            </ListItem>
                          )}
                          {employee.probationEndDate && (
                            <ListItem>
                              <ListItemText 
                                primary="Probation End" 
                                secondary={formatDate(employee.probationEndDate)}
                              />
                            </ListItem>
                          )}
                        </List>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom color="info.dark">
                          Appraisal Details
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText 
                              primary="Last Appraisal" 
                              secondary={
                                employee.lastAppraisalDate ? 
                                formatDate(employee.lastAppraisalDate) : 'Not yet appraised'
                              }
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Next Appraisal" 
                              secondary={
                                employee.nextAppraisalDate ? 
                                formatDate(employee.nextAppraisalDate) : 'Not scheduled'
                              }
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Performance Rating" 
                              secondary={
                                employee.performanceRating ? 
                                `${employee.performanceRating}/5` : 'Not rated'
                              }
                            />
                          </ListItem>
                        </List>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 2: // Performance
        return (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 1 }} />
                Performance & Goals
              </Typography>
              
              {employee.performanceRating ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h1" color="primary" fontWeight={600}>
                        {employee.performanceRating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        out of 5
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(employee.performanceRating / 5) * 100} 
                        sx={{ mt: 2 }}
                        color={
                          employee.performanceRating >= 4 ? "success" :
                          employee.performanceRating >= 3 ? "warning" : "error"
                        }
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" gutterBottom>
                      Performance Timeline
                    </Typography>
                    <Alert severity="info">
                      <Typography variant="body2">
                        Detailed performance reviews, goals, and feedback would be displayed here.
                      </Typography>
                    </Alert>
                    
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Recent Feedback
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <TrendingUp color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Exceeds expectations in teamwork"
                            secondary="Manager feedback - Last month"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Needs improvement in documentation"
                            secondary="Peer feedback - 2 weeks ago"
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    No performance data available. Schedule an appraisal to get started.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 3: // Attendance
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1 }} />
                    Attendance Summary
                  </Typography>
                  
                  {employee.attendanceSummary ? (
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="success.main">
                            {employee.attendanceSummary.present}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Present Days
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="error.main">
                            {employee.attendanceSummary.absent}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Absent Days
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="info.main">
                            {employee.attendanceSummary.leave}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Leave Days
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4">
                            {employee.attendanceSummary.percentage}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Attendance Rate
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Detailed Statistics
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Late Arrivals:
                            </Typography>
                            <Typography variant="body2">
                              {employee.attendanceSummary.lateArrivals}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Early Departures:
                            </Typography>
                            <Typography variant="body2">
                              {employee.attendanceSummary.earlyDepartures}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Overtime Hours:
                            </Typography>
                            <Typography variant="body2">
                              {employee.attendanceSummary.overtimeHours}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Average Hours/Day:
                            </Typography>
                            <Typography variant="body2">
                              {employee.attendanceSummary.averageHoursPerDay.toFixed(1)}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Working Days:
                            </Typography>
                            <Typography variant="body2">
                              {employee.attendanceSummary.workingDays}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Total Days:
                            </Typography>
                            <Typography variant="body2">
                              {employee.attendanceSummary.totalDays}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info">
                      <Typography variant="body2">
                        No attendance data available for this month.
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 4: // Training
        return (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1 }} />
                Training & Development
              </Typography>
              
              {employee.trainingCompleted && employee.trainingCompleted.length > 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" gutterBottom>
                      Completed Training
                    </Typography>
                    <List dense>
                      {employee.trainingCompleted.map((training, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={training}
                            secondary="Completed"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Training Stats
                      </Typography>
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h2" color="primary">
                          {employee.trainingCompleted.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Training Completed
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Add />}
                        onClick={() => console.log('Assign new training')}
                      >
                        Assign Training
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    No training records found. Assign training programs to this employee.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    sx={{ mt: 1 }}
                    onClick={() => console.log('Assign training')}
                  >
                    Assign Training
                  </Button>
                </Alert>
              )}
              
              {employee.certificationExpiry && Object.keys(employee.certificationExpiry).length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom color="warning.main">
                    Certifications Expiring Soon
                  </Typography>
                  <List dense>
                    {Object.entries(employee.certificationExpiry).map(([cert, expiry]) => (
                      <ListItem key={cert}>
                        <ListItemIcon>
                          <Warning color="warning" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={cert}
                          secondary={`Expires: ${formatDate(expiry)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        );

      case 5: // Documents
        return (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} />
                Documents & Compliance Files
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
                                <CheckCircle fontSize="small" color="success" />
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
                          {!doc.verified && (
                            <Button
                              size="small"
                              variant="contained"
                              className="!text-white"
                              onClick={() => console.log(`Verify ${doc.id}`)}
                            >
                              Verify
                            </Button>
                          )}
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
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  employee.onboardingStatus !== 'Completed' ? (
                    <small className="bd-badge bg-warning">Onboarding</small>
                  ) : employee.employmentStatus === 'On Probation' ? (
                    <small className="bd-badge bg-warning">Probation</small>
                  ) : null
                }
              >
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
              </Badge>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h4">
                    {employee.preferredName || `${employee.firstName} ${employee.lastName}`}
                  </Typography>
                  <Chip 
                    label={employee.workflowStatus} 
                    color={getWorkflowStatusColor(employee.workflowStatus) as any}
                    size="small"
                  />
                  <Chip 
                    label={employee.onboardingStatus} 
                    color={getOnboardingStatusColor(employee.onboardingStatus) as any}
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
                  <Chip 
                    icon={<CalendarToday />} 
                    label={`Joined: ${formatDate(employee.dateOfJoining)}`}
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

          {/* HR Actions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {onEdit && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={onEdit}
                    fullWidth
                    className="!text-white"
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
                    const dataStr = JSON.stringify(employee, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const link = document.createElement('a');
                    link.href = dataUri;
                    link.download = `hr_employee_${employee.employeeId}.json`;
                    link.click();
                  }}
                >
                  Export
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {employee.employmentStatus === 'On Probation' && (
                  <Button
                    variant="outlined"
                    startIcon={<Checklist />}
                    onClick={() => handleSendEmail('probation')}
                    color="warning"
                  >
                    Probation Review
                  </Button>
                )}
                
                {employee.workflowStatus === 'Notice Period' && (
                  <Button
                    variant="outlined"
                    startIcon={<ExitToApp />}
                    onClick={() => handleSendEmail('exit')}
                    color="error"
                  >
                    Exit Process
                  </Button>
                )}
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

      {/* HR System Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          HR System Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Employee ID
            </Typography>
            <Typography variant="body2">
              {employee.employeeId}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              HR Manager
            </Typography>
            <Typography variant="body2">
              {employee.hrManagerName || 'Not assigned'}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Created On
            </Typography>
            <Typography variant="body2">
              {formatDate(employee.createdAt)}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body2">
              {formatDate(employee.updatedAt)}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Updated By
            </Typography>
            <Typography variant="body2">
              {employee.updatedBy}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Attendance Compliance
            </Typography>
            <Typography variant="body2">
              {employee.attendanceCompliance || 0}%
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Leave Balance
            </Typography>
            <Typography variant="body2">
              {employee.leaveBalance || 0} days
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Training Completed
            </Typography>
            <Typography variant="body2">
              {employee.trainingCompleted?.length || 0}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Send Email Dialog */}
      <Dialog open={sendEmailDialog} onClose={() => setSendEmailDialog(false)}>
        <DialogTitle>Send HR Email</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Send email to {employee.email}
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value as any)}
            >
              <MenuItem value="welcome">Welcome & Onboarding</MenuItem>
              <MenuItem value="probation">Probation Review</MenuItem>
              <MenuItem value="appraisal">Appraisal Schedule</MenuItem>
              <MenuItem value="exit">Exit Process</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            {emailType === 'welcome' && 'Welcome email with company policies and onboarding steps'}
            {emailType === 'probation' && 'Probation review schedule and expectations'}
            {emailType === 'appraisal' && 'Performance appraisal schedule and preparation guidelines'}
            {emailType === 'exit' && 'Exit process steps and clearance requirements'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendEmailDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              console.log(`Sending ${emailType} email to ${employee.email}`);
              setSendEmailDialog(false);
              alert(`HR email sent to ${employee.email}`);
            }} 
            variant="contained"
            className="!text-white"
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HREmployeeProfile;