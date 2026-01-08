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
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import DeleteModal from "@/components/common/DeleteModal";
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

import { IHoliday } from "./HolidayTypes";

const headCells = [
  { id: "name", label: "Holiday Name" },
  { id: "date", label: "Date" },
  { id: "status", label: "Status" },
];

interface Props {
  data: IHoliday[];
  onEdit?: (row: IHoliday) => void;
  onDelete?: (id: number) => void;
}

const HolidayTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
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
  } = useMaterialTableHook<IHoliday>(data, 10);

  const handleDelete = (id: number) => {
    const index = data.findIndex(row => row.id === id);
    if (index >= 0) {
      internalHandleDelete(index);
      onDelete?.(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDayTypeClass = (dayType: string) => {
    switch(dayType?.toLowerCase()) {
      case 'national holiday': return 'bg-danger';
      case 'regional holiday': return 'bg-warning';
      case 'optional': return 'bg-info';
      case 'company holiday': return 'bg-primary';
      default: return 'default-badge';
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Holiday Name",
      "Date",
      "Formatted Date",
      "Day Type",
      "Description",
      "Status"
    ];
    
    const rows = filteredRows.map(holiday => {
      const formattedDate = formatDate(holiday.date);
      const dateObj = new Date(holiday.date);
      const simpleDate = dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      return [
        holiday.name,
        simpleDate,
        formattedDate,
        holiday.dayType || "-",
        holiday.description || "-",
        holiday.status
      ];
    });
    
    return {
      headers,
      rows,
      title: `Holidays Export - ${filteredRows.length} records`
    };
  }, [filteredRows]);

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
                    placeholder="Search holidays..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right (Only new addition) */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `holidays_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Holidays Calendar - ${new Date().toLocaleDateString()}`
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>

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
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < filteredRows.length
                            }
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
                            sortDirection={orderBy === cell.id ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === cell.id}
                              direction={orderBy === cell.id ? order : "asc"}
                              onClick={() => handleRequestSort(cell.id)}
                            >
                              {cell.label}
                              {orderBy === cell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === "desc"
                                    ? "sorted descending"
                                    : "sorted ascending"}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        ))}

                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody className="table__body">
                      {paginatedRows.map((row, index) => {
                        const statusClass = getTableStatusClass(row.status);
                        const dayTypeClass = getDayTypeClass(row.dayType);

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
                                onChange={() => handleClick(index)}
                              />
                            </TableCell>

                            <TableCell>
                              <div className="font-medium">{row.name}</div>
                              {row.dayType && (
                                <span className={`bd-badge ${dayTypeClass} text-xs mt-1`}>
                                  {row.dayType}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold">{formatDate(row.date)}</div>
                              {row.description && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {row.description}
                                </div>
                              )}
                            </TableCell>

                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {row.status}
                              </span>
                            </TableCell>

                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(row);
                                  }}
                                  title="Edit Holiday"
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(row.id);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Holiday"
                                >
                                  <i className="fa-regular fa-trash"></i>
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

            {/* Holiday Summary */}
            {filteredRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Holidays</div>
                      <div className="text-xl font-semibold">{filteredRows.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active Holidays</div>
                      <div className="text-xl font-semibold text-green-600">
                        {filteredRows.filter(h => h.status === 'Active').length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Upcoming Holidays</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {filteredRows.filter(h => new Date(h.date) > new Date()).length}
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
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="card__wrapper mb-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-primary-700 font-medium">
                {selected.length} holiday(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedHolidays = data.filter((_, idx) => selected.includes(idx));
                    console.log('Bulk action on holidays:', selectedHolidays);
                  }}
                >
                  <i className="fa-solid fa-toggle-on mr-1"></i>
                  Toggle Status
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} holiday(s)?`)) {
                      selected.forEach(idx => {
                        const row = filteredRows[idx];
                        if (row) onDelete?.(row.id);
                      });
                      // Clear selection after deletion
                      selected.forEach(idx => handleClick(idx));
                    }
                  }}
                >
                  <i className="fa-regular fa-trash mr-1"></i>
                  Delete Selected
                </button>
              </div>
            </div>
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

export default HolidayTable;