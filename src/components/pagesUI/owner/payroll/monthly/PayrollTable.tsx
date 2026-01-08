"use client";

import React, { useState, useMemo } from "react";
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
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DeleteModal from "@/components/common/DeleteModal";
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { IPayroll } from "./PayrollTypes";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import { AttachMoney } from "@mui/icons-material";

const headCells = [
  { id: "employeeName", label: "Employee" },
  { id: "month", label: "Month" },
  { id: "basic", label: "Basic" },
  { id: "hra", label: "HRA" },
  { id: "allowances", label: "Allowances" },
  { id: "deductions", label: "Deductions" },
  { id: "netSalary", label: "Net Salary" },
  { id: "status", label: "Status" },
];

interface Props {
  data: IPayroll[];
  onEdit?: (row: IPayroll) => void;
  onDelete?: (id: number) => void;
}

const PayrollTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  const {
    order,
    orderBy,
    selected,
    page,
    rowsPerPage,
    searchQuery,
    paginatedRows,
    filteredRows,
    handleDelete: internalHandleDelete,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
  } = useMaterialTableHook<IPayroll>(data, 10);

  const handleDelete = (id: number) => {
    const index = data.findIndex(row => row.id === id);
    if (index >= 0) {
      internalHandleDelete(index);
      onDelete?.(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'failed': return 'bg-danger';
      case 'draft': return 'bg-secondary';
      default: return 'default-badge';
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Employee Name",
      "Employee Code",
      "Month",
      "Basic Salary",
      "HRA",
      "Allowances",
      "Deductions",
      "Net Salary",
      "Status"
    ];
    
    const rows = filteredRows.map(row => {
      return [
        row.employeeName,
        row.employeeCode || "-",
        row.month,
        formatCurrency(row.basic),
        formatCurrency(row.hra),
        formatCurrency(row.allowances),
        formatCurrency(row.deductions),
        formatCurrency(row.netSalary),
        row.status
      ];
    });
    
    return {
      headers,
      rows,
      title: `Payroll Report - ${filteredRows.length} records`
    };
  }, [filteredRows]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            
            {/* Top Controls Row - Only added export button */}
            <Grid container spacing={2} alignItems="center" className="mb-4">
              {/* Search Bar - Top Left */}
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
                    placeholder="Search payrolls..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right (Only new addition) */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `payroll_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Payroll Report - ${new Date().toLocaleDateString()}`
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ width: "100%" }} className="table-responsive">
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer className="table mb-[20px] hover multiple_tables w-full">
                  <Table aria-labelledby="tableTitle" className="whitespace-nowrap">
                    <TableHead>
                      <TableRow className="table__title bg-gray-50">
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
                        {headCells.map((cell) => (
                          <TableCell
                            className="table__title !font-semibold"
                            key={cell.id}
                            sortDirection={orderBy === cell.id ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === cell.id}
                              direction={orderBy === cell.id ? order : "asc"}
                              onClick={() => handleRequestSort(cell.id)}
                            >
                              {cell.label}
                              {orderBy === cell.id ? (
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
                      {paginatedRows.map((row, index) => {
                        const statusClass = getStatusClass(row.status);

                        return (
                          <TableRow
                            key={row.id}
                            selected={selected.includes(index)}
                            onClick={() => handleClick(index)}
                            className={`hover:bg-blue-50 ${selected.includes(index) ? 'bg-blue-50' : ''}`}
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
                              <div className="font-medium flex items-center gap-2">
                                <AttachMoney fontSize="small" className="text-gray-400" />
                                <div>
                                  <div>{row.employeeName}</div>
                                  {row.employeeCode && (
                                    <div className="text-sm text-gray-500">{row.employeeCode}</div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">{row.month}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{formatCurrency(row.basic)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{formatCurrency(row.hra)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-green-600">+{formatCurrency(row.allowances)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-red-600">-{formatCurrency(row.deductions)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-blue-600">{formatCurrency(row.netSalary)}</span>
                            </TableCell>
                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {row.status}
                              </span>
                            </TableCell>
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-2">
                                <button
                                  type="button"
                                  className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(row);
                                  }}
                                  title="Edit Payroll"
                                >
                                  <i className="fa-regular fa-pen-to-square text-blue-600"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon download p-1.5 hover:bg-green-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Downloading payroll for ${row.employeeName} - ${row.month}`);
                                  }}
                                  title="Download Payslip"
                                >
                                  <i className="fa-solid fa-download text-green-600"></i>
                                </button>
                                <button
                                  className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(row.id);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Payroll"
                                >
                                  <i className="fa-regular fa-trash text-red-600"></i>
                                </button>
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

            {/* Payroll Summary */}
            {filteredRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Payrolls</div>
                      <div className="text-xl font-semibold">{filteredRows.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Net Salary</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {formatCurrency(filteredRows.reduce((sum, row) => sum + row.netSalary, 0))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Paid</div>
                      <div className="text-xl font-semibold text-green-600">
                        {filteredRows.filter(row => row.status === 'Paid').length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Pending</div>
                      <div className="text-xl font-semibold text-yellow-600">
                        {filteredRows.filter(row => row.status === 'Pending').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls Row */}
            <Grid container spacing={2} alignItems="center" className="mt-4">
              {/* Number of Entries Dropdown - Bottom Left */}
              <Grid item xs={12} md={3}>
                <Box className="flex items-center gap-2">
                  <Typography variant="body2" className="whitespace-nowrap">
                    Show
                  </Typography>
                  <Select
                    value={rowsPerPage}
                    onChange={(e) => handleChangeRowsPerPage(+e.target.value)}
                    size="small"
                    sx={{ width: 100 }}
                    className="manaz-table-row-per-page"
                  >
                    {[5, 10, 15, 20, 25, 50].map((option) => (
                      <MenuItem key={option} value={option} className="menu-item">
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="body2" className="whitespace-nowrap">
                    entries
                  </Typography>
                </Box>
              </Grid>
              
              {/* Showing Entries Info - Bottom Center */}
              <Grid item xs={12} md={6}>
                <Box className="flex flex-col items-center">
                  <Typography variant="body2">
                    {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                      page * rowsPerPage,
                      filteredRows.length
                    )} of ${filteredRows.length} entries`}
                  </Typography>
                  {searchQuery && (
                    <Typography variant="caption" className="text-gray-600">
                      (Filtered by: `{searchQuery}`)
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              {/* Pagination - Bottom Right */}
              <Grid item xs={12} md={3}>
                <Box className="flex justify-end">
                  <Pagination
                    count={Math.ceil(filteredRows.length / rowsPerPage)}
                    page={page}
                    onChange={(e, value) => handleChangePage(value)}
                    variant="outlined"
                    shape="rounded"
                    className="manaz-pagination-button"
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2" className="text-white">
            {selected.length} payroll{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedPayrolls = selected.map(index => filteredRows[index]);
                console.log('Bulk export payrolls:', selectedPayrolls);
              }}
            >
              <i className="fa-solid fa-download mr-1"></i>
              Export Selected
            </button>
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
              onClick={() => {
                const selectedPayrolls = selected.map(index => filteredRows[index]);
                console.log('Bulk process payrolls:', selectedPayrolls);
              }}
            >
              <i className="fa-solid fa-paper-plane mr-1"></i>
              Process Selected
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selected.length} payroll${selected.length > 1 ? 's' : ''}?`)) {
                  selected.forEach(index => {
                    const payroll = filteredRows[index];
                    if (payroll) handleDelete(payroll.id);
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

export default PayrollTable;