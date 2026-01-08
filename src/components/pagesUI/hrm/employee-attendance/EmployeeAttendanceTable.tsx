"use client";

import React, { useMemo } from "react";
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
import AttendanceTypeIcons from "../attendance/AttendanceTypeIcons";
import { adminAttendanceHeadCells } from "@/data/table-head-cell/table-head";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import { getAttendanceClass } from "@/hooks/use-condition-class";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface Props {
  attendance: any[];
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (v: number) => void;
  setSelectedYear: (v: number) => void;
}

const EmployeeAttendanceTable = ({
  attendance,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear
}: Props) => {

  const attendanceRows = useMemo(() => attendance, [attendance]);
  
  const daysInMonth = useMemo(() => new Date(selectedYear, selectedMonth, 0).getDate(), [selectedMonth, selectedYear]);
  const dateKeys = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => `date${i + 1}`), [daysInMonth]);

  const {
    order,
    orderBy,
    selected,
    page,
    rowsPerPage,
    searchQuery,
    paginatedRows,
    filteredRows,
    handleRequestSort,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
  } = useMaterialTableHook<any>(attendanceRows, 15);

  return (
    <div className="col-span-12">
      <div className="card__wrapper">
        <AttendanceTypeIcons />

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Month:</h3>
          <Box className="flex gap-2 flex-wrap">
            {months.map((monthName, index) => (
              <button
                key={index}
                onClick={() => setSelectedMonth(index + 1)}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  selectedMonth === index + 1 ? "bg-blue-600" : "bg-blue-400"
                }`}
              >
                {monthName}
              </button>
            ))}
          </Box>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Year:</h3>
          <Box className="flex gap-2 items-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 rounded-md border"
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="text-gray-600">
              Showing data for {months[selectedMonth - 1]} {selectedYear}
            </span>
          </Box>
        </div>

        <div className="manaz-common-mat-list table__wrapper">
          <TableControls
            rowsPerPage={rowsPerPage}
            searchQuery={searchQuery}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleSearchChange={handleSearchChange}
          />

          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Paper sx={{ width: "100%", mb: 2, minWidth: "1400px" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {adminAttendanceHeadCells.map((headCell, idx) => (
                      <TableCell
                        key={headCell.id}
                        sx={{
                          background: "#fff",
                          position: idx === 0 ? "sticky" : "static",
                          left: idx === 0 ? 0 : undefined,
                          zIndex: idx === 0 ? 5 : 1,
                        }}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : "asc"}
                          onClick={() => handleRequestSort(headCell.id)}
                        >
                          {headCell.label}
                          {orderBy === headCell.id && (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc" ? "sorted descending" : "sorted ascending"}
                            </Box>
                          )}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRows.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      selected={selected.includes(rowIndex)}
                      onClick={() => handleClick(rowIndex)}
                    >
                      <TableCell
                        sx={{
                          background: "#fff",
                          position: "sticky",
                          left: 0,
                          zIndex: 5,
                          minWidth: "180px",
                        }}
                      >
                        {row?.name}
                      </TableCell>

                      {dateKeys.map((key) => (
                        <TableCell key={key} sx={{ minWidth: "60px" }}>
                          <i className={getAttendanceClass(row[key])}></i>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>

          <Pagination
            count={Math.ceil(filteredRows.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => handleChangePage(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendanceTable;
