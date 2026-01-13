"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Tooltip
} from "@mui/material";
import {
  FilterList,
  Search,
  Download,
  Refresh,
  CheckCircle,
  Cancel,
  Visibility,
  MoreVert,
  CalendarMonth,
  People,
  PendingActions,
  TaskAlt,
  Warning,
  AccessTime,
  ArrowForward,
  AllInbox // Replaced BulkAction with AllInbox
} from "@mui/icons-material";
import Link from "next/link";
import LeaveRequestTable from "./LeaveRequestTable";
import BulkActionsPanel from "./BulkActionsPanel";
import LeaveCalendarView from "./LeaveCalendar";
import TeamLeaveOverview from "./TeamLeaveOverview";

// Types
export interface ILeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  designation: string;
  leaveType: string;
  leaveTypeCode: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: string;
  submittedAt?: string;
  approvedDate?: string;
  rejectedDate?: string;
  lastModified?: string;
  approverNotes?: string;
  supportingDocuments?: string[];
  contactDuringLeave?: string;
  workflowStage: number;
  totalStages: number;
  currentApprover?: string;
  previousApprovers: string[];
  emergencyContact?: string;
  leaveBalance: number;
  isHalfDay?: boolean;
  halfDayType?: 'first' | 'second';
  attachments?: { name: string; url: string }[];
  role?: string; // Added this
}

export interface ILeaveStats {
  totalPending: number;
  pendingToday: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  avgProcessingTime: number;
  teamsWithPending: number;
}

const LeaveRequestsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
  const [stats, setStats] = useState<ILeaveStats>({
    totalPending: 0,
    pendingToday: 0,
    approvedThisMonth: 0,
    rejectedThisMonth: 0,
    avgProcessingTime: 1.5,
    teamsWithPending: 3
  });
  const [loading, setLoading] = useState(true);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    leaveType: 'all',
    dateRange: 'thisMonth'
  });

  // Mock data
  useEffect(() => {
    const mockRequests: ILeaveRequest[] = [
      {
        id: 'LR001',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        employeeAvatar: '/avatars/john.jpg',
        department: 'Engineering',
        designation: 'Senior Developer',
        leaveType: 'Casual Leave',
        leaveTypeCode: 'CL',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        totalDays: 3,
        reason: 'Family function',
        status: 'pending',
        appliedDate: '2024-01-15',
        submittedAt: '2024-01-15T10:30:00Z',
        workflowStage: 1,
        totalStages: 2,
        currentApprover: 'HR Manager',
        previousApprovers: ['Team Lead'],
        leaveBalance: 8,
        isHalfDay: false,
        role: 'Employee'
      },
      {
        id: 'LR002',
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        employeeAvatar: '/avatars/jane.jpg',
        department: 'Marketing',
        designation: 'Marketing Manager',
        leaveType: 'Sick Leave',
        leaveTypeCode: 'SL',
        startDate: '2024-01-18',
        endDate: '2024-01-18',
        totalDays: 1,
        reason: 'Medical appointment',
        status: 'pending',
        appliedDate: '2024-01-16',
        submittedAt: '2024-01-16T14:20:00Z',
        workflowStage: 2,
        totalStages: 2,
        currentApprover: 'Department Head',
        previousApprovers: ['Team Lead'],
        leaveBalance: 12,
        isHalfDay: true,
        halfDayType: 'first',
        role: 'Manager'
      },
      {
        id: 'LR003',
        employeeId: 'EMP003',
        employeeName: 'Robert Johnson',
        employeeAvatar: '/avatars/robert.jpg',
        department: 'Sales',
        designation: 'Sales Executive',
        leaveType: 'Earned Leave',
        leaveTypeCode: 'EL',
        startDate: '2024-01-25',
        endDate: '2024-01-30',
        totalDays: 6,
        reason: 'Vacation',
        status: 'approved',
        appliedDate: '2024-01-10',
        submittedAt: '2024-01-10T09:15:00Z',
        approvedDate: '2024-01-12',
        workflowStage: 2,
        totalStages: 2,
        previousApprovers: ['Team Lead', 'HR Manager'],
        leaveBalance: 18,
        role: 'Employee'
      },
      {
        id: 'LR004',
        employeeId: 'EMP004',
        employeeName: 'Sarah Williams',
        department: 'HR',
        designation: 'HR Executive',
        leaveType: 'Maternity Leave',
        leaveTypeCode: 'ML',
        startDate: '2024-02-01',
        endDate: '2024-07-31',
        totalDays: 180,
        reason: 'Maternity',
        status: 'pending',
        appliedDate: '2024-01-14',
        submittedAt: '2024-01-14T11:45:00Z',
        workflowStage: 1,
        totalStages: 3,
        currentApprover: 'HR Director',
        previousApprovers: [],
        leaveBalance: 0,
        role: 'Employee'
      }
    ];

    setLeaveRequests(mockRequests);
    setStats({
      totalPending: mockRequests.filter(r => r.status === 'pending').length,
      pendingToday: 2,
      approvedThisMonth: 15,
      rejectedThisMonth: 3,
      avgProcessingTime: 1.5,
      teamsWithPending: 3
    });
    setLoading(false);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleApproveRequest = (id: string) => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { 
        ...req, 
        status: 'approved' as const,
        approvedDate: new Date().toISOString().split('T')[0]
      } : req
    ));
  };

  const handleRejectRequest = (id: string, reason: string) => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { 
        ...req, 
        status: 'rejected' as const, 
        approverNotes: reason,
        rejectedDate: new Date().toISOString().split('T')[0]
      } : req
    ));
  };

  const handleBulkApprove = () => {
    setLeaveRequests(prev => prev.map(req => 
      selectedRequests.includes(req.id) ? { 
        ...req, 
        status: 'approved' as const,
        approvedDate: new Date().toISOString().split('T')[0]
      } : req
    ));
    setSelectedRequests([]);
  };

  const handleBulkReject = (reason: string) => {
    setLeaveRequests(prev => prev.map(req => 
      selectedRequests.includes(req.id) ? { 
        ...req, 
        status: 'rejected' as const, 
        approverNotes: reason,
        rejectedDate: new Date().toISOString().split('T')[0]
      } : req
    ));
    setSelectedRequests([]);
  };

  const tabs = [
    {
      label: "Pending Approval",
      icon: <PendingActions />,
      count: stats.totalPending,
      component: (
        <LeaveRequestTable
          requests={leaveRequests.filter(r => r.status === 'pending')}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          onViewDetails={(id) => console.log("View details:", id)}
          selectedRequests={selectedRequests}
          onSelectionChange={setSelectedRequests}
        />
      )
    },
    {
      label: "Approved",
      icon: <TaskAlt />,
      count: stats.approvedThisMonth,
      component: (
        <LeaveRequestTable
          requests={leaveRequests.filter(r => r.status === 'approved')}
          onApprove={() => {}}
          onReject={() => {}}
          onViewDetails={(id) => console.log("View details:", id)}
          isReadOnly={true}
        />
      )
    },
    {
      label: "Rejected",
      icon: <Cancel />,
      count: stats.rejectedThisMonth,
      component: (
        <LeaveRequestTable
          requests={leaveRequests.filter(r => r.status === 'rejected')}
          onApprove={() => {}}
          onReject={() => {}}
          onViewDetails={(id) => console.log("View details:", id)}
          isReadOnly={true}
        />
      )
    },
    {
      label: "Calendar View",
      icon: <CalendarMonth />,
      component: <LeaveCalendarView />
    },
    {
      label: "Team Overview",
      icon: <People />,
      component: <TeamLeaveOverview requests={leaveRequests} />
    }
  ];

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
              <Link href="/hrm">HR Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Leave Requests</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDialogOpen(true)}
            size="small"
          >
            Filters
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => console.log("Export requests")}
            size="small"
          >
            Export
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            size="small"
          >
            Refresh
          </Button>
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
              <PendingActions sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Leave Requests
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review, approve or reject leave requests from employees
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              icon={<PendingActions />} 
              label={`${stats.totalPending} Pending`} 
              color="warning" 
              variant="outlined" 
            />
            <Chip 
              icon={<AccessTime />} 
              label={`${stats.avgProcessingTime}h avg`} 
              color="info" 
              variant="outlined" 
            />
          </Box>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">{stats.totalPending}</Typography>
              <Typography variant="caption" color="text.secondary">Pending Requests</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">{stats.approvedThisMonth}</Typography>
              <Typography variant="caption" color="text.secondary">Approved This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">{stats.rejectedThisMonth}</Typography>
              <Typography variant="caption" color="text.secondary">Rejected This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{stats.pendingToday}</Typography>
              <Typography variant="caption" color="text.secondary">Pending Today</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{stats.teamsWithPending}</Typography>
              <Typography variant="caption" color="text.secondary">Teams with Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{stats.avgProcessingTime}h</Typography>
              <Typography variant="caption" color="text.secondary">Avg Processing Time</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      {/* Bulk Actions Panel (when selections made) */}
      {selectedRequests.length > 0 && (
        <BulkActionsPanel
          selectedCount={selectedRequests.length}
          onApprove={handleBulkApprove}
          onReject={(reason) => handleBulkReject(reason)}
          onClearSelection={() => setSelectedRequests([])}
        />
      )}

      {/* Main Content */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <LinearProgress sx={{ width: '50%' }} />
          </Box>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  py: 2,
                  minHeight: 64
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  iconPosition="start"
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap:1.5 }}>
                      <Typography variant="subtitle2">{tab.label}</Typography>
                      {tab.count !== undefined && (
                        <Badge 
                          badgeContent={tab.count} 
                          color={
                            tab.label === 'Pending Approval' ? 'warning' :
                            tab.label === 'Approved' ? 'success' :
                            tab.label === 'Rejected' ? 'error' : 'default'
                          }
                          sx={{ '& .MuiBadge-badge': { mt: 0 } }}
                        />
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabs[activeTab].component}
            </Box>
          </>
        )}
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, bgcolor: 'grey.50', mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AllInbox /> Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CheckCircle />}
              onClick={() => {
                const pendingIds = leaveRequests
                  .filter(r => r.status === 'pending')
                  .map(r => r.id);
                setSelectedRequests(pendingIds);
              }}
            >
              Select All Pending
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CalendarMonth />}
              onClick={() => setActiveTab(3)}
            >
              View Calendar
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<People />}
              onClick={() => setActiveTab(4)}
            >
              Team Overview
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              className="!text-white"
              startIcon={<ArrowForward />}
              onClick={() => {
                // Navigate to leave policy setup
                window.location.href = '/hrm/leave-policy';
              }}
            >
              Policy Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>Filter Leave Requests</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={filters.leaveType}
                  onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
                  label="Leave Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="CL">Casual Leave</MenuItem>
                  <MenuItem value="SL">Sick Leave</MenuItem>
                  <MenuItem value="EL">Earned Leave</MenuItem>
                  <MenuItem value="ML">Maternity Leave</MenuItem>
                  <MenuItem value="PL">Paternity Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  label="Date Range"
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              console.log("Apply filters:", filters);
              setFilterDialogOpen(false);
            }} 
            variant="contained"
            className="!text-white"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaveRequestsPanel;