// HREmployeeMainArea.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Button, 
  Box, 
  Typography, 
  Alert, 
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";
import {
  PersonAdd,
  Download,
  Upload,
  FilterList,
  Search,
  Person,
  Group,
  Business,
  LocationOn,
  Checklist,
  Notifications,
  ExitToApp,
  CalendarToday,
  TrendingUp,
  MoreVert,
  Assessment,
  Task,
  School,
  Security
} from "@mui/icons-material";
import HREmployeeTable from "./HREmployeeTable";
import HRDashboardSummary from "./HRDashboardSummary";
import BulkImportModal from "../../owner/employees/BulkImportModal";
import OnboardingTasks from "./tabs/OnboardingTab";
import { createHRMockEmployees, IHREmployee, HR_FILTERS } from "./HREmployeeTypes";

const HREmployeeMainArea: React.FC = () => {
  const [employees, setEmployees] = useState<IHREmployee[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department: "All",
    status: "All",
    onboarding: "All",
    probation: "All",
    workType: "All",
    location: "All"
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onProbation: 0,
    onboardingPending: 0,
    onLeave: 0,
    attritionRate: 0
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const mockData = createHRMockEmployees(15);
    setEmployees(mockData);
    
    // Calculate statistics
    const stats = {
      total: mockData.length,
      active: mockData.filter(e => e.workflowStatus === "Active").length,
      onProbation: mockData.filter(e => e.employmentStatus === "On Probation").length,
      onboardingPending: mockData.filter(e => e.onboardingStatus === "Pending" || e.onboardingStatus === "In Progress").length,
      onLeave: mockData.filter(e => e.workflowStatus === "On Leave").length,
      attritionRate: Math.round((mockData.filter(e => e.workflowStatus === "Exit").length / mockData.length) * 100)
    };
    setStats(stats);
  }, []);

  const handleAddEmployee = () => {
    window.location.href = "/hrm/employee/add-employee";
  };

  const handleBulkImport = () => {
    setImportModalOpen(true);
  };

  const handleExportEmployees = () => {
    console.log("Exporting employees...");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredEmployees = employees.filter(employee => {
    // Search filter
    const matchesSearch = 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Department filter
    const matchesDept = filters.department === "All" || employee.departmentName === filters.department;
    
    // Status filter
    const matchesStatus = filters.status === "All" || employee.workflowStatus === filters.status;
    
    // Onboarding filter
    const matchesOnboarding = filters.onboarding === "All" || employee.onboardingStatus === filters.onboarding;
    
    // Probation filter
    const matchesProbation = filters.probation === "All" || 
      (filters.probation === "Active" && employee.employmentStatus === "On Probation") ||
      (filters.probation === "Completed" && employee.employmentStatus !== "On Probation");
    
    // Work type filter
    const matchesWorkType = filters.workType === "All" || employee.workType === filters.workType;
    
    // Location filter
    const matchesLocation = filters.location === "All" || employee.workLocationName === filters.location;
    
    return matchesSearch && matchesDept && matchesStatus && matchesOnboarding && 
           matchesProbation && matchesWorkType && matchesLocation;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    handleMenuClose();
  };

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/hr">HR Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Employee Management</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={handleBulkImport}
            size="small"
          >
            Bulk Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportEmployees}
            size="small"
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddEmployee}
            className="!text-white"
            size="small"
          >
            Add Employee
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: 2, 
              bgcolor: 'primary.light', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mr: 2
            }}>
              <Group sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                HR Employee Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage employee records, onboarding, performance, and HR workflows
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip icon={<Notifications />} label="3 Pending Tasks" color="warning" variant="outlined" />
            <Chip icon={<CalendarToday />} label="2 Appraisals Due" color="info" variant="outlined" />
            <Chip icon={<ExitToApp />} label="1 Exit Process" color="error" variant="outlined" />
          </Box>
        </Box>
      </Box>

      {/* HR Dashboard Summary */}
      <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0 mb-6">
        <HRDashboardSummary employees={employees} />
      </div>

      {/* HR Quick Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderLeft: '4px solid #1976d2' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Onboarding Pending
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  {stats.onboardingPending}
                </Typography>
                <Checklist color="warning" />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.onboardingPending / stats.total) * 100} 
                sx={{ mt: 1 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderLeft: '4px solid #ed6c02' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                On Probation
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  {stats.onProbation}
                </Typography>
                <Assessment color="warning" />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.onProbation / stats.total) * 100} 
                sx={{ mt: 1 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderLeft: '4px solid #2e7d32' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Training Completion
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  92%
                </Typography>
                <School color="success" />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={92} 
                sx={{ mt: 1 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderLeft: '4px solid #9c27b0' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Attrition Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  {stats.attritionRate}%
                </Typography>
                <TrendingUp color="secondary" />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.attritionRate} 
                sx={{ mt: 1 }}
                color="secondary"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Onboarding Tasks Section */}
      <OnboardingTasks employees={employees} />

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <label className="form-label">Search Employees</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
              <input
                type="text"
                placeholder="Name, email, or employee code..."
                className="w-full border-0 bg-transparent focus:outline-none focus:ring-0"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          {/* Department Filter */}
          <div>
            <label className="form-label">Department</label>
            <select
              className="form-control"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              {HR_FILTERS.department.map(dept => (
                <option key={dept} value={dept}>
                  {dept === "All" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {HR_FILTERS.employmentStatus.map(status => (
                <option key={status} value={status}>
                  {status === "All" ? "All Status" : status}
                </option>
              ))}
            </select>
          </div>
          
          {/* Onboarding Status Filter */}
          <div>
            <label className="form-label">Onboarding Status</label>
            <select
              className="form-control"
              value={filters.onboarding}
              onChange={(e) => handleFilterChange('onboarding', e.target.value)}
            >
              {HR_FILTERS.onboardingStatus.map(status => (
                <option key={status} value={status}>
                  {status === "All" ? "All Onboarding" : status}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Second Row with additional filters and clear button */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {/* Work Type Filter */}
          <div>
            <label className="form-label">Work Type</label>
            <select
              className="form-control"
              value={filters.workType}
              onChange={(e) => handleFilterChange('workType', e.target.value)}
            >
              <option value="All">All Work Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          
          {/* Location Filter */}
          <div>
            <label className="form-label">Location</label>
            <select
              className="form-control"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="All">All Locations</option>
              <option value="Mumbai HQ">Mumbai HQ</option>
              <option value="Delhi Office">Delhi Office</option>
              <option value="Bangalore Branch">Bangalore Branch</option>
              <option value="Hyderabad Office">Hyderabad Office</option>
              <option value="Chennai Office">Chennai Office</option>
            </select>
          </div>
          
          {/* Probation Status Filter */}
          <div>
            <label className="form-label">Probation Status</label>
            <select
              className="form-control"
              value={filters.probation}
              onChange={(e) => handleFilterChange('probation', e.target.value)}
            >
              <option value="All">All Probation</option>
              <option value="Active">Active Probation</option>
              <option value="Completed">Completed</option>
              <option value="Extended">Extended</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
          
          {/* Clear Filters Button */}
          <div className="flex items-end">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilters({
                department: "All",
                status: "All",
                onboarding: "All",
                probation: "All",
                workType: "All",
                location: "All"
              })}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>

      {/* HR Employee Table */}
      <HREmployeeTable
        data={filteredEmployees}
        onEdit={(employee) => {
          window.location.href = `/hrm/employee/update-employee/${employee.employeeId}`;
        }}
        onDelete={(id) => {
          setEmployees(prev => prev.filter(emp => emp.employeeId !== id));
        }}
        onStatusChange={(id, status) => {
          setEmployees(prev => prev.map(emp => 
            emp.employeeId === id 
              ? { ...emp, workflowStatus: status as any, updatedAt: new Date().toISOString() } 
              : emp
          ));
        }}
        onOnboardingComplete={(id) => {
          setEmployees(prev => prev.map(emp => 
            emp.employeeId === id 
              ? { ...emp, onboardingStatus: "Completed", updatedAt: new Date().toISOString() } 
              : emp
          ));
        }}
      />

      {/* HR Alerts */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" sx={{ mb: 1 }}>
          <Typography variant="body2">
            <strong>HR Tip:</strong> Complete onboarding tasks within 7 days of employee joining.
          </Typography>
        </Alert>
        
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Action Required:</strong> 3 employees have probation ending this month. Schedule review meetings.
          </Typography>
        </Alert>
      </Box>

      {/* Bulk Import Modal */}
      <BulkImportModal
        open={importModalOpen}
        employees={employees}
      />

      {/* Quick Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleQuickAction('sendReminders')}>
          <Notifications sx={{ mr: 1 }} />
          Send Document Reminders
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('generateReports')}>
          <Assessment sx={{ mr: 1 }} />
          Generate Monthly Reports
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('scheduleAppraisals')}>
          <CalendarToday sx={{ mr: 1 }} />
          Schedule Appraisals
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('checkCompliance')}>
          <Security sx={{ mr: 1 }} />
          Check Compliance
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleQuickAction('settings')}>
          HR Settings
        </MenuItem>
      </Menu>
    </div>
  );
};

export default HREmployeeMainArea;