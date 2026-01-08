// EmployeeProfile.tsx - Individual employee profile view
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  Person,
  AttachMoney,
  Description,
  Fingerprint,
  Download,
  Print,
  Share,
  ArrowBack,
  Cake,
  Transgender,
  ContactEmergency,
  Security,
  Badge as BadgeIcon,
  AccessTime,
  AccountBalance,
  Folder,
  VerifiedUser,
  PendingActions,
} from "@mui/icons-material";
import { IEmployee, createMockEmployee } from "../EmployeeTypes";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const EmployeeProfile: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Mock API call to fetch employee data
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockEmployee = createMockEmployee({
          employeeId: params.id as string,
          profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
          documents: [
            {
              id: "1",
              type: "ID Proof",
              documentType: "Aadhaar",
              documentNumber: "XXXX-XXXX-1234",
              fileName: "aadhaar_card.jpg",
              fileUrl: "#",
              fileSize: 2048,
              uploadedDate: "2024-01-15",
              verified: true,
            },
            {
              id: "2",
              type: "Offer Letter",
              fileName: "offer_letter.pdf",
              fileUrl: "#",
              fileSize: 5120,
              uploadedDate: "2024-01-10",
              verified: true,
            },
          ],
        });
        setEmployee(mockEmployee);
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    router.push(`/owner/employees/update-employee/${employee?.employeeId}`);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleBack = () => {
    router.push("/owner/employees");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Employee not found
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Back to Employees
        </Button>
      </Box>
    );
  }

  // Calculate tenure
  const calculateTenure = () => {
    const joiningDate = new Date(employee.dateOfJoining);
    const today = new Date();
    const years = today.getFullYear() - joiningDate.getFullYear();
    const months = today.getMonth() - joiningDate.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "On Probation":
        return "warning";
      case "Resigned":
        return "info";
      case "Terminated":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-6">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner/employees">Employees</Link>
            </li>
            <li className="breadcrumb-item active">{employee.firstName} {employee.lastName}</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Avatar
              src={employee.profilePhoto}
              sx={{ width: 80, height: 80, border: 4, borderColor: "background.paper", boxShadow: 2 }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {employee.firstName} {employee.lastName}
                </Typography>
                {employee.preferredName && (
                  <Chip label={`aka ${employee.preferredName}`} size="small" variant="outlined" />
                )}
                <Chip
                  label={employee.employmentStatus}
                  size="small"
                  color={getStatusColor(employee.employmentStatus) as any}
                  sx={{ 
                    '&.MuiChip-filled': {
                      color: 'white'
                    }
                  }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {employee.roleName} • {employee.departmentName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  icon={<BadgeIcon />}
                  label={employee.employeeCode}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<Work />}
                  label={employee.workType}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<LocationOn />}
                  label={employee.workLocationName}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit Profile">
              <IconButton onClick={handleEdit} sx={{ color: "primary.main" }}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send Email">
              <IconButton sx={{ color: "info.main" }}>
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete} sx={{ color: "error.main" }}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Basic Info */}
        <Grid item xs={12} md={4}>
          {/* Contact Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person /> Contact Information
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Email fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={employee.email}
                    secondary="Work Email"
                  />
                </ListItem>
                {employee.phoneNumber && (
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Phone fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={employee.phoneNumber}
                      secondary="Phone Number"
                    />
                  </ListItem>
                )}
                {employee.dateOfBirth && (
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Cake fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={new Date(employee.dateOfBirth).toLocaleDateString()}
                      secondary="Date of Birth"
                    />
                  </ListItem>
                )}
                {employee.gender && (
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Transgender fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={employee.gender}
                      secondary="Gender"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ContactEmergency /> Emergency Contact
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText 
                    primary={employee.emergencyContactName}
                    secondary="Contact Name"
                  />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText 
                    primary={employee.emergencyContactRelation}
                    secondary="Relationship"
                  />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText 
                    primary={employee.emergencyContactPhone}
                    secondary="Phone Number"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* System Access */}
          {employee.systemUserEnabled && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Security /> System Access
                </Typography>
                <List disablePadding>
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <VerifiedUser fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={employee.username}
                      secondary="Username"
                    />
                  </ListItem>
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <AccessTime fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={employee.attendanceType}
                      secondary="Attendance Type"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab icon={<Work />} label="Employment" />
              <Tab icon={<AttachMoney />} label="Salary" />
              <Tab icon={<Description />} label="Documents" />
              <Tab icon={<Fingerprint />} label="Attendance" />
              <Tab icon={<LocationOn />} label="Address" />
            </Tabs>

            {/* Employment Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Joining Details
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText 
                        primary={new Date(employee.dateOfJoining).toLocaleDateString()}
                        secondary="Date of Joining"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText 
                        primary={calculateTenure()}
                        secondary="Tenure"
                      />
                    </ListItem>
                    {employee.probationEndDate && (
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemText 
                          primary={new Date(employee.probationEndDate).toLocaleDateString()}
                          secondary="Probation End Date"
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Organization
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText 
                        primary={employee.departmentName}
                        secondary="Department"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText 
                        primary={employee.workLocationName}
                        secondary="Work Location"
                      />
                    </ListItem>
                    {employee.shiftName && (
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemText 
                          primary={employee.shiftName}
                          secondary="Assigned Shift"
                        />
                      </ListItem>
                    )}
                    {employee.reportingManagerName && (
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemText 
                          primary={employee.reportingManagerName}
                          secondary="Reporting Manager"
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Salary Tab */}
            <TabPanel value={tabValue} index={1}>
              {employee.costToCompany ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AccountBalance /> Salary Details
                        </Typography>
                        <List disablePadding>
                          <ListItem disablePadding sx={{ py: 1 }}>
                            <ListItemText 
                              primary={`₹${(employee.costToCompany / 100000).toFixed(1)} LPA`}
                              secondary="Cost to Company (CTC)"
                              primaryTypographyProps={{ fontWeight: 600 }}
                            />
                          </ListItem>
                          <ListItem disablePadding sx={{ py: 1 }}>
                            <ListItemText 
                              primary={employee.payFrequency}
                              secondary="Pay Frequency"
                            />
                          </ListItem>
                          {employee.salaryGrade && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                              <ListItemText 
                                primary={employee.salaryGrade}
                                secondary="Salary Grade"
                              />
                            </ListItem>
                          )}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Bank Details
                        </Typography>
                        {employee.bankDetails ? (
                          <List disablePadding>
                            <ListItem disablePadding sx={{ py: 1 }}>
                              <ListItemText 
                                primary={employee.bankDetails.accountName}
                                secondary="Account Name"
                              />
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 1 }}>
                              <ListItemText 
                                primary={`XXXXXX${employee.bankDetails.accountNumber.slice(-4)}`}
                                secondary="Account Number"
                              />
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 1 }}>
                              <ListItemText 
                                primary={employee.bankDetails.ifscCode}
                                secondary="IFSC Code"
                              />
                            </ListItem>
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            No bank details provided
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">
                  Salary details not configured for this employee
                </Alert>
              )}
            </TabPanel>

            {/* Documents Tab */}
            <TabPanel value={tabValue} index={2}>
              {employee.documents && employee.documents.length > 0 ? (
                <Grid container spacing={2}>
                  {employee.documents.map((doc) => (
                    <Grid item xs={12} md={6} key={doc.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Folder color="primary" />
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {doc.fileName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {doc.type} {doc.documentType && `• ${doc.documentType}`}
                                </Typography>
                              </Box>
                            </Box>
                            {doc.verified ? (
                              <Chip
                                icon={<VerifiedUser />}
                                label="Verified"
                                size="small"
                                color="success"
                              />
                            ) : (
                              <Chip
                                icon={<PendingActions />}
                                label="Pending"
                                size="small"
                                color="warning"
                              />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()} • 
                            Size: {(doc.fileSize / 1024).toFixed(1)} KB
                          </Typography>
                          {doc.documentNumber && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Document No: {doc.documentNumber}
                            </Typography>
                          )}
                        </CardContent>
                        <CardActions>
                          <Button size="small" startIcon={<Download />}>
                            Download
                          </Button>
                          <Button size="small">
                            View
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  No documents uploaded for this employee
                </Alert>
              )}
            </TabPanel>

            {/* Attendance Tab */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Attendance Settings
                      </Typography>
                      <List disablePadding>
                        <ListItem disablePadding sx={{ py: 1 }}>
                          <ListItemText 
                            primary={employee.attendanceType}
                            secondary="Attendance Type"
                          />
                        </ListItem>
                        {employee.geoFence && (
                          <>
                            <ListItem disablePadding sx={{ py: 1 }}>
                              <ListItemText 
                                primary={employee.geoFence.address}
                                secondary="Geo-fence Location"
                              />
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 1 }}>
                              <ListItemText 
                                primary={`${employee.geoFence.radius}m radius`}
                                secondary="Allowed Radius"
                              />
                            </ListItem>
                          </>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {`This Month's Attendance`}
                      </Typography>
                      <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography variant="h2" color="primary" gutterBottom>
                          92%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Attendance Rate
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={92} 
                          sx={{ mt: 2, height: 8, borderRadius: 4 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Present: 22
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Absent: 2
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Address Tab */}
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Present Address
                      </Typography>
                      {employee.presentAddress ? (
                        <List disablePadding>
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={employee.presentAddress.addressLine1}
                            />
                          </ListItem>
                          {employee.presentAddress.addressLine2 && (
                            <ListItem disablePadding sx={{ py: 0.5 }}>
                              <ListItemText 
                                primary={employee.presentAddress.addressLine2}
                              />
                            </ListItem>
                          )}
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={`${employee.presentAddress.city}, ${employee.presentAddress.state}`}
                            />
                          </ListItem>
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={`${employee.presentAddress.country} - ${employee.presentAddress.zipCode}`}
                            />
                          </ListItem>
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                          No address provided
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                {!employee.sameAsPresentAddress && employee.permanentAddress && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Permanent Address
                        </Typography>
                        <List disablePadding>
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={employee.permanentAddress.addressLine1}
                            />
                          </ListItem>
                          {employee.permanentAddress.addressLine2 && (
                            <ListItem disablePadding sx={{ py: 0.5 }}>
                              <ListItemText 
                                primary={employee.permanentAddress.addressLine2}
                              />
                            </ListItem>
                          )}
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={`${employee.permanentAddress.city}, ${employee.permanentAddress.state}`}
                            />
                          </ListItem>
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={`${employee.permanentAddress.country} - ${employee.permanentAddress.zipCode}`}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default EmployeeProfile;