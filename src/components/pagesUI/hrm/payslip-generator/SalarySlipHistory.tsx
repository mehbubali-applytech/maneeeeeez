// app/hr/salary-slip/SalarySlipHistory.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Pagination,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import {
  Download,
  Visibility,
  Mail,
  Delete,
  PictureAsPdf,
  Print,
  Search,
  FilterList,
  CalendarMonth
} from "@mui/icons-material";
import { ISalarySlipData, formatCurrency } from "./SalarySlipTypes";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface SalarySlipHistoryProps {
  slips: ISalarySlipData[];
}

const SalarySlipHistory: React.FC<SalarySlipHistoryProps> = ({ slips }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<string>("generatedOn");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slipToDelete, setSlipToDelete] = useState<string | null>(null);

  const headCells = [
    { id: "employeeName", label: "Employee" },
    { id: "month", label: "Month" },
    { id: "netSalary", label: "Net Salary" },
    { id: "status", label: "Status" },
    { id: "generatedOn", label: "Generated On" },
    { id: "actions", label: "Actions" }
  ];

  // Filter and sort data
  const filteredData = useMemo(() => {
    return slips.filter(slip => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        slip.employeeInfo.employeeName.toLowerCase().includes(searchLower) ||
        slip.employeeInfo.employeeCode.toLowerCase().includes(searchLower) ||
        slip.employeeInfo.department.toLowerCase().includes(searchLower) ||
        slip.calculation.month.toLowerCase().includes(searchLower)
      );
    }).sort((a, b) => {
      if (orderBy === "generatedOn") {
        return order === "asc" 
          ? new Date(a.generatedOn).getTime() - new Date(b.generatedOn).getTime()
          : new Date(b.generatedOn).getTime() - new Date(a.generatedOn).getTime();
      }
      if (orderBy === "netSalary") {
        return order === "asc" 
          ? a.calculation.netSalary - b.calculation.netSalary
          : b.calculation.netSalary - a.calculation.netSalary;
      }
      if (orderBy === "employeeName") {
        return order === "asc"
          ? a.employeeInfo.employeeName.localeCompare(b.employeeInfo.employeeName)
          : b.employeeInfo.employeeName.localeCompare(a.employeeInfo.employeeName);
      }
      return 0;
    });
  }, [slips, searchQuery, order, orderBy]);

  // Paginate data
  const paginatedRows = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(filteredData.map(slip => slip.slipId));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDeleteSlip = (id: string) => {
    // In a real app, you would make an API call here
    console.log('Delete slip:', id);
    setDeleteDialogOpen(false);
    setSlipToDelete(null);
  };

  const handleBulkDownload = () => {
    // Implement bulk download
    console.log('Bulk download:', selected);
  };

  const handleBulkEmail = () => {
    // Implement bulk email
    console.log('Bulk email:', selected);
  };

  // Prepare export data
  const exportData = useMemo((): TableData => {
    const headers = [
      "Slip ID",
      "Employee Name",
      "Employee Code",
      "Department",
      "Month",
      "Year",
      "Basic Salary",
      "HRA",
      "Allowances",
      "Deductions",
      "Net Salary",
      "Status",
      "Generated Date",
      "Payment Date"
    ];
    
    const rows = filteredData.map(slip => {
      return [
        slip.slipId,
        slip.employeeInfo.employeeName,
        slip.employeeInfo.employeeCode,
        slip.employeeInfo.department,
        slip.calculation.month,
        slip.calculation.year.toString(),
        formatCurrency(slip.calculation.basic),
        formatCurrency(slip.calculation.hra),
        formatCurrency(slip.calculation.totalEarnings - slip.calculation.basic - slip.calculation.hra),
        formatCurrency(slip.calculation.totalDeductions),
        formatCurrency(slip.calculation.netSalary),
        "Generated",
        new Date(slip.generatedOn).toLocaleDateString(),
        slip.paymentDate
      ];
    });
    
    return {
      headers,
      rows,
      title: `Salary Slips History - ${filteredData.length} records`
    };
  }, [filteredData]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            
            {/* Top Controls */}
            <Grid container spacing={2} alignItems="center" className="mb-4">
              <Grid item xs={12} md={6}>
                <Box className="flex items-center gap-4">
                  <Typography variant="body2" className="whitespace-nowrap">
                    Search:
                  </Typography>
                  <TextField
                    id="outlined-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    size="small"
                    className="manaz-table-search-input"
                    sx={{ width: '100%', maxWidth: 300 }}
                    placeholder="Search salary slips..."
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end gap-2">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `salary_slips_history_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Salary Slips History Report`
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    size="small"
                    onClick={() => console.log('Filter')}
                  >
                    Filter
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Bulk Actions Bar */}
            {selected.length > 0 && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.50', borderColor: 'primary.main' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" className="text-primary-700 font-medium">
                    {selected.length} slip(s) selected
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Download />}
                      onClick={handleBulkDownload}
                      className="!text-white"
                    >
                      Download Selected
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Mail />}
                      onClick={handleBulkEmail}
                    >
                      Email Selected
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => {
                        if (confirm(`Delete ${selected.length} slip(s)?`)) {
                          console.log('Delete selected slips');
                        }
                      }}
                    >
                      Delete Selected
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}

            <Box sx={{ width: "100%" }} className="table-responsive">
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer className="table mb-[20px] hover multiple_tables w-full">
                  <Table aria-labelledby="tableTitle" className="whitespace-nowrap">
                    <TableHead>
                      <TableRow className="table__title">
                        <TableCell>
                          {/* Checkbox removed as per requirement */}
                        </TableCell>
                        {headCells.map((headCell) => (
                          <TableCell
                            className="table__title"
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={orderBy === headCell.id ? order : "asc"}
                              onClick={() => handleRequestSort(headCell.id)}
                              hideSortIcon={headCell.id === "actions"}
                            >
                              {headCell.label}
                              {orderBy === headCell.id && headCell.id !== "actions" ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    
                    <TableBody className="table__body">
                      {paginatedRows.map((slip) => (
                        <TableRow
                          key={slip.slipId}
                          hover
                          onClick={() => handleClick(slip.slipId)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            {/* Checkbox removed */}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                bgcolor: 'primary.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'primary.main',
                                fontWeight: 600
                              }}>
                                {slip.employeeInfo.employeeName.charAt(0)}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {slip.employeeInfo.employeeName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {slip.employeeInfo.department} • {slip.employeeInfo.employeeCode}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {slip.calculation.month} {slip.calculation.year}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Payment: {new Date(slip.paymentDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {formatCurrency(slip.calculation.netSalary)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Basic: {formatCurrency(slip.calculation.basic)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Generated"
                              size="small"
                              color="success"
                              icon={<PictureAsPdf fontSize="small" />}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(slip.generatedOn).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(slip.generatedOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Download PDF">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Download slip:', slip.slipId);
                                  }}
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('View slip:', slip.slipId);
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Send Email">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Email slip:', slip.slipId);
                                  }}
                                >
                                  <Mail fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSlipToDelete(slip.slipId);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            {/* Summary Stats */}
            {filteredData.length > 0 && (
              <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Total Slips
                      </Typography>
                      <Typography variant="h6">{filteredData.length}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Total Salary
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        {formatCurrency(filteredData.reduce((sum, slip) => sum + slip.calculation.netSalary, 0))}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        This Month
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {
                          filteredData.filter(slip => 
                            new Date(slip.generatedOn).getMonth() === new Date().getMonth() &&
                            new Date(slip.generatedOn).getFullYear() === new Date().getFullYear()
                          ).length
                        }
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Unique Employees
                      </Typography>
                      <Typography variant="h6">
                        {new Set(filteredData.map(slip => slip.employeeInfo.employeeId)).size}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Bottom Controls */}
            {filteredData.length > 0 && (
              <Grid container spacing={2} alignItems="center" className="mt-4">
                <Grid item xs={12} md={3}>
                  <Box className="flex items-center gap-2">
                    <Typography variant="body2" className="whitespace-nowrap">
                      Show
                    </Typography>
                    <Select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(+e.target.value)}
                      size="small"
                      sx={{ width: 100 }}
                    >
                      {[5, 10, 15, 20, 25, 50].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography variant="body2" className="whitespace-nowrap">
                      entries
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box className="flex flex-col items-center">
                    <Typography variant="body2">
                      {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                        page * rowsPerPage,
                        filteredData.length
                      )} of ${filteredData.length} entries`}
                    </Typography>
                    {searchQuery && (
                      <Typography variant="caption" className="text-gray-600">
                        (Filtered by: `{searchQuery}`)
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box className="flex justify-end">
                    <Pagination
                      count={Math.ceil(filteredData.length / rowsPerPage)}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      variant="outlined"
                      shape="rounded"
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Empty State */}
            {filteredData.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <PictureAsPdf sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Salary Slips Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery 
                    ? `No slips found matching "${searchQuery}"`
                    : "Generate your first salary slip to see history here"}
                </Typography>
              </Box>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Salary Slip</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this salary slip? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              The PDF file will still exist if it was downloaded. This only removes the record from history.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => slipToDelete && handleDeleteSlip(slipToDelete)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalarySlipHistory;