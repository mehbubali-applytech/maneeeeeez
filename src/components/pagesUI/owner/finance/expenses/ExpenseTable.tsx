"use client";

import React, { useMemo } from "react";
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
  IconButton,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { IExpense } from "./ExpenseTypes";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import { AttachMoney, Category, CalendarMonth, Payment } from "@mui/icons-material";

const headCells = [
  { id: "expenseTitle", label: "Title" },
  { id: "expenseCategory", label: "Category" },
  { id: "amount", label: "Amount" },
  { id: "expenseDate", label: "Date" },
  { id: "paymentMode", label: "Payment" },
  { id: "status", label: "Status" },
];

interface Props {
  data: IExpense[];
  onEdit?: (row: IExpense) => void;
  onDelete?: (id: number) => void;
}

const ExpenseTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const memoData = useMemo(() => data, [data]);

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
  } = useMaterialTableHook<IExpense>(memoData, 10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'rejected': return 'bg-danger';
      case 'paid': return 'bg-info';
      case 'draft': return 'bg-secondary';
      default: return 'default-badge';
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = headCells.map(cell => cell.label);
    
    const rows = filteredRows.map(expense => {
      return [
        expense.expenseTitle,
        expense.expenseCategory,
        formatCurrency(expense.amount),
        expense.expenseDate,
        expense.paymentMode,
        expense.status
      ];
    });
    
    return {
      headers,
      rows,
      title: `Expenses Export - ${filteredRows.length} records`
    };
  }, [filteredRows]);

  return (
    <div className="card__wrapper">
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
              placeholder="Search expenses..."
            />
          </Box>
        </Grid>
        
        {/* Export Options - Top Right (Only new addition) */}
        <Grid item xs={12} md={6}>
          <Box className="flex justify-end">
            <DownloadButtonGroup
              data={exportData}
              options={{
                fileName: `expenses_${new Date().toISOString().split('T')[0]}`,
                includeHeaders: true,
                pdfTitle: `Expenses Report - ${new Date().toLocaleDateString()}`
              }}
              variant="outlined"
              size="small"
              color="primary"
            />
          </Box>
        </Grid>
      </Grid>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="table__title bg-gray-50">
                <TableCell padding="checkbox">
                  <Checkbox
                    className="custom-checkbox checkbox-small"
                    color="primary"
                    checked={selected.length === filteredRows.length}
                    onChange={(e) =>
                      handleSelectAllClick(e.target.checked, filteredRows)
                    }
                    size="small"
                  />
                </TableCell>

                {headCells.map((cell) => (
                  <TableCell
                    className="table__title !font-semibold"
                    key={cell.id}
                  >
                    <TableSortLabel
                      active={orderBy === cell.id}
                      direction={order}
                      onClick={() => handleRequestSort(cell.id)}
                    >
                      {cell.label}
                      {orderBy === cell.id && (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                      )}
                    </TableSortLabel>
                  </TableCell>
                ))}

                <TableCell className="table__title !font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody className="table__body">
              {paginatedRows.map((row, index) => (
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
                      onChange={() => handleClick(index)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AttachMoney fontSize="small" className="text-gray-400" />
                      <div className="font-medium">{row.expenseTitle}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Category fontSize="small" className="text-gray-400" />
                      <span>{row.expenseCategory}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-blue-600">
                      {formatCurrency(row.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarMonth fontSize="small" className="text-gray-400" />
                      <span>{row.expenseDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Payment fontSize="small" className="text-gray-400" />
                      <span>{row.paymentMode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`bd-badge ${getTableStatusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </TableCell>

                  <TableCell className="table__icon-box">
                    <div className="flex items-center justify-start gap-2">
                      <IconButton 
                        size="small"
                        className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(row);
                        }}
                        title="Edit Expense"
                      >
                        <i className="fa-light fa-pen text-blue-600" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                          onDelete?.(row.id);
                        }}
                        title="Delete Expense"
                      >
                        <i className="fa-regular fa-trash text-red-600" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2" className="text-white">
            {selected.length} expense{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedExpenses = selected.map(index => filteredRows[index]);
                console.log('Bulk export expenses:', selectedExpenses);
              }}
            >
              <i className="fa-solid fa-download mr-1"></i>
              Export Selected
            </button>
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
              onClick={() => {
                const selectedExpenses = selected.map(index => filteredRows[index]);
                console.log('Bulk approve expenses:', selectedExpenses);
              }}
            >
              <i className="fa-solid fa-check mr-1"></i>
              Approve Selected
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selected.length} expense${selected.length > 1 ? 's' : ''}?`)) {
                  selected.forEach(index => {
                    handleDelete(index);
                    const expense = filteredRows[index];
                    if (expense) onDelete?.(expense.id);
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

      {/* Empty State */}
      {filteredRows.length === 0 && (
        <div className="card__wrapper mt-4">
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <AttachMoney fontSize="large" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Expenses Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No expenses found matching "${searchQuery}"`
                : "Create your first expense to get started"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;