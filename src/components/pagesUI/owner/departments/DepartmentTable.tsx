"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
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
  Switch,
  IconButton,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DeleteModal from "@/components/common/DeleteModal";
import { IDepartment } from "./DepartmentTypes";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import BusinessIcon from "@mui/icons-material/Business";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface Props {
  data: IDepartment[];
  onEdit?: (department: IDepartment) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

// Table head cells
const departmentHeadCells = [
  { id: "departmentName", label: "Department Name" },
  { id: "status", label: "Status" },
  { id: "subDeptName", label: "Sub Department" },
  { id: "subDeptStatus", label: "Status" },
];

const DepartmentsTable: React.FC<Props> = ({
  data = [],
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
  const [orderBy, setOrderBy] = useState<string>("dept_name");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  // Transform the data to match IDepartment interface
  const transformedData = useMemo(() => {
    return data.map(dept => ({
      ...dept,
      id: dept.dept_id,
      departmentName: dept.dept_name,
      statusText: dept.status === "1" ? "Active" : "Inactive",
      children: dept.children?.map(child => ({
        ...child,
        id: child.dept_id,
        departmentName: child.dept_name,
        statusText: child.status === "1" ? "Active" : "Inactive",
      })) || []
    }));
  }, [data]);

  // Get all IDs for selection
  const getAllIds = useMemo(() => {
    const allIds: number[] = [];
    transformedData.forEach(dept => {
      allIds.push(dept.dept_id);
      if (dept.children) {
        dept.children.forEach(child => {
          allIds.push(child.dept_id);
        });
      }
    });
    return allIds;
  }, [transformedData]);

  // Handle row selection
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(getAllIds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: number, event?: React.MouseEvent) => {
    // Prevent selection when clicking on switch or expand button
    const target = event?.target as HTMLElement;
    if (target.closest('.MuiSwitch-root') || 
        target.closest('.MuiIconButton-root') ||
        target.closest('.table__icon')) {
      return;
    }
    
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }

    setSelected(newSelected);
  };

  const handleCheckboxClick = (id: number, event: ChangeEvent<HTMLInputElement>) => {
    // No need to stop propagation since we're not using onClick but onChange
    const checked = event.target.checked;
    
    if (checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter(item => item !== id));
    }
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

  const toggleRowExpand = (deptId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedRows((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId]
    );
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!transformedData || !Array.isArray(transformedData)) return [];

    return transformedData.filter((dept) => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      const matches = (text: string) =>
        text?.toLowerCase().includes(searchLower);

      if (matches(dept.departmentName) || matches(dept.statusText)) {
        return true;
      }

      // Check children recursively
      if (dept.children) {
        return dept.children.some((child) =>
          matches(child.departmentName) || matches(child.statusText)
        );
      }

      return false;
    });
  }, [transformedData, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    return [...filteredData].sort((a, b) => {
      if (orderBy === "dept_name") {
        const valueA = a.dept_name?.toLowerCase() || "";
        const valueB = b.dept_name?.toLowerCase() || "";
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      if (orderBy === "status") {
        const valueA = a.status || "";
        const valueB = b.status || "";
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  // Get paginated rows
  const paginatedRows = useMemo(() => {
    const allRows: any[] = [];
    
    sortedData.forEach((parentDept) => {
      // Add parent row
      allRows.push({
        ...parentDept,
        isParent: true,
        rowSpan: parentDept.children?.length || 1,
      });
      
      // Add child rows if expanded
      if (parentDept.children && parentDept.children.length > 0 && expandedRows.includes(parentDept.dept_id)) {
        parentDept.children.forEach((childDept, childIndex) => {
          allRows.push({
            ...childDept,
            isParent: false,
            parentDeptId: parentDept.dept_id,
            isLastChild: childIndex === parentDept.children!.length - 1,
          });
        });
      }
    });
    
    // Apply pagination
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    return allRows.slice(startIndex, endIndex);
  }, [sortedData, page, rowsPerPage, expandedRows]);

  const totalItems = useMemo(() => {
    let count = 0;
    sortedData.forEach(dept => {
      count++; // Parent
      if (dept.children && dept.children.length > 0 && expandedRows.includes(dept.dept_id)) {
        count += dept.children.length; // Children if expanded
      }
    });
    return count;
  }, [sortedData, expandedRows]);

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
    setSelected(selected.filter((item) => item !== id));
  };

  const handleStatusChange = (dept_id: number, currentStatus: string, event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    
    if (onStatusChange) {
      const newStatus = currentStatus === "1" ? "0" : "1";
      onStatusChange(dept_id, newStatus);
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = ["Department Name", "Status", "Sub-Department", "Sub-Dept Status", "Created Date"];

    const rows: any[] = [];
    
    sortedData.forEach((dept) => {
      // Parent row
      rows.push([
        dept.departmentName || "N/A",
        dept.statusText || "N/A",
        "-",
        "-",
        formatDate(dept.created_at || ""),
      ]);
      
      // Child rows
      if (dept.children && dept.children.length > 0) {
        dept.children.forEach((child) => {
          rows.push([
            dept.departmentName || "N/A",
            dept.statusText || "N/A",
            child.departmentName || "N/A",
            child.status === "1" ? "Active" : "Inactive",
            formatDate(child.created_at || ""),
          ]);
        });
      }
    });
    
    return {
      headers,
      rows,
      title: `Departments Export - ${rows.length} records`,
    };
  }, [sortedData]);

  const isEmpty = !transformedData || transformedData.length === 0;

  const renderParentRow = (dept: any, rowIndex: number) => {
    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedRows.includes(dept.dept_id);
    const statusColor = dept.status === "1" ? "success" : "error";
    
    return (
      <TableRow
        key={`parent-${dept.dept_id}`}
        hover
        selected={selected.includes(dept.dept_id)}
        onClick={(e) => handleClick(dept.dept_id, e)}
        className={`hover:bg-blue-50 ${selected.includes(dept.dept_id) ? "bg-blue-50" : ""}`}
        sx={{
          '& > td:first-of-type': {
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
          },
          backgroundColor: 'grey.50',
          cursor: 'pointer',
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            className="custom-checkbox checkbox-small"
            checked={selected.includes(dept.dept_id)}
            onChange={(e) => handleCheckboxClick(dept.dept_id, e)}
            size="small"
          />
        </TableCell>
        <TableCell>
          <div className="font-medium flex items-center gap-2">
            {hasChildren && (
              <IconButton
                size="small"
                onClick={(e) => toggleRowExpand(dept.dept_id, e)}
                className="expand-button"
              >
                {isExpanded ? (
                  <KeyboardArrowUpIcon fontSize="small" />
                ) : (
                  <KeyboardArrowDownIcon fontSize="small" />
                )}
              </IconButton>
            )}
            <BusinessIcon fontSize="small" className="text-gray-400" />
            <span style={{ fontWeight: 600 }}>
              {dept.departmentName || "Unnamed Department"}
              {hasChildren && (
                <Chip
                  label={`${dept.children.length} sub-department${dept.children.length > 1 ? 's' : ''}`}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              )}
            </span>
          </div>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {/* <Switch
              size="small"
              checked={dept.status === "1"}
              onChange={(e) => handleStatusChange(dept.dept_id, dept.status, e)}
              color={dept.status === "1" ? "success" : "default"}
              className="status-switch"
            /> */}
            <Chip
              label={dept.statusText || (dept.status === "1" ? "Active" : "Inactive")}
              size="small"
              color={statusColor}
              variant="filled"
            />
          </div>
        </TableCell>
        <TableCell colSpan={2}>
          {hasChildren ? (
            <Typography variant="body2" color="text.secondary">
              {isExpanded ? "Showing sub-departments below" : "Click arrow to view sub-departments"}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              No sub-departments
            </Typography>
          )}
        </TableCell>
        <TableCell className="table__icon-box" onClick={(e) => e.stopPropagation()}>
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
            {/* <button
              className="table__icon delete p-1.5 hover:bg-red-100 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(dept.dept_id);
                setModalDeleteOpen(true);
              }}
              title="Delete Department"
            >
              <i className="fa-regular fa-trash text-red-600"></i>
            </button> */}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderChildRow = (dept: any, rowIndex: number) => {
    const statusColor = dept.status === "1" ? "success" : "error";
    
    return (
      <TableRow
        key={`child-${dept.dept_id}`}
        hover
        selected={selected.includes(dept.dept_id)}
        onClick={(e) => handleClick(dept.dept_id, e)}
        className={`hover:bg-blue-50 ${selected.includes(dept.dept_id) ? "bg-blue-50" : ""}`}
        sx={{
          backgroundColor: 'grey.100',
          '& > td:first-of-type': {
            borderLeft: '4px solid',
            borderLeftColor: 'grey.400',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '-4px',
              top: 0,
              height: '100%',
              width: '2px',
              backgroundColor: 'grey.400',
            }
          },
          cursor: 'pointer',
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            className="custom-checkbox checkbox-small"
            checked={selected.includes(dept.dept_id)}
            onChange={(e) => handleCheckboxClick(dept.dept_id, e)}
            size="small"
          />
        </TableCell>
        <TableCell>
          {/* Empty for child rows - parent name shown in previous row */}
        </TableCell>
        <TableCell>
          {/* Empty for child rows - parent status shown in previous row */}
        </TableCell>
        <TableCell>
          <div className="font-medium flex items-center gap-2 ml-8">
            <BusinessIcon fontSize="small" className="text-gray-500" />
            <span>
              {dept.departmentName || "Unnamed Sub-Department"}
            </span>
          </div>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {/* <Switch
              size="small"
              checked={dept.status === "1"}
              onChange={(e) => handleStatusChange(dept.dept_id, dept.status, e)}
              color={dept.status === "1" ? "success" : "default"}
              className="status-switch"
            /> */}
            <Chip
              label={dept.statusText || (dept.status === "1" ? "Active" : "Inactive")}
              size="small"
              color={statusColor}
              variant="filled"
            />
          </div>
        </TableCell>
        <TableCell className="table__icon-box" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-start gap-2">
            <button
              type="button"
              className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(dept);
              }}
              title="Edit Sub-Department"
            >
              <i className="fa-light fa-edit text-blue-600"></i>
            </button>
            {/* <button
              className="table__icon delete p-1.5 hover:bg-red-100 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(dept.dept_id);
                setModalDeleteOpen(true);
              }}
              title="Delete Sub-Department"
            >
              <i className="fa-regular fa-trash text-red-600"></i>
            </button> */}
          </div>
        </TableCell>
      </TableRow>
    );
  };

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
                    id="outlined-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    size="small"
                    className="manaz-table-search-input"
                    sx={{ width: "100%", maxWidth: 300 }}
                    placeholder="Search departments..."
                    disabled={isEmpty}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `departments_${new Date().toISOString().split("T")[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Departments Report - ${new Date().toLocaleDateString()}`,
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                    disabled={isEmpty}
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
                        <TableCell padding="checkbox" width="5%">
                          <Checkbox
                            className="custom-checkbox checkbox-small"
                            color="primary"
                            indeterminate={
                              selected.length > 0 && selected.length < getAllIds.length
                            }
                            checked={getAllIds.length > 0 && selected.length === getAllIds.length}
                            onChange={handleSelectAllClick}
                            size="small"
                            disabled={isEmpty}
                          />
                        </TableCell>
                        <TableCell width="25%" className="table__title !font-semibold">
                          <TableSortLabel
                            active={orderBy === "dept_name"}
                            direction={orderBy === "dept_name" ? order : "asc"}
                            onClick={() => handleRequestSort("dept_name")}
                            disabled={isEmpty}
                          >
                            Department Name
                            {orderBy === "dept_name" ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === "desc" ? "sorted descending" : "sorted ascending"}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                        <TableCell width="20%" className="table__title !font-semibold">
                          <TableSortLabel
                            active={orderBy === "status"}
                            direction={orderBy === "status" ? order : "asc"}
                            onClick={() => handleRequestSort("status")}
                            disabled={isEmpty}
                          >
                            Status
                            {orderBy === "status" ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === "desc" ? "sorted descending" : "sorted ascending"}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                        <TableCell width="25%" className="table__title !font-semibold">
                          Sub Department
                        </TableCell>
                        <TableCell width="20%" className="table__title !font-semibold">
                          Status
                        </TableCell>
                        <TableCell width="5%" className="table__title !font-semibold">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody className="table__body">
                      {isEmpty ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <BusinessIcon
                                className="text-gray-400 mb-2"
                                fontSize="large"
                              />
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
                        paginatedRows.map((row, index) => 
                          row.isParent 
                            ? renderParentRow(row, index)
                            : renderChildRow(row, index)
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            {/* Summary Stats */}
            {!isEmpty && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Departments</div>
                      <div className="text-xl font-semibold">
                        {sortedData.length + sortedData.reduce((acc, dept) => 
                          acc + (dept.children?.length || 0), 0
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Parent Departments</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {sortedData.filter((dept) => dept.is_parent === 1).length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active</div>
                      <div className="text-xl font-semibold text-green-600">
                        {sortedData.filter((dept) => dept.status === "1").length +
                          sortedData.reduce((acc, dept) => 
                            acc + (dept.children?.filter(child => child.status === "1").length || 0), 0
                          )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Sub-Departments</div>
                      <div className="text-xl font-semibold text-purple-600">
                        {sortedData.reduce((acc, dept) => acc + (dept.children?.length || 0), 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls Row */}
            {!isEmpty && (
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
                        totalItems
                      )} of ${totalItems} entries`}
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
                      count={Math.ceil(totalItems / rowsPerPage)}
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
      {selected.length > 0 && !isEmpty && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2" className="text-white">
            {selected.length} department{selected.length > 1 ? "s" : ""} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedDepartments = selected
                  .map((id) => {
                    const parent = sortedData.find(d => d.dept_id === id);
                    if (parent) return parent;
                    // Check in children
                    for (const dept of sortedData) {
                      const child = dept.children?.find(c => c.dept_id === id);
                      if (child) return child;
                    }
                    return null;
                  })
                  .filter(Boolean);
                console.log("Bulk export departments:", selectedDepartments);
              }}
            >
              <i className="fa-regular fa-download mr-1"></i>
              Export Selected
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