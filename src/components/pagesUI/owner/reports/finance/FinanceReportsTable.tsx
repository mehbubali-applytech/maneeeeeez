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
import FinanceReportDetailsModal from "./FinanceReportDetailsModal";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Define Finance Report interface
interface IFinanceReport {
  id: number;
  reportName: string;
  reportType: string;
  period: string;
  generatedBy: string;
  generationDate: string;
  status: string;
  fileSize: string;
  totalAmount: number;
  currency: string;
  recordCount: number;
  downloadCount: number;
  [key: string]: any;
}

// Mock data
const financeReportsData: IFinanceReport[] = [
  {
    id: 1,
    reportName: "Monthly Profit & Loss Statement",
    reportType: "P&L Statement",
    period: "March 2024",
    generatedBy: "John Doe",
    generationDate: "2024-04-01",
    status: "Complete",
    fileSize: "3.2 MB",
    totalAmount: 1250000,
    currency: "USD",
    recordCount: 450,
    downloadCount: 18
  },
  {
    id: 2,
    reportName: "Balance Sheet",
    reportType: "Balance Sheet",
    period: "Q1 2024",
    generatedBy: "Jane Smith",
    generationDate: "2024-03-31",
    status: "Complete",
    fileSize: "2.8 MB",
    totalAmount: 4500000,
    currency: "USD",
    recordCount: 320,
    downloadCount: 12
  },
  {
    id: 3,
    reportName: "Cash Flow Statement",
    reportType: "Cash Flow",
    period: "March 2024",
    generatedBy: "Mike Johnson",
    generationDate: "2024-04-02",
    status: "Pending",
    fileSize: "2.1 MB",
    totalAmount: 750000,
    currency: "USD",
    recordCount: 280,
    downloadCount: 5
  },
  {
    id: 4,
    reportName: "Accounts Receivable Aging",
    reportType: "AR Aging",
    period: "March 2024",
    generatedBy: "Sarah Wilson",
    generationDate: "2024-03-30",
    status: "Complete",
    fileSize: "1.8 MB",
    totalAmount: 450000,
    currency: "USD",
    recordCount: 150,
    downloadCount: 8
  },
  {
    id: 5,
    reportName: "Accounts Payable Aging",
    reportType: "AP Aging",
    period: "March 2024",
    generatedBy: "Robert Brown",
    generationDate: "2024-03-29",
    status: "Complete",
    fileSize: "1.5 MB",
    totalAmount: 320000,
    currency: "USD",
    recordCount: 120,
    downloadCount: 6
  },
  {
    id: 6,
    reportName: "Budget vs Actual Variance",
    reportType: "Budget Analysis",
    period: "Q1 2024",
    generatedBy: "Emily Davis",
    generationDate: "2024-04-03",
    status: "In Progress",
    fileSize: "2.5 MB",
    totalAmount: 0,
    currency: "USD",
    recordCount: 200,
    downloadCount: 3
  },
  {
    id: 7,
    reportName: "Tax Compliance Report",
    reportType: "Tax",
    period: "FY 2023-24",
    generatedBy: "David Miller",
    generationDate: "2024-03-25",
    status: "Complete",
    fileSize: "4.5 MB",
    totalAmount: 350000,
    currency: "USD",
    recordCount: 500,
    downloadCount: 15
  },
  {
    id: 8,
    reportName: "Revenue by Department",
    reportType: "Revenue Analysis",
    period: "March 2024",
    generatedBy: "Lisa Taylor",
    generationDate: "2024-03-28",
    status: "Complete",
    fileSize: "1.9 MB",
    totalAmount: 890000,
    currency: "USD",
    recordCount: 180,
    downloadCount: 10
  },
  {
    id: 9,
    reportName: "Expense Analysis Report",
    reportType: "Expense Analysis",
    period: "Q1 2024",
    generatedBy: "James Anderson",
    generationDate: "2024-04-01",
    status: "Failed",
    fileSize: "N/A",
    totalAmount: 0,
    currency: "USD",
    recordCount: 0,
    downloadCount: 0
  },
  {
    id: 10,
    reportName: "Financial Ratios Analysis",
    reportType: "Financial Ratios",
    period: "March 2024",
    generatedBy: "Amanda Thomas",
    generationDate: "2024-03-27",
    status: "Complete",
    fileSize: "1.2 MB",
    totalAmount: 0,
    currency: "USD",
    recordCount: 85,
    downloadCount: 7
  }
];

// Table head cells
const financeReportHeadCells = [
  { id: "reportName", label: "Report Name" },
  { id: "reportType", label: "Type" },
  { id: "period", label: "Period" },
  { id: "generatedBy", label: "Generated By" },
  { id: "generationDate", label: "Date" },
  { id: "status", label: "Status" },
  { id: "totalAmount", label: "Total Amount" },
  { id: "fileSize", label: "File Size" },
  { id: "recordCount", label: "Records" },
  { id: "downloadCount", label: "Downloads" },
];

interface FinanceReportsTableProps {
  reportType?: string;
  period?: string;
  dateRange?: { start: string; end: string };
}

const FinanceReportsTable: React.FC<FinanceReportsTableProps> = ({ 
  reportType = "all",
  period = "all",
  dateRange 
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<IFinanceReport | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
  // Filter data based on report type, period, and date range
  const filteredData = financeReportsData.filter(report => {
    // Filter by report type
    if (reportType !== "all" && report.reportType !== reportType) {
      return false;
    }
    
    // Filter by period if specified
    if (period !== "all") {
      const periodLower = report.period.toLowerCase();
      if (period === "monthly" && !periodLower.includes("march") && !periodLower.includes("april") && !periodLower.includes("may")) {
        return false;
      }
      if (period === "quarterly" && !periodLower.includes("q1") && !periodLower.includes("q2") && !periodLower.includes("q3") && !periodLower.includes("q4")) {
        return false;
      }
      if (period === "yearly" && !periodLower.includes("fy")) {
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
  } = useMaterialTableHook<IFinanceReport>(filteredData, 10);

  // Helper function for report type badge
  const getReportTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "p&l statement":
      case "profit & loss":
        return "bg-success";
      case "balance sheet":
        return "bg-primary";
      case "cash flow":
        return "bg-info";
      case "ar aging":
      case "accounts receivable":
        return "bg-warning";
      case "ap aging":
      case "accounts payable":
        return "bg-danger";
      case "budget analysis":
        return "bg-secondary";
      case "tax":
        return "dark-badge";
      case "revenue analysis":
        return "bg-success";
      case "expense analysis":
        return "bg-danger";
      case "financial ratios":
        return "bg-primary";
      default:
        return "default-badge";
    }
  };

  const handleDownloadReport = (report: IFinanceReport) => {
    console.log(`Downloading finance report: ${report.reportName}`);
    alert(`Downloading ${report.reportName}...`);
  };

  const handleViewReport = (report: IFinanceReport) => {
    setSelectedReport(report);
    setDetailsModalOpen(true);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
                        {financeReportHeadCells.map((headCell) => (
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
                            <TableCell>{row.period}</TableCell>
                            <TableCell>{row.generatedBy}</TableCell>
                            <TableCell>{row.generationDate}</TableCell>
                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {row.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AttachMoneyIcon className="mr-1 text-gray-500" fontSize="small" />
                                <span className={`font-semibold ${row.totalAmount > 0 ? 'text-success' : ''}`}>
                                  {row.totalAmount > 0 ? formatCurrency(row.totalAmount, row.currency) : '-'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{row.fileSize}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">{row.recordCount}</span>
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
        <FinanceReportDetailsModal
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

export default FinanceReportsTable;