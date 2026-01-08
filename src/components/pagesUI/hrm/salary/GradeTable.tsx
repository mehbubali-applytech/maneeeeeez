"use client";

import React, { useMemo, useState } from "react";
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
import DeleteModal from "@/components/common/DeleteModal";
import Link from "next/link";

interface GradeData {
  id: number;
  grade_name: string;
  ctc_range_min: number;
  ctc_range_max: number;
  [key: string]: any;
}

interface GradeTableProps {
  grades: GradeData[];
}

const headCells = [
  { id: "id", label: "ID" },
  { id: "grade_name", label: "Grade Name" },
  { id: "ctc_range_min", label: "CTC Min" },
  { id: "ctc_range_max", label: "CTC Max" },
];

const GradeTable = ({ grades }: GradeTableProps) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  // ✔ TRANSFORM + MEMOIZE (just like EmployeesTable)
  const gradeRows = useMemo(() => grades, [grades]);

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
  } = useMaterialTableHook<GradeData>(gradeRows, 15);

  if (!grades.length) return <p>No grade data found</p>;

        const handlePrint = () => {
    const printWindow = window.open("https://manez-dashboard.vercel.app/payroll-payslip-print", "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        // Ensure the DOM is fully loaded
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 1000);
      };
    }
  };

  return (
    <>
      <div className="col-span-12 card__wrapper">

        <div className="">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive mat-list-without-checkbox">
            <TableControls
              rowsPerPage={rowsPerPage}
              searchQuery={searchQuery}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleSearchChange={handleSearchChange}
            />

            <Box sx={{ width: "100%" }} className="table-responsive">
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer className="table mb-[20px] hover multiple_tables w-full">
                  <Table>
                    <TableHead>
                      <TableRow>
                        {headCells.map((headCell) => (
                          <TableCell key={headCell.id}>
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={orderBy === headCell.id ? order : "asc"}
                              onClick={() => handleRequestSort(headCell.id)}
                            >
                              {headCell.label}
                              {orderBy === headCell.id && (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === "desc"
                                    ? "sorted descending"
                                    : "sorted ascending"}
                                </Box>
                              )}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {paginatedRows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          selected={selected.includes(index)}
                          onClick={() => handleClick(index)}
                        >
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.grade_name}</TableCell>
                          <TableCell>{row.ctc_range_min}</TableCell>
                          <TableCell>{row.ctc_range_max}</TableCell>

                          <TableCell>
                            <button
                              className="removeBtn table__icon delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(row.id);
                                setModalDeleteOpen(true);
                              }}
                            >
                              <i className="fa-regular fa-trash"></i>
                            </button>
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
                              <div className="flex flex-wrap lg:justify-end gap-[10px] my-5">
                <button className="btn btn-info" onClick={handlePrint}>
                  <i className="fa-sharp fa-regular fa-eye"></i>
                  Print
                </button>
                <button className="btn btn-success">
                  <i className="fa-sharp fa-light fa-floppy-disk"></i> Save
                </button>
                <Link
                  href="/assets/documents/payroll-payslip.pdf"
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    const link = document.createElement("a");
                    link.href = "/assets/documents/payroll-payslip.pdf";
                    link.download = "payroll-payslip.pdf";
                    link.click();
                  }}
                >
                  <i className="fa-sharp fa-thin fa-file-arrow-down"></i> Download
                </Link>
                <button type="submit" className="btn btn-primary">
                  <i className="fa-light fa-paper-plane"></i> Send
                </button>
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

export default GradeTable;
