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
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

import { IDesignation } from "./DesignationTypes";

const headCells = [
  { id: "name", label: "Designation Name" },
  { id: "designationId", label: "Designation ID" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
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

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = headCells.map(cell => cell.label);
    
    const rows = filteredRows.map(designation => {
      return [
        designation.name,
        designation.designationId,
        designation.description || "-",
        designation.status
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
              placeholder="Search designations..."
            />
          </Box>
        </Grid>
        
        {/* Export Options - Top Right (Only new addition) */}
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
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="table__title">
                  <TableCell padding="checkbox">
                    <Checkbox
                      className="custom-checkbox checkbox-small"
                      color="primary"
                      checked={
                        filteredRows.length > 0 &&
                        selected.length === filteredRows.length
                      }
                      onChange={(e) =>
                        handleSelectAllClick(e.target.checked, filteredRows)
                      }
                      size="small"
                    />
                  </TableCell>

                  {headCells.map((cell) => (
                    <TableCell
                      className="table__title"
                      key={cell.id}
                    >
                      <TableSortLabel
                        active={orderBy === cell.id}
                        direction={orderBy === cell.id ? order : "asc"}
                        onClick={() => handleRequestSort(cell.id)}
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

                  <TableCell className="table__title">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody className="table__body">
                {paginatedRows.map((row, index) => {
                  const statusClass = getTableStatusClass(row.status);

                  return (
                    <TableRow
                      key={row.id}
                      selected={selected.includes(index)}
                      onClick={() => handleClick(index)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          className="custom-checkbox checkbox-small"
                          checked={selected.includes(index)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">{row.name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{row.designationId}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">
                          {row.description ?? "-"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className={`bd-badge ${statusClass}`}>
                          {row.status}
                        </span>
                      </TableCell>

                      <TableCell className="table__icon-box">
                        <div className="flex items-center justify-start gap-[10px]">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit?.(row);
                            }}
                            className="table__icon edit"
                            title="Edit Designation"
                          >
                            <i className="fa-light fa-pen" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDeleteHandler(index);
                            }}
                            className="table__icon delete"
                            title="Delete Designation"
                          >
                            <i className="fa-regular fa-trash" />
                          </IconButton>
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

      {/* Bottom Controls Row */}
      <Grid container spacing={2} alignItems="center" className="mt-6">
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
    </div>
  );
};

export default DesignationTable;