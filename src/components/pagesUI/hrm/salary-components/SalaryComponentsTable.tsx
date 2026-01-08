"use client";

import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import { visuallyHidden } from "@mui/utils";
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import InputField from "@/components/elements/SharedInputs/InputField";
import { useForm, FieldError } from "react-hook-form";

interface SalaryComponent {
  id: number;
  name: string;
  calculation_type: string;
  component_type: string;
  description: string;
  [key: string]: any;
}

interface SalaryComponentsTableProps {
  salaryComponents: SalaryComponent[];
}

const headCells = [
  { id: "id", label: "ID" },
  { id: "name", label: "Component Name" },
  { id: "calculation_type", label: "Calculation Type" },
  { id: "component_type", label: "Component Type" },
  { id: "description", label: "Description" },
];

const SalaryComponentsTable = ({ salaryComponents }: SalaryComponentsTableProps) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const componentRows = useMemo(() => salaryComponents, [salaryComponents]);

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
  } = useMaterialTableHook<SalaryComponent>(componentRows, 15);

  // Initialize form for editing
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleEditClick = (row: SalaryComponent) => {
    setIsEditing(true);
    setEditingRowId(row.id);
    // Reset form with current row values
    reset({
      [`name_${row.id}`]: row.name,
      [`calculation_type_${row.id}`]: row.calculation_type,
      [`component_type_${row.id}`]: row.component_type,
      [`description_${row.id}`]: row.description,
    });
  };

  const handleSaveClick = (rowId: number) => {
    // Here you would typically make an API call to update the data
    console.log(`Save changes for row ${rowId}`);
    setIsEditing(false);
    setEditingRowId(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingRowId(null);
  };

  const onSubmit = (data: any) => {
    // Handle form submission here
    console.log("Form data:", data);
    // Make API call to update all rows
  };

  // Helper function to get error as FieldError or undefined
  const getFieldError = (fieldName: string): FieldError | undefined => {
    const error = errors[fieldName];
    // Cast the error to FieldError since we know it has the required properties
    return error as FieldError;
  };

  if (!salaryComponents.length) return <p>No salary component data found</p>;

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
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            {/* ID - Not editable */}
                            <TableCell>{row.id}</TableCell>

                            {/* Component Name */}
                            <TableCell>
                              {editingRowId === row.id ? (
                                <InputField
                                  label=""
                                  id={`name_${row.id}`}
                                  type="text"
                                  defaultValue={row.name}
                                  register={register(`name_${row.id}`, { 
                                    required: "Component name is required" 
                                  })}
                                  error={getFieldError(`name_${row.id}`)}
                                  required={true}
                                />
                              ) : (
                                row.name
                              )}
                            </TableCell>

                            {/* Calculation Type */}
                            <TableCell>
                              {editingRowId === row.id ? (
                                <InputField
                                  label=""
                                  id={`calculation_type_${row.id}`}
                                  type="text"
                                  defaultValue={row.calculation_type}
                                  register={register(`calculation_type_${row.id}`, { 
                                    required: "Calculation type is required" 
                                  })}
                                  error={getFieldError(`calculation_type_${row.id}`)}
                                  required={true}
                                />
                              ) : (
                                row.calculation_type
                              )}
                            </TableCell>

                            {/* Component Type */}
                            <TableCell>
                              {editingRowId === row.id ? (
                                <InputField
                                  label=""
                                  id={`component_type_${row.id}`}
                                  type="text"
                                  defaultValue={row.component_type}
                                  register={register(`component_type_${row.id}`, { 
                                    required: "Component type is required" 
                                  })}
                                  error={getFieldError(`component_type_${row.id}`)}
                                  required={true}
                                />
                              ) : (
                                row.component_type
                              )}
                            </TableCell>

                            {/* Description */}
                            <TableCell>
                              {editingRowId === row.id ? (
                                <InputField
                                  label=""
                                  id={`description_${row.id}`}
                                  type="text"
                                  defaultValue={row.description}
                                  register={register(`description_${row.id}`)}
                                  error={getFieldError(`description_${row.id}`)}
                                  required={false}
                                  isTextArea={true}
                                />
                              ) : (
                                row.description
                              )}
                            </TableCell>

                            <TableCell>
                              {editingRowId === row.id ? (
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    className="saveBtn table__icon edit"
                                    onClick={() => handleSaveClick(row.id)}
                                  >
                                    <i className="fa-regular fa-check"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="cancelBtn table__icon delete"
                                    onClick={handleCancelClick}
                                  >
                                    <i className="fa-regular fa-times"></i>
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    className="editBtn table__icon edit"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(row);
                                    }}
                                  >
                                    <i className="fa-regular fa-pen-to-square"></i>
                                  </button>
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
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Submit Button */}
                  <div className="flex justify-end p-4">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Save All Changes
                    </button>
                  </div>
                </form>
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

export default SalaryComponentsTable;