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
  Chip,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

import { IDesignation } from "./DesignationTypes";

const headCells = [
  { id: "name", label: "Designation Name" },
  { id: "designationId", label: "Designation Code" },
  { id: "departmentName", label: "Department" },
  { id: "description", label: "Description" },
  { id: "created_at", label: "Created Date" },
];

interface Props {
  data: IDesignation[];
  onEdit?: (row: IDesignation) => void;
  onDelete?: (id: number) => void;
}

const DesignationTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
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
  } = useMaterialTableHook<IDesignation>(memoData, 10);

  const confirmDeleteHandler = (index: number) => {
    const row = filteredRows[index];
    if (!row) return;
    handleDelete(index);
    onDelete?.(row.id);
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

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Designation Name",
      "Designation Code",
      "Department",
      "Description",
      "Created Date",
      "Client ID",
    ];
    
    const rows = filteredRows.map(designation => {
      return [
        designation.name,
        designation.designationId,
        designation.departmentName || "-",
        designation.description || "-",
        formatDate(designation.created_at),
        designation.client_id?.toString() || "N/A",
      ];
    });
    
    return {
      headers,
      rows,
      title: `Designations Export - ${filteredRows.length} records`
    };
  }, [filteredRows]);

  return (
    <div className="card__wrapper">
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
              placeholder="Search designations..."
              disabled={filteredRows.length === 0}
            />
          </Box>
        </Grid>
        
        {/* Export Options - Top Right */}
        <Grid item xs={12} md={6}>
          <Box className="flex justify-end">
            <DownloadButtonGroup
              data={exportData}
              options={{
                fileName: `designations_${new Date().toISOString().split('T')[0]}`,
                includeHeaders: true,
                pdfTitle: `Designations Report - ${new Date().toLocaleDateString()}`
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

                  <TableCell width="10%" className="table__title !font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody className="table__body">
                {paginatedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length + 2} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <i className="fa-regular fa-user-tie text-gray-400 text-4xl mb-2"></i>
                        <Typography variant="body1" className="text-gray-600 mb-2">
                          No designations found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchQuery.trim()
                            ? `Try adjusting your search query: "${searchQuery}"`
                            : "Try adding designations to see results"}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRows.map((row, index) => {
                    const statusClass = getTableStatusClass(row.status || "Active");

                    return (
                      <TableRow
                        key={row.id}
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
                          <div className="font-medium flex items-center gap-2">
                            <i className="fa-regular fa-user-tie text-gray-400"></i>
                            {row.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.designationId}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600">
                            {row.description || "-"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDate(row.created_at)}
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
                              title="Edit Designation"
                            >
                              <i className="fa-light fa-edit text-blue-600"></i>
                            </button>
                            <button
                              className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteHandler(index);
                              }}
                              title="Delete Designation"
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
      {filteredRows.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Designations</div>
              <div className="text-xl font-semibold">{filteredRows.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Departments Covered</div>
              <div className="text-xl font-semibold text-blue-600">
                {new Set(filteredRows.filter(d => d.department_id).map(d => d.department_id)).size}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Client ID</div>
              <div className="text-xl font-semibold text-purple-600">
                {filteredRows[0]?.client_id || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls Row */}
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
      )}

      {/* Bulk Actions Bar */}
      {/* {selected.length > 0 && filteredRows.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2" className="text-white">
            {selected.length} designation{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedDesignations = selected.map(index => filteredRows[index]).filter(Boolean);
                console.log('Bulk export designations:', selectedDesignations);
              }}
            >
              <i className="fa-regular fa-download mr-1"></i>
              Export Selected
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
              onClick={() => {
                // Clear selection
                const newSelected: number[] = [];
                // @ts-ignore - This hook should provide a way to clear selection
                if (handleSelectAllClick) {
                  // @ts-ignore
                  handleSelectAllClick(false, filteredRows);
                }
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DesignationTable;