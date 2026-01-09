"use client";
import React, { useMemo, useState } from "react";
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
  Chip,
  Avatar,
  Grid,
  TextField,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useRouter } from "next/navigation";

import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import DeleteModal from "@/components/common/DeleteModal";
import UpdateEmployeeModal from "./UpdateEmployeeModal";
import { IEmployee } from "../../owner/employees/EmployeeTypes";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

const headCells = [
  { id: "employeeCode", label: "Employee ID" },
  { id: "firstName", label: "Name" },
  { id: "email", label: "Email" },
  { id: "departmentName", label: "Department" },
  { id: "roleName", label: "Role" },
  { id: "workType", label: "Work Type" },
  { id: "employmentStatus", label: "Status" },
];

interface Props {
  data: IEmployee[];
  onUpdateEmployee: (employee: IEmployee) => void;
  onDeleteEmployee: (employeeId: string) => void;
}

const EmployeesTable: React.FC<Props> = ({ data, onUpdateEmployee, onDeleteEmployee }) => {
  const router = useRouter();

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editData, setEditData] = useState<IEmployee | null>(null);

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
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleSelectAllClick,
  } = useMaterialTableHook<IEmployee>(memoData, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Probation': return 'warning';
      case 'Resigned': return 'info';
      case 'Terminated': return 'error';
      default: return 'default';
    }
  };

  const getWorkTypeColor = (workType: string) => {
    switch (workType) {
      case 'Full-time': return 'primary';
      case 'Part-time': return 'secondary';
      case 'Contract': return 'info';
      case 'Intern': return 'warning';
      default: return 'default';
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = headCells.map(cell => cell.label);
    
    const rows = filteredRows.map(employee => [
      employee.employeeCode,
      `${employee.firstName} ${employee.lastName}`,
      employee.email,
      employee.departmentName,
      employee.roleName,
      employee.workType,
      employee.employmentStatus,
      employee.preferredName || '',
      employee.phone || '',
      employee.hireDate || '',
      employee.jobTitle || ''
    ]);
    
    return {
      headers: [...headers, 'Preferred Name', 'Phone', 'Hire Date', 'Job Title'],
      rows,
      title: `Employees Export - ${filteredRows.length} records`
    };
  }, [filteredRows]);

  return (
    <>
      <div className="card__wrapper">
        <div className="manaz-common-mat-list w-full table__wrapper">
          
          {/* Top Controls Row */}
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
                  placeholder="Search employees..."
                />
              </Box>
            </Grid>
            
            {/* Export Options - Top Right */}
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
                />
              </Box>
            </Grid>
          </Grid>

          <Box>
            <Paper sx={{ mb: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell padding="checkbox">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600"
                          checked={selected.length > 0 && selected.length === filteredRows.length}
                          onChange={(e) => handleSelectAllClick(e.target.checked, filteredRows)}
                        />
                      </TableCell>
                      {headCells.map((headCell) => (
                        <TableCell key={headCell.id} className="font-semibold">
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={() => handleRequestSort(headCell.id)}
                          >
                            {headCell.label}
                            {orderBy === headCell.id && (
                              <Box component="span" sx={visuallyHidden}>
                                {order === "desc"
                                  ? "sorted descending"
                                  : "sorted ascending"}
                              </Box>
                            )}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                      <TableCell className="font-semibold">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={headCells.length + 2} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <i className="fa-solid fa-users text-gray-400 text-4xl mb-2"></i>
                            <Typography variant="body1" className="text-gray-600 mb-2">
                              No employees found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {searchQuery.trim()
                                ? `Try adjusting your search query: "${searchQuery}"`
                                : "Try adding employees to see results"}
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRows.map((row, index) => (
                        <TableRow
                          key={row.employeeId}
                          selected={selected.includes(index)}
                          hover
                          onClick={() => handleClick(index)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={selected.includes(index)}
                              onChange={() => handleClick(index)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="font-mono font-semibold">
                              {row.employeeCode}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar
                                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                                src={row.profilePhoto}
                              >
                                {row.firstName?.[0]}{row.lastName?.[0]}
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {row.firstName} {row.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {row.preferredName || row.firstName}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>{row.email}</TableCell>

                          <TableCell>
                            <Chip
                              label={row.departmentName}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>

                          <TableCell>{row.roleName}</TableCell>

                          <TableCell>
                            <Chip
                              label={row.workType}
                              size="small"
                              color={getWorkTypeColor(row.workType) as any}
                              variant="outlined"
                            />
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={row.employmentStatus}
                              size="small"
                              color={getStatusColor(row.employmentStatus) as any}
                            />
                          </TableCell>

                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                              <button
                                className="table__icon edit p-2 hover:bg-blue-50 rounded"
                                onClick={(e) => router.push(
                                  `/super-admin/employees/update-employee/${row.employeeId}`
                                )}
                              >
                                <i className="fa-light fa-pen text-blue-600"></i>
                              </button>

                              <button
                                className="table__icon view p-2 hover:bg-green-50 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    `/super-admin/employees/${row.employeeId}`
                                  );
                                }}
                                title="View Details"
                              >
                                <i className="fa-light fa-eye text-green-600"></i>
                              </button>

                              <button
                                className="table__icon delete p-2 hover:bg-red-50 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteId(row.employeeId);
                                  setModalDeleteOpen(true);
                                }}
                                title="Delete"
                              >
                                <i className="fa-regular fa-trash text-red-600"></i>
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
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
                    <div className="text-sm text-gray-600">Full-time</div>
                    <div className="text-xl font-semibold text-blue-600">
                      {filteredRows.filter(e => e.workType === "Full-time").length}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Departments</div>
                    <div className="text-xl font-semibold">
                      {new Set(filteredRows.map(e => e.departmentName)).size}
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
                  )} of ${filteredRows.length} employees`}
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
              <Typography variant="body2">
                {selected.length} employee{selected.length > 1 ? 's' : ''} selected
              </Typography>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
                  onClick={() => {
                    const selectedEmployees = selected.map(index => filteredRows[index]);
                    console.log('Bulk export employees:', selectedEmployees);
                  }}
                >
                  <i className="fa-regular fa-download mr-1"></i>
                  Export Selected
                </button>
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
                  onClick={() => {
                    const selectedEmployees = selected.map(index => filteredRows[index]);
                    console.log('Bulk toggle status:', selectedEmployees);
                  }}
                >
                  <i className="fa-solid fa-toggle-on mr-1"></i>
                  Toggle Status
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${selected.length} employee${selected.length > 1 ? 's' : ''}?`)) {
                      selected.forEach(index => {
                        const employee = filteredRows[index];
                        if (employee) onDeleteEmployee(employee.employeeId);
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

      {updateModalOpen && editData && (
        <UpdateEmployeeModal
          open={updateModalOpen}
          setOpen={setUpdateModalOpen}
          editData={editData}
          onUpdateEmployee={onUpdateEmployee}
        />
      )}

      {modalDeleteOpen && (
        <DeleteModal
          open={modalDeleteOpen}
          setOpen={setModalDeleteOpen}
          onConfirm={() => onDeleteEmployee(deleteId)}
        />
      )}
    </>
  );
};

export default EmployeesTable;