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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
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
  People,
  CheckCircle,
  Warning,
  Dashboard
} from "@mui/icons-material";
import Link from "next/link";

import SummarySingleCard from "@/components/common/SummarySingleCard";

import LiveAttendanceMonitor from "../../owner/attendance/LiveAttendanceMonitor";
import AttendanceLogs from "../../owner/attendance/AttendanceLogs";
import EmployeeAttendanceTable from "./EmployeeAttendanceTable";
import HRManualEditModal from "./HRManualEditModal";
import HRAttendanceRequestsList from "./HRAttendanceRequestsList";
import { IAttendanceRecord, IAttendanceCorrectionRequest } from "../../owner/attendance/AttendanceTypes";
import HREmployeeAttendanceTable from "./HREmployeeAttendanceTable";

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
      isManualEntry: true,
      manualOverrideReason: "Forgot to check-in, HR corrected",
      overriddenBy: "HR Manager",
      overriddenAt: new Date().toISOString(),
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
      type: "Incorrect Time",
      currentCheckIn: "09:45",
      currentCheckOut: "18:00",
      requestedCheckIn: "09:00",
      requestedCheckOut: "18:00",
      reason: "Forgot to check-in on time due to meeting",
      status: "Pending",
      submittedAt: "2024-01-15T10:30:00Z",
      attachmentUrl: "/attachments/meeting_invite.pdf"
    },
    {
      id: "REQ002",
      attendanceId: "ATT002",
      employeeId: "EMP002",
      employeeName: "Priya Sharma",
      date: "2024-01-14",
      type: "Missing In",
      currentCheckIn: undefined,
      currentCheckOut: "22:00",
      requestedCheckIn: "14:00",
      requestedCheckOut: "22:00",
      reason: "System error - check-in not recorded",
      status: "Approved",
      submittedAt: "2024-01-14T15:00:00Z",
      reviewedBy: "HR Manager",
      reviewedAt: "2024-01-14T16:30:00Z",
      reviewNotes: "Approved with note to maintain punctuality"
    }
  ];
};

const HRAttendanceMainArea: React.FC = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState(0);
  
  // State for modals
  const [hrEditModalOpen, setHrEditModalOpen] = useState(false);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  
  // State for data
  const [todayAttendance, setTodayAttendance] = useState<IAttendanceRecord[]>(generateTodayAttendance());
  const [correctionRequests, setCorrectionRequests] = useState<IAttendanceCorrectionRequest[]>(generateCorrectionRequests());
  
  // State for selected record
  const [selectedRecord, setSelectedRecord] = useState<IAttendanceRecord | null>(null);
  
  // State for bulk actions
  const [bulkActionType, setBulkActionType] = useState<'approve' | 'reject'>('approve');
  const [bulkActionReason, setBulkActionReason] = useState('');
  
  // State for filters
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Current HR user
  const currentHRUser = "HR Manager";
  
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
          setSelectedRecord(record);
          setHrEditModalOpen(true);
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
      component: <HREmployeeAttendanceTable />
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
          setSelectedRecord(record);
          setHrEditModalOpen(true);
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
      component: <HRAttendanceRequestsList 
        requests={correctionRequests}
        onApprove={(requestIds) => {
          console.log("Approve requests:", requestIds);
          setCorrectionRequests(prev => 
            prev.map(req => requestIds.includes(req.id) ? { 
              ...req, 
              status: 'Approved',
              reviewedBy: currentHRUser,
              reviewedAt: new Date().toISOString()
            } : req)
          );
        }}
        onReject={(requestIds, reason) => {
          console.log("Reject requests:", requestIds, "with reason:", reason);
          setCorrectionRequests(prev => 
            prev.map(req => requestIds.includes(req.id) ? { 
              ...req, 
              status: 'Rejected',
              reviewedBy: currentHRUser,
              reviewedAt: new Date().toISOString(),
              reviewNotes: reason
            } : req)
          );
        }}
        onEditRequest={(request) => {
          console.log("Edit request:", request);
          // Open edit modal
        }}
        onViewDetails={(request) => {
          console.log("View request details:", request);
        }}
        onExport={(data) => {
          console.log("Export requests:", data.length, "requests");
        }}
        currentUser={currentHRUser}
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
    const manualEntries = todayAttendance.filter(r => r.isManualEntry).length;
    
    return {
      totalEmployees,
      present,
      absent,
      late,
      checkedIn,
      checkedOut,
      pendingRequests,
      manualEntries,
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
      isIncrease: attendanceStats.attendanceRate > 85,
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
      iconClass: "fa-light fa-user-edit",
      title: "Manual Entries",
      value: attendanceStats.manualEntries.toString(),
      description: "HR corrected",
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

  const handleManualEdit = () => {
    setHrEditModalOpen(true);
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

  const handleHREditSubmit = (data: any) => {
    console.log("HR manual edit:", data);
    
    // Update the attendance record
    setTodayAttendance(prev => 
      prev.map(record => 
        record.id === data.attendanceId ? {
          ...record,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          totalHours: calculateTotalHours(data.checkInTime, data.checkOutTime),
          attendanceStatus: 'Present', // Assuming manual edits mark as present
          isManualEntry: true,
          manualOverrideReason: data.overrideReason,
          overriddenBy: data.changedBy,
          overriddenAt: data.changedAt,
          updatedAt: new Date().toISOString()
        } : record
      )
    );
    
    setHrEditModalOpen(false);
    alert("Attendance record updated successfully!");
  };

  const handleBulkApprove = () => {
    // Filter pending requests
    const pendingIds = correctionRequests
      .filter(req => req.status === 'Pending')
      .map(req => req.id);
    
    if (pendingIds.length > 0) {
      setCorrectionRequests(prev => 
        prev.map(req => pendingIds.includes(req.id) ? { 
          ...req, 
          status: 'Approved',
          reviewedBy: currentHRUser,
          reviewedAt: new Date().toISOString(),
          reviewNotes: "Bulk approved by HR"
        } : req)
      );
      alert(`${pendingIds.length} requests bulk approved`);
    } else {
      alert("No pending requests to approve");
    }
    setBulkActionDialogOpen(false);
  };

  const handleBulkReject = () => {
    if (!bulkActionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    const pendingIds = correctionRequests
      .filter(req => req.status === 'Pending')
      .map(req => req.id);
    
    if (pendingIds.length > 0) {
      setCorrectionRequests(prev => 
        prev.map(req => pendingIds.includes(req.id) ? { 
          ...req, 
          status: 'Rejected',
          reviewedBy: currentHRUser,
          reviewedAt: new Date().toISOString(),
          reviewNotes: bulkActionReason
        } : req)
      );
      alert(`${pendingIds.length} requests bulk rejected`);
      setBulkActionReason('');
    } else {
      alert("No pending requests to reject");
    }
    setBulkActionDialogOpen(false);
  };

  const calculateTotalHours = (checkIn: string, checkOut: string): number => {
    const start = new Date(`2000-01-01T${checkIn}`);
    const end = new Date(`2000-01-01T${checkOut}`);
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60);
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
              <Link href="/hr">HR Panel</Link>
            </li>
            <li className="breadcrumb-item active">Attendance Management</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportAll}
            size="small"
          >
            Export Reports
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleManualEdit}
            size="small"
            className="!text-white"
          >
            Manual Edit
          </Button>
          
          <Button
            variant="contained"
            color="warning"
            startIcon={<CheckCircle />}
            className="!text-white"
            onClick={() => {
              setBulkActionType('approve');
              setBulkActionDialogOpen(true);
            }}
            size="small"
          >
            Bulk Approve
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
            <MenuItem onClick={handleManualEdit}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Manual Edit Attendance
            </MenuItem>
            <MenuItem onClick={() => {
              setBulkActionType('approve');
              setBulkActionDialogOpen(true);
              handleMenuClose();
            }}>
              <CheckCircle fontSize="small" sx={{ mr: 1 }} color="success" />
              Bulk Approve Requests
            </MenuItem>
            <MenuItem onClick={() => {
              setBulkActionType('reject');
              setBulkActionDialogOpen(true);
              handleMenuClose();
            }}>
              <Warning fontSize="small" sx={{ mr: 1 }} color="error" />
              Bulk Reject Requests
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
              HR Attendance Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor, manage, and correct employee attendance with administrative privileges
            </Typography>
            <Chip 
              label={`Logged in as: ${currentHRUser}`} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ mt: 1 }}
            />
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
              lg:col-span-4
              xl:col-span-3
              2xl:col-span-2
            `}
          >
            <SummarySingleCard {...item} />
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
            <strong>{attendanceStats.pendingRequests} correction request(s) pending review.</strong> Use bulk actions to approve/reject multiple requests.
          </Typography>
        </Alert>
      )}
      
      {attendanceStats.manualEntries > 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>{attendanceStats.manualEntries} record(s) manually corrected.</strong> All manual edits are logged for audit purposes.
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
                      Real-time monitoring
                    </Typography>
                  )}
                  {index === 1 && (
                    <Typography variant="caption" color="text.secondary">
                      Monthly calendar view
                    </Typography>
                  )}
                  {index === 2 && (
                    <Typography variant="caption" color="text.secondary">
                      Historical records & audit
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
          HR Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleManualEdit}
            size="small"
          >
            Manual Attendance Entry
          </Button>
          
          <Button
            variant="outlined"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => {
              setBulkActionType('approve');
              setBulkActionDialogOpen(true);
            }}
            size="small"
          >
            Bulk Approve Requests
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<Warning />}
            onClick={() => {
              setBulkActionType('reject');
              setBulkActionDialogOpen(true);
            }}
            size="small"
          >
            Bulk Reject Requests
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
        </Box>
      </Paper>

      {/* HR Tips Section */}
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
              HR Attendance Management Guidelines
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
              <li>
                <Typography variant="body2">
                  <strong>Manual Corrections:</strong> Always provide detailed reasons for manual overrides
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Audit Trail:</strong> All manual edits create audit log entries
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Bulk Actions:</strong> Use bulk approve/reject for efficient request processing
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Compliance:</strong> Ensure all corrections comply with labor laws
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Notifications:</strong> Always notify employees when their requests are approved/rejected
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Documentation:</strong> Keep supporting documents for all manual corrections
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* HR Manual Edit Modal */}
      <HRManualEditModal
        open={hrEditModalOpen}
        onClose={() => setHrEditModalOpen(false)}
        onSubmit={handleHREditSubmit}
        record={selectedRecord}
        currentUser={currentHRUser}
      />

      {/* Bulk Action Dialog */}
      <Dialog 
        open={bulkActionDialogOpen} 
        onClose={() => setBulkActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {bulkActionType === 'approve' ? 'Bulk Approve Requests' : 'Bulk Reject Requests'}
        </DialogTitle>
        <DialogContent>
          {bulkActionType === 'approve' ? (
            <Box>
              <Typography gutterBottom>
                Are you sure you want to approve all pending correction requests?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This will approve {correctionRequests.filter(r => r.status === 'Pending').length} pending request(s).
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  All approved requests will be marked as reviewed by {currentHRUser}.
                </Typography>
              </Alert>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography gutterBottom>
                Are you sure you want to reject all pending correction requests?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This will reject {correctionRequests.filter(r => r.status === 'Pending').length} pending request(s).
              </Typography>
              
              <TextField
                label="Reason for rejection *"
                multiline
                rows={3}
                fullWidth
                value={bulkActionReason}
                onChange={(e) => setBulkActionReason(e.target.value)}
                placeholder="Provide a reason for rejecting all pending requests..."
                required
              />
              
              <Alert severity="warning" sx={{ mt: 1 }}>
                <Typography variant="caption">
                  This action cannot be undone. All rejected requests will be marked with this reason.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={bulkActionType === 'approve' ? handleBulkApprove : handleBulkReject}
            variant="contained"
            color={bulkActionType === 'approve' ? 'success' : 'error'}
            className="!text-white"
            disabled={bulkActionType === 'reject' && !bulkActionReason.trim()}
          >
            {bulkActionType === 'approve' ? 'Approve All' : 'Reject All'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HRAttendanceMainArea;