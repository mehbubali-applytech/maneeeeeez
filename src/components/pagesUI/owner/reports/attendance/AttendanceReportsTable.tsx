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
import { Checkbox } from "@mui/material";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import AttendanceReportDetailsModal from "./AttendanceReportDetailsModal";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Define Attendance Report interface
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
  description?: string;
  keyMetrics?: Array<{label: string; value: string; change?: number}>;
  [key: string]: any;
}

// Mock data
const attendanceReportsData: IAttendanceReport[] = [
  {
    id: 1,
    reportName: "Daily Attendance Report",
    reportType: "Daily",
    period: "March 28, 2024",
    generatedBy: "HR Department",
    generationDate: "2024-03-28",
    status: "Complete",
    fileSize: "2.1 MB",
    totalEmployees: 1245,
    presentCount: 1180,
    absentCount: 45,
    lateCount: 15,
    earlyLeaveCount: 5,
    leaveCount: 50,
    averageHours: 8.2,
    overtimeHours: 125,
    attendanceRate: 94.8
  },
  {
    id: 2,
    reportName: "Weekly Attendance Summary",
    reportType: "Weekly",
    period: "Week 12, 2024",
    generatedBy: "John Smith",
    generationDate: "2024-03-29",
    status: "Complete",
    fileSize: "3.5 MB",
    totalEmployees: 1245,
    presentCount: 11580,
    absentCount: 285,
    lateCount: 95,
    earlyLeaveCount: 35,
    leaveCount: 320,
    averageHours: 8.1,
    overtimeHours: 680,
    attendanceRate: 95.6
  },
  {
    id: 3,
    reportName: "Monthly Attendance Analysis",
    reportType: "Monthly",
    period: "March 2024",
    generatedBy: "Sarah Johnson",
    generationDate: "2024-04-01",
    status: "Complete",
    fileSize: "5.8 MB",
    totalEmployees: 1245,
    presentCount: 26100,
    absentCount: 940,
    lateCount: 310,
    earlyLeaveCount: 120,
    leaveCount: 680,
    averageHours: 8.2,
    overtimeHours: 2850,
    attendanceRate: 96.2
  },
  {
    id: 4,
    reportName: "Quarterly Attendance Review",
    reportType: "Quarterly",
    period: "Q1 2024",
    generatedBy: "Mike Williams",
    generationDate: "2024-04-02",
    status: "Complete",
    fileSize: "8.2 MB",
    totalEmployees: 1245,
    presentCount: 78300,
    absentCount: 2820,
    lateCount: 940,
    earlyLeaveCount: 360,
    leaveCount: 2040,
    averageHours: 8.15,
    overtimeHours: 8550,
    attendanceRate: 96.5
  },
  {
    id: 5,
    reportName: "Department-wise Attendance",
    reportType: "Department",
    period: "March 2024",
    generatedBy: "Emily Brown",
    generationDate: "2024-03-30",
    status: "Complete",
    fileSize: "4.5 MB",
    totalEmployees: 1245,
    presentCount: 26100,
    absentCount: 940,
    lateCount: 310,
    earlyLeaveCount: 120,
    leaveCount: 680,
    averageHours: 8.2,
    overtimeHours: 2850,
    attendanceRate: 96.2
  },
  {
    id: 6,
    reportName: "Late Arrival Analysis",
    reportType: "Late Arrivals",
    period: "March 2024",
    generatedBy: "David Miller",
    generationDate: "2024-04-03",
    status: "In Progress",
    fileSize: "1.8 MB",
    totalEmployees: 1245,
    presentCount: 0,
    absentCount: 0,
    lateCount: 310,
    earlyLeaveCount: 0,
    leaveCount: 0,
    averageHours: 0,
    overtimeHours: 0,
    attendanceRate: 0
  },
  {
    id: 7,
    reportName: "Absenteeism Report",
    reportType: "Absenteeism",
    period: "March 2024",
    generatedBy: "Lisa Taylor",
    generationDate: "2024-03-25",
    status: "Complete",
    fileSize: "2.5 MB",
    totalEmployees: 1245,
    presentCount: 0,
    absentCount: 940,
    lateCount: 0,
    earlyLeaveCount: 0,
    leaveCount: 0,
    averageHours: 0,
    overtimeHours: 0,
    attendanceRate: 0
  },
  {
    id: 8,
    reportName: "Overtime Analysis Report",
    reportType: "Overtime",
    period: "March 2024",
    generatedBy: "Robert Davis",
    generationDate: "2024-03-28",
    status: "Complete",
    fileSize: "3.2 MB",
    totalEmployees: 1245,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    earlyLeaveCount: 0,
    leaveCount: 0,
    averageHours: 0,
    overtimeHours: 2850,
    attendanceRate: 0
  },
  {
    id: 9,
    reportName: "Leave Utilization Report",
    reportType: "Leave",
    period: "Q1 2024",
    generatedBy: "Amanda Wilson",
    generationDate: "2024-04-01",
    status: "Failed",
    fileSize: "N/A",
    totalEmployees: 1245,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    earlyLeaveCount: 0,
    leaveCount: 2040,
    averageHours: 0,
    overtimeHours: 0,
    attendanceRate: 0
  },
  {
    id: 10,
    reportName: "Employee Attendance History",
    reportType: "Employee",
    period: "Jan-Mar 2024",
    generatedBy: "Thomas Anderson",
    generationDate: "2024-03-27",
    status: "Complete",
    fileSize: "6.5 MB",
    totalEmployees: 1245,
    presentCount: 78300,
    absentCount: 2820,
    lateCount: 940,
    earlyLeaveCount: 360,
    leaveCount: 2040,
    averageHours: 8.15,
    overtimeHours: 8550,
    attendanceRate: 96.5
  }
];

// Table head cells
const attendanceReportHeadCells = [
  { id: "reportName", label: "Report Name" },
  { id: "reportType", label: "Type" },
  { id: "period", label: "Period" },
  { id: "generatedBy", label: "Generated By" },
  { id: "generationDate", label: "Date" },
  { id: "status", label: "Status" },
  { id: "totalEmployees", label: "Employees" },
  { id: "attendanceRate", label: "Rate" },
  { id: "fileSize", label: "File Size" },
  { id: "averageHours", label: "Avg Hours" },
];

interface AttendanceReportsTableProps {
  reportType?: string;
  period?: string;
  dateRange?: { start: string; end: string };
}

const AttendanceReportsTable: React.FC<AttendanceReportsTableProps> = ({ 
  reportType = "all",
  period = "all",
  dateRange 
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<IAttendanceReport | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
  // Filter data based on report type, period, and date range
  const filteredData = attendanceReportsData.filter(report => {
    // Filter by report type
    if (reportType !== "all" && report.reportType !== reportType) {
      return false;
    }
    
    // Filter by period if specified
    if (period !== "all") {
      const periodLower = report.period.toLowerCase();
      if (period === "daily" && !periodLower.includes("march") && !periodLower.includes("daily")) {
        return false;
      }
      if (period === "weekly" && !periodLower.includes("week")) {
        return false;
      }
      if (period === "monthly" && !periodLower.includes("march")) {
        return false;
      }
      if (period === "quarterly" && !periodLower.includes("q1")) {
        return false;
      }
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
  } = useMaterialTableHook<IAttendanceReport>(filteredData, 10);

  // Helper function for report type badge
  const getReportTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "daily":
        return "bg-success";
      case "weekly":
        return "bg-primary";
      case "monthly":
        return "bg-info";
      case "quarterly":
        return "bg-warning";
      case "yearly":
        return "bg-danger";
      case "department":
        return "bg-secondary";
      case "employee":
        return "dark-badge";
      case "late arrivals":
        return "bg-warning";
      case "absenteeism":
        return "bg-danger";
      case "overtime":
        return "bg-info";
      case "leave":
        return "bg-primary";
      default:
        return "default-badge";
    }
  };

  const handleDownloadReport = (report: IAttendanceReport) => {
    console.log(`Downloading attendance report: ${report.reportName}`);
    alert(`Downloading ${report.reportName}...`);
  };

  const handleViewReport = (report: IAttendanceReport) => {
    setSelectedReport(report);
    setDetailsModalOpen(true);
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 95) return "text-success";
    if (rate >= 90) return "text-warning";
    return "text-danger";
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
                      <TableRow className="table__title">
                        <TableCell padding="checkbox">
                          <Checkbox
                            className="custom-checkbox checkbox-small"
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                            checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                            onChange={(e) => handleSelectAllClick(e.target.checked, filteredRows)}
                            size="small"
                          />
                        </TableCell>
                        {attendanceReportHeadCells.map((headCell) => (
                          <TableCell
                            className="table__title"
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
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    
                    <TableBody className="table__body">
                      {paginatedRows.map((row, index) => {
                        const statusClass = getTableStatusClass(row.status);
                        const typeClass = getReportTypeClass(row.reportType);
                        const rateColor = getAttendanceRateColor(row.attendanceRate);
                        
                        return (
                          <TableRow
                            key={row.id}
                            selected={selected.includes(index)}
                            onClick={() => handleClick(index)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                className="custom-checkbox checkbox-small"
                                checked={selected.includes(index)}
                                size="small"
                                onChange={() => handleClick(index)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <DescriptionIcon className="mr-2 text-gray-500" fontSize="small" />
                                {row.reportName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`bd-badge ${typeClass}`}>
                                {row.reportType}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <CalendarTodayIcon className="mr-1 text-gray-500" fontSize="small" />
                                {row.period}
                              </div>
                            </TableCell>
                            <TableCell>{row.generatedBy}</TableCell>
                            <TableCell>{row.generationDate}</TableCell>
                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {row.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <PeopleIcon className="mr-1 text-gray-500" fontSize="small" />
                                <span className="font-semibold">{row.totalEmployees}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={`font-bold ${rateColor}`}>
                                {row.attendanceRate > 0 ? `${row.attendanceRate}%` : '-'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{row.fileSize}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AccessTimeIcon className="mr-1 text-gray-500" fontSize="small" />
                                <span className="font-semibold">{row.averageHours > 0 ? `${row.averageHours}h` : '-'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon download"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewReport(row);
                                  }}
                                  title="View Report"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadReport(row);
                                  }}
                                  title="Download Report"
                                >
                                  <DownloadIcon fontSize="small" />
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(row.id);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Report"
                                >
                                  <i className="fa-regular fa-trash"></i>
                                </button>
                                {row.status === "Complete" && (
                                  <button
                                    type="button"
                                    className="table__icon pdf"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadReport(row);
                                    }}
                                    title="Download PDF"
                                  >
                                    <PictureAsPdfIcon fontSize="small" />
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
          </div>
        </div>
      </div>

      {detailsModalOpen && selectedReport && (
        <AttendanceReportDetailsModal
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

export default AttendanceReportsTable;