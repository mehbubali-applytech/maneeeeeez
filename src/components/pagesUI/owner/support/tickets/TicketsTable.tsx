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
import { ITicket } from "@/interface/table.interface";
import { ticketsHeadCells } from "@/data/table-head-cell/table-head";
import {
  useTablePrirotyHook,
  getTableStatusClass,
} from "@/hooks/use-condition-class";
import { ticketsData } from "@/data/tickets-data";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";

const TicketsTable = () => {
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
  } = useMaterialTableHook<ITicket>(ticketsData, 10);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  /** Priority numeric indexing */
  const priorityIndexing = (priority: string) => {
    switch (priority) {
      case "Low":
        return 0;
      case "Medium":
        return 1;
      case "High":
        return 2;
      default:
        return 99;
    }
  };

  /** Custom sorted rows (priority handled numerically) */
  const sortedRows = useMemo(() => {
    if (orderBy !== "priority") return paginatedRows;

    return [...paginatedRows].sort((a, b) => {
      const aVal = priorityIndexing(a.priority);
      const bVal = priorityIndexing(b.priority);

      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [paginatedRows, orderBy, order]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
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
                  <Table aria-labelledby="tableTitle" className="whitespace-nowrap">
                    <TableHead>
                      <TableRow className="table__title">
                        {ticketsHeadCells.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}
                          >
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

                    <TableBody className="table__body">
                      {sortedRows.map((row, index) => {
                        const statusClass = getTableStatusClass(row.status);
                        const priorityClass = useTablePrirotyHook(row.priority);

                        return (
                          <TableRow
                            key={index}
                            selected={selected.includes(index)}
                            onClick={() => handleClick(index)}
                          >
                            <TableCell>{row.ticketID}</TableCell>
                            <TableCell>{row.ticketTitle}</TableCell>

                            <TableCell>
                              <span className={`bd-badge ${priorityClass}`}>
                                {row.priority}
                              </span>
                            </TableCell>

                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.createdBy}</TableCell>
                            <TableCell>{row.lastReply}</TableCell>

                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {row.status}
                              </span>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon reply"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <i className="fa-sharp fa-light fa-reply"></i>
                                </button>

                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(index);
                                    setModalDeleteOpen(true);
                                  }}
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

export default TicketsTable;
