// ShiftTable.tsx
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
import { 
  Checkbox,
  Grid,
  TextField,
  Select,
  MenuItem,
  Typography 
} from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import { IShift, calculateDuration, calculateTotalBreakTime } from "./ShiftTypes";
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

// Table head cells (keeping original)
const shiftHeadCells = [
  { id: "shiftName", label: "Shift Name" },
  { id: "timing", label: "Timing" },
  { id: "duration", label: "Duration" },
  { id: "breakTimeSlots", label: "Breaks" },
  { id: "applicableLocations", label: "Locations" },
  { id: "assignedEmployees", label: "Employees" },
  { id: "isNightShift", label: "Type" },
  { id: "activeStatus", label: "Status" },
];

const ShiftTable: React.FC<ShiftTableProps> = ({
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
  } = useMaterialTableHook<IShift>(data, 10);

  const handleStatusChange = (id: number, currentStatus: boolean) => {
    if (onStatusChange) {
      onStatusChange(id, !currentStatus);
    }
  };

  // Format timing display
  const formatTiming = (shift: IShift) => {
    return `${shift.startTime} - ${shift.endTime}${shift.isNightShift ? ' (ND)' : ''}`;
  };

  // Calculate total break time display
  const calculateTotalBreakTimeDisplay = (shift: IShift) => {
    if (!shift.breakTimeSlots || shift.breakTimeSlots.length === 0) {
      return "No breaks";
    }

    const totalMinutes = calculateTotalBreakTime(shift.breakTimeSlots);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStatusBadge = (status: boolean) => {
    return status ? "Active" : "Inactive";
  };

  const getStatusClass = (status: boolean) => {
    return status ? "bg-success" : "bg-danger";
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = shiftHeadCells.map(cell => cell.label);
    
    const rows = filteredRows.map(shift => {
      const breakDetails = shift.breakTimeSlots?.map(b => 
        `${b.breakStart}-${b.breakEnd}`
      ).join(", ") || "No breaks";
      
      return [
        shift.shiftName,
        formatTiming(shift),
        calculateDuration(shift.startTime, shift.endTime, shift.isNightShift),
        `${calculateTotalBreakTimeDisplay(shift)} (${breakDetails})`,
        shift.applicableLocations?.join(", ") || "All locations",
        (shift.assignedEmployees || 0).toString(),
        shift.isNightShift ? "Night Shift" : "Day Shift",
        getStatusBadge(shift.activeStatus),
      ];
    });
    
    return {
      headers,
      rows,
      title: `Shifts Export - ${filteredRows.length} records`
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
                    placeholder="Search shifts..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right (Only new addition) */}
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
                  />
                </Box>
              </Grid>
            </Grid>
            
            {/* Main Table - Keeping original structure */}
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
                            indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                            checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                            onChange={(e) => handleSelectAllClick(e.target.checked, filteredRows)}
                            size="small"
                          />
                        </TableCell>
                        {shiftHeadCells.map((headCell) => (
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
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody className="table__body">
                      {paginatedRows.map((row, index) => {
                        const statusClass = getStatusClass(row.activeStatus);

                        return (
                          <TableRow
                            key={row.shiftId}
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
                              <div className="font-medium flex items-center">
                                <AccessTimeIcon className="mr-2 text-gray-500" fontSize="small" />
                                {row.shiftName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold">
                                {formatTiming(row)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-blue-600 font-semibold">
                                {calculateDuration(row.startTime, row.endTime, row.isNightShift)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={
                                  row.breakTimeSlots && row.breakTimeSlots.length > 0 ? (
                                    <div>
                                      {row.breakTimeSlots.map((breakSlot, i) => (
                                        <div key={i}>
                                          {breakSlot.breakStart} - {breakSlot.breakEnd}
                                        </div>
                                      ))}
                                    </div>
                                  ) : "No breaks"
                                }
                              >
                                <Chip
                                  label={calculateTotalBreakTimeDisplay(row)}
                                  size="small"
                                  variant="outlined"
                                  color="info"
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={
                                  row.applicableLocations && row.applicableLocations.length > 0 ? (
                                    <div>
                                      {row.applicableLocations.map((loc, i) => (
                                        <div key={i}>{loc}</div>
                                      ))}
                                    </div>
                                  ) : "All locations"
                                }
                              >
                                <div className="flex items-center">
                                  <LocationOnIcon fontSize="small" className="mr-1 text-gray-500" />
                                  <span className="text-sm">
                                    {row.applicableLocations?.length || 0} locations
                                  </span>
                                </div>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <PersonIcon fontSize="small" className="mr-1 text-gray-500" />
                                <span className="font-semibold">
                                  {row.assignedEmployees || 0}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {row.isNightShift ? (
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
                                <Switch
                                  size="small"
                                  checked={row.activeStatus}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(row.shiftId, row.activeStatus);
                                  }}
                                  color="success"
                                />
                                <span className={`bd-badge ${getStatusClass(row.activeStatus)}`}>
                                  {getStatusBadge(row.activeStatus)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(row);
                                  }}
                                  title="Edit Shift"
                                >
                                  <i className="fa-light fa-edit"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon bg-info/50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle assign employees
                                  }}
                                  title="Assign Employees"
                                >
                                  <i className="fa-light fa-user-plus"></i>
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(row.shiftId);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Shift"
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

            {/* Bottom Controls - Keeping original structure */}
            <Box className="table-search-box mt-[30px]" sx={{ p: 2 }}>
              <Box>
                {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                  page * rowsPerPage,
                  filteredRows.length
                )} of ${filteredRows.length} entries`}
              </Box>
              <Pagination
                count={Math.ceil(filteredRows.length / rowsPerPage)}
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