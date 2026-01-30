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
import { 
  Checkbox,
  Grid,
  TextField,
  Select,
  MenuItem,
  Typography 
} from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import { IShift } from "./ShiftTypes";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface ShiftTableProps {
  data: IShift[];
  onEdit: (shift: IShift) => void;
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: boolean) => void;
}

// Helper functions
const calculateDuration = (startTime: string, endTime: string, isNightShift: boolean = false): string => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  if (isNightShift) {
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

const calculateTotalBreakTime = (breakSlots: any[]): number => {
  if (!breakSlots || !Array.isArray(breakSlots)) return 0;
  
  return breakSlots.reduce((total, breakSlot) => {
    if (!breakSlot.breakStart || !breakSlot.breakEnd) return total;
    
    const start = new Date(`2000-01-01T${breakSlot.breakStart}`);
    const end = new Date(`2000-01-01T${breakSlot.breakEnd}`);
    const diffMs = end.getTime() - start.getTime();
    return total + Math.floor(diffMs / (1000 * 60));
  }, 0);
};

const ShiftTable: React.FC<ShiftTableProps> = ({
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
  const [orderBy, setOrderBy] = useState<string>("shift_name");

  // Table head cells
  const shiftHeadCells = [
    { id: "shift_name", label: "Shift Name" },
    { id: "start_time", label: "Timing" },
    { id: "duration", label: "Duration" },
    { id: "break_time_slots", label: "Breaks" },
    { id: "branches", label: "Branches" },
    { id: "is_night_shift", label: "Type" },
    { id: "active_status", label: "Status" },
  ];

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map(shift => shift.shift_id));
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

  // Format timing display
  const formatTiming = (shift: IShift) => {
    const formatTime = (timeString: string) => {
      if (!timeString) return "";
      const time = timeString.split(':');
      return `${time[0]}:${time[1]}`; // Remove seconds
    };
    
    return `${formatTime(shift.start_time)} - ${formatTime(shift.end_time)}${shift.is_night_shift ? ' (ND)' : ''}`;
  };

  // Calculate total break time display
  const calculateTotalBreakTimeDisplay = (breakSlots: any[]) => {
    if (!breakSlots || breakSlots.length === 0) {
      return "No breaks";
    }

    const totalMinutes = calculateTotalBreakTime(breakSlots);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter(shift => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        shift.shift_name?.toLowerCase().includes(searchLower) ||
        shift.start_time?.toLowerCase().includes(searchLower) ||
        shift.end_time?.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    return [...filteredData].sort((a, b) => {
      if (orderBy === "shift_name" || orderBy === "start_time" || orderBy === "end_time") {
        const valueA = a[orderBy]?.toLowerCase() || '';
        const valueB = b[orderBy]?.toLowerCase() || '';
        return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      if (orderBy === "assigned_employees") {
        const valueA = a[orderBy] || 0;
        const valueB = b[orderBy] || 0;
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
      if (orderBy === "created_at") {
        const valueA = new Date(a.created_at).getTime();
        const valueB = new Date(b.created_at).getTime();
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  // Paginate data
  const paginatedRows = useMemo(() => {
    if (!sortedData || sortedData.length === 0) return [];
    
    return sortedData.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

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

  const handleStatusChange = (id: number, currentStatus: boolean) => {
    if (onStatusChange) {
      onStatusChange(id, currentStatus);
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = shiftHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(shift => {
      const breakDetails = shift.break_time_slots?.map((b: any) => 
        `${b.breakStart || ''}-${b.breakEnd || ''}`
      ).join(", ") || "No breaks";
      
      const branchNames = shift.Branches?.map(b => b.branch_name).join(", ") || "All branches";
      
      return [
        shift.shift_name,
        formatTiming(shift),
        calculateDuration(shift.start_time, shift.end_time, shift.is_night_shift),
        `${calculateTotalBreakTimeDisplay(shift.break_time_slots)} (${breakDetails})`,
        branchNames,
        (shift.assigned_employees || 0).toString(),
        shift.is_night_shift ? "Night Shift" : "Day Shift",
        shift.active_status ? "Active" : "Inactive",
      ];
    });
    
    return {
      headers,
      rows,
      title: `Shifts Export - ${sortedData.length} records`
    };
  }, [sortedData]);

  const isEmpty = !data || data.length === 0;

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
                    placeholder="Search shifts..."
                    disabled={isEmpty}
                  />
                </Box>
              </Grid>
              
              {/* Export Options */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `shifts_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Shifts Report - ${new Date().toLocaleDateString()}`
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
                        <TableCell padding="checkbox">
                          <Checkbox
                            className="custom-checkbox checkbox-small"
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < sortedData.length}
                            checked={sortedData.length > 0 && selected.length === sortedData.length}
                            onChange={handleSelectAllClick}
                            size="small"
                            disabled={isEmpty}
                          />
                        </TableCell>
                        {shiftHeadCells.map((headCell) => (
                          <TableCell
                            className="table__title !font-semibold"
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={orderBy === headCell.id ? order : "asc"}
                              onClick={() => handleRequestSort(headCell.id)}
                              disabled={isEmpty}
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
                      {isEmpty ? (
                        <TableRow>
                          <TableCell colSpan={shiftHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <AccessTimeIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                No shifts found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {searchQuery.trim()
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : "Try adding shifts to see results"}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((shift) => {
                          return (
                            <TableRow
                              key={shift.shift_id}
                              hover
                              selected={selected.includes(shift.shift_id)}
                              onClick={() => handleClick(shift.shift_id)}
                              className={`hover:bg-blue-50 ${selected.includes(shift.shift_id) ? 'bg-blue-50' : ''}`}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="custom-checkbox checkbox-small"
                                  checked={selected.includes(shift.shift_id)}
                                  onChange={() => handleClick(shift.shift_id)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="font-medium flex items-center gap-2">
                                  <AccessTimeIcon fontSize="small" className="text-gray-400" />
                                  {shift.shift_name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-semibold">
                                  {formatTiming(shift)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-blue-600 font-semibold">
                                  {calculateDuration(shift.start_time, shift.end_time, shift.is_night_shift)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    shift.break_time_slots && shift.break_time_slots.length > 0 ? (
                                      <div>
                                        {shift.break_time_slots.map((breakSlot: any, i: number) => (
                                          <div key={i}>
                                            {breakSlot.breakStart || ''} - {breakSlot.breakEnd || ''}
                                          </div>
                                        ))}
                                      </div>
                                    ) : "No breaks"
                                  }
                                >
                                  <Chip
                                    label={calculateTotalBreakTimeDisplay(shift.break_time_slots)}
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                  />
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    shift.Branches && shift.Branches.length > 0 ? (
                                      <div>
                                        {shift.Branches.map((branch, i) => (
                                          <div key={i}>{branch.branch_name}</div>
                                        ))}
                                      </div>
                                    ) : "No branches assigned"
                                  }
                                >
                                  <div className="flex items-center">
                                    <LocationOnIcon fontSize="small" className="mr-1 text-gray-500" />
                                    <span className="text-sm">
                                      {shift.Branches?.length || 0} branches
                                    </span>
                                  </div>
                                </Tooltip>
                              </TableCell>
                              {/* <TableCell>
                                <div className="flex items-center">
                                  <PersonIcon fontSize="small" className="mr-1 text-gray-500" />
                                  <span className="font-semibold">
                                    {shift.assigned_employees || 0}
                                  </span>
                                </div>
                              </TableCell> */}
                              <TableCell>
                                {shift.is_night_shift ? (
                                  <Chip
                                    icon={<NightsStayIcon />}
                                    label="Night"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                ) : (
                                  <Chip
                                    label="Day"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {/* <Switch
                                    size="small"
                                    checked={shift.active_status}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(shift.shift_id, shift.active_status);
                                    }}
                                    color="success"
                                  /> */}
                                  <Chip
                                    label={shift.active_status ? "Active" : "Inactive"}
                                    size="small"
                                    color={shift.active_status ? "success" : "default"}
                                    variant="filled"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-2">
                                  <button
                                    type="button"
                                    className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit(shift);
                                    }}
                                    title="Edit Shift"
                                  >
                                    <i className="fa-light fa-edit text-blue-600"></i>
                                  </button>
                                  {/* <button
                                    className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteId(shift.shift_id);
                                      setModalDeleteOpen(true);
                                    }}
                                    title="Delete Shift"
                                  >
                                    <i className="fa-regular fa-trash text-red-600"></i>
                                  </button> */}
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
            {!isEmpty && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Shifts</div>
                      <div className="text-xl font-semibold">{sortedData.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active</div>
                      <div className="text-xl font-semibold text-green-600">
                        {sortedData.filter(shift => shift.active_status).length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Night Shifts</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {sortedData.filter(shift => shift.is_night_shift).length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Employees</div>
                      <div className="text-xl font-semibold text-purple-600">
                        {sortedData.reduce((sum, shift) => sum + (shift.assigned_employees || 0), 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bottom Controls Row */}
            {!isEmpty && (
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
                
                {/* Pagination */}
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
      {selected.length > 0 && !isEmpty && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2" className="text-white">
            {selected.length} shift{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedShifts = selected.map(id => sortedData.find(s => s.shift_id === id)).filter(Boolean);
                console.log('Bulk export shifts:', selectedShifts);
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

export default ShiftTable;