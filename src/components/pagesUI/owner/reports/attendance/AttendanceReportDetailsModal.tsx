"use client";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Chip,
    Box,
    Divider,
    Grid,
    Button,
    Paper,
    LinearProgress,
    Avatar
} from "@mui/material";
import { AttendanceReportDetailsStatePropsType } from "./attendancereports.interface";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShareIcon from "@mui/icons-material/Share";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import TimerIcon from "@mui/icons-material/Timer";

interface IAttendanceReport {
    id: number;
    reportName: string;
    reportType: string;
    period: string;
    generatedBy: string;
    generationDate: string;
    status: string;
    fileSize: string;
    totalEmployees: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    earlyLeaveCount: number;
    leaveCount: number;
    averageHours: number;
    overtimeHours: number;
    attendanceRate: number;
    keyMetrics?: Array<{ label: string; value: string; change?: number }>;
    description?: string;
    parameters?: Record<string, any>;
}

const AttendanceReportDetailsModal = ({
    open,
    setOpen,
    reportData
}: AttendanceReportDetailsStatePropsType) => {

    const handleToggle = () => setOpen(!open);

    if (!reportData) return null;

    const getReportTypeClass = (type: string) => {
        switch (type.toLowerCase()) {
            case "daily":
                return "success-badge";
            case "weekly":
                return "primary-badge";
            case "monthly":
                return "info-badge";
            case "quarterly":
                return "warning-badge";
            case "yearly":
                return "danger-badge";
            case "summary":
                return "secondary-badge";
            default:
                return "default-badge";
        }
    };

    const handleDownload = () => {
        alert(`Downloading ${reportData.reportName}...`);
    };

    const handleShare = () => {
        alert(`Sharing ${reportData.reportName}...`);
    };

    // Sample key metrics for attendance report
    const sampleMetrics = reportData.keyMetrics || [
        { label: "Attendance Rate", value: `${reportData.attendanceRate}%`, change: reportData.attendanceRate > 95 ? 2 : -3 },
        { label: "Average Hours", value: `${reportData.averageHours}h`, change: 0.5 },
        { label: "Overtime Hours", value: `${reportData.overtimeHours}h`, change: -15 },
        { label: "Late Arrivals", value: `${reportData.lateCount}`, change: -8 },
        { label: "Absent Employees", value: `${reportData.absentCount}`, change: -12 },
        { label: "Early Leaves", value: `${reportData.earlyLeaveCount}`, change: -5 },
    ];

    // Calculate percentages
    const presentPercentage = (reportData.presentCount / reportData.totalEmployees) * 100;
    const absentPercentage = (reportData.absentCount / reportData.totalEmployees) * 100;
    const latePercentage = (reportData.lateCount / reportData.totalEmployees) * 100;
    const leavePercentage = (reportData.leaveCount / reportData.totalEmployees) * 100;

    return (
        <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
            <DialogTitle>
                <div className="flex justify-between items-center">
                    <h5 className="modal-title">Attendance Report Details</h5>
                    <button onClick={handleToggle} type="button" className="bd-btn-close">
                        <i className="fa-solid fa-xmark-large"></i>
                    </button>
                </div>
            </DialogTitle>

            <DialogContent className="common-scrollbar overflow-y-auto">
                <div className="card__wrapper">
                    <div className="grid grid-cols-12 gap-y-5">
                        <div className="col-span-12">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <DescriptionIcon className="mr-3 text-primary" fontSize="large" />
                                    <div>
                                        <Typography variant="h6" className="font-semibold">
                                            {reportData.reportName}
                                        </Typography>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Chip
                                                label={reportData.reportType}
                                                className={getReportTypeClass(reportData.reportType)}
                                                size="small"
                                            />
                                            <Chip
                                                label={reportData.status}
                                                className={getTableStatusClass(reportData.status)}
                                                size="small"
                                            />
                                            <Chip
                                                label={reportData.period}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Typography variant="body2" color="text.secondary">
                                        Overall Attendance Rate
                                    </Typography>
                                    <Typography variant="h5" className={`font-bold ${reportData.attendanceRate > 90 ? 'text-success' : 'text-warning'}`}>
                                        {reportData.attendanceRate}%
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <Divider className="col-span-12 my-2" />

                        <Grid container spacing={2} className="col-span-12">
                            <Grid item xs={12} md={6}>
                                <div className="label__content-wrapper">
                                    <div className="flex items-center gap-2">
                                        <PersonIcon fontSize="small" color="action" />
                                        <span className="label__subtitle">Generated By</span>
                                    </div>
                                    <h6 className="label__title">{reportData.generatedBy}</h6>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <div className="label__content-wrapper">
                                    <div className="flex items-center gap-2">
                                        <CalendarTodayIcon fontSize="small" color="action" />
                                        <span className="label__subtitle">Generation Date</span>
                                    </div>
                                    <h6 className="label__title">{reportData.generationDate}</h6>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <div className="label__content-wrapper">
                                    <div className="flex items-center gap-2">
                                        <PeopleIcon fontSize="small" color="action" />
                                        <span className="label__subtitle">Total Employees</span>
                                    </div>
                                    <h6 className="label__title">{reportData.totalEmployees} employees</h6>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <div className="label__content-wrapper">
                                    <div className="flex items-center gap-2">
                                        <TimerIcon fontSize="small" color="action" />
                                        <span className="label__subtitle">File Size</span>
                                    </div>
                                    <h6 className="label__title">{reportData.fileSize}</h6>
                                </div>
                            </Grid>
                        </Grid>

                        <Divider className="col-span-12 my-4" />

                        <div className="col-span-12">
                            <Typography variant="subtitle1" className="font-medium mb-3">
                                Attendance Breakdown
                            </Typography>
                            <Paper variant="outlined" className="p-4">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <CheckCircleIcon className="text-green-600 mb-2" fontSize="large" />
                                            <Typography variant="h5" className="font-bold text-green-700">
                                                {reportData.presentCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Present
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={presentPercentage}
                                                className="mt-2 h-2 rounded"
                                                color="success"
                                            />
                                            <Typography variant="caption" className="mt-1 block">
                                                {presentPercentage.toFixed(1)}%
                                            </Typography>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <div className="text-center p-3 bg-red-50 rounded-lg">
                                            <WarningIcon className="text-red-600 mb-2" fontSize="large" />
                                            <Typography variant="h5" className="font-bold text-red-700">
                                                {reportData.absentCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Absent
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={absentPercentage}
                                                className="mt-2 h-2 rounded"
                                                color="error"
                                            />
                                            <Typography variant="caption" className="mt-1 block">
                                                {absentPercentage.toFixed(1)}%
                                            </Typography>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                            <AccessTimeIcon className="text-yellow-600 mb-2" fontSize="large" />
                                            <Typography variant="h5" className="font-bold text-yellow-700">
                                                {reportData.lateCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Late Arrivals
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={latePercentage}
                                                className="mt-2 h-2 rounded"
                                                color="warning"
                                            />
                                            <Typography variant="caption" className="mt-1 block">
                                                {latePercentage.toFixed(1)}%
                                            </Typography>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <CalendarTodayIcon className="text-blue-600 mb-2" fontSize="large" />
                                            <Typography variant="h5" className="font-bold text-blue-700">
                                                {reportData.leaveCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                On Leave
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={leavePercentage}
                                                className="mt-2 h-2 rounded"
                                                color="info"
                                            />
                                            <Typography variant="caption" className="mt-1 block">
                                                {leavePercentage.toFixed(1)}%
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </div>

                        <Divider className="col-span-12 my-4" />

                        <div className="col-span-12">
                            <Typography variant="subtitle1" className="font-medium mb-3">
                                Performance Metrics
                            </Typography>
                            <Paper variant="outlined" className="p-3">
                                <Grid container spacing={2}>
                                    {sampleMetrics.map((metric: { label: string; value: string; change?: number }, index: number) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Paper className="p-3" elevation={0}>
                                                <Typography variant="body2" color="text.secondary" className="mb-1">
                                                    {metric.label}
                                                </Typography>
                                                <div className="flex items-center justify-between">
                                                    <Typography variant="h6" className="font-semibold">
                                                        {metric.value}
                                                    </Typography>
                                                    {metric.change !== undefined && (
                                                        <Chip
                                                            label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                                                            color={metric.change > 0 ? "success" : "error"}
                                                            size="small"
                                                            icon={metric.change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                                        />
                                                    )}
                                                </div>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </div>

                        <Divider className="col-span-12 my-4" />

                        <div className="col-span-12">
                            <Typography variant="subtitle1" className="font-medium mb-3">
                                Report Description
                            </Typography>
                            <Box className="p-3 bg-gray-50 rounded-lg">
                                <Typography variant="body2">
                                    {reportData.description ||
                                        `This ${reportData.reportType.toLowerCase()} attendance report covers ${reportData.totalEmployees} employees for the period ${reportData.period}. 
                    The overall attendance rate is ${reportData.attendanceRate}% with ${reportData.presentCount} employees present, 
                    ${reportData.absentCount} absent, ${reportData.lateCount} late arrivals, and ${reportData.leaveCount} on approved leave.`}
                                </Typography>
                            </Box>
                        </div>

                        {reportData.parameters && Object.keys(reportData.parameters).length > 0 && (
                            <>
                                <Divider className="col-span-12 my-4" />
                                <div className="col-span-12">
                                    <Typography variant="subtitle1" className="font-medium mb-3">
                                        Report Parameters
                                    </Typography>
                                    <Box className="p-3 bg-blue-50 rounded-lg">
                                        <Grid container spacing={2}>
                                            {Object.entries(reportData.parameters).map(([key, value], index) => (
                                                <Grid item xs={12} md={6} key={index}>
                                                    <Typography variant="body2">
                                                        <strong>{key}:</strong> {String(value)}
                                                    </Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </div>
                            </>
                        )}

                        <Divider className="col-span-12 my-4" />

                        <div className="col-span-12">
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownload}
                                >
                                    Download Report
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<PictureAsPdfIcon />}
                                    onClick={handleDownload}
                                >
                                    Download PDF
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="info"
                                    startIcon={<ShareIcon />}
                                    onClick={handleShare}
                                >
                                    Share Report
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<PeopleIcon />}
                                    onClick={() => alert("Exporting to HR system...")}
                                >
                                    Export to HR System
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => alert("Sending to department heads...")}
                                >
                                    Send to Managers
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AttendanceReportDetailsModal;