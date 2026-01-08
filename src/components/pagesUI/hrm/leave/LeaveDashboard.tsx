"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Card,
  CardContent
} from "@mui/material";
import {
  CalendarMonth,
  CheckCircle,
  Cancel,
  Pending,
  History,
  Download,
  MoreVert,
  Refresh,
  FilterList,
  Upload,
  Settings,
  BeachAccess
} from "@mui/icons-material";
import Link from "next/link";

import LeaveRequests from "./LeaveRequests";
import LeaveCalendar from "./LeaveCalendar";
import LeavePolicies from "./LeavePolicies";
import HolidayCalendar from "./HolidayCalendar";
import LeaveBalances from "./LeaveBalances";
import { ILeaveRequest, ILeavePolicy, IHoliday, ILeaveBalance } from "./LeaveTypes";

const generateLeaveRequests = (): ILeaveRequest[] => [
  {
    id: "LEAVE001",
    employeeId: "EMP001",
    employeeName: "Rajesh Kumar",
    department: "Engineering",
    role: "Software Engineer",
    leaveType: "Annual",
    startDate: "2024-02-10",
    endDate: "2024-02-15",
    totalDays: 4,
    reason: "Family vacation",
    status: "Pending",
    submittedAt: "2024-01-15T10:30:00Z",
    attachments: ["tickets.pdf"]
  },
  {
    id: "LEAVE002",
    employeeId: "EMP002",
    employeeName: "Priya Sharma",
    department: "Marketing",
    role: "Marketing Manager",
    leaveType: "Sick",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    totalDays: 3,
    reason: "Medical appointment",
    status: "Approved",
    submittedAt: "2024-01-10T09:15:00Z",
    reviewedBy: "HR001",
    reviewedAt: "2024-01-11T14:30:00Z",
    reviewNotes: "Approved with medical certificate"
  },
  {
    id: "LEAVE003",
    employeeId: "EMP003",
    employeeName: "Amit Patel",
    department: "Sales",
    role: "Sales Executive",
    leaveType: "Casual",
    startDate: "2024-01-25",
    endDate: "2024-01-25",
    totalDays: 1,
    reason: "Personal work",
    status: "Rejected",
    submittedAt: "2024-01-18T16:45:00Z",
    reviewedBy: "HR001",
    reviewedAt: "2024-01-19T11:20:00Z",
    reviewNotes: "Rejected - peak sales period"
  },
  {
    id: "LEAVE004",
    employeeId: "EMP004",
    employeeName: "Sneha Reddy",
    department: "HR",
    role: "HR Manager",
    leaveType: "Maternity",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    totalDays: 180,
    reason: "Maternity leave",
    status: "Approved",
    submittedAt: "2024-01-05T14:00:00Z",
    reviewedBy: "HR002",
    reviewedAt: "2024-01-06T10:15:00Z",
    reviewNotes: "Approved as per policy"
  }
];

const generateLeaveBalances = (): ILeaveBalance[] => [
  {
    employeeId: "EMP001",
    employeeName: "Rajesh Kumar",
    department: "Engineering",
    annualLeave: { total: 15, used: 5, balance: 10, pending: 4 },
    sickLeave: { total: 10, used: 2, balance: 8 },
    casualLeave: { total: 8, used: 3, balance: 5 },
    unpaidLeave: { used: 0 },
    lastUpdated: "2024-01-15T00:00:00Z"
  },
  {
    employeeId: "EMP002",
    employeeName: "Priya Sharma",
    department: "Marketing",
    annualLeave: { total: 15, used: 8, balance: 7, pending: 0 },
    sickLeave: { total: 10, used: 4, balance: 6 },
    casualLeave: { total: 8, used: 2, balance: 6 },
    unpaidLeave: { used: 1 },
    lastUpdated: "2024-01-15T00:00:00Z"
  }
];

const LeaveDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>(generateLeaveRequests());
  const [leaveBalances, setLeaveBalances] = useState<ILeaveBalance[]>(generateLeaveBalances());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const tabs = [
    {
      label: "Leave Requests",
      icon: <Pending />,
      component: <LeaveRequests 
        requests={leaveRequests}
        onApprove={(requestId) => {
          setLeaveRequests(prev => 
            prev.map(req => req.id === requestId ? { ...req, status: 'Approved' } : req)
          );
        }}
        onReject={(requestId, reason) => {
          setLeaveRequests(prev => 
            prev.map(req => req.id === requestId ? { ...req, status: 'Rejected', reviewNotes: reason } : req)
          );
        }}
        onEscalate={(requestId, toRole) => {
          setLeaveRequests(prev => 
            prev.map(req => req.id === requestId ? { ...req, status: 'Escalated', escalationTo: toRole } : req)
          );
        }}
        onExport={(data) => {
          console.log("Export leave requests:", data.length);
        }}
        onBulkAction={(selectedIds, action) => {
          console.log("Bulk action:", action, "on", selectedIds.length, "requests");
        }}
      />
    },
    {
      label: "Leave Calendar",
      icon: <CalendarMonth />,
      component: <LeaveCalendar 
        leaveRequests={leaveRequests}
        onViewDetails={(request) => {
          console.log("View leave details:", request);
        }}
      />
    },
    {
      label: "Leave Balances",
      icon: <History />,
      component: <LeaveBalances 
        balances={leaveBalances}
        onExport={(data:any) => {
          console.log("Export balances:", data.length);
        }}
        onRefresh={() => {
          setLeaveBalances(generateLeaveBalances());
        }}
      />
    },
    {
      label: "Policies",
      icon: <Settings />,
      component: React.createElement(LeavePolicies as any, {
        onSavePolicy: (policy:any) => {
          console.log("Save policy:", policy);
        },
        onToggleActive: (policyId:any, isActive:boolean) => {
          console.log("Toggle policy:", policyId, isActive);
        }
      })
    },
    {
      label: "Holidays",
      icon: <BeachAccess />,
      component: React.createElement(HolidayCalendar as any, {
        onSaveHoliday: (holiday:any) => {
          console.log("Save holiday:", holiday);
        },
        onPublishCalendar: (holidays:any[]) => {
          console.log("Publish holidays:", holidays.length);
        }
      })
    }
  ];

  const leaveStats = useMemo(() => {
    const totalRequests = leaveRequests.length;
    const pending = leaveRequests.filter(r => r.status === 'Pending').length;
    const approvedToday = leaveRequests.filter(r => 
      r.status === 'Approved' && 
      new Date(r.reviewedAt || '').toDateString() === new Date().toDateString()
    ).length;
    const onLeaveToday = leaveRequests.filter(r => 
      r.status === 'Approved' &&
      new Date(r.startDate) <= new Date() &&
      new Date(r.endDate) >= new Date()
    ).length;
    
    const totalEmployees = leaveBalances.length;
    const totalAnnualLeave = leaveBalances.reduce((sum, b) => sum + b.annualLeave.total, 0);
    const usedAnnualLeave = leaveBalances.reduce((sum, b) => sum + b.annualLeave.used, 0);
    const utilizationRate = totalAnnualLeave > 0 ? Math.round((usedAnnualLeave / totalAnnualLeave) * 100) : 0;
    
    return {
      totalRequests,
      pending,
      approvedToday,
      onLeaveToday,
      utilizationRate,
      totalEmployees
    };
  }, [leaveRequests, leaveBalances]);

  const summaryData = [
    {
      iconClass: "fa-light fa-clock",
      title: "Pending Requests",
      value: leaveStats.pending.toString(),
      description: "Awaiting approval",
      percentageChange: "",
      isIncrease: leaveStats.pending > 5,
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Approved Today",
      value: leaveStats.approvedToday.toString(),
      description: "Requests approved",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-calendar-day",
      title: "On Leave Today",
      value: leaveStats.onLeaveToday.toString(),
      description: "Currently absent",
      percentageChange: "",
      isIncrease: leaveStats.onLeaveToday > 10,
    },
    {
      iconClass: "fa-light fa-chart-pie",
      title: "Leave Utilization",
      value: `${leaveStats.utilizationRate}%`,
      description: "Annual leave used",
      percentageChange: "",
      isIncrease: leaveStats.utilizationRate > 60,
    },
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: leaveStats.totalEmployees.toString(),
      description: "Leave tracked",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-file-contract",
      title: "Active Policies",
      value: "6",
      description: "Leave types configured",
      percentageChange: "",
      isIncrease: true,
    }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportAll = () => {
    console.log("Export all leave data");
    handleMenuClose();
  };

  const handleRefreshAll = () => {
    setLeaveRequests(generateLeaveRequests());
    setLeaveBalances(generateLeaveBalances());
    handleMenuClose();
  };

  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/hr">HR</Link>
            </li>
            <li className="breadcrumb-item active">Leave Management</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportAll}
            size="small"
          >
            Export Report
          </Button>
          
          <IconButton
            size="small"
            onClick={handleMenuOpen}
          >
            <MoreVert />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleRefreshAll}>
              <Refresh fontSize="small" sx={{ mr: 1 }} />
              Refresh All Data
            </MenuItem>
            <MenuItem onClick={handleExportAll}>
              <Download fontSize="small" sx={{ mr: 1 }} />
              Export All Reports
            </MenuItem>
            <MenuItem onClick={() => console.log("Import data")}>
              <Upload fontSize="small" sx={{ mr: 1 }} />
              Import Data
            </MenuItem>
          </Menu>
        </div>
      </div>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
            <CalendarMonth sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Leave Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage leave requests, approvals, policies, and holiday calendar
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-12 gap-[25px] mb-[25px]">
        {summaryData.map((item, index) => (
          <div 
            key={index} 
            className={`
              col-span-12 
              sm:col-span-6 
              ${index === 0 || index === 5 ? 'lg:col-span-4' : 'lg:col-span-4'}
              xl:col-span-3
              2xl:col-span-2
            `}
          >
            <Card className="border border-solid border-[#ECECEE] dark:border-[#2A2C31] bg-white dark:bg-[#1A1C23] rounded-[10px] p-[25px] transition-all duration-300 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30">
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {leaveStats.pending > 10 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>{leaveStats.pending} leave requests pending.</strong> Please review and take action.
          </Typography>
        </Alert>
      )}
      
      {leaveStats.onLeaveToday > 15 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>{leaveStats.onLeaveToday} employees on leave today.</strong> Consider resource planning.
          </Typography>
        </Alert>
      )}
      
      {leaveStats.utilizationRate > 80 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>High leave utilization ({leaveStats.utilizationRate}%).</strong> Monitor leave balances.
          </Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="subtitle2">{tab.label}</Typography>
                  {index === 0 && leaveStats.pending > 0 && (
                    <Chip 
                      label={`${leaveStats.pending} pending`} 
                      size="small" 
                      color="warning" 
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
        
        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {tabs[activeTab].component}
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.50', borderColor: 'primary.light' }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={() => console.log("Bulk approve")}
            size="small"
            className="!text-white"
          >
            Bulk Approve
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => console.log("Bulk reject")}
            size="small"
            color="error"
          >
            Bulk Reject
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportAll}
            size="small"
          >
            Export Monthly Report
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => console.log("Advanced filters")}
            size="small"
          >
            Advanced Filters
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefreshAll}
            size="small"
          >
            Refresh Data
          </Button>
        </Box>
      </Paper>

      {/* Tips Section */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.50', borderColor: 'info.light' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            bgcolor: 'info.light', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Typography sx={{ color: 'info.main', fontWeight: 'bold' }}>💡</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
              Leave Management Best Practices
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
              <li>
                <Typography variant="body2">
                  <strong>Timely Approvals:</strong> Review pending requests within 24 hours
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Documentation:</strong> Always request supporting documents for sick leaves
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Balance Monitoring:</strong> Regularly check leave balances to prevent overutilization
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Policy Updates:</strong> Review and update leave policies quarterly
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Holiday Calendar:</strong> Publish holiday calendar at least one month in advance
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Compliance:</strong> Ensure all leave policies comply with local labor laws
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default LeaveDashboard;