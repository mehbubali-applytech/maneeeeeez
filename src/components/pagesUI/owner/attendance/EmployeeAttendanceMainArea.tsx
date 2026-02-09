"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  CircularProgress,
  Snackbar,
  AlertColor
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
  EventBusy
} from "@mui/icons-material";
import Link from "next/link";

import SummarySingleCard from "@/components/common/SummarySingleCard";
import LiveAttendanceMonitor from "./LiveAttendanceMonitor";
import AttendanceLogs from "./AttendanceLogs";
import AttendanceRequests from "./AttendanceRequests";
import EmployeeAttendanceTable from "./EmployeeAttendanceTable";
import ManualCorrectionModal from "./ManualCorrectionModal";
import LeaveManagement from "./LeaveManagement";
import { 
  IAttendanceRecord, 
  IAttendanceCorrectionRequest, 
  ICompanyAttendanceSummary,
  ICorrectedAttendance 
} from "./AttendanceTypes";
import axios from "axios";
import { getCorrectedAttendance } from "./attendanceApi";
import { useRouter } from "next/navigation";

const EmployeeAttendanceMainArea: React.FC = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  
  // State for modals
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState<ICompanyAttendanceSummary>();
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState<IAttendanceRecord | null>(null);
  
  // State for data
  const [todayAttendance, setTodayAttendance] = useState<IAttendanceRecord[]>([]);
  const [correctionRequests, setCorrectionRequests] = useState<ICorrectedAttendance[]>([]);
  
  // State for loading
  const [loading, setLoading] = useState({
    summary: false,
    liveAttendance: false,
    correctionRequests: false
  });
  
  // State for errors
  const [errors, setErrors] = useState<string[]>([]);
  
  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as AlertColor
  });
  
  // State for filters
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Refresh data when tab changes
  useEffect(() => {
    if (activeTab === 0) {
      fetchLiveAttendance();
    } else if (activeTab === 3) {
      fetchCorrectionRequests();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchAttendanceSummary(),
        fetchLiveAttendance(),
        fetchCorrectionRequests()
      ]);
    } catch (error) {
      console.error("Error fetching all data:", error);
      setErrors(prev => [...prev, "Failed to fetch some data. Please refresh."]);
      showSnackbar("Failed to load some data", "error");
    }
  };

  const fetchAttendanceSummary = async () => {
    try {
      setLoading(prev => ({ ...prev, summary: true }));
      const payload = {
        client_id: 27,
        date: new Date().toISOString().split("T")[0],
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/attendance/summaryByCompany`,
        payload
      );

      if (response.data && response.data.data) {
        setAttendanceSummary(response.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch attendance summary", err);
      setErrors(prev => [...prev, "Failed to fetch attendance summary"]);
      showSnackbar("Failed to fetch attendance summary", "error");
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const fetchLiveAttendance = async () => {
    try {
      setLoading(prev => ({ ...prev, liveAttendance: true }));
      const payload = {
        date: new Date().toISOString().split("T")[0],
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/attendance/getLiveAttendance`,
        payload,{
          withCredentials: true
        }
      );

      if (response.data && response.data.data) {
        setTodayAttendance(response.data.data);
      }
    } catch (err: any) {
     if (err.response?.status === 401) {
        router.push("/");
        return;
      }
      console.error("Failed to fetch live attendance", err);
      setErrors(prev => [...prev, "Failed to fetch live attendance"]);
      showSnackbar("Failed to fetch live attendance", "error");
    } finally {
      setLoading(prev => ({ ...prev, liveAttendance: false }));
    }
  };

  const fetchCorrectionRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, correctionRequests: true }));
      const response = await getCorrectedAttendance();
      
      if (response && response.data) {
        setCorrectionRequests(response.data);
      } else {
        // Fallback to empty array if no data
        setCorrectionRequests([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch correction requests", err);
      setErrors(prev => [...prev, "Failed to fetch correction requests"]);
      showSnackbar("Failed to fetch correction requests", "error");
      // Set empty array on error
      setCorrectionRequests([]);
    } finally {
      setLoading(prev => ({ ...prev, correctionRequests: false }));
    }
  };

  const handleRefreshAll = async () => {
    setErrors([]);
    await fetchAllData();
    showSnackbar("All data refreshed successfully", "success");
    handleMenuClose();
  };

  const handleRefreshCurrentTab = () => {
    switch(activeTab) {
      case 0:
        fetchLiveAttendance();
        showSnackbar("Live attendance refreshed", "success");
        break;
      case 1:
        showSnackbar("Monthly view data refreshed", "success");
        break;
      case 2:
        showSnackbar("Attendance logs refreshed", "success");
        break;
      case 3:
        fetchCorrectionRequests();
        showSnackbar("Correction requests refreshed", "success");
        break;
    }
  };

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Tab configuration
 const tabs = [
  {
    label: "Live Monitor",
    icon: <AccessTime />,
    component: (
      <LiveAttendanceMonitor 
        attendanceData={todayAttendance}
        onRefresh={handleRefreshCurrentTab}
        onEditAttendance={(record) => {
          setSelectedAttendanceRecord(record);
          setCorrectionModalOpen(true);
        }}
        onViewDetails={(record) => {
          console.log("View details:", record);
          setSnackbar({
            open: true,
            message: `Viewing details for ${record.employeeName}`,
            severity: 'info'
          });
        }}
      />
    ),
    loading: loading.liveAttendance
  },
  {
    label: "Monthly View",
    icon: <CalendarMonth />,
    component: <EmployeeAttendanceTable />,
    loading: false
  },
  {
    label: "Attendance Logs",
    icon: <History />,
    component: (
      <AttendanceLogs 
        onExportCSV={(data) => {
          console.log("Export CSV:", data.length, "records");
          showSnackbar(`Exported ${data.length} records to CSV`, "success");
        }}
        onExportPDF={(data) => {
          console.log("Export PDF:", data.length, "records");
          showSnackbar(`Exported ${data.length} records to PDF`, "success");
        }}
        onEditRecord={(record) => {
          console.log("Edit record:", record);
          setSelectedAttendanceRecord(record);
          setCorrectionModalOpen(true);
        }}
        onViewCorrection={(record) => {
          console.log("View correction:", record);
          if (record.correctionRequest) {
            setSnackbar({
              open: true,
              message: `Viewing correction request for ${record.employeeName}`,
              severity: 'info'
            });
          }
        }}
      />
    ),
    loading: false
  },
  {
    label: "Correction Requests",
    icon: <Edit />,
    component: (
      <AttendanceRequests 
        onApprove={async (requestId) => {
          console.log("Approve request:", requestId);
          await fetchCorrectionRequests();
          showSnackbar("Correction request approved", "success");
        }}
        onReject={async (requestId) => {
          console.log("Reject request:", requestId);
          await fetchCorrectionRequests();
          showSnackbar("Correction request rejected", "success");
        }}
        onViewDetails={(request) => {
          console.log("View request details:", request);
          setSnackbar({
            open: true,
            message: `Viewing correction request details`,
            severity: 'info'
          });
        }}
        onExport={(data) => {
          console.log("Export requests:", data.length, "requests");
          showSnackbar(`Exported ${data.length} correction requests`, "success");
        }}
      />
    ),
    loading: loading.correctionRequests
  },
  // ADD THIS NEW TAB FOR LEAVE MANAGEMENT
  {
    label: "Leave Management",
    icon: <EventBusy />, // You'll need to import this icon
    component: (
      <LeaveManagement
        onApprove={async (leaveId) => {
          console.log("Approve leave:", leaveId);
          showSnackbar("Leave request approved", "success");
        }}
        onReject={async (leaveId) => {
          console.log("Reject leave:", leaveId);
          showSnackbar("Leave request rejected", "success");
        }}
        onCreate={() => {
          setSnackbar({
            open: true,
            message: "Create new leave request functionality",
            severity: 'info'
          });
          // You can open a modal for creating leave request here
        }}
        onViewDetails={(leave) => {
          console.log("View leave details:", leave);
          setSnackbar({
            open: true,
            message: `Viewing leave details for ${leave.employee_name}`,
            severity: 'info'
          });
        }}
        onExport={(data) => {
          console.log("Export leaves:", data.length, "leaves");
          showSnackbar(`Exported ${data.length} leave requests`, "success");
        }}
      />
    ),
    loading: false
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
    const pendingRequests = correctionRequests.filter(r => r.status === 'Need Approval').length;
    
    return {
      totalEmployees,
      present,
      absent,
      late,
      checkedIn,
      checkedOut,
      pendingRequests,
      attendanceRate: totalEmployees > 0 ? Math.round((present / totalEmployees) * 100) : 0
    };
  }, [todayAttendance, correctionRequests]);

  // Summary data for SummarySingleCard components
  const summaryData = [
    {
      iconClass: "fa-light fa-chart-line",
      title: "Attendance Rate",
      value: attendanceSummary
        ? `${attendanceSummary.attendanceRate}%`
        : "--",
      description: "Today",
      percentageChange: "",
      isIncrease: (attendanceSummary?.attendanceRate ?? 0) > 85,
    },
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: attendanceSummary
        ? attendanceSummary.totalEmployees.toString()
        : "--",
      description: "Tracked today",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Present Today",
      value: attendanceSummary
        ? attendanceSummary.present.toString()
        : "--",
      description: attendanceSummary
        ? `vs ${attendanceSummary.absent} absent`
        : "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-clock",
      title: "Late Arrivals",
      value: attendanceSummary
        ? attendanceSummary.late.toString()
        : "--",
      description: "Need attention",
      percentageChange: "",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-business-time",
      title: "Total Work Hours",
      value: attendanceSummary
        ? `${attendanceSummary.totalWorkedHours} Hrs`
        : "--",
      description: "All employees",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-calendar-day",
      title: "Today's Date",
      value: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }),
      description: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
      }),
      percentageChange: "",
      isIncrease: true,
    },
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
    setSelectedAttendanceRecord(null);
    setCorrectionModalOpen(true);
    handleMenuClose();
  };

  const handleExportAll = () => {
    console.log("Export all attendance data");
    // Implement export logic
    setSnackbar({
      open: true,
      message: "Export functionality will be implemented soon",
      severity: 'info'
    });
    handleMenuClose();
  };

  const handleSubmitCorrection = async (data: any) => {
    try {
      console.log("Submit correction:", data);
      
      // Prepare payload for API
      const payload = {
        employee_id: parseInt(data.employeeId.replace('EMP', '')),
        attendance_date: data.date.toISOString().split('T')[0],
        shift_id: 1, // You might need to get this from the selected record
        check_in_time: data.checkInTime ? 
          data.checkInTime.toTimeString().split(' ')[0].substring(0, 5) : 
          '09:00',
        check_out_time: data.checkOutTime ? 
          data.checkOutTime.toTimeString().split(' ')[0].substring(0, 5) : 
          '18:00',
        location: "Office",
        reason: data.reason,
        source: 'manual'
      };

      // Call the API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/attendance/absent-correction`,
        payload
      );

      if (response.data && response.data.errorCode === 0) {
        showSnackbar("Correction request submitted successfully!", "success");
        
        // Refresh correction requests
        await fetchCorrectionRequests();
        
        // Close modal
        setCorrectionModalOpen(false);
        
        // Switch to correction requests tab
        setActiveTab(3);
      } else {
        throw new Error(response.data?.errorMessage || "Failed to submit correction");
      }
    } catch (error: any) {
      console.error("Error submitting correction:", error);
      
      let errorMessage = "Failed to submit correction request";
      if (error.response?.data?.errorIdentifier === 'CORRECTION.DUPLICATE') {
        errorMessage = "A correction request already exists for this employee on this date";
      } else if (error.response?.data?.errorMessage) {
        errorMessage = error.response.data.errorMessage;
      }
      
      showSnackbar(errorMessage, "error");
    }
  };

  const handleCorrectionModalClose = () => {
    setCorrectionModalOpen(false);
    setSelectedAttendanceRecord(null);
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
              <Link href="/owner">Owner</Link>
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
            disabled={loading.summary || loading.liveAttendance}
          >
            Export All
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleManualCorrection}
            size="small"
            className="!text-white"
            disabled={loading.summary || loading.liveAttendance}
          >
            Manual Correction
          </Button>
          
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            disabled={loading.summary || loading.liveAttendance}
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

      {/* Error Alerts */}
      {errors.length > 0 && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setErrors([])}
        >
          <Typography variant="body2">
            {errors[0]}
            {errors.length > 1 && ` (and ${errors.length - 1} more)`}
          </Typography>
        </Alert>
      )}

      {/* Loading Indicator for Summary Cards */}
      {loading.summary ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Summary Stats Cards using SummarySingleCard */
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
              <SummarySingleCard {...item} />
            </div>
          ))}
        </div>
      )}

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
              icon={tab.loading ? <CircularProgress size={20} /> : tab.icon}
              iconPosition="start"
              disabled={tab.loading}
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
                        <Chip 
                          label={`${attendanceStats.pendingRequests} pending`} 
                          size="small" 
                          color="warning" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
        
        {/* Tab Content */}
        <Box sx={{ p: 3, minHeight: 400 }}>
          {tabs[activeTab].loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <CircularProgress />
            </Box>
          ) : (
            tabs[activeTab].component
          )}
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
            disabled={loading.summary || loading.liveAttendance}
          >
            Manual Attendance Entry
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportAll}
            size="small"
            disabled={loading.summary || loading.liveAttendance}
          >
            Export Monthly Report
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => {
              console.log("Open advanced filters");
              setSnackbar({
                open: true,
                message: "Advanced filters will be implemented soon",
                severity: 'info'
              });
            }}
            size="small"
          >
            Advanced Filters
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefreshAll}
            size="small"
            disabled={loading.summary || loading.liveAttendance}
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
        onClose={handleCorrectionModalClose}
        onSubmit={handleSubmitCorrection}
        record={selectedAttendanceRecord || undefined}
        mode={selectedAttendanceRecord ? 'edit' : 'create'}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      />
    </div>
  );
};

export default EmployeeAttendanceMainArea;