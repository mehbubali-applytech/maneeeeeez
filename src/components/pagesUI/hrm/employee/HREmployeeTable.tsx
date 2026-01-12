// HREmployeeTable.tsx
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
  LinearProgress,
  Grid,
  TextField,
  Pagination,
  TableSortLabel,
  Badge,
  Button,
  Divider
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
  Send,
  Checklist,
  Assessment,
  School,
  ExitToApp,
  CalendarToday,
  Task,
  Visibility,
  Download,
  Upload
} from "@mui/icons-material";
import { IHREmployee } from "./HREmployeeTypes";
import { visuallyHidden } from "@mui/utils";
import DeleteModal from "@/components/common/DeleteModal";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface HREmployeeTableProps {
  data: IHREmployee[];
  onEdit: (employee: IHREmployee) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  onOnboardingComplete?: (id: string) => void;
  onSendOnboardingEmail?: (employee: IHREmployee) => void;
}

const hrHeadCells = [
  { id: "employee", label: "Employee" },
  { id: "jobDetails", label: "Job Details" },
  { id: "hrStatus", label: "HR Status" },
  { id: "onboarding", label: "Onboarding" },
  { id: "performance", label: "Performance" },
  { id: "attendance", label: "Attendance" },
  { id: "actions", label: "Actions" }
];

const HREmployeeTable: React.FC<HREmployeeTableProps> = ({
  data,
  onEdit,
  onDelete,
  onStatusChange,
  onOnboardingComplete,
  onSendOnboardingEmail
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<IHREmployee | null>(null);
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: IHREmployee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const getWorkflowStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'success';
      case 'on probation': return 'warning';
      case 'new hire': return 'info';
      case 'on leave': return 'info';
      case 'notice period': return 'error';
      case 'exit': return 'error';
      default: return 'default';
    }
  };

  const getOnboardingStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'warning';
      case 'pending': return 'error';
      case 'on hold': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
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
      "Department",
      "Role",
      "HR Status",
      "Onboarding Status",
      "Performance Rating",
      "Attendance %",
      "Joining Date",
      "HR Manager"
    ];
    
    const rows = sortedData.map(employee => {
      return [
        `${employee.firstName} ${employee.lastName}`,
        employee.employeeCode || employee.employeeId,
        employee.departmentName || "-",
        employee.roleName || "-",
        employee.workflowStatus,
        employee.onboardingStatus,
        employee.performanceRating?.toString() || "-",
        employee.attendanceCompliance?.toString() + "%" || "-",
        formatDate(employee.dateOfJoining),
        employee.hrManagerName || "-"
      ];
    });
    
    return {
      headers,
      rows,
      title: `HR Employees Report - ${sortedData.length} records`
    };
  }, [sortedData]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            
            {/* Top Controls Row */}
            <Grid container spacing={2} alignItems="center" className="mb-4">
              <Grid item xs={12} md={6}>
                <Box className="flex items-center gap-4">
                  <Typography variant="body2" className="whitespace-nowrap">
                    Search:
                  </Typography>
                  <TextField
                    id="hr-search"
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
              
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end gap-2">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `hr_employees_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `HR Employees Report - ${new Date().toLocaleDateString()}`
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Send />}
                    onClick={() => {
                      const selectedEmployees = data.filter(emp => selected.includes(emp.employeeId));
                      console.log('Bulk send onboarding emails:', selectedEmployees);
                    }}
                    disabled={selected.length === 0}
                  >
                    Bulk Email
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    onClick={() => {
                      console.log('Download HR template');
                    }}
                  >
                    HR Template
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {/* Main Table */}
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
                        {hrHeadCells.map((headCell) => (
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
                      </TableRow>
                    </TableHead>
                    
                    <TableBody className="table__body">
                      {paginatedRows.map((employee) => {
                        const onboardingColor = getOnboardingStatusColor(employee.onboardingStatus);
                        const workflowColor = getWorkflowStatusColor(employee.workflowStatus);
                        
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
                            
                            {/* Employee Column */}
                            <TableCell>
                              <div className="flex items-center">
                                <Badge
                                  overlap="circular"
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                  badgeContent={
                                    employee.onboardingStatus === "Pending" ? (
                                      <small className="bd-badge bg-danger">New</small>
                                    ) : null
                                  }
                                >
                                  <Avatar
                                    src={employee.profilePhoto}
                                    sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}
                                  >
                                    {getInitials(employee.firstName, employee.lastName)}
                                  </Avatar>
                                </Badge>
                                <div>
                                  <div className="font-medium">
                                    {employee.preferredName || `${employee.firstName} ${employee.lastName}`}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {employee.employeeCode || employee.employeeId}
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <Email fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
                                    <span className="text-xs">{employee.email}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            
                            {/* Job Details Column */}
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center">
                                  <Business sx={{ fontSize: 14, mr: 0.5 }} />
                                  <span className="text-sm">{employee.roleName || '-'}</span>
                                </div>
                                <div className="flex items-center">
                                  <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                                  <span className="text-sm">{employee.departmentName || '-'}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Joined: {formatDate(employee.dateOfJoining)}
                                </div>
                              </div>
                            </TableCell>
                            
                            {/* HR Status Column */}
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Chip
                                  label={employee.workflowStatus}
                                  size="small"
                                  color={workflowColor as any}
                                  variant="outlined"
                                />
                                {employee.employmentStatus === "On Probation" && (
                                  <Chip
                                    label="On Probation"
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                  />
                                )}
                                {employee.hrManagerName && (
                                  <div className="text-xs text-gray-500">
                                    HR: {employee.hrManagerName}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            
                            {/* Onboarding Column */}
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Chip
                                  label={employee.onboardingStatus}
                                  size="small"
                                  color={onboardingColor as any}
                                  variant="outlined"
                                />
                                {employee.onboardingStatus !== "Completed" && onOnboardingComplete && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Checklist />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOnboardingComplete(employee.employeeId);
                                    }}
                                  >
                                    Complete
                                  </Button>
                                )}
                                {employee.orientationCompleted && (
                                  <Chip
                                    label="Oriented"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                )}
                              </div>
                            </TableCell>
                            
                            {/* Performance Column */}
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {employee.performanceRating ? (
                                  <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="body2">
                                        {employee.performanceRating}/5
                                      </Typography>
                                      <LinearProgress
                                        variant="determinate"
                                        value={(employee.performanceRating / 5) * 100}
                                        sx={{ flex: 1, height: 6 }}
                                        color={
                                          employee.performanceRating >= 4 ? "success" :
                                          employee.performanceRating >= 3 ? "warning" : "error"
                                        }
                                      />
                                    </Box>
                                    {employee.nextAppraisalDate && (
                                      <Typography variant="caption" color="text.secondary">
                                        Next: {formatDate(employee.nextAppraisalDate)}
                                      </Typography>
                                    )}
                                  </>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    Not rated
                                  </Typography>
                                )}
                              </div>
                            </TableCell>
                            
                            {/* Attendance Column */}
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {employee.attendanceCompliance ? (
                                  <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="body2">
                                        {employee.attendanceCompliance}%
                                      </Typography>
                                      <LinearProgress
                                        variant="determinate"
                                        value={employee.attendanceCompliance}
                                        sx={{ flex: 1, height: 6 }}
                                        color={
                                          employee.attendanceCompliance >= 95 ? "success" :
                                          employee.attendanceCompliance >= 90 ? "warning" : "error"
                                        }
                                      />
                                    </Box>
                                    {employee.attendanceSummary && (
                                      <Typography variant="caption" color="text.secondary">
                                        {employee.attendanceSummary.present}P / {employee.attendanceSummary.absent}A
                                      </Typography>
                                    )}
                                  </>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    No data
                                  </Typography>
                                )}
                              </div>
                            </TableCell>
                            
                            {/* Actions Column */}
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <Tooltip title="View Profile">
                                  <button
                                    type="button"
                                    className="table__icon view bg-info"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/hrm/employee/${employee.employeeId}`;
                                    }}
                                  >
                                    <i className="fa-regular fa-eye"></i>
                                  </button>
                                </Tooltip>
                                
                                <Tooltip title="Edit">
                                  <button
                                    type="button"
                                    className="table__icon edit"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit(employee);
                                    }}
                                  >
                                    <i className="fa-regular fa-pen-to-square"></i>
                                  </button>
                                </Tooltip>
                                
                                <Tooltip title="HR Actions">
                                  <button
                                    type="button"
                                    className="table__icon bg-secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMenuOpen(e, employee);
                                    }}
                                  >
                                    <MoreVert fontSize="small" />
                                  </button>
                                </Tooltip>
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
            
            {/* Bottom Controls */}
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

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="card__wrapper mb-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-primary-700 font-medium">
                {selected.length} employee(s) selected
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Send />}
                  onClick={() => {
                    console.log('Send bulk onboarding emails');
                  }}
                >
                  Send Onboarding
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Assessment />}
                  onClick={() => {
                    console.log('Schedule bulk appraisals');
                  }}
                >
                  Schedule Appraisals
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<School />}
                  onClick={() => {
                    console.log('Assign bulk training');
                  }}
                >
                  Assign Training
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => {
                    console.log('Export selected');
                  }}
                >
                  Export Selected
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HR Actions Menu */}
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
            
            <MenuItem onClick={() => {
              window.location.href = `/hrm/employee/${selectedEmployee.employeeId}`;
              handleMenuClose();
            }}>
              <Visibility fontSize="small" sx={{ mr: 1 }} />
              View Profile
            </MenuItem>
            
            <MenuItem onClick={() => {
              console.log('View onboarding checklist');
              handleMenuClose();
            }}>
              <Checklist fontSize="small" sx={{ mr: 1 }} />
              Onboarding Checklist
            </MenuItem>
            
            <MenuItem onClick={() => {
              console.log('View performance');
              handleMenuClose();
            }}>
              <Assessment fontSize="small" sx={{ mr: 1 }} />
              Performance Review
            </MenuItem>
            
            <MenuItem onClick={() => {
              console.log('Assign training');
              handleMenuClose();
            }}>
              <School fontSize="small" sx={{ mr: 1 }} />
              Assign Training
            </MenuItem>
            
            {selectedEmployee.workflowStatus === "Notice Period" && (
              <MenuItem onClick={() => {
                console.log('Start exit process');
                handleMenuClose();
              }}>
                <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                Exit Process
              </MenuItem>
            )}
            
            {selectedEmployee.employmentStatus === "On Probation" && (
              <MenuItem onClick={() => {
                console.log('Schedule probation review');
                handleMenuClose();
              }}>
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                Probation Review
              </MenuItem>
            )}
            
            <Divider />
            
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

      {/* Delete Modal */}
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

export default HREmployeeTable;