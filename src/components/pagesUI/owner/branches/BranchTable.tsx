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
import BadgeIcon from "@mui/icons-material/Badge";

const branchHeadCells = [
  { id: "branchName", label: "Branch Name" },
  { id: "branchCode", label: "Code" },
  { id: "address", label: "Address" },
  { id: "city", label: "City" },
  { id: "phone", label: "Phone" },
  { id: "email", label: "Email" },
  { id: "managerName", label: "Manager" },
  { id: "totalEmployees", label: "Employees" },
  { id: "status", label: "Status" },
  { id: "establishedDate", label: "Established" },
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
  } = useMaterialTableHook<IBranch>(data, 10);

  const handleDelete = (id: number) => {
    const index = data.findIndex(row => row.id === id);
    if (index >= 0) {
      internalHandleDelete(index);
      onDelete?.(id);
    }
  };

  const handleStatusChange = (id: number, currentStatus: string) => {
    if (onStatusChange) {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      onStatusChange(id, newStatus);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = branchHeadCells.map(cell => cell.label);
    
    const rows = filteredRows.map(branch => {
      return [
        branch.branchName,
        branch.branchCode,
        truncateText(branch.address || "", 50),
        branch.city,
        branch.phone,
        branch.email,
        branch.managerName,
        branch.totalEmployees?.toString() || "0",
        branch.status,
        formatDate(branch.establishedDate)
      ];
    });
    
    return {
      headers,
      rows,
      title: `Branches Export - ${filteredRows.length} records`
    };
  }, [filteredRows]);

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
                    placeholder="Search branches..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
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
                              <LocationOnIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                No branches found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {searchQuery.trim()
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : "Try adding branches to see results"}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row, index) => {
                          const statusClass = getTableStatusClass(row.status);

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
                                <div className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <LocationOnIcon fontSize="small" className="text-gray-400" />
                                    {row.branchName}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {row.branchCode}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Tooltip title={row.address || ""}>
                                  <span className="text-gray-600">
                                    {truncateText(row.address || "", 25)}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.city}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <PhoneIcon fontSize="small" className="text-gray-400" />
                                  <span className="font-medium">{row.phone}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <a 
                                  href={`mailto:${row.email}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {truncateText(row.email || "", 20)}
                                </a>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">{row.managerName}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <PeopleIcon fontSize="small" className="text-gray-400" />
                                  <span className="font-semibold">{row.totalEmployees ?? "0"}</span>
                                </div>
                              </TableCell>
                       <TableCell>
  <div className="flex items-center gap-2">
    <Switch
      size="small"
      checked={row.status === "Active"}
      onChange={(e) => {
        e.stopPropagation();
        handleStatusChange(row.id, row.status || "Inactive");
      }}
      color={row.status === "Active" ? "success" : "default"}
    />
    <span className={`bd-badge ${statusClass}`}>
      {row.status || "Inactive"}
    </span>
  </div>
</TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">
                                  {formatDate(row.establishedDate)}
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
                                    title="Edit Branch"
                                  >
                                    <i className="fa-light fa-edit text-blue-600"></i>
                                  </button>
                                  <button
                                    className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteId(row.id);
                                      setModalDeleteOpen(true);
                                    }}
                                    title="Delete Branch"
                                  >
                                    <i className="fa-regular fa-trash text-red-600"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="table__icon p-1.5 hover:bg-green-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // View branch details or assign employees
                                      console.log("View branch details:", row.id);
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

            {/* Branch Summary */}
            {paginatedRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Branches</div>
                      <div className="text-xl font-semibold">{filteredRows.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active</div>
                      <div className="text-xl font-semibold text-green-600">
                        {filteredRows.filter(b => b.status === "Active").length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Employees</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {filteredRows.reduce((sum, b) => sum + (b.totalEmployees || 0), 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Avg. Employees/Branch</div>
                      <div className="text-xl font-semibold">
                        {Math.round(filteredRows.reduce((sum, b) => sum + (b.totalEmployees || 0), 0) / filteredRows.length)}
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

            {/* Bulk Actions Bar */}
            {selected.length > 0 && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
                <Typography variant="body2" className="text-white">
                  {selected.length} branch{selected.length > 1 ? 'es' : ''} selected
                </Typography>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
                    onClick={() => {
                      const selectedBranches = selected.map(index => filteredRows[index]);
                      console.log('Bulk export branches:', selectedBranches);
                    }}
                  >
                    <i className="fa-regular fa-download mr-1"></i>
                    Export Selected
                  </button>
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
                    onClick={() => {
                      const selectedBranches = selected.map(index => filteredRows[index]);
                      console.log('Bulk toggle status:', selectedBranches);
                    }}
                  >
                    <i className="fa-solid fa-toggle-on mr-1"></i>
                    Toggle Status
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selected.length} branch${selected.length > 1 ? 'es' : ''}?`)) {
                        selected.forEach(index => {
                          const branch = filteredRows[index];
                          if (branch) handleDelete(branch.id);
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
      </div>

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

export default BranchTable;