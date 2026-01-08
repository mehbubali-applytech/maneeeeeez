"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import DesignationUpdateModal from "../designations/DesignationUpdateModal";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import { IEmployee } from "@/interface";
import { array } from "prop-types";

const headCells = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "employee_code", numeric: false, disablePadding: false, label: "Employee Code" },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    { id: "phone", numeric: false, disablePadding: false, label: "Phone" },
    { id: "date_of_joining", numeric: false, disablePadding: false, label: "Date of Joining" },
    { id: "registered_on", numeric: false, disablePadding: false, label: "Registered On" },
];
interface propsType {
    employee: IEmployee[];
}

type EmployeeRow = {
    name: string;
    employee_code: string;
    email: string;
    phone: string;
    date_of_joining: string;
    created_at: string;
    original: IEmployee;
};



const EmployeesTable = ({ employee }: propsType) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<null>(null);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);

    // Transform data using useMemo to avoid unnecessary recalculations
    const employeesData = useMemo(() => {
        if (Array.isArray(employee)) {
            return employee.map((emp) => ({
                name: `${emp.info.first_name} ${emp.info.last_name}`,
                employee_code: emp.info.employee_code,
                email: emp.info.email,
                phone: emp.info.phone,
                date_of_joining: emp.info.date_of_joining,
                created_at: emp.info.created_at,
                original: emp,
            }));
        }
        return [];
    }, [employee]);

    console.log("Transformed data:", employeesData);

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
    } = useMaterialTableHook<any>(employeesData, 10);

    if (!employeesData.length) return <div>Loading...</div>;

    return (
        <>
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
                                            {headCells.map((headCell) => (
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
                                                        {orderBy === headCell.id ? (
                                                            <Box component="span" sx={visuallyHidden}>
                                                                {order === "desc" ? "sorted descending" : "sorted ascending"}
                                                            </Box>
                                                        ) : null}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="table__body">
                                        {paginatedRows.map((row, index) => (
                                            <TableRow
                                                key={index}
                                                selected={selected.includes(index)}
                                                onClick={() => handleClick(index)}
                                            >
                                                <TableCell>{row?.name}</TableCell>
                                                <TableCell>{row?.employee_code}</TableCell>
                                                <TableCell>{row?.email}</TableCell>
                                                <TableCell>{row?.phone}</TableCell>
                                                <TableCell>{row?.date_of_joining}</TableCell>
                                                <TableCell>{row?.created_at}</TableCell>

                                                <TableCell>
                                                    <div className="flex items-center justify-start gap-[10px]">
                                                        <button
                                                            type="button"
                                                            className="table__icon edit"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setModalOpen(true);
                                                                setEditData(row.original);

                                                            }}
                                                        >
                                                            <i className="fa-sharp fa-light fa-pen"></i>
                                                        </button>
                                                        <button
                                                            className="removeBtn table__icon delete"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteId(row.original.info.employee_id);
                                                                setModalDeleteOpen(true);
                                                            }}
                                                        >
                                                            <i className="fa-regular fa-trash"></i>
                                                        </button>
                                                    </div>
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

            {modalOpen && editData && (
                <DesignationUpdateModal
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

export default EmployeesTable;
