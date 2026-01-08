"use client";

import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Pagination from "@mui/material/Pagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { Checkbox, Grid, TextField, Select, MenuItem, Typography } from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import { IRole } from "./RoleTypes";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface RoleTableProps {
  data: IRole[];
  onEdit: (role: IRole) => void;
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: boolean) => void;
}

// Table head cells
const roleHeadCells = [
  { id: "roleName", label: "Role Name" },
  { id: "roleCode", label: "Code" },
  { id: "description", label: "Description" },
  { id: "defaultSalaryGrade", label: "Salary Grade" },
  { id: "permissions", label: "Permissions" },
  { id: "assignedUsers", label: "Users" },
  { id: "activeStatus", label: "Status" },
  { id: "createdAt", label: "Created" },
];

const RoleTable: React.FC<RoleTableProps> = ({
  data,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
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
    handleDelete,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
  } = useMaterialTableHook<IRole>(data, 10);

  const handleStatusChange = (id: number, currentStatus: boolean) => {
    if (onStatusChange) {
      onStatusChange(id, !currentStatus);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: boolean) => {
    return status ? "Active" : "Inactive";
  };

  const getStatusClass = (status: boolean) => {
    return status ? "success" : "error";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format permissions for display
  const formatPermissionsForDisplay = (permissions: string[] = []) => {
    if (!permissions || permissions.length === 0) {
      return {
        count: 0,
        displayText: "0",
        tooltipText: "No permissions"
      };
    }
    
    const count = permissions.length;
    const displayText = `${count}`;
    
    // Create tooltip with all permissions listed
    const tooltipText = permissions.map(permission => {
      // Format permission name for better readability
      const formattedPermission = permission
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim();
      
      return formattedPermission;
    }).join(", ");
    
    return {
      count,
      displayText,
      tooltipText: permissions.length <= 3 
        ? tooltipText 
        : `${permissions.slice(0, 3).map(p => p.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()).join(", ")}... (+${permissions.length - 3} more)`
    };
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = roleHeadCells.map(cell => cell.label);
    
    const rows = filteredRows.map(role => {
      const permissionsInfo = formatPermissionsForDisplay(role.permissions);
      
      return [
        role.roleName,
        role.roleCode || "-",
        truncateText(role.description || "", 50),
        role.defaultSalaryGrade || "-",
        `${permissionsInfo.count} (${role.permissions?.join(", ") || "none"})`,
        role.assignedUsers?.toString() || "0",
        getStatusBadge(role.activeStatus),
        formatDate(role.createdAt)
      ];
    });
    
    return {
      headers,
      rows,
      title: `Roles Export - ${filteredRows.length} records`
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
                    placeholder="Search roles..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `roles_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Roles Report - ${new Date().toLocaleDateString()}`
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
                        {roleHeadCells.map((headCell) => (
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
                          <TableCell colSpan={roleHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <BadgeIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                No roles found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {searchQuery.trim()
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : "Try adding roles to see results"}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row, index) => {
                          const statusClass = getStatusClass(row.activeStatus);
                          const permissionsInfo = formatPermissionsForDisplay(row.permissions);
                          
                          return (
                            <TableRow
                              key={row.roleId}
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
                                  {row.roleName}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {row.roleCode || "-"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Tooltip title={row.description || ""}>
                                  <span className="text-gray-600">
                                    {truncateText(row.description || "", 30)}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                {row.defaultSalaryGrade ? (
                                  <Chip
                                    label={row.defaultSalaryGrade}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                  />
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>
                                <Tooltip 
                                  title={
                                    <div className="max-w-xs">
                                      <div className="font-semibold mb-1">Permissions ({permissionsInfo.count}):</div>
                                      {row.permissions && row.permissions.length > 0 ? (
                                        <div className="space-y-1">
                                          {row.permissions.map((permission, idx) => (
                                            <div key={idx} className="text-sm">
                                              • {permission
                                                .replace(/([A-Z])/g, ' $1')
                                                .replace(/^./, str => str.toUpperCase())
                                                .trim()}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-sm text-gray-500">No permissions assigned</div>
                                      )}
                                    </div>
                                  }
                                  arrow
                                  placement="top"
                                >
                                  <div className="flex items-center gap-1">
                                    <Chip
                                      label={permissionsInfo.displayText}
                                      size="small"
                                      variant="outlined"
                                      color="info"
                                      icon={<i className="fa-solid fa-key text-xs ml-1"></i>}
                                    />
                                    {permissionsInfo.count > 0 && (
                                      <span className="text-xs text-gray-500">
                                        ({truncateText(row.permissions?.[0] || "", 15)}...)
                                      </span>
                                    )}
                                  </div>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <PersonIcon fontSize="small" />
                                  <span className="font-semibold">
                                    {row.assignedUsers || 0}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    size="small"
                                    checked={row.activeStatus}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(row.roleId, row.activeStatus);
                                    }}
                                    color={row.activeStatus ? "success" : "default"}
                                  />
                                  <Chip
                                    label={getStatusBadge(row.activeStatus)}
                                    size="small"
                                    color={statusClass as any}
                                    variant="filled"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">
                                  {formatDate(row.createdAt)}
                                </span>
                              </TableCell>
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-2">
                                  <button
                                    type="button"
                                    className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit(row);
                                    }}
                                    title="Edit Role"
                                  >
                                    <i className="fa-light fa-edit text-blue-600"></i>
                                  </button>
                                  <button
                                    className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteId(row.roleId);
                                      setModalDeleteOpen(true);
                                    }}
                                    title="Delete Role"
                                  >
                                    <i className="fa-regular fa-trash text-red-600"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="table__icon p-1.5 hover:bg-green-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Open assign users modal
                                      console.log("Assign users for role:", row.roleId);
                                    }}
                                    title="Assign to Users"
                                  >
                                    <i className="fa-light fa-user-plus text-green-600"></i>
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

            {/* Roles Summary */}
            {paginatedRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Roles</div>
                      <div className="text-xl font-semibold">{filteredRows.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active</div>
                      <div className="text-xl font-semibold text-green-600">
                        {filteredRows.filter(r => r.activeStatus).length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Permissions</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {filteredRows.reduce((sum, r) => sum + (r.permissions?.length || 0), 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Avg. Permissions/Role</div>
                      <div className="text-xl font-semibold">
                        {Math.round(filteredRows.reduce((sum, r) => sum + (r.permissions?.length || 0), 0) / filteredRows.length)}
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
                  {selected.length} role{selected.length > 1 ? 's' : ''} selected
                </Typography>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
                    onClick={() => {
                      const selectedRoles = selected.map(index => filteredRows[index]);
                      console.log('Bulk export roles:', selectedRoles);
                    }}
                  >
                    <i className="fa-regular fa-download mr-1"></i>
                    Export Selected
                  </button>
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
                    onClick={() => {
                      const selectedRoles = selected.map(index => filteredRows[index]);
                      console.log('Bulk toggle status:', selectedRoles);
                    }}
                  >
                    <i className="fa-solid fa-toggle-on mr-1"></i>
                    Toggle Status
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selected.length} role${selected.length > 1 ? 's' : ''}?`)) {
                        selected.forEach(index => {
                          const role = filteredRows[index];
                          if (role) handleDelete(role.roleId);
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

export default RoleTable;