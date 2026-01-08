"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Checkbox,
  TableSortLabel,
  Pagination,
  Grid,
  TextField,
  Select,
  MenuItem,
  Typography,
  Chip,
  Tooltip,
  Switch,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DeleteModal from "@/components/common/DeleteModal";
import { IDepartment } from "./DepartmentTypes";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";

interface Props {
  data: IDepartment[];
  onEdit?: (department: IDepartment) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

// Table head cells
const departmentHeadCells = [
  { id: "departmentName", label: "Department Name" },
  { id: "departmentCode", label: "Code" },
  { id: "departmentType", label: "Type" },
  { id: "managerName", label: "Manager" },
  { id: "employeeCount", label: "Employees" },
  { id: "projectsCount", label: "Projects" },
  { id: "budget", label: "Budget" },
  { id: "status", label: "Status" },
  { id: "createdAt", label: "Created" },
];

const DepartmentsTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("departmentName");

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map(dept => dept.id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

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

  const formatCurrency = (amount: number, currency: string = "₹") => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'archived': return 'secondary';
      case 'planned': return 'info';
      default: return 'default';
    }
  };

  const getTypeClass = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'technical': return 'primary';
      case 'administrative': return 'success';
      case 'marketing': return 'warning';
      case 'hr': return 'info';
      case 'finance': return 'error';
      case 'operations': return 'secondary';
      default: return 'default';
    }
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Filter data based on search query
  const filteredData = data.filter(dept => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      dept.departmentName.toLowerCase().includes(searchLower) ||
      dept.departmentCode.toLowerCase().includes(searchLower) ||
      dept.managerName?.toLowerCase().includes(searchLower) ||
      dept.departmentType?.toLowerCase().includes(searchLower)
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === "departmentName" || orderBy === "departmentCode" || orderBy === "managerName" || orderBy === "departmentType" || orderBy === "status") {
      const valueA = a[orderBy]?.toLowerCase() || '';
      const valueB = b[orderBy]?.toLowerCase() || '';
      return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    if (orderBy === "employeeCount" || orderBy === "projectsCount" || orderBy === "budget") {
      return order === "asc" ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
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

  const handleDelete = (id: number) => {
    onDelete?.(id);
    setModalDeleteOpen(false);
    // Remove from selected if it was selected
    setSelected(selected.filter(item => item !== id));
  };

  const handleStatusChange = (id: number, currentStatus: string) => {
    if (onStatusChange) {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      onStatusChange(id, newStatus);
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = departmentHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(dept => {
      return [
        dept.departmentName,
        dept.departmentCode,
        dept.departmentType,
        dept.managerName || "-",
        dept.employeeCount.toString(),
        dept.projectsCount.toString(),
        formatCurrency(dept.budget, dept.currency),
        dept.status,
        formatDate(dept.createdAt)
      ];
    });
    
    return {
      headers,
      rows,
      title: `Departments Export - ${sortedData.length} records`
    };
  }, [sortedData]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            
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
                    placeholder="Search departments..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `departments_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Departments Report - ${new Date().toLocaleDateString()}`
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>
            
            {/* Main Table */}
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
                            indeterminate={selected.length > 0 && selected.length < sortedData.length}
                            checked={sortedData.length > 0 && selected.length === sortedData.length}
                            onChange={handleSelectAllClick}
                            size="small"
                          />
                        </TableCell>
                        {departmentHeadCells.map((headCell) => (
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
                          <TableCell colSpan={departmentHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <BusinessIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                No departments found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {searchQuery.trim()
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : "Try adding departments to see results"}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((dept) => {
                          const statusClass = getStatusClass(dept.status);
                          const typeClass = getTypeClass(dept.departmentType);
                          
                          return (
                            <TableRow
                              key={dept.id}
                              hover
                              selected={selected.includes(dept.id)}
                              onClick={() => handleClick(dept.id)}
                              className={`hover:bg-blue-50 ${selected.includes(dept.id) ? 'bg-blue-50' : ''}`}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="custom-checkbox checkbox-small"
                                  checked={selected.includes(dept.id)}
                                  onChange={() => handleClick(dept.id)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="font-medium flex items-center gap-2">
                                  <BusinessIcon fontSize="small" className="text-gray-400" />
                                  {dept.departmentName}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {dept.departmentCode}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={dept.departmentType}
                                  size="small"
                                  variant="outlined"
                                  color={typeClass as any}
                                />
                              </TableCell>
                              <TableCell>
                                <Tooltip title={dept.managerName || "No manager assigned"}>
                                  <span className="font-medium">
                                    {truncateText(dept.managerName, 20)}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <PeopleIcon fontSize="small" className="text-gray-400" />
                                  <span className="font-semibold">{dept.employeeCount}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <WorkIcon fontSize="small" className="text-gray-400" />
                                  <span className="font-semibold">{dept.projectsCount}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <AccountBalanceIcon fontSize="small" className="text-gray-400" />
                                  <div className="font-medium">
                                    {formatCurrency(dept.budget, dept.currency)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    size="small"
                                    checked={(dept.status || "Inactive") === "Active"}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(dept.id, dept.status || "Inactive");
                                    }}
                                    color={(dept.status || "Inactive") === "Active" ? "success" : "default"}
                                  />
                                  <Chip
                                    label={dept.status || "Inactive"}
                                    size="small"
                                    color={statusClass as any}
                                    variant="filled"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">
                                  {formatDate(dept.createdAt)}
                                </span>
                              </TableCell>
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-2">
                                  <button
                                    type="button"
                                    className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit?.(dept);
                                    }}
                                    title="Edit Department"
                                  >
                                    <i className="fa-light fa-edit text-blue-600"></i>
                                  </button>
                                  <button
                                    className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteId(dept.id);
                                      setModalDeleteOpen(true);
                                    }}
                                    title="Delete Department"
                                  >
                                    <i className="fa-regular fa-trash text-red-600"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="table__icon p-1.5 hover:bg-green-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // View department details
                                      console.log("View department details:", dept.id);
                                    }}
                                    title="View Details"
                                  >
                                    <i className="fa-light fa-eye text-green-600"></i>
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

            {/* Department Summary */}
            {sortedData.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Departments</div>
                      <div className="text-xl font-semibold">{sortedData.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Employees</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {sortedData.reduce((sum, dept) => sum + dept.employeeCount, 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Projects</div>
                      <div className="text-xl font-semibold text-green-600">
                        {sortedData.reduce((sum, dept) => sum + dept.projectsCount, 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Budget</div>
                      <div className="text-xl font-semibold">
                        {formatCurrency(sortedData.reduce((sum, dept) => sum + dept.budget, 0))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bottom Controls Row */}
            {sortedData.length > 0 && (
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
                        sortedData.length
                      )} of ${sortedData.length} entries`}
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
                      count={Math.ceil(sortedData.length / rowsPerPage)}
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
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2" className="text-white">
            {selected.length} department{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedDepartments = selected.map(id => data.find(d => d.id === id)).filter(Boolean);
                console.log('Bulk export departments:', selectedDepartments);
              }}
            >
              <i className="fa-regular fa-download mr-1"></i>
              Export Selected
            </button>
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
              onClick={() => {
                const selectedDepartments = selected.map(id => data.find(d => d.id === id)).filter(Boolean);
                console.log('Bulk toggle status:', selectedDepartments);
              }}
            >
              <i className="fa-solid fa-toggle-on mr-1"></i>
              Toggle Status
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selected.length} department${selected.length > 1 ? 's' : ''}?`)) {
                  selected.forEach(id => onDelete?.(id));
                  setSelected([]);
                }
              }}
            >
              <i className="fa-regular fa-trash mr-1"></i>
              Delete Selected
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
              onClick={() => setSelected([])}
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

export default DepartmentsTable;