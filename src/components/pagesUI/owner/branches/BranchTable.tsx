// BranchTable.tsx
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
  Select,
  MenuItem,
  Typography,
  Chip,
  Tooltip,
  Switch,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import DeleteModal from "@/components/common/DeleteModal";
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import { IBranch } from "./BranchTypes";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";

const branchHeadCells = [
  { id: "branch_name", label: "Branch Name" },
  { id: "branch_code", label: "Code" },
  { id: "address", label: "Address" },
  { id: "city", label: "City" },
  { id: "phone", label: "Phone" },
  { id: "email", label: "Email" },
  { id: "manager_name", label: "Manager" },
  { id: "total_employees", label: "Employees" },
  { id: "is_active", label: "Status" },
  { id: "created_at", label: "Created" },
];

interface Props {
  data: IBranch[];
  onEdit?: (row: IBranch) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

const BranchTable: React.FC<Props> = ({ data, onEdit, onDelete, onStatusChange }) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  // Transform data for table compatibility
  const transformedData = useMemo(() => {
    return data.map(branch => ({
      ...branch,
      // Ensure all required fields exist
      branch_name: branch.branch_name || branch.branchName || "",
      branch_code: branch.branch_code || branch.branchCode || "",
      phone: branch.phone || "",
      email: branch.email || "",
      manager_name: branch.manager_name || branch.managerName || "",
      manager_email: branch.manager_email || "",
      total_employees: branch.total_employees || branch.totalEmployees || 0,
      is_active: branch.is_active || branch.status || "Inactive",
      address: branch.address || {
        country: branch.country,
        state: branch.state,
        city: branch.city,
        addressLine1: branch.addressLine1,
        addressLine2: branch.addressLine2,
        zipCode: branch.zipCode,
      },
      // Add aliases for sorting compatibility
      branchName: branch.branch_name || branch.branchName,
      branchCode: branch.branch_code || branch.branchCode,
      managerName: branch.manager_name || branch.managerName,
      totalEmployees: branch.total_employees || branch.totalEmployees,
      status: branch.is_active || branch.status,
    }));
  }, [data]);

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
  } = useMaterialTableHook<IBranch>(transformedData, 10);

  // const handleDelete = (id: number) => {
  //   const index = transformedData.findIndex(row => row.id === id);
  //   if (index >= 0) {
  //     internalHandleDelete(index);
  //     onDelete?.(id);
  //   }
  // };

  const handleStatusChange = (id: number, currentStatus: string) => {
    if (onStatusChange) {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      onStatusChange(id, newStatus);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "-";
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "-";
    }
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getFullAddress = (branch: IBranch) => {
    const addr = branch.address;
    if (!addr) return "";
    
    const parts = [
      addr.addressLine1,
      addr.addressLine2,
      addr.city,
      addr.state,
      addr.country,
      addr.zipCode
    ].filter(Boolean);
    
    return parts.join(", ");
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Branch Name",
      "Branch Code",
      "Address",
      "City",
      "State",
      "Country",
      "Phone",
      "Email",
      "Manager",
      "Manager Email",
      "Total Employees",
      "Status",
      "Created At",
      "Updated At"
    ];
    
    const rows = filteredRows.map(branch => {
      const addr = branch.address || {};
      return [
        branch.branch_name || branch.branchName || "",
        branch.branch_code || branch.branchCode || "",
        getFullAddress(branch),
        addr.city || branch.city || "",
        addr.state || branch.state || "",
        addr.country || branch.country || "",
        branch.phone || "",
        branch.email || "",
        branch.manager_name || branch.managerName || "",
        branch.manager_email || "",
        (branch.total_employees || branch.totalEmployees || 0).toString(),
        branch.is_active || branch.status || "",
        formatDateTime(branch.created_at),
        formatDateTime(branch.updated_at)
      ];
    });
    
    return {
      headers,
      rows,
      title: `Branches Export - ${filteredRows.length} records`
    };
  }, [filteredRows]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    return {
      totalBranches: filteredRows.length,
      activeBranches: filteredRows.filter(b => 
        (b.is_active === "Active" || b.status === "Active")
      ).length,
      totalEmployees: filteredRows.reduce(
        (sum, b) => sum + (b.total_employees || b.totalEmployees || 0),
        0
      ),
      avgEmployees: Math.round(
        filteredRows.reduce((sum, b) => sum + (b.total_employees || b.totalEmployees || 0), 0) /
        (filteredRows.length || 1)
      )
    };
  }, [filteredRows]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            
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
                    placeholder="Search by name, code, city, or manager..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `branches_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Branches Report - ${new Date().toLocaleDateString()}`
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
                            indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                            checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                            onChange={(e) => handleSelectAllClick(e.target.checked, filteredRows)}
                            size="small"
                          />
                        </TableCell>

                        {branchHeadCells.map((headCell) => (
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
                          <TableCell colSpan={branchHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <BusinessIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                No branches found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {searchQuery.trim()
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : "Add branches to get started"}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row, index) => {
                          const isSelected = selected.includes(index);
                          const status = row.is_active || row.status || "Inactive";
                          const statusClass = getTableStatusClass(status);
                          const addr = row.address || {};
                          const city = addr.city || row.city || "";
                          const addressLine1 = addr.addressLine1 || row.addressLine1 || "";

                          return (
                            <TableRow
                              key={row.id}
                              selected={isSelected}
                              onClick={() => handleClick(index)}
                              className={`hover:bg-blue-50 ${isSelected ? 'bg-blue-50' : ''}`}
                              hover
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="custom-checkbox checkbox-small"
                                  checked={isSelected}
                                  size="small"
                                  onChange={() => handleClick(index)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </TableCell>

                              <TableCell>
                                <div className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <LocationOnIcon fontSize="small" className="text-gray-400" />
                                    <div>
                                      <div className="font-semibold">
                                        {row.branch_name || row.branchName || "Unnamed Branch"}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        ID: {row.id}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              
                              <TableCell>
                                <Tooltip title="Branch Code">
                                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                    {row.branch_code || row.branchCode || "N/A"}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              
                              <TableCell>
                                <Tooltip title={getFullAddress(row)}>
                                  <div className="max-w-[200px]">
                                    <div className="text-gray-800 font-medium">
                                      {truncateText(addressLine1, 25)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {truncateText(addr.addressLine2 || row.addressLine2 || "", 20)}
                                    </div>
                                  </div>
                                </Tooltip>
                              </TableCell>
                              
                              <TableCell>
                                <Chip
                                  label={city}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  icon={<LocationOnIcon fontSize="small" />}
                                />
                              </TableCell>
                              
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <PhoneIcon fontSize="small" className="text-gray-400" />
                                  <Tooltip title={row.phone || "No phone"}>
                                    <span className="font-medium">
                                      {truncateText(row.phone, 12)}
                                    </span>
                                  </Tooltip>
                                </div>
                              </TableCell>
                              
                              <TableCell>
                                <Tooltip title={row.email || "No email"}>
                                  <a 
                                    href={`mailto:${row.email}`}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <EmailIcon fontSize="small" />
                                    {truncateText(row.email, 15)}
                                  </a>
                                </Tooltip>
                              </TableCell>
                              
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {row.manager_name || row.managerName || "Not assigned"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {truncateText(row.manager_email || "", 20)}
                                  </div>
                                </div>
                              </TableCell>
                              
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <PeopleIcon fontSize="small" className="text-gray-400" />
                                  <Tooltip title="Total Employees">
                                    <span className="font-semibold">
                                      {row.total_employees || row.totalEmployees || 0}
                                    </span>
                                  </Tooltip>
                                </div>
                              </TableCell>
                              
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {/* <Switch
                                    size="small"
                                    checked={status === "Active"}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(row.id, status);
                                    }}
                                    color={status === "Active" ? "success" : "default"}
                                    onClick={(e) => e.stopPropagation()}
                                  /> */}
                                  <span className={`bd-badge ${statusClass}`}>
                                    {status}
                                  </span>
                                </div>
                              </TableCell>
                              
                              <TableCell>
                                <Tooltip title={formatDateTime(row.created_at)}>
                                  <div className="text-sm">
                                    {formatDate(row.created_at)}
                                    <div className="text-xs text-gray-500">
                                      {row.updated_at && (
                                        <>Updated: {formatDate(row.updated_at)}</>
                                      )}
                                    </div>
                                  </div>
                                </Tooltip>
                              </TableCell>
                              
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-2">
                                  <Tooltip title="Edit Branch">
                                    <button
                                      type="button"
                                      className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit?.(row);
                                      }}
                                    >
                                      <i className="fa-light fa-edit text-blue-600"></i>
                                    </button>
                                  </Tooltip>
                                  
                                  {/* <Tooltip title="Delete Branch">
                                    <button
                                      className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteId(row.id);
                                        setModalDeleteOpen(true);
                                      }}
                                    >
                                      <i className="fa-regular fa-trash text-red-600"></i>
                                    </button>
                                  </Tooltip> */}
                                  
                                  {/* <Tooltip title="View Details">
                                    <button
                                      type="button"
                                      className="table__icon p-1.5 hover:bg-green-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Navigate to branch details page
                                        console.log("View branch details:", row.id);
                                      }}
                                    >
                                      <i className="fa-light fa-eye text-green-600"></i>
                                    </button>
                                  </Tooltip> */}
                                  
                                  {/* <Tooltip title="Assign Employees">
                                    <button
                                      type="button"
                                      className="table__icon p-1.5 hover:bg-purple-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Assign employees to branch:", row.id);
                                      }}
                                    >
                                      <i className="fa-light fa-user-plus text-purple-600"></i>
                                    </button>
                                  </Tooltip> */}
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

            {/* Branch Summary Stats */}
            {paginatedRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Branches</div>
                      <div className="text-2xl font-bold text-gray-800">{summaryStats.totalBranches}</div>
                      <div className="text-xs text-gray-500">Showing {paginatedRows.length} on this page</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active Branches</div>
                      <div className="text-2xl font-bold text-green-600">{summaryStats.activeBranches}</div>
                      <div className="text-xs text-gray-500">
                        {((summaryStats.activeBranches / (summaryStats.totalBranches || 1)) * 100).toFixed(1)}% active
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Employees</div>
                      <div className="text-2xl font-bold text-blue-600">{summaryStats.totalEmployees}</div>
                      <div className="text-xs text-gray-500">Across all branches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Avg. Employees/Branch</div>
                      <div className="text-2xl font-bold text-indigo-600">{summaryStats.avgEmployees}</div>
                      <div className="text-xs text-gray-500">Per branch average</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bottom Controls Row */}
            <Grid container spacing={2} alignItems="center" className="mt-4">
              {/* Number of Entries Dropdown */}
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
              
              {/* Showing Entries Info */}
              <Grid item xs={12} md={6}>
                <Box className="flex flex-col items-center">
                  <Typography variant="body2" className="text-gray-700">
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
              
              {/* Pagination */}
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
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Bulk Actions Bar */}
            {/* {selected.length > 0 && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-4 z-50 border border-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="font-bold">{selected.length}</span>
                  </div>
                  <Typography variant="body2" className="text-white font-medium">
                    {selected.length} branch{selected.length > 1 ? 'es' : ''} selected
                  </Typography>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-1"
                    onClick={() => {
                      const selectedBranches = selected.map(index => filteredRows[index]);
                      console.log('Bulk export branches:', selectedBranches);
                    }}
                  >
                    <i className="fa-regular fa-download"></i>
                    Export
                  </button>
                  <button
                    className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600 transition-colors flex items-center gap-1"
                    onClick={() => {
                      const selectedBranches = selected.map(index => filteredRows[index]);
                      console.log('Bulk toggle status:', selectedBranches);
                    }}
                  >
                    <i className="fa-solid fa-toggle-on"></i>
                    Toggle Status
                  </button>
                  <button
                    className="px-3 py-1.5 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selected.length} branch${selected.length > 1 ? 'es' : ''}?`)) {
                        selected.forEach(index => {
                          const branch = filteredRows[index];
                          if (branch) handleDelete(branch.id);
                        });
                      }
                    }}
                  >
                    <i className="fa-regular fa-trash"></i>
                    Delete
                  </button>
                  <button
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                    onClick={() => handleSelectAllClick(false, [])}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {/* {modalDeleteOpen && (
        <DeleteModal
          open={modalDeleteOpen}
          setOpen={setModalDeleteOpen}
          onConfirm={() => {
            handleDelete(deleteId);
            setModalDeleteOpen(false);
          }}
        />
      )} */}
    </>
  );
};

export default BranchTable;