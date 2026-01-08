// SalaryGradeTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableSortLabel,
  Pagination,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { AttachMoney } from "@mui/icons-material";
import { ISalaryGrade } from "./SalaryGradeTypes";
import DeleteModal from "@/components/common/DeleteModal";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface SalaryGradeTableProps {
  data: ISalaryGrade[];
  onEdit: (grade: ISalaryGrade) => void;
  onDelete: (id: string) => void;
  onView: (grade: ISalaryGrade) => void;
  onDuplicate: (grade: ISalaryGrade) => void;
  onStatusChange: (id: string, status: boolean) => void;
}

// Table head cells
const salaryGradeHeadCells = [
  { id: "name", label: "Grade Name" },
  { id: "code", label: "Code" },
  { id: "components", label: "Components" },
  { id: "totalCTC", label: "Total CTC" },
  { id: "monthlyGross", label: "Monthly Gross" },
  { id: "status", label: "Status" },
];

const SalaryGradeTable: React.FC<SalaryGradeTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onStatusChange
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("name");

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map(grade => grade.id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter data based on search query
  const filteredData = data.filter(grade => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      grade.name.toLowerCase().includes(searchLower) ||
      grade.code.toLowerCase().includes(searchLower) ||
      grade.description?.toLowerCase().includes(searchLower)
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === "name" || orderBy === "code") {
      const valueA = a[orderBy].toLowerCase();
      const valueB = b[orderBy].toLowerCase();
      return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    if (orderBy === "totalCTC" || orderBy === "monthlyGross") {
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

  const handleDelete = (id: string) => {
    onDelete(id);
    setModalDeleteOpen(false);
    // Remove from selected if it was selected
    setSelected(selected.filter(item => item !== id));
  };

  const getStatusClass = (isActive: boolean) => {
    return isActive ? 'bg-success' : 'bg-danger';
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = salaryGradeHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(grade => {
      const componentNames = grade.components.map(c => c.name).join(", ");
      const totalComponents = grade.components.length;
      
      return [
        grade.name,
        grade.code,
        `${totalComponents} components (${componentNames})`,
        formatCurrency(grade.totalCTC),
        formatCurrency(grade.monthlyGross),
        grade.isActive ? "Active" : "Inactive"
      ];
    });
    
    return {
      headers,
      rows,
      title: `Salary Grades Export - ${sortedData.length} records`
    };
  }, [sortedData]);

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
                    placeholder="Search salary grades..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right (Only new addition) */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `salary_grades_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Salary Grades Report - ${new Date().toLocaleDateString()}`
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
                        {salaryGradeHeadCells.map((headCell) => (
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
                      {paginatedRows.map((grade) => {
                        const statusClass = getStatusClass(grade.isActive);
                        
                        return (
                          <TableRow
                            key={grade.id}
                            hover
                            selected={selected.includes(grade.id)}
                            onClick={() => handleClick(grade.id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                className="custom-checkbox checkbox-small"
                                checked={selected.includes(grade.id)}
                                onChange={() => handleClick(grade.id)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AttachMoney className="mr-2 text-gray-500" fontSize="small" />
                                <div>
                                  <div className="font-medium">{grade.name}</div>
                                  {grade.description && (
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {grade.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">{grade.code}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {grade.components.slice(0, 2).map((comp, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {comp.name}
                                  </span>
                                ))}
                                {grade.components.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{grade.components.length - 2} more
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-right">
                                {formatCurrency(grade.totalCTC)}
                                <div className="text-xs text-gray-500">Annual</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-right">
                                {formatCurrency(grade.monthlyGross)}
                                <div className="text-xs text-gray-500">Monthly</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {grade.isActive ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(grade);
                                  }}
                                  title="Edit Grade"
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon download"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onView(grade);
                                  }}
                                  title="View Details"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicate(grade);
                                  }}
                                  title="Duplicate Grade"
                                >
                                  <i className="fa-regular fa-copy"></i>
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(grade.id);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Grade"
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
            
            {/* Summary Stats */}
            {sortedData.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Grades</div>
                      <div className="text-xl font-semibold">{sortedData.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active Grades</div>
                      <div className="text-xl font-semibold text-green-600">
                        {sortedData.filter(g => g.isActive).length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Avg. CTC</div>
                      <div className="text-xl font-semibold">
                        {formatCurrency(sortedData.reduce((sum, g) => sum + g.totalCTC, 0) / sortedData.length)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Components</div>
                      <div className="text-xl font-semibold">
                        {sortedData.reduce((sum, g) => sum + g.components.length, 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls Row */}
            {sortedData.length > 0 && (
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
                        sortedData.length
                      )} of ${sortedData.length} entries`}
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
                      count={Math.ceil(sortedData.length / rowsPerPage)}
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
                {selected.length} grade(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedGrades = data.filter(grade => selected.includes(grade.id));
                    console.log('Bulk action on grades:', selectedGrades);
                  }}
                >
                  <i className="fa-solid fa-toggle-on mr-1"></i>
                  Toggle Status
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    console.log('Bulk export grades:', selected);
                  }}
                >
                  <i className="fa-solid fa-download mr-1"></i>
                  Export Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} grade(s)?`)) {
                      selected.forEach(id => onDelete(id));
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

      {/* Empty State */}
      {sortedData.length === 0 && (
        <div className="card__wrapper">
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <AttachMoney fontSize="large" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Salary Grades Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No grades found matching "${searchQuery}"`
                : "Create your first salary grade to get started"}
            </p>
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

export default SalaryGradeTable;