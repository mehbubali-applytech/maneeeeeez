"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Pagination from "@mui/material/Pagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { Checkbox, Chip, LinearProgress, Typography } from "@mui/material";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import PerformanceReportDetailsModal from "./PerformanceReportDetailsModal";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import ScoreIcon from "@mui/icons-material/Score";
import GroupIcon from "@mui/icons-material/Group";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { IPerformanceReport } from "./performance.interface";

// Mock data
const performanceReportsData: IPerformanceReport[] = [
    {
        id: 1,
        reportName: "Q1 Performance Review Summary",
        reportType: "Quarterly Review",
        generatedBy: "Sarah Johnson",
        generationDate: "2024-04-05",
        evaluationPeriod: "Q1 2024",
        status: "Complete",
        fileSize: "3.2 MB",
        employeeCount: 156,
        department: "All",
        averageScore: 4.2,
        downloadCount: 24,
        description: "Comprehensive performance review for Q1 2024 across all departments",
        parameters: {
            "Rating Scale": "5-Point Scale",
            "Include 360 Feedback": "Yes",
            "Minimum Employee Tenure": "3 months",
            "Reviewers per Employee": "3"
        },
        keyMetrics: [
            { label: "Overall Performance", value: "4.2/5.0", change: 5, target: 4.5 },
            { label: "Goal Achievement", value: "87%", change: 8 },
            { label: "Top Performers", value: 15, change: 12 },
            { label: "Development Needed", value: 8, change: -3 },
        ]
    },
    {
        id: 2,
        reportName: "Annual Performance Assessment 2023",
        reportType: "Annual Review",
        generatedBy: "Michael Chen",
        generationDate: "2024-01-15",
        evaluationPeriod: "2023",
        status: "Complete",
        fileSize: "4.8 MB",
        employeeCount: 245,
        department: "All",
        averageScore: 4.1,
        downloadCount: 18,
        description: "Annual performance assessment for fiscal year 2023",
        parameters: {
            "Rating Scale": "5-Point Scale",
            "Include Self-Assessment": "Yes",
            "Manager Review Required": "Yes",
            "Calibration Session": "Completed"
        }
    },
    {
        id: 3,
        reportName: "360 Feedback - Sales Department",
        reportType: "360 Feedback",
        generatedBy: "Robert Kim",
        generationDate: "2024-03-28",
        evaluationPeriod: "Q1 2024",
        status: "In Progress",
        fileSize: "2.1 MB",
        employeeCount: 45,
        department: "Sales",
        averageScore: 4.3,
        downloadCount: 8,
        description: "360-degree feedback report for Sales department leadership",
        parameters: {
            "Reviewers per Employee": "5",
            "Anonymous Feedback": "Yes",
            "Department": "Sales",
            "Response Rate": "92%"
        }
    },
    {
        id: 4,
        reportName: "Leadership Competency Assessment",
        reportType: "Competency Assessment",
        generatedBy: "Jennifer Lee",
        generationDate: "2024-03-20",
        evaluationPeriod: "Q1 2024",
        status: "Complete",
        fileSize: "2.8 MB",
        employeeCount: 32,
        department: "Leadership",
        averageScore: 4.4,
        downloadCount: 12,
        description: "Competency assessment for leadership team focusing on core competencies",
        parameters: {
            "Competency Model": "Leadership Framework v2.0",
            "Assessment Method": "Multi-rater",
            "Gap Analysis": "Included",
            "Development Recommendations": "Yes"
        }
    },
    {
        id: 5,
        reportName: "Q4 Goal Achievement Report",
        reportType: "Goal Tracking",
        generatedBy: "David Wilson",
        generationDate: "2024-01-10",
        evaluationPeriod: "Q4 2023",
        status: "Complete",
        fileSize: "1.9 MB",
        employeeCount: 189,
        department: "All",
        averageScore: 3.9,
        downloadCount: 15,
        description: "Goal achievement tracking and analysis for Q4 2023",
        parameters: {
            "Goal Categories": "Individual, Team, Company",
            "Tracking Period": "October - December 2023",
            "Success Criteria": "70% achievement threshold",
            "Alignment Check": "Completed"
        }
    },
    {
        id: 6,
        reportName: "Engineering Performance Scorecard",
        reportType: "Performance Scorecard",
        generatedBy: "Alex Patel",
        generationDate: "2024-04-02",
        evaluationPeriod: "Q1 2024",
        status: "Pending",
        fileSize: "2.5 MB",
        employeeCount: 78,
        department: "Engineering",
        downloadCount: 5,
        description: "Performance scorecard for engineering teams with KPIs and metrics",
        parameters: {
            "KPI Categories": "Technical, Agile, Quality, Collaboration",
            "Scoring Method": "Weighted Average",
            "Benchmark Comparison": "Industry Standard",
            "Team Level Analysis": "Included"
        }
    },
    {
        id: 7,
        reportName: "Talent Review - High Potentials",
        reportType: "Talent Review",
        generatedBy: "Maria Garcia",
        generationDate: "2024-03-15",
        evaluationPeriod: "Q1 2024",
        status: "Complete",
        fileSize: "1.7 MB",
        employeeCount: 28,
        department: "All",
        averageScore: 4.7,
        downloadCount: 9,
        description: "Talent review focusing on high-potential employees and succession planning",
        parameters: {
            "Review Panel": "Executive Committee",
            "Assessment Criteria": "9-Box Grid",
            "Succession Plans": "Generated",
            "Development Actions": "Assigned"
        }
    },
    {
        id: 8,
        reportName: "Development Plan Compliance",
        reportType: "Development Plan",
        generatedBy: "Thomas Brown",
        generationDate: "2024-04-01",
        evaluationPeriod: "Q1 2024",
        status: "Failed",
        fileSize: "N/A",
        employeeCount: 0,
        department: "All",
        downloadCount: 0,
        description: "Development plan completion and compliance tracking report",
        parameters: {
            "Compliance Deadline": "March 31, 2024",
            "Required Completion": "100%",
            "Reminder Frequency": "Weekly",
            "Escalation Process": "Enabled"
        }
    },
    {
        id: 9,
        reportName: "Marketing Team Performance Analysis",
        reportType: "Quarterly Review",
        generatedBy: "Lisa Wong",
        generationDate: "2024-03-30",
        evaluationPeriod: "Q1 2024",
        status: "Complete",
        fileSize: "2.3 MB",
        employeeCount: 42,
        department: "Marketing",
        averageScore: 4.0,
        downloadCount: 11,
        description: "Detailed performance analysis for marketing department with campaign metrics",
        parameters: {
            "Campaign Performance": "Included",
            "ROI Analysis": "Yes",
            "Creative Assessment": "Included",
            "Benchmark Comparison": "Industry Average"
        }
    },
    {
        id: 10,
        reportName: "Executive Leadership Assessment",
        reportType: "Leadership Assessment",
        generatedBy: "CEO Office",
        generationDate: "2024-03-25",
        evaluationPeriod: "2023",
        status: "Complete",
        fileSize: "1.5 MB",
        employeeCount: 12,
        department: "Executive",
        averageScore: 4.6,
        downloadCount: 6,
        description: "Executive leadership assessment with board-level insights",
        parameters: {
            "Confidentiality Level": "Highest",
            "Board Review": "Required",
            "External Benchmarks": "Included",
            "Compensation Linkage": "Yes"
        }
    },
    {
        id: 11,
        reportName: "New Hire Performance Review",
        reportType: "Quarterly Review",
        generatedBy: "HR Analytics",
        generationDate: "2024-04-10",
        evaluationPeriod: "Q1 2024",
        status: "Complete",
        fileSize: "1.8 MB",
        employeeCount: 67,
        department: "All",
        averageScore: 3.8,
        downloadCount: 7,
        description: "Performance review for employees hired within the last 6 months",
        parameters: {
            "Hire Date Range": "September 2023 - February 2024",
            "Probation Period": "6 months",
            "Manager Feedback": "Required",
            "Onboarding Impact": "Assessed"
        }
    },
    {
        id: 12,
        reportName: "Remote Work Performance Analysis",
        reportType: "Analytics",
        generatedBy: "Workplace Analytics",
        generationDate: "2024-03-22",
        evaluationPeriod: "Q1 2024",
        status: "Complete",
        fileSize: "3.5 MB",
        employeeCount: 145,
        department: "All",
        averageScore: 4.1,
        downloadCount: 14,
        description: "Analysis of performance metrics for remote vs. in-office employees",
        parameters: {
            "Work Location": "Hybrid, Remote, Office",
            "Productivity Metrics": "Multiple",
            "Engagement Scores": "Included",
            "Recommendations": "Generated"
        }
    }
];

// Table head cells
const performanceReportHeadCells = [
    { id: "reportName", label: "Report Name" },
    { id: "reportType", label: "Type" },
    { id: "department", label: "Department" },
    { id: "generatedBy", label: "Generated By" },
    { id: "generationDate", label: "Date" },
    { id: "evaluationPeriod", label: "Period" },
    { id: "employeeCount", label: "Employees" },
    { id: "averageScore", label: "Avg. Score" },
    { id: "status", label: "Status" },
    { id: "downloadCount", label: "Downloads" },
];

interface PerformanceReportsTableProps {
    reportType?: string;
    period?: string;
    dateRange?: { start: string; end: string };
    department?: string;
}

const PerformanceReportsTable: React.FC<PerformanceReportsTableProps> = ({
    reportType = "all",
    period = "all",
    dateRange,
    department = "all"
}) => {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<IPerformanceReport | null>(null);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    // Filter data based on filters
    const filteredData = performanceReportsData.filter(report => {
        // Filter by report type
        if (reportType !== "all" && report.reportType !== reportType) {
            return false;
        }

        // Filter by period
        if (period !== "all" && report.evaluationPeriod !== period) {
            return false;
        }

        // Filter by department
        if (department !== "all" && report.department !== department) {
            return false;
        }

        // Filter by date range if provided
        if (dateRange) {
            const reportDate = new Date(report.generationDate);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            return reportDate >= startDate && reportDate <= endDate;
        }

        return true;
    });

    const {
        order,
        orderBy,
        selected,
        page,
        rowsPerPage,
        searchQuery,
        paginatedRows,
        filteredRows,
        handleDelete,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSearchChange,
    } = useMaterialTableHook<IPerformanceReport>(filteredData, 10);

    const getReportTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "quarterly review":
                return "success";
            case "annual review":
                return "primary";
            case "360 feedback":
                return "info";
            case "competency assessment":
                return "warning";
            case "goal tracking":
                return "error";
            case "leadership assessment":
                return "secondary";
            case "performance scorecard":
                return "default";
            case "talent review":
                return "success";
            case "development plan":
                return "primary";
            case "analytics":
                return "info";
            default:
                return "default";
        }
    };

    const getScoreColor = (score?: number) => {
        if (!score) return "text-gray-500";
        if (score >= 4.5) return "text-success";
        if (score >= 3.5) return "text-info";
        if (score >= 2.5) return "text-warning";
        return "text-error";
    };

    const getScoreProgress = (score?: number) => {
        if (!score) return 0;
        return (score / 5) * 100;
    };

    const handleDownloadReport = async (report: IPerformanceReport) => {
        setIsDownloading(report.id);

        // Simulate download delay
        setTimeout(() => {
            console.log(`Downloading performance report: ${report.reportName}`);
            alert(`Downloading ${report.reportName}...`);
            setIsDownloading(null);
        }, 1000);
    };

    const handleDownloadPDF = async (report: IPerformanceReport) => {
        setIsDownloading(report.id);

        // Simulate PDF generation delay
        setTimeout(() => {
            console.log(`Generating PDF for: ${report.reportName}`);
            alert(`Generating PDF for ${report.reportName}...`);
            setIsDownloading(null);
        }, 1500);
    };

    const handleViewReport = (report: IPerformanceReport) => {
        setSelectedReport(report);
        setDetailsModalOpen(true);
    };

    const handleExportToHRIS = (report: IPerformanceReport) => {
        alert(`Exporting ${report.reportName} to HRIS system...`);
    };

    const handleShareReport = (report: IPerformanceReport) => {
        const email = prompt("Enter email address to share with:");
        if (email) {
            alert(`Sharing ${report.reportName} with ${email}...`);
        }
    };

    return (
        <>
            <div className="col-span-12">
                <div className="card__wrapper">
                    <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
                        <TableControls
                            rowsPerPage={rowsPerPage}
                            searchQuery={searchQuery}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                            handleSearchChange={handleSearchChange}
                        />

                        <Box sx={{ width: "100%" }} className="table-responsive">
                            <Paper sx={{ width: "100%", mb: 2 }}>
                                <TableContainer className="table mb-[20px] hover multiple_tables w-full">
                                    <Table aria-labelledby="tableTitle" className="whitespace-nowrap">
                                        <TableHead>
                                            <TableRow className="table__title bg-gray-50">
                                                <TableCell padding="checkbox" className="!font-semibold">
                                                    <Checkbox
                                                        className="custom-checkbox checkbox-small"
                                                        color="primary"
                                                        indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                                                        checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                                                        onChange={(e) => handleSelectAllClick(e.target.checked, filteredRows)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                {performanceReportHeadCells.map((headCell) => (
                                                    <TableCell
                                                        className="table__title !font-semibold"
                                                        key={headCell.id}
                                                        sortDirection={orderBy === headCell.id ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === headCell.id}
                                                            direction={orderBy === headCell.id ? order : "asc"}
                                                            onClick={() => handleRequestSort(headCell.id)}
                                                        >
                                                            {headCell.label}
                                                            {orderBy === headCell.id ? (
                                                                <Box component="span" sx={visuallyHidden}>
                                                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                                                </Box>
                                                            ) : null}
                                                        </TableSortLabel>
                                                    </TableCell>
                                                ))}
                                                <TableCell className="!font-semibold">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody className="table__body">
                                            {paginatedRows.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={performanceReportHeadCells.length + 2} className="text-center py-8">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <DescriptionIcon className="text-gray-400 mb-2" fontSize="large" />
                                                            <Typography variant="body1" className="text-gray-600">
                                                                No performance reports found
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Try adjusting your filters or generate a new report
                                                            </Typography>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                paginatedRows.map((row, index) => {
                                                    const statusClass = getTableStatusClass(row.status);
                                                    const typeClass = getReportTypeColor(row.reportType);
                                                    const scoreColor = getScoreColor(row.averageScore);
                                                    const scoreProgress = getScoreProgress(row.averageScore);
                                                    const isRowSelected = selected.includes(index);

                                                    return (
                                                        <TableRow
                                                            key={row.id}
                                                            selected={isRowSelected}
                                                            onClick={() => handleClick(index)}
                                                            className={`hover:bg-blue-50 ${isRowSelected ? 'bg-blue-50' : ''}`}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    className="custom-checkbox checkbox-small"
                                                                    checked={isRowSelected}
                                                                    size="small"
                                                                    onChange={() => handleClick(index)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center">
                                                                    <DescriptionIcon className="mr-2 text-gray-500" fontSize="small" />
                                                                    <div>
                                                                        <Typography variant="body2" className="font-medium">
                                                                            {row.reportName}
                                                                        </Typography>
                                                                        {row.fileSize !== "N/A" && (
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {row.fileSize}
                                                                            </Typography>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={row.reportType}
                                                                    size="small"
                                                                    color={getReportTypeColor(row.reportType)}
                                                                    variant="filled"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center">
                                                                    <GroupIcon className="mr-1 text-gray-400" fontSize="small" />
                                                                    <Typography variant="body2">
                                                                        {row.department}
                                                                    </Typography>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {row.generatedBy}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" className="font-medium">
                                                                    {row.generationDate}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={row.evaluationPeriod}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="primary"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center">
                                                                    <GroupIcon className="mr-2 text-gray-400" fontSize="small" />
                                                                    <div>
                                                                        <Typography variant="body2" className="font-semibold">
                                                                            {row.employeeCount}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            employees
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {row.averageScore ? (
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <ScoreIcon className={`mr-1 ${scoreColor}`} fontSize="small" />
                                                                            <Typography variant="body2" className={`font-semibold ${scoreColor}`}>
                                                                                {row.averageScore.toFixed(1)}/5.0
                                                                            </Typography>
                                                                        </div>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={scoreProgress}
                                                                            className="h-1.5 rounded"
                                                                            color={row.averageScore >= 4 ? "success" : row.averageScore >= 3 ? "info" : "warning"}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        N/A
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={row.status}
                                                                    size="small"
                                                                    className={statusClass}
                                                                    variant="filled"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center">
                                                                    <DownloadIcon className="mr-1 text-gray-400" fontSize="small" />
                                                                    <Typography variant="body2" className="font-semibold">
                                                                        {row.downloadCount}
                                                                    </Typography>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="table__icon-box">
                                                                <div className="flex items-center justify-start gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="table__icon view p-1.5 hover:bg-blue-100 rounded"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleViewReport(row);
                                                                        }}
                                                                        title="View Report Details"
                                                                    >
                                                                        <i className="fa-regular fa-eye text-blue-600"></i>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="table__icon download p-1.5 hover:bg-green-100 rounded"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDownloadReport(row);
                                                                        }}
                                                                        title="Download Report"
                                                                        disabled={isDownloading === row.id}
                                                                    >
                                                                        {isDownloading === row.id ? (
                                                                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                                                        ) : (
                                                                            <DownloadIcon fontSize="small" className="text-green-600" />
                                                                        )}
                                                                    </button>
                                                                    {row.status === "Complete" && (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                className="table__icon pdf p-1.5 hover:bg-red-100 rounded"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDownloadPDF(row);
                                                                                }}
                                                                                title="Download PDF"
                                                                                disabled={isDownloading === row.id}
                                                                            >
                                                                                <PictureAsPdfIcon fontSize="small" className="text-red-600" />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="table__icon share p-1.5 hover:bg-purple-100 rounded"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleShareReport(row);
                                                                                }}
                                                                                title="Share Report"
                                                                            >
                                                                                <i className="fa-regular fa-share text-purple-600"></i>
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="table__icon export p-1.5 hover:bg-teal-100 rounded"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleExportToHRIS(row);
                                                                                }}
                                                                                title="Export to HRIS"
                                                                            >
                                                                                <i className="fa-regular fa-upload text-teal-600"></i>
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    <button
                                                                        className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setDeleteId(row.id);
                                                                            setModalDeleteOpen(true);
                                                                        }}
                                                                        title="Delete Report"
                                                                    >
                                                                        <i className="fa-regular fa-trash text-red-600"></i>
                                                                    </button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>

                        <Box className="table-search-box mt-[30px]" sx={{ p: 2 }}>
                            <Box>
                                {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                                    page * rowsPerPage,
                                    filteredRows.length
                                )} of ${filteredRows.length} entries`}
                                {(reportType !== "all" || period !== "all") && (
                                    <span className="ml-2 text-sm text-gray-600">
                                        (Filtered: {reportType !== "all" ? reportType : ""} {period !== "all" ? `• ${period}` : ""})
                                    </span>
                                )}
                            </Box>
                            <Pagination
                                count={Math.ceil(filteredRows.length / rowsPerPage)}
                                page={page}
                                onChange={(e, value) => handleChangePage(value)}
                                variant="outlined"
                                shape="rounded"
                                className="manaz-pagination-button"
                            />
                        </Box>

                        {/* Bulk Actions Bar */}
                        {selected.length > 0 && (
                            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
                                <Typography variant="body2">
                                    {selected.length} report{selected.length > 1 ? 's' : ''} selected
                                </Typography>
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
                                        onClick={() => {
                                            const selectedReports = selected.map(index => filteredRows[index]);
                                            alert(`Downloading ${selected.length} reports...`);
                                            console.log('Selected reports:', selectedReports);
                                        }}
                                    >
                                        <DownloadIcon fontSize="small" className="mr-1" />
                                        Download Selected
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                                        onClick={() => {
                                            if (confirm(`Are you sure you want to delete ${selected.length} report${selected.length > 1 ? 's' : ''}?`)) {
                                                selected.forEach(index => {
                                                    const report = filteredRows[index];
                                                    if (report) handleDelete(report.id);
                                                });
                                            }
                                        }}
                                    >
                                        <i className="fa-regular fa-trash mr-1"></i>
                                        Delete Selected
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
                                        onClick={() => handleSelectAllClick(false, [])}
                                    >
                                        Clear Selection
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Details Modal */}
            {detailsModalOpen && selectedReport && (
                <PerformanceReportDetailsModal
                    open={detailsModalOpen}
                    setOpen={setDetailsModalOpen}
                    reportData={selectedReport}
                />
            )}

            {modalDeleteOpen && (
               <DeleteModal
  open={modalDeleteOpen}
  setOpen={setModalDeleteOpen}
  onConfirm={() => handleDelete(deleteId)}
/>

            )}
        </>
    );
};

export default PerformanceReportsTable;