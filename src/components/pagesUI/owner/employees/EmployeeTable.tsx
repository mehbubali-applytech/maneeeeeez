// EmployeeTable.tsx
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
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Switch,
  Grid,
  TextField,
  Select,
  Pagination,
  TableSortLabel
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Email,
  Phone,
  Business,
  LocationOn,
  AccessTime,
  PersonOff,
  FileDownload,
  Send
} from "@mui/icons-material";
import { IEmployee } from "./EmployeeTypes";
import { visuallyHidden } from "@mui/utils";
import DeleteModal from "@/components/common/DeleteModal";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface EmployeeTableProps {
  data: IEmployee[];
  onEdit: (employee: IEmployee) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  onSendOnboardingEmail?: (employee: IEmployee) => void;
}

// Table head cells
const employeeHeadCells = [
  { id: "employee", label: "Employee" },
  { id: "contact", label: "Contact" },
  { id: "jobDetails", label: "Job Details" },
  { id: "status", label: "Status" },
  { id: "joiningDate", label: "Joining Date" },
];

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  data,
  onEdit,
  onDelete,
  onStatusChange,
  onSendOnboardingEmail
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("employee");

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map(emp => emp.employeeId));
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: IEmployee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-success';
      case 'on probation': return 'bg-warning';
      case 'resigned': return 'bg-info';
      case 'terminated': return 'bg-danger';
      case 'draft': return 'bg-secondary';
      case 'inactive': return 'bg-danger';
      default: return 'default-badge';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Filter data based on search query
  const filteredData = data.filter(employee => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(searchLower) ||
      employee.lastName.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower) ||
      employee.employeeCode?.toLowerCase().includes(searchLower) ||
      employee.roleName?.toLowerCase().includes(searchLower) ||
      employee.departmentName?.toLowerCase().includes(searchLower)
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === "employee") {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return order === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    return 0;
  });

  // Paginate data
  const paginatedRows = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setModalDeleteOpen(false);
    setSelected(selected.filter(item => item !== id));
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Employee Name",
      "Employee ID",
      "Email",
      "Phone",
      "Role",
      "Department",
      "Shift",
      "Employment Status",
      "Joining Date",
      "Location"
    ];
    
    const rows = sortedData.map(employee => {
      return [
        `${employee.firstName} ${employee.lastName}`,
        employee.employeeCode || employee.employeeId,
        employee.email,
        formatPhone(employee.phoneNumber),
        employee.roleName || "-",
        employee.departmentName || "-",
        employee.shiftName || "-",
        employee.employmentStatus,
        formatDate(employee.dateOfJoining),
        employee.workLocation || "-"
      ];
    });
    
    return {
      headers,
      rows,
      title: `Employees Export - ${sortedData.length} records`
    };
  }, [sortedData]);

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
                    placeholder="Search employees..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right (Only new addition) */}
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
            
            {/* Main Table - Keeping original structure */}
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
                            indeterminate={selected.length > 0 && selected.length < filteredData.length}
                            checked={filteredData.length > 0 && selected.length === filteredData.length}
                            onChange={handleSelectAllClick}
                            size="small"
                          />
                        </TableCell>
                        {employeeHeadCells.map((headCell) => (
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
                      {paginatedRows.map((employee) => {
                        const statusClass = getStatusColor(employee.employmentStatus);
                        
                        return (
                          <TableRow
                            key={employee.employeeId}
                            hover
                            selected={selected.includes(employee.employeeId)}
                            onClick={() => handleClick(employee.employeeId)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                className="custom-checkbox checkbox-small"
                                checked={selected.includes(employee.employeeId)}
                                onChange={() => handleClick(employee.employeeId)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar
                                  src={employee.profilePhoto}
                                  sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}
                                >
                                  {getInitials(employee.firstName, employee.lastName)}
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {employee.preferredName || `${employee.firstName} ${employee.lastName}`}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {employee.employeeCode || employee.employeeId}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center">
                                  <Email className="mr-1 text-gray-500" fontSize="small" />
                                  <span className="text-sm">{employee.email}</span>
                                </div>
                                {employee.phoneNumber && (
                                  <div className="flex items-center">
                                    <Phone className="mr-1 text-gray-500" fontSize="small" />
                                    <span className="text-sm">{formatPhone(employee.phoneNumber)}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center">
                                  <Business className="mr-1 text-gray-500" fontSize="small" />
                                  <span className="text-sm">{employee.roleName || '-'}</span>
                                </div>
                                <div className="flex items-center">
                                  <LocationOn className="mr-1 text-gray-500" fontSize="small" />
                                  <span className="text-sm">{employee.departmentName || '-'}</span>
                                </div>
                                {employee.shiftName && (
                                  <div className="flex items-center">
                                    <AccessTime className="mr-1 text-gray-500" fontSize="small" />
                                    <span className="text-sm">{employee.shiftName}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                 {onStatusChange && (
                                  <Tooltip title="Toggle Active Status">
                                    <Switch
                                      size="small"
                                      className="custom-switch"
                                      checked={employee.employmentStatus === 'Active'}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        onStatusChange(
                                          employee.employeeId,
                                          e.target.checked ? 'Active' : 'Inactive'
                                        );
                                      }}
                                      color="success"
                                    />
                                  </Tooltip>
                                )}
                                <span className={`bd-badge ${statusClass}`}>
                                  {employee.employmentStatus}
                                </span>
                               
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{formatDate(employee.dateOfJoining)}</span>
                            </TableCell>
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(employee);
                                  }}
                                  title="Edit Employee"
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon download"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/owner/employees/${employee.employeeId}`;
                                  }}
                                  title="View Profile"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(employee.employeeId);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Employee"
                                >
                                  <i className="fa-regular fa-trash"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMenuOpen(e, employee);
                                  }}
                                  title="More Actions"
                                >
                                  <MoreVert fontSize="small" />
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
            
            {/* Bottom Controls - Keeping original structure */}
            <Box className="table-search-box mt-[30px]" sx={{ p: 2 }}>
              <Box>
                {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                  page * rowsPerPage,
                  filteredData.length
                )} of ${filteredData.length} entries`}
                {searchQuery && (
                  <span className="ml-2 text-sm text-gray-600">
                    (Filtered by: `{searchQuery}`)
                  </span>
                )}
              </Box>
              <Pagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
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

      {/* Bulk Actions Bar - Keeping original */}
      {selected.length > 0 && (
        <div className="card__wrapper mb-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-primary-700 font-medium">
                {selected.length} employee(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedEmployees = data.filter(emp => selected.includes(emp.employeeId));
                    console.log('Bulk send onboarding:', selectedEmployees);
                  }}
                >
                  <Send fontSize="small" />
                  Send Onboarding
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    console.log('Bulk export:', selected);
                  }}
                >
                  <FileDownload fontSize="small" />
                  Export Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} employee(s)?`)) {
                      selected.forEach(id => onDelete(id));
                      setSelected([]);
                    }
                  }}
                >
                  <Delete fontSize="small" />
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions Menu - Keeping original */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedEmployee && (
          <>
            <MenuItem onClick={() => {
              onEdit(selectedEmployee);
              handleMenuClose();
            }}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Edit Employee
            </MenuItem>
            
            {onSendOnboardingEmail && selectedEmployee.systemUserEnabled && (
              <MenuItem onClick={() => {
                onSendOnboardingEmail(selectedEmployee);
                handleMenuClose();
              }}>
                <Send fontSize="small" sx={{ mr: 1 }} />
                Send Onboarding Email
            </MenuItem>
            )}
            
            <MenuItem onClick={() => {
              handleMenuClose();
            }}>
              <FileDownload fontSize="small" sx={{ mr: 1 }} />
              Export Profile
            </MenuItem>
            
            <MenuItem onClick={() => {
              if (onStatusChange) {
                const newStatus = selectedEmployee.employmentStatus === 'Active' ? 'Inactive' : 'Active';
                onStatusChange(selectedEmployee.employeeId, newStatus);
              }
              handleMenuClose();
            }}>
              <PersonOff fontSize="small" sx={{ mr: 1 }} />
              {selectedEmployee.employmentStatus === 'Active' ? 'Deactivate' : 'Activate'}
            </MenuItem>
            
            <MenuItem onClick={() => {
              setDeleteId(selectedEmployee.employeeId);
              setModalDeleteOpen(true);
              handleMenuClose();
            }} sx={{ color: 'error.main' }}>
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete Employee
            </MenuItem>
          </>
        )}
      </Menu>

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

export default EmployeeTable; 