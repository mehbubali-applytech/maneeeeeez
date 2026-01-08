// components/finance/dashboard/RecentPayrollActivity.tsx
"use client";
import React from "react";
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
import TableControls from "@/components/elements/SharedInputs/TableControls";
import { recentPayrollData } from "./finance-data";

const headCells = [
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "payrollId",
    numeric: false,
    disablePadding: false,
    label: "Payroll ID",
  },
  {
    id: "processedBy",
    numeric: false,
    disablePadding: false,
    label: "Processed By",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];

const RecentPayrollActivity = () => {
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
  } = useMaterialTableHook(recentPayrollData, 5);

  return (
    <div className="col-span-12">
      <div className="card__wrapper">
        <h5 className="card__heading-title mb-[20px]">Recent Payroll Activity</h5>
        <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
          <TableControls
            rowsPerPage={rowsPerPage}
            searchQuery={searchQuery}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleSearchChange={handleSearchChange}
          />
          <Box sx={{ width: "100%" }} className="table-responsive">
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer className="table mb-[20px] hover multiple_tables w-full">
                <Table
                  aria-labelledby="tableTitle"
                  className="whitespace-nowrap"
                >
                  <TableHead>
                    <TableRow className="table__title">
                      {headCells.map((headCell) => (
                        <TableCell
                          className="table__title"
                          key={headCell.id}
                          sortDirection={
                            orderBy === headCell.id ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={
                              orderBy === headCell.id ? order : "asc"
                            }
                            onClick={() => handleRequestSort(headCell.id)}
                          >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === "desc"
                                  ? "sorted descending"
                                  : "sorted ascending"}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody className="table__body">
                    {paginatedRows.map((row: any, index) => (
                      <TableRow
                        key={index}
                        selected={selected.includes(index)}
                        onClick={() => handleClick(index)}
                      >
                        <TableCell className="table__designation">
                          {row.date}
                        </TableCell>
                        <TableCell className="font-medium text-primary">
                          {row.payrollId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                              {row.processedBy.charAt(0)}
                            </div>
                            {row.processedBy}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{row.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`badge ${
                            row.status === 'Completed' ? 'bg-success' :
                            row.status === 'Processing' ? 'bg-warning' :
                            row.status === 'Failed' ? 'bg-danger' : 'bg-info'
                          }`}>
                            {row.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
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
  );
};

export default RecentPayrollActivity;