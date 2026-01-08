/* eslint-disable react-hooks/rules-of-hooks */
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
import Link from "next/link";
import Image from "next/image";
import { IExpese } from "@/interface/table.interface";
import { expenseHeadCells } from "@/data/table-head-cell/table-head";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { expenseData } from "@/data/expense-data";
import UpdateExpenseModal from "./UpdateExpenseModal";
import DeleteModal from "@/components/common/DeleteModal";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import {
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { Receipt, Person } from "@mui/icons-material";

const ExpenseTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<IExpese | null>(null);
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
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
  } = useMaterialTableHook<IExpese | any>(expenseData, 10);

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Invoice Number",
      "Item Name",
      "Purchased By",
      "Purchase Date",
      "Amount",
      "Status"
    ];
    
    const rows = filteredRows.map(row => {
      return [
        row?.invoiceNumber || "-",
        row?.itemName || "-",
        row?.purchasedBy || "-",
        row?.purchaseDate || "-",
        `$${row?.amount?.toFixed(2) || "0.00"}`,
        row?.status || "-"
      ];
    });
    
    return {
      headers,
      rows,
      title: `Expenses Report - ${filteredRows.length} records`
    };
  }, [filteredRows]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive mat-list-without-checkbox">
            
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
                    placeholder="Search expenses..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right (Only new addition) */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `expenses_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Expenses Report - ${new Date().toLocaleDateString()}`
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
                  <Table
                    aria-labelledby="tableTitle"
                    className="whitespace-nowrap"
                  >
                    <TableHead>
                      <TableRow className="table__title bg-gray-50">
                        {expenseHeadCells.map((headCell) => (
                          <TableCell
                            className="table__title !font-semibold"
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
                        <TableCell className="!font-semibold">Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody className="table__body">
                      {paginatedRows.map((row, index) => {
                        const statusClass = getTableStatusClass(row?.status);
                        return (
                          <TableRow
                            key={index}
                            selected={selected.includes(index)}
                            onClick={() => handleClick(index)}
                            className={`hover:bg-blue-50 ${selected.includes(index) ? 'bg-blue-50' : ''}`}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Receipt fontSize="small" className="text-gray-400" />
                                <span className="font-medium">{row?.invoiceNumber}</span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <span className="font-medium">{row?.itemName}</span>
                            </TableCell>
                            <TableCell>
                              <span className="table-avatar flex justify-start items-center">
                                <Link
                                  className="avatar-img-small me-[10px]"
                                  href={`/hrm/employee-profile/${index + 1}`}
                                >
                                  <Image
                                    className="img-36 border-circle"
                                    src={row?.employeeImg}
                                    alt="User Image"
                                  />
                                </Link>
                                <div className="flex items-center gap-2">
                                  <Person fontSize="small" className="text-gray-400" />
                                  <Link
                                    href={`/hrm/employee-profile/${index + 1}`}
                                  >
                                    {row?.purchasedBy}
                                  </Link>
                                </div>
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-600">{row?.purchaseDate}</span>
                            </TableCell>

                            <TableCell>
                              <span className="font-semibold text-green-600">
                                ${row?.amount?.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {row?.status}
                              </span>
                            </TableCell>
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-2">
                                <button
                                  type="button"
                                  className="table__icon edit p-1.5 hover:bg-blue-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditData(row);
                                    setModalOpen(true);
                                  }}
                                  title="Edit Expense"
                                >
                                  <i className="fa-sharp fa-light fa-pen text-blue-600"></i>
                                </button>
                                <button
                                  className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(index);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Expense"
                                >
                                  <i className="fa-regular fa-trash text-red-600"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon p-1.5 hover:bg-green-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // View expense details
                                    console.log("View expense details:", row?.invoiceNumber);
                                  }}
                                  title="View Details"
                                >
                                  <i className="fa-light fa-eye text-green-600"></i>
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

            {/* Expenses Summary */}
            {filteredRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Expenses</div>
                      <div className="text-xl font-semibold">{filteredRows.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="text-xl font-semibold text-green-600">
                        ${filteredRows.reduce((sum, row) => sum + (row?.amount || 0), 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Approved</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {filteredRows.filter(row => row?.status === 'Approved').length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Pending</div>
                      <div className="text-xl font-semibold text-yellow-600">
                        {filteredRows.filter(row => row?.status === 'Pending').length}
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

      {modalOpen && editData?.purchasedBy && (
        <UpdateExpenseModal
          open={modalOpen}
          setOpen={setModalOpen}
          editData={editData}
        />
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

export default ExpenseTable;