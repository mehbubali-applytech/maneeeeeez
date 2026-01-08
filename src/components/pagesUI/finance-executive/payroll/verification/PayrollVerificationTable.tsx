"use client";
import React, { useMemo, useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Pagination,
  Checkbox,
  Avatar,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Divider,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useRouter } from "next/navigation";

import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BusinessIcon from "@mui/icons-material/Business";
import { IPayroll } from "./payroll.interface";

// Mock data
const data: IPayroll[] = [
  {
    id: 1,
    employeeName: "John Smith",
    employeeId: "EMP-001",
    department: "Engineering",
    month: "December 2024",
    basic: 75000,
    hra: 37500,
    allowances: 15000,
    deductions: 8500,
    netSalary: 119000,
    status: "Pending",
    paymentDate: "2024-12-31",
    bankAccount: "XXXX-1234",
    taxDeductions: 12500,
    bonus: 10000,
    overtime: 5000,
    totalEarnings: 140000,
    totalDeductions: 21000,
  },
  {
    id: 2,
    employeeName: "Sarah Johnson",
    employeeId: "EMP-002",
    department: "Sales",
    month: "December 2024",
    basic: 65000,
    hra: 32500,
    allowances: 12000,
    deductions: 7200,
    netSalary: 102300,
    status: "Verified",
    paymentDate: "2024-12-30",
    bankAccount: "XXXX-5678",
    taxDeductions: 11000,
    bonus: 8000,
    overtime: 3000,
    totalEarnings: 120500,
    totalDeductions: 18200,
  },
  {
    id: 3,
    employeeName: "Michael Chen",
    employeeId: "EMP-003",
    department: "Marketing",
    month: "December 2024",
    basic: 55000,
    hra: 27500,
    allowances: 10000,
    deductions: 6500,
    netSalary: 86000,
    status: "Paid",
    paymentDate: "2024-12-29",
    bankAccount: "XXXX-9012",
    taxDeductions: 9500,
    bonus: 6000,
    overtime: 2000,
    totalEarnings: 94500,
    totalDeductions: 8500,
  },
  {
    id: 4,
    employeeName: "Lisa Rodriguez",
    employeeId: "EMP-004",
    department: "Operations",
    month: "December 2024",
    basic: 60000,
    hra: 30000,
    allowances: 11000,
    deductions: 7800,
    netSalary: 93200,
    status: "Needs Review",
    paymentDate: "2024-12-31",
    bankAccount: "XXXX-3456",
    taxDeductions: 10500,
    bonus: 7000,
    overtime: 2500,
    totalEarnings: 104500,
    totalDeductions: 11300,
  },
  {
    id: 5,
    employeeName: "David Wilson",
    employeeId: "EMP-005",
    department: "Finance",
    month: "December 2024",
    basic: 80000,
    hra: 40000,
    allowances: 18000,
    deductions: 12000,
    netSalary: 126000,
    status: "Failed",
    paymentDate: "2024-12-28",
    bankAccount: "XXXX-7890",
    taxDeductions: 15000,
    bonus: 12000,
    overtime: 6000,
    totalEarnings: 156000,
    totalDeductions: 30000,
  },
  {
    id: 6,
    employeeName: "Emma Davis",
    employeeId: "EMP-006",
    department: "HR",
    month: "December 2024",
    basic: 58000,
    hra: 29000,
    allowances: 9500,
    deductions: 6200,
    netSalary: 90300,
    status: "Pending",
    paymentDate: "2024-12-31",
    bankAccount: "XXXX-2345",
    taxDeductions: 9800,
    bonus: 5500,
    overtime: 1800,
    totalEarnings: 98200,
    totalDeductions: 7900,
  },
];

// Table head cells
const headCells = [
  { id: "employeeName", label: "Employee" },
  { id: "employeeId", label: "Employee ID" },
  { id: "department", label: "Department" },
  { id: "month", label: "Month" },
  { id: "basic", label: "Basic" },
  { id: "hra", label: "HRA" },
  { id: "allowances", label: "Allowances" },
  { id: "deductions", label: "Deductions" },
  { id: "netSalary", label: "Net Salary" },
  { id: "status", label: "Status" },
];

interface PayrollVerificationTableProps {
  status?: string;
  month?: string;
  department?: string;
  searchQuery?: string;
  dateRange?: { start: string; end: string };
}

// Payroll Details Modal Component
const PayrollDetailsModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  payrollData: IPayroll | null;
  onApprove?: (id: number) => void;
}> = ({ open, setOpen, payrollData, onApprove }) => {
  if (!payrollData) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'success';
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'needs review': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 2, bgcolor: 'primary.50' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              Payroll Details - {payrollData.employeeName}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Employee Information
            </Typography>
            <Box sx={{ pl: 1 }}>
              <Typography variant="body2"><strong>Name:</strong> {payrollData.employeeName}</Typography>
              <Typography variant="body2"><strong>Employee ID:</strong> {payrollData.employeeId}</Typography>
              <Typography variant="body2"><strong>Department:</strong> {payrollData.department}</Typography>
              <Typography variant="body2"><strong>Payroll Month:</strong> {payrollData.month}</Typography>
              <Typography variant="body2"><strong>Payment Date:</strong> {payrollData.paymentDate}</Typography>
            </Box>
          </Grid>

          {/* Earnings Breakdown */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Earnings Breakdown
            </Typography>
            <Box sx={{ pl: 1 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Basic Salary:</Typography>
                <Typography variant="body2" fontWeight="bold">₹{payrollData.basic.toLocaleString('en-IN')}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">House Rent Allowance:</Typography>
                <Typography variant="body2" fontWeight="bold">₹{payrollData.hra.toLocaleString('en-IN')}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Allowances:</Typography>
                <Typography variant="body2" fontWeight="bold">₹{payrollData.allowances.toLocaleString('en-IN')}</Typography>
              </Box>
              {payrollData.bonus && (
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Bonus:</Typography>
                  <Typography variant="body2" fontWeight="bold">₹{payrollData.bonus.toLocaleString('en-IN')}</Typography>
                </Box>
              )}
              {payrollData.overtime && (
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Overtime:</Typography>
                  <Typography variant="body2" fontWeight="bold">₹{payrollData.overtime.toLocaleString('en-IN')}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" fontWeight="bold">Total Earnings:</Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  ₹{(payrollData.basic + payrollData.hra + payrollData.allowances + (payrollData.bonus || 0) + (payrollData.overtime || 0)).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Deductions Breakdown */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Deductions
            </Typography>
            <Box sx={{ pl: 1 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Tax Deductions:</Typography>
                <Typography variant="body2" fontWeight="bold" color="error">
                  ₹{payrollData.taxDeductions?.toLocaleString('en-IN') || '0'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Other Deductions:</Typography>
                <Typography variant="body2" fontWeight="bold" color="error">
                  ₹{(payrollData.deductions - (payrollData.taxDeductions || 0)).toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" fontWeight="bold">Total Deductions:</Typography>
                <Typography variant="body2" fontWeight="bold" color="error">
                  ₹{payrollData.deductions.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Summary */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Payment Summary
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Net Salary Payable:</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ₹{payrollData.netSalary.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2"><strong>Bank Account:</strong> {payrollData.bankAccount}</Typography>
                <Typography variant="body2"><strong>Status:</strong> 
                  <Chip
                    label={payrollData.status}
                    size="small"
                    color={getStatusColor(payrollData.status) as any}
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Notes Section for Verification */}
        {payrollData.status === 'Pending' || payrollData.status === 'Needs Review' ? (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Verification Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add notes or comments for verification..."
              variant="outlined"
              size="small"
            />
            <Box display="flex" alignItems="center" mt={2}>
              <FormControlLabel
                control={<Switch color="primary" />}
                label="Mark as verified"
              />
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
          Close
        </Button>
        {payrollData.status === 'Pending' || payrollData.status === 'Needs Review' ? (
          <>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                // Handle reject action
                console.log('Reject payroll:', payrollData.id);
                setOpen(false);
              }}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                if (onApprove) onApprove(payrollData.id);
                setOpen(false);
              }}
            >
              Approve Payment
            </Button>
          </>
        ) : payrollData.status === 'Failed' ? (
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              // Handle retry payment
              console.log('Retry payment:', payrollData.id);
              setOpen(false);
            }}
          >
            Retry Payment
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

const PayrollVerificationTable: React.FC<PayrollVerificationTableProps> = ({
  status = "all",
  month = "all",
  department = "all",
  searchQuery = "",
  dateRange = { start: "", end: "" },
}) => {
  const router = useRouter();

  const [tableData, setTableData] = useState<IPayroll[]>(data);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<IPayroll | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Apply filters
  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (status && status !== "all") {
      result = result.filter(payroll => payroll.status === status);
    }
    
    if (month && month !== "all") {
      result = result.filter(payroll => payroll.month === month);
    }
    
    if (department && department !== "all") {
      result = result.filter(payroll => payroll.department === department);
    }
    
    // Use external search query if provided, otherwise use local search query
    const currentSearchQuery = searchQuery || localSearchQuery;
    if (currentSearchQuery.trim()) {
      const query = currentSearchQuery.toLowerCase();
      result = result.filter(payroll => 
        payroll.employeeName.toLowerCase().includes(query) ||
        payroll.employeeId.toLowerCase().includes(query)
      );
    }
    
    if (dateRange?.start && dateRange?.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      end.setDate(end.getDate() + 1);
      
      result = result.filter(payroll => {
        const paymentDate = new Date(payroll.paymentDate);
        return paymentDate >= start && paymentDate <= end;
      });
    }
    
    return result;
  }, [status, month, department, searchQuery, dateRange, localSearchQuery]);

  // Update table data when filters change
  useEffect(() => {
    setTableData(filteredData);
  }, [filteredData]);

  const memoData = useMemo(() => tableData, [tableData]);

  const {
    order,
    orderBy,
    selected,
    page,
    rowsPerPage,
    searchQuery: hookSearchQuery,
    paginatedRows,
    filteredRows,
    handleDelete,
    handleRequestSort,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleSelectAllClick,
  } = useMaterialTableHook<IPayroll>(memoData, 10);

  // Combine search handling
  const handleCombinedSearchChange = (query: string) => {
    if (searchQuery) {
      // If external search query is provided, update local state only
      setLocalSearchQuery(query);
    } else {
      // If no external search query, use the hook's search
      handleSearchChange(query);
    }
  };

  const handleApprovePayroll = (id: number) => {
    setTableData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: "Verified" as const } : item
      )
    );
    // In real app, you would call API here
    console.log(`Approved payroll ${id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteId !== undefined) {
      handleDelete(deleteId);
      setModalDeleteOpen(false);
    }
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    handleSelectAllClick(checked, filteredRows);
  };

  const getStatusClass = (status: string = "Pending") => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('paid') || statusLower.includes('verified')) return "success";
    if (statusLower.includes('pending') || statusLower.includes('needs review')) return "warning";
    if (statusLower.includes('failed')) return "error";
    return "default";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string = "") => {
    if (!name.trim()) return "EMP";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalAmount = filteredRows.reduce((sum, item) => sum + item.netSalary, 0);
    const pendingCount = filteredRows.filter(item => item.status === 'Pending' || item.status === 'Needs Review').length;
    const paidCount = filteredRows.filter(item => item.status === 'Paid' || item.status === 'Verified').length;
    const failedCount = filteredRows.filter(item => item.status === 'Failed').length;

    return { totalAmount, pendingCount, paidCount, failedCount };
  }, [filteredRows]);

  // Determine which search query to use for display
  const currentSearchQuery = searchQuery || localSearchQuery || hookSearchQuery;

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            <TableControls
              rowsPerPage={rowsPerPage}
              searchQuery={currentSearchQuery}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleSearchChange={handleCombinedSearchChange}
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
                            onChange={handleSelectAll}
                            size="small"
                          />
                        </TableCell>
                        {headCells.map((headCell) => (
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
                          <TableCell colSpan={headCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <AttachMoneyIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                No payroll records found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {currentSearchQuery.trim() 
                                  ? `Try adjusting your search query: "${currentSearchQuery}"`
                                  : "Try adjusting your filters to see more results"}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row, index) => {
                          const isSelected = selected.includes(index);
                          const statusClass = getStatusClass(row.status);

                          return (
                            <TableRow
                              key={row.id}
                              hover
                              selected={isSelected}
                              onClick={() => handleClick(index)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="custom-checkbox checkbox-small"
                                  checked={isSelected}
                                  onChange={() => handleClick(index)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="mr-3 bg-primary">
                                    {getInitials(row.employeeName)}
                                  </Avatar>
                                  <div>
                                    <Typography variant="body2" className="font-medium">
                                      {row.employeeName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {row.department}
                                    </Typography>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {row.employeeId}
                                </code>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <BusinessIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {row.department}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <CalendarMonthIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {row.month}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-medium">
                                  {formatCurrency(row.basic)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-medium">
                                  {formatCurrency(row.hra)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-medium text-green-600">
                                  {formatCurrency(row.allowances)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-medium text-red-600">
                                  {formatCurrency(row.deductions)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-bold text-primary">
                                  {formatCurrency(row.netSalary)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.status}
                                  size="small"
                                  color={statusClass as any}
                                  variant="filled"
                                  className="font-medium"
                                />
                              </TableCell>
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-2">
                                  <button
                                    type="button"
                                    className="table__icon view p-1.5 hover:bg-blue-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPayroll(row);
                                      setDetailsModalOpen(true);
                                    }}
                                    title="View & Verify Details"
                                  >
                                    <VisibilityIcon fontSize="small" className="text-blue-600" />
                                  </button>
                                  <button
                                    type="button"
                                    className="table__icon edit p-1.5 hover:bg-green-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPayroll(row);
                                      setEditModalOpen(true);
                                    }}
                                    title="Edit Payroll"
                                  >
                                    <EditIcon fontSize="small" className="text-green-600" />
                                  </button>
                                  {(row.status === 'Pending' || row.status === 'Needs Review') && (
                                    <button
                                      type="button"
                                      className="table__icon approve p-1.5 hover:bg-green-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprovePayroll(row.id);
                                      }}
                                      title="Approve Payroll"
                                    >
                                      <CheckCircleIcon fontSize="small" className="text-green-600" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteId(row.id);
                                      setModalDeleteOpen(true);
                                    }}
                                    title="Delete Record"
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

            {/* Summary Section */}
            {paginatedRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Payroll Amount</div>
                      <div className="text-xl font-semibold text-primary">
                        {formatCurrency(summaryStats.totalAmount)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Pending Verification</div>
                      <div className="text-xl font-semibold text-warning">
                        {summaryStats.pendingCount}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Successfully Paid</div>
                      <div className="text-xl font-semibold text-success">
                        {summaryStats.paidCount}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Failed Payments</div>
                      <div className="text-xl font-semibold text-error">
                        {summaryStats.failedCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Box className="table-search-box mt-[30px]" sx={{ p: 2 }}>
              <Box>
                <Typography variant="body2">
                  {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                    page * rowsPerPage,
                    filteredRows.length
                  )} of ${filteredRows.length} entries`}
                </Typography>
                {currentSearchQuery && (
                  <Typography variant="caption" className="ml-2 text-gray-600">
                    (Filtered by: `{currentSearchQuery}`)
                  </Typography>
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

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="card__wrapper mb-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-primary-700 font-medium">
                {selected.length} payroll record(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedPayrolls = paginatedRows.filter((_, index) => selected.includes(index));
                    selectedPayrolls.forEach(payroll => handleApprovePayroll(payroll.id));
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                  Approve Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedPayrolls = paginatedRows.filter((_, index) => selected.includes(index));
                    console.log('Export payrolls:', selectedPayrolls);
                  }}
                >
                  <i className="fa-solid fa-download mr-1"></i>
                  Export Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} payroll record(s)?`)) {
                      selected.forEach(index => {
                        const payroll = paginatedRows[index];
                        if (payroll) {
                          handleDelete(payroll.id);
                        }
                      });
                    }
                  }}
                >
                  <i className="fa-regular fa-trash mr-1"></i>
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && selectedPayroll && (
        <PayrollDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
          payrollData={selectedPayroll}
          onApprove={handleApprovePayroll}
        />
      )}

      {/* Delete Modal */}
      {modalDeleteOpen && (
        <DeleteModal
          open={modalDeleteOpen}
          setOpen={setModalDeleteOpen}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default PayrollVerificationTable;