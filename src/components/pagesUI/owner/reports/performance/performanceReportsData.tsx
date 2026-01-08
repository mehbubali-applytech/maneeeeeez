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
import PerformanceReportDetailsModal from "./PerformanceReportDetailsModal";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import ScoreIcon from "@mui/icons-material/Score";
import GroupIcon from "@mui/icons-material/Group";
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
    downloadCount: 24
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
    downloadCount: 18
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
    downloadCount: 8
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
    downloadCount: 12
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
    downloadCount: 15
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
    downloadCount: 5
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
    downloadCount: 9
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
    downloadCount: 0
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
    downloadCount: 11
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
    downloadCount: 6
  }
];

// Table head cells
const performanceReportHeadCells = [
  { id: "reportName", label: "Report Name" },
  { id: "reportType", label: "Type" },
  { id: "generatedBy", label: "Generated By" },
  { id: "generationDate", label: "Date" },
  { id: "evaluationPeriod", label: "Period" },
  { id: "department", label: "Department" },
  { id: "employeeCount", label: "Employees" },
  { id: "averageScore", label: "Avg. Score" },
  { id: "status", label: "Status" },
  { id: "downloadCount", label: "Downloads" },
];

interface PerformanceReportsTableProps {
  reportType?: string;
  period?: string;
  dateRange?: { start: string; end: string };
}

const PerformanceReportsTable: React.FC<PerformanceReportsTableProps> = ({ 
  reportType = "all",
  period = "all",
  dateRange 
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<IPerformanceReport | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
  // Filter data based on report type, period, and date range
  const filteredData = performanceReportsData.filter(report => {
    // Filter by report type
    if (reportType !== "all" && report.reportType !== reportType) {
      return false;
    }
    
    // Filter by period
    if (period !== "all" && report.evaluationPeriod !== period) {
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

  const getReportTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "quarterly review":
        return "bg-success";
      case "annual review":
        return "bg-primary";
      case "360 feedback":
        return "bg-info";
      case "competency assessment":
        return "bg-warning";
      case "goal tracking":
        return "bg-danger";
      case "leadership assessment":
        return "bg-secondary";
      case "performance scorecard":
        return "bg-dark";
      case "talent review":
        return "bg-success";
      case "development plan":
        return "bg-primary";
      default:
        return "default-badge";
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 4.5) return "text-success";
    if (score >= 3.5) return "text-info";
    if (score >= 2.5) return "text-warning";
    return "text-error";
  };

  const handleDownloadReport = (report: IPerformanceReport) => {
    console.log(`Downloading performance report: ${report.reportName}`);
    alert(`Downloading ${report.reportName}...`);
  };

  const handleViewReport = (report: IPerformanceReport) => {
    setSelectedReport(report);
    setDetailsModalOpen(true);
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
                        {performanceReportHeadCells.map((headCell) => (
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
                        const scoreColor = getScoreColor(row.averageScore);
                        
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
                            <TableCell>{row.generatedBy}</TableCell>
                            <TableCell>{row.generationDate}</TableCell>
                            <TableCell>{row.evaluationPeriod}</TableCell>
                            <TableCell>{row.department}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <GroupIcon className="mr-1 text-gray-500" fontSize="small" />
                                <span className="font-semibold">{row.employeeCount}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <ScoreIcon className="mr-1 text-gray-500" fontSize="small" />
                                <span className={`font-semibold ${scoreColor}`}>
                                  {row.averageScore ? `${row.averageScore.toFixed(1)}/5.0` : '-'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {row.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">{row.downloadCount}</span>
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