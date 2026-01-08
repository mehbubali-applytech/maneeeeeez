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
  Chip
} from "@mui/material";
import {
  AccessTime,
  CalendarMonth,
  History,
  Edit,
  Download,
  MoreVert,
  Refresh,
  FilterList,
} from "@mui/icons-material";
import Link from "next/link";

import SummarySingleCard from "@/components/common/SummarySingleCard";

import LiveAttendanceMonitor from "./LiveAttendanceMonitor";
import AttendanceLogs from "./AttendanceLogs";
import AttendanceRequests from "./AttendanceRequests";
import EmployeeAttendanceTable from "./EmployeeAttendanceTable";
import ManualCorrectionModal from "./ManualCorrectionModal";
import { IAttendanceRecord, IAttendanceCorrectionRequest } from "./AttendanceTypes";

const generateTodayAttendance = (): IAttendanceRecord[] => {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Rajesh Kumar",
      department: "Engineering",
      role: "Software Engineer",
      shiftId: 1,
      shiftName: "Morning Shift",
      shiftStartTime: "09:00",
      shiftEndTime: "18:00",
      date: today,
      checkInTime: "08:55",
      checkOutTime: "18:10",
      checkInLocation: "Bangalore Office",
      totalHours: 9.25,
      attendanceStatus: "Present",
      isManualEntry: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Priya Sharma",
      department: "Marketing",
      role: "Marketing Manager",
      shiftId: 2,
      shiftName: "Evening Shift",
      shiftStartTime: "14:00",
      shiftEndTime: "22:00",
      date: today,
      checkInTime: "14:25",
      checkOutTime: undefined,
      checkInLocation: "Delhi Office",
      totalHours: 0,
      attendanceStatus: "Late",
      lateMinutes: 25,
      isManualEntry: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Amit Patel",
      department: "Sales",
      role: "Sales Executive",
      shiftId: 1,
      shiftName: "Morning Shift",
      shiftStartTime: "09:00",
      shiftEndTime: "18:00",
      date: today,
      checkInTime: "09:15",
      checkOutTime: "18:15",
      checkInLocation: "Mumbai Office",
      totalHours: 9,
      attendanceStatus: "Present",
      isManualEntry: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      employeeId: "EMP004",
      employeeName: "Sneha Reddy",
      department: "HR",
      role: "HR Manager",
      shiftId: 1,
      shiftName: "Morning Shift",
      shiftStartTime: "09:00",
      shiftEndTime: "18:00",
      date: today,
      checkInTime: undefined,
      checkOutTime: undefined,
      attendanceStatus: "Absent",
      isManualEntry: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

const generateCorrectionRequests = (): IAttendanceCorrectionRequest[] => {
  return [
    {
      id: "REQ001",
      attendanceId: "ATT001",
      employeeId: "EMP001",
      employeeName: "Rajesh Kumar",
      date: "2024-01-15",
      currentCheckIn: "09:45",
      currentCheckOut: "18:00",
      requestedCheckIn: "09:00",
      requestedCheckOut: "18:00",
      reason: "Forgot to check-in on time due to meeting",
      status: "Pending",
      submittedAt: "2024-01-15T10:30:00Z",
      supportingDocuments: ["meeting_invite.pdf"]
    },
    {
      id: "REQ002",
      attendanceId: "ATT002",
      employeeId: "EMP002",
      employeeName: "Priya Sharma",
      date: "2024-01-14",
      currentCheckIn: "14:30",
      currentCheckOut: "22:00",
      requestedCheckIn: "14:00",
      requestedCheckOut: "22:00",
      reason: "Late check-in due to client call",
      status: "Approved",
      submittedAt: "2024-01-14T15:00:00Z",
      reviewedBy: "HR001",
      reviewedAt: "2024-01-14T16:30:00Z",
      reviewNotes: "Approved with note to maintain punctuality"
    }
  ];
};

const EmployeeAttendanceMainArea: React.FC = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState(0);
  
  // State for modals
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  
  // State for data
  const [todayAttendance, setTodayAttendance] = useState<IAttendanceRecord[]>(generateTodayAttendance());
  const [correctionRequests, setCorrectionRequests] = useState<IAttendanceCorrectionRequest[]>(generateCorrectionRequests());
  
  // State for filters
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Tab configuration
  const tabs = [
    {
      label: "Live Monitor",
      icon: <AccessTime />,
      component: <LiveAttendanceMonitor 
        attendanceData={todayAttendance}
        onRefresh={() => {
          setTodayAttendance(generateTodayAttendance());
        }}
        onEditAttendance={(record) => {
          console.log("Edit attendance:", record);
          // Open edit modal
        }}
        onViewDetails={(record) => {
          console.log("View details:", record);
          // Navigate to details
        }}
      />
    },
    {
      label: "Monthly View",
      icon: <CalendarMonth />,
      component: <EmployeeAttendanceTable />
    },
    {
      label: "Attendance Logs",
      icon: <History />,
      component: <AttendanceLogs 
        onExportCSV={(data) => {
          console.log("Export CSV:", data.length, "records");
          // Export logic
        }}
        onExportPDF={(data) => {
          console.log("Export PDF:", data.length, "records");
          // Export logic
        }}
        onEditRecord={(record) => {
          console.log("Edit record:", record);
          // Open edit modal
        }}
        onViewCorrection={(record) => {
          console.log("View correction:", record);
          // Open correction details
        }}
      />
    },
    {
      label: "Correction Requests",
      icon: <Edit />,
      component: <AttendanceRequests 
        requests={correctionRequests}
        onApprove={(requestId) => {
          console.log("Approve request:", requestId);
          setCorrectionRequests(prev => 
            prev.map(req => req.id === requestId ? { ...req, status: 'Approved' } : req)
          );
        }}
        onReject={(requestId) => {
          console.log("Reject request:", requestId);
          setCorrectionRequests(prev => 
            prev.map(req => req.id === requestId ? { ...req, status: 'Rejected' } : req)
          );
        }}
        onViewDetails={(request) => {
          console.log("View request details:", request);
        }}
        onExport={(data) => {
          console.log("Export requests:", data.length, "requests");
        }}
      />
    }
  ];

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    const totalEmployees = todayAttendance.length;
    const present = todayAttendance.filter(r => r.attendanceStatus === 'Present').length;
    const absent = todayAttendance.filter(r => r.attendanceStatus === 'Absent').length;
    const late = todayAttendance.filter(r => r.attendanceStatus === 'Late').length;
    const checkedIn = todayAttendance.filter(r => r.checkInTime).length;
    const checkedOut = todayAttendance.filter(r => r.checkOutTime).length;
    const pendingRequests = correctionRequests.filter(r => r.status === 'Pending').length;
    
    return {
      totalEmployees,
      present,
      absent,
      late,
      checkedIn,
      checkedOut,
      pendingRequests,
      attendanceRate: Math.round((present / totalEmployees) * 100)
    };
  }, [todayAttendance, correctionRequests]);

  // Summary data for SummarySingleCard components
  const summaryData = [
    {
      iconClass: "fa-light fa-chart-line",
      title: "Attendance Rate",
      value: `${attendanceStats.attendanceRate}%`,
      description: "Today",
      percentageChange: "",
      isIncrease: attendanceStats.attendanceRate > 85, // Assuming >85% is good
    },
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: attendanceStats.totalEmployees.toString(),
      description: "Tracked today",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Present Today",
      value: attendanceStats.present.toString(),
      description: `vs ${attendanceStats.absent} absent`,
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-clock",
      title: "Late Arrivals",
      value: attendanceStats.late.toString(),
      description: "Need attention",
      percentageChange: "",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-edit",
      title: "Pending Requests",
      value: attendanceStats.pendingRequests.toString(),
      description: "Require review",
      percentageChange: "",
      isIncrease: attendanceStats.pendingRequests > 0,
    },
    {
      iconClass: "fa-light fa-calendar-day",
      title: "Today&apos;s Date",
      value: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit' 
      }),
      description: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric' 
      }),
      percentageChange: "",
      isIncrease: true,
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleManualCorrection = () => {
    setCorrectionModalOpen(true);
    handleMenuClose();
  };

  const handleExportAll = () => {
    console.log("Export all attendance data");
    handleMenuClose();
  };

  const handleRefreshAll = () => {
    setTodayAttendance(generateTodayAttendance());
    setCorrectionRequests(generateCorrectionRequests());
    handleMenuClose();
  };

  const handleSubmitCorrection = (data: any) => {
    console.log("Submit correction:", data);
    setCorrectionModalOpen(false);
    // In real app, would update state or make API call
    alert("Correction request submitted successfully!");
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
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item active">Salary Structure</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportAll}
            size="small"
          >
            Export All
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleManualCorrection}
            size="small"
            className="!text-white"
          >
            Manual Correction
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
              Export Reports
            </MenuItem>
            <MenuItem onClick={handleManualCorrection}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Manual Entry
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
            <AccessTime sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Attendance Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor, manage, and correct employee attendance in real-time
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary Stats Cards using SummarySingleCard */}
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
            {/* <div className="card card__border border border-solid border-[#ECECEE] dark:border-[#2A2C31] bg-white dark:bg-[#1A1C23] rounded-[10px] p-[25px] transition-all duration-300 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30"> */}
              <SummarySingleCard {...item} />
            {/* </div> */}
          </div>
        ))}
      </div>

      {/* Alerts */}
      {attendanceStats.late > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>{attendanceStats.late} employee(s) arrived late today.</strong> Review attendance records for details.
          </Typography>
        </Alert>
      )}
      
      {attendanceStats.absent > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>{attendanceStats.absent} employee(s) absent today.</strong> Check if leave requests are pending.
          </Typography>
        </Alert>
      )}
      
      {attendanceStats.pendingRequests > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>{attendanceStats.pendingRequests} correction request(s) pending review.</strong> Please review and take action.
          </Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
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
                  {index === 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Real-time updates
                    </Typography>
                  )}
                  {index === 1 && (
                    <Typography variant="caption" color="text.secondary">
                      Monthly calendar view
                    </Typography>
                  )}
                  {index === 2 && (
                    <Typography variant="caption" color="text.secondary">
                      Historical records
                    </Typography>
                  )}
                  {index === 3 && (
                    <Typography variant="caption" color="text.secondary">
                      {attendanceStats.pendingRequests > 0 && (
                        <Chip label={`${attendanceStats.pendingRequests} pending`} size="small" color="warning" />
                      )}
                    </Typography>
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

      {/* Quick Actions Footer */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleManualCorrection}
            size="small"
          >
            Manual Attendance Entry
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
            onClick={() => console.log("Open advanced filters")}
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
            Refresh All Data
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
              Attendance Management Tips
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
              <li>
                <Typography variant="body2">
                  <strong>Real-time Monitoring:</strong> Use the Live Monitor tab to track {`today's`} attendance in real-time
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Monthly Reports:</strong> Generate monthly reports for payroll and compliance purposes
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Correction Requests:</strong> Review and approve correction requests within 24 hours
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Export Data:</strong> Regularly export attendance data for backup and audit purposes
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Late Arrivals:</strong> Set up automated alerts for frequent late arrivals
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Compliance:</strong> Ensure attendance records comply with labor laws and company policies
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Manual Correction Modal */}
      <ManualCorrectionModal
        open={correctionModalOpen}
        onClose={() => setCorrectionModalOpen(false)}
        onSubmit={handleSubmitCorrection}
        mode="create"
      />
    </div>
  );
};

export default EmployeeAttendanceMainArea;