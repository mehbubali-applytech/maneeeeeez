"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Checkbox,
  TableSortLabel,
  Pagination,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import { IDepartment } from "./departments.interface";

interface Props {
  data: IDepartment[];
  onEdit?: (department: IDepartment) => void;
  onDelete?: (id: number) => void;
}

// Table head cells
const departmentHeadCells = [
  { id: "departmentName", label: "Department Name" },
  { id: "departmentCode", label: "Code" },
  { id: "departmentType", label: "Type" },
  { id: "managerName", label: "Manager" },
  { id: "employeeCount", label: "Employees" },
  { id: "projectsCount", label: "Projects" },
  { id: "budget", label: "Budget" },
  { id: "status", label: "Status" },
];

const DepartmentsTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("departmentName");

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map(dept => dept.id));
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

  const formatCurrency = (amount: number, currency: string = "₹") => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getStatusClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-danger';
      case 'archived': return 'bg-secondary';
      case 'planned': return 'bg-info';
      default: return 'default-badge';
    }
  };

  const getTypeClass = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'technical': return 'bg-primary';
      case 'administrative': return 'bg-success';
      case 'marketing': return 'bg-warning';
      case 'hr': return 'bg-info';
      case 'finance': return 'bg-danger';
      case 'operations': return 'bg-secondary';
      default: return 'default-badge';
    }
  };

  // Filter data based on search query
  const filteredData = data.filter(dept => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      dept.departmentName.toLowerCase().includes(searchLower) ||
      dept.departmentCode.toLowerCase().includes(searchLower) ||
      dept.managerName?.toLowerCase().includes(searchLower) ||
      dept.departmentType?.toLowerCase().includes(searchLower)
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === "departmentName" || orderBy === "departmentCode" || orderBy === "managerName") {
      const valueA = a[orderBy]?.toLowerCase() || '';
      const valueB = b[orderBy]?.toLowerCase() || '';
      return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    if (orderBy === "employeeCount" || orderBy === "projectsCount" || orderBy === "budget") {
      return order === "asc" ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    return 0;
  });

  // Paginate data
  const paginatedRows = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
                            indeterminate={selected.length > 0 && selected.length < filteredData.length}
                            checked={filteredData.length > 0 && selected.length === filteredData.length}
                            onChange={handleSelectAllClick}
                            size="small"
                          />
                        </TableCell>
                        {departmentHeadCells.map((headCell) => (
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
                      {paginatedRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} align="center" className="py-8">
                            <div className="text-gray-400">
                              <i className="fa-solid fa-building text-4xl mb-4"></i>
                              <h3 className="text-lg font-medium text-gray-700">No departments found</h3>
                              <p className="text-gray-500">
                                {searchQuery 
                                  ? `No departments matching "${searchQuery}"`
                                  : "Create your first department to get started"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((dept) => {
                          const statusClass = getStatusClass(dept.status);
                          const typeClass = getTypeClass(dept.departmentType);
                          
                          return (
                            <TableRow
                              key={dept.id}
                              hover
                              selected={selected.includes(dept.id)}
                              onClick={() => handleClick(dept.id)}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="custom-checkbox checkbox-small"
                                  checked={selected.includes(dept.id)}
                                  onChange={() => handleClick(dept.id)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{dept.departmentName}</div>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold">{dept.departmentCode}</span>
                              </TableCell>
                              <TableCell>
                                <span className={`bd-badge ${typeClass}`}>
                                  {dept.departmentType}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">{dept.managerName || "-"}</span>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold">{dept.employeeCount}</span>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold">{dept.projectsCount}</span>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-right">
                                  {formatCurrency(dept.budget, dept.currency)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`bd-badge ${statusClass}`}>
                                  {dept.status}
                                </span>
                              </TableCell>
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-[10px]">
                                  <button
                                    type="button"
                                    className="table__icon edit"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit?.(dept);
                                    }}
                                    title="Edit Department"
                                  >
                                    <i className="fa-regular fa-pen-to-square"></i>
                                  </button>
                                  <button
                                    className="removeBtn table__icon delete"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteId(dept.id);
                                      setModalDeleteOpen(true);
                                    }}
                                    title="Delete Department"
                                  >
                                    <i className="fa-regular fa-trash"></i>
                                  </button>
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

            {/* Department Summary */}
            {sortedData.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Departments</div>
                      <div className="text-xl font-semibold">{sortedData.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Employees</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {sortedData.reduce((sum, dept) => sum + dept.employeeCount, 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Projects</div>
                      <div className="text-xl font-semibold text-green-600">
                        {sortedData.reduce((sum, dept) => sum + dept.projectsCount, 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Budget</div>
                      <div className="text-xl font-semibold">
                        {formatCurrency(sortedData.reduce((sum, dept) => sum + dept.budget, 0))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sortedData.length > 0 && (
              <Box className="table-search-box mt-[30px]" sx={{ p: 2 }}>
                <Box>
                  {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                    page * rowsPerPage,
                    sortedData.length
                  )} of ${sortedData.length} entries`}
                  {searchQuery && (
                    <span className="ml-2 text-sm text-gray-600">
                      (Filtered by: `{searchQuery}`)
                    </span>
                  )}
                </Box>
                <Pagination
                  count={Math.ceil(sortedData.length / rowsPerPage)}
                  page={page}
                  onChange={(e, value) => handleChangePage(value)}
                  variant="outlined"
                  shape="rounded"
                  className="manaz-pagination-button"
                />
              </Box>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="card__wrapper mb-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-primary-700 font-medium">
                {selected.length} department(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedDepartments = data.filter(dept => selected.includes(dept.id));
                    console.log('Bulk action on departments:', selectedDepartments);
                  }}
                >
                  <i className="fa-solid fa-toggle-on mr-1"></i>
                  Toggle Status
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedDepartments = data.filter(dept => selected.includes(dept.id));
                    console.log('Bulk export departments:', selectedDepartments);
                  }}
                >
                  <i className="fa-solid fa-download mr-1"></i>
                  Export Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} department(s)?`)) {
                      selected.forEach(id => onDelete?.(id));
                      setSelected([]);
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

export default DepartmentsTable;