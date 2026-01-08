// RoleTable.tsx
"use client";

import React, { useState } from "react";
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
import { Checkbox } from "@mui/material";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import { IRole } from "./RoleTypes";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import PersonIcon from "@mui/icons-material/Person";

interface RoleTableProps {
  data: IRole[];
  onEdit: (role: IRole) => void;
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: boolean) => void;
}

// Table head cells
const roleHeadCells = [
  { id: "roleName", label: "Role Name" },
  { id: "roleCode", label: "Code" },
  { id: "description", label: "Description" },
  { id: "defaultSalaryGrade", label: "Salary Grade" },
  { id: "permissions", label: "Permissions" },
  { id: "assignedUsers", label: "Users" },
  { id: "activeStatus", label: "Status" },
  { id: "createdAt", label: "Created" },
];

const RoleTable: React.FC<RoleTableProps> = ({
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
  } = useMaterialTableHook<IRole>(data, 10);

  const handleStatusChange = (id: number, currentStatus: boolean) => {
    if (onStatusChange) {
      onStatusChange(id, !currentStatus);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: boolean) => {
    return status ? "Active" : "Inactive";
  };

  const getStatusClass = (status: boolean) => {
    return status ? "bg-success" : "bg-secondary";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
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
                        {roleHeadCells.map((headCell) => (
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
                            key={row.roleId}
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
                              <div className="font-medium">
                                {row.roleName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {row.roleCode || "-"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={row.description || ""}>
                                <span className="text-gray-600">
                                  {truncateText(row.description || "", 30)}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              {row.defaultSalaryGrade ? (
                                <Chip
                                  label={row.defaultSalaryGrade}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={
                                  <div>
                                    {row.permissions?.slice(0, 5).map(p => (
                                      <div key={p}>{p}</div>
                                    ))}
                                    {row.permissions?.length > 5 && (
                                      <div>+ {row.permissions.length - 5} more</div>
                                    )}
                                  </div>
                                }
                              >
                                <Chip
                                  label={`${row.permissions?.length || 0} perms`}
                                  size="small"
                                  variant="outlined"
                                  color="info"
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <PersonIcon fontSize="small" />
                                <span className="font-semibold">
                                  {row.assignedUsers || 0}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  size="small"
                                  checked={row.activeStatus}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(row.roleId, row.activeStatus);
                                  }}
                                  color="success"
                                />
                                <span className={`bd-badge ${statusClass}`}>
                                  {getStatusBadge(row.activeStatus)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600">
                                {formatDate(row.createdAt)}
                              </span>
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
                                  title="Edit Role"
                                >
                                  <i className="fa-light fa-edit"></i>
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(row.roleId);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Role"
                                >
                                  <i className="fa-regular fa-trash"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon bg-info/50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Open assign users modal
                                    console.log("Assign users for role:", row.roleId);
                                  }}
                                  title="Assign to Users"
                                >
                                  <i className="fa-light fa-user-plus"></i>
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

export default RoleTable;