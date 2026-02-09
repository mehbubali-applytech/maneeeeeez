"use client";

import React, { useEffect, useMemo } from "react";
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
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

import { IEmployee } from "./EmployeeTypes";
import Link from "next/link";

const headCells = [
  { id: "employeeCode", label: "Employee ID" },
  { id: "firstName", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phoneNumber", label: "Phone" },
  { id: "designation", label: "Designation" },
  // { id: "departmentName", label: "Department" },
  { id: "dateOfJoining", label: "Date of Joining" },
  { id: "employmentStatus", label: "Status" },
];

interface Props {
  data: IEmployee[];
  onEdit?: (row: IEmployee) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const EmployeeTable: React.FC<Props> = ({ data, onEdit, onDelete, onStatusChange }) => {
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
  } = useMaterialTableHook<IEmployee>(memoData, 10);

  const confirmDeleteHandler = (index: number) => {
    const row = filteredRows[index];
    if (!row) return;
    handleDelete(index);
    onDelete?.(row.employeeId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Inactive": return "error";
      case "On Probation": return "warning";
      default: return "default";
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Employee Code",
      "Name",
      "Email",
      "Phone",
      "Designation",
      // "Department",
      "Date of Joining",
      "Status",
      "Work Type",
    ];
    
    const rows = filteredRows.map(employee => {
      return [
        employee.employeeCode || "-",
        `${employee.firstName} ${employee.lastName}`,
        employee.email,
        employee.phoneNumber || "-",
        employee.designation || "-",
        // employee.departmentName || "-",
        formatDate(employee.date_of_joining),
        employee.employmentStatus,
        employee.workType,
      ];
    });
    
    return {
      headers,
      rows,
      title: `Employees Export - ${filteredRows.length} records`
    };
  }, [filteredRows]);


  return (
    <div className="card__wrapper">
      {/* Top Controls Row */}
      <Grid container spacing={2} alignItems="center" className="mb-4">
        {/* Search Bar */}
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
              placeholder="Search employees..."
            />
          </Box>
        </Grid>
        
        {/* Export Options */}
        <Grid item xs={12} md={6}>
          <Box className="flex justify-end">
            <DownloadButtonGroup
              data={exportData}
              options={{
                fileName: `employees_${new Date().toISOString().split('T')[0]}`,
                includeHeaders: true,
                pdfTitle: `Employees Report - ${new Date().toLocaleDateString()}`
              }}
              variant="outlined"
              size="small"
              color="primary"
              disabled={filteredRows.length === 0}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="table__title bg-gray-50">
                  <TableCell padding="checkbox" width="5%">
                    <Checkbox
                      className="custom-checkbox checkbox-small"
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < filteredRows.length
                      }
                      checked={
                        filteredRows.length > 0 &&
                        selected.length === filteredRows.length
                      }
                      onChange={(e) =>
                        handleSelectAllClick(e.target.checked, filteredRows)
                      }
                      size="small"
                      disabled={filteredRows.length === 0}
                    />
                  </TableCell>

                  {headCells.map((cell) => (
                    <TableCell
                      className="table__title !font-semibold"
                      key={cell.id}
                    >
                      <TableSortLabel
                        active={orderBy === cell.id}
                        direction={orderBy === cell.id ? order : "asc"}
                        onClick={() => handleRequestSort(cell.id)}
                        disabled={filteredRows.length === 0}
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

                  <TableCell width="12%" className="table__title !font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody className="table__body">
                {paginatedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length + 2} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <i className="fa-regular fa-users text-gray-400 text-4xl mb-2"></i>
                        <Typography variant="body1" className="text-gray-600 mb-2">
                          No employees found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchQuery.trim()
                            ? `Try adjusting your search query: "${searchQuery}"`
                            : "No employees in the system"}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRows.map((row, index) => {
                    const statusClass = getTableStatusClass(row.employmentStatus || "Active");

                    return (
                      <TableRow
                        key={row.employeeId}
                        hover
                        selected={selected.includes(index)}
                        onClick={() => handleClick(index)}
                        className={`hover:bg-blue-50 ${selected.includes(index) ? "bg-blue-50" : ""}`}
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
                          <Chip
                            label={row.employeeCode}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              sx={{ width: 32, height: 32 }}
                              src={row.profilePhoto}
                            >
                              {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {row.firstName} {row.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {row.preferredName}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-gray-600">{row.email}</div>
                        </TableCell>

                        <TableCell>
                          <div className="text-gray-600">{row.phoneNumber || "-"}</div>
                        </TableCell>

                        <TableCell>
                          <div className="font-medium">{row.designation || "-"}</div>
                        </TableCell>

                        {/* <TableCell>
                          {row.departmentName ? (
                            <Chip
                              label={row.departmentName}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                          ) : (
                            <span className="text-gray-400 italic">Not assigned</span>
                          )}
                        </TableCell> */}

                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDate(row.dateOfJoining)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={row.employmentStatus}
                            size="small"
                            color={getStatusColor(row.employmentStatus) as any}
                            variant="filled"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newStatus = row.employmentStatus === "Active" ? "Inactive" : "Active";
                              onStatusChange?.(row.employeeId, newStatus);
                            }}
                            className="cursor-pointer"
                          />
                        </TableCell>

                        <TableCell className="table__icon-box">
                          <div className="flex items-center justify-start gap-2">
                            <Link href={`/owner/employees/${row.employeeId}`}>
                              <button
                                type="button"
                                className="table__icon view p-1.5 hover:bg-green-100 rounded"
                                onClick={(e) => e.stopPropagation()}
                                title="View Employee"
                              >
                                <i className="fa-light fa-eye text-green-600"></i>
                              </button>
                            </Link>
                            
                            <button
                              type="button"
                              className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(row);
                              }}
                              title="Edit Employee"
                            >
                              <i className="fa-light fa-edit text-blue-600"></i>
                            </button>
                            
                            <button
                              className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteHandler(index);
                              }}
                              title="Delete Employee"
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

      {/* Summary Stats */}
      {/* {filteredRows.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Employees</div>
              <div className="text-xl font-semibold">{filteredRows.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-xl font-semibold text-green-600">
                {filteredRows.filter(e => e.employmentStatus === "Active").length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Departments</div>
              <div className="text-xl font-semibold text-blue-600">
                {new Set(filteredRows.filter(d => d.departmentName).map(d => d.departmentName)).size}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">New This Month</div>
              <div className="text-xl font-semibold text-purple-600">
                {filteredRows.filter(e => {
                  const joinDate = new Date(e.dateOfJoining);
                  const today = new Date();
                  return joinDate.getMonth() === today.getMonth() && 
                         joinDate.getFullYear() === today.getFullYear();
                }).length}
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Bottom Controls */}
      {filteredRows.length > 0 && (
        <Grid container spacing={2} alignItems="center" className="mt-4">
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
          
          <Grid item xs={12} md={3}>
            <Box className="flex justify-end">
              <Pagination
  count={Math.ceil(filteredRows.length / rowsPerPage)}
  page={page}
  onChange={(e, value) => handleChangePage(value)}
  variant="outlined"
  shape="rounded"
  size="small"
  showFirstButton
  showLastButton
  siblingCount={1}
  boundaryCount={1}
/>

            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default EmployeeTable;