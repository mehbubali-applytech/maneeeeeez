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
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import {
  Description,
  Edit,
  Delete,
  Visibility,
  ContentCopy,
  ToggleOn,
  ToggleOff,
  Star,
  StarBorder
} from "@mui/icons-material";
import { IOfferLetterTemplate } from "./OfferLetterTypes";
import DeleteModal from "@/components/common/DeleteModal";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface TemplateTableProps {
  data: IOfferLetterTemplate[];
  onEdit: (template: IOfferLetterTemplate) => void;
  onDelete: (id: string) => void;
  onPreview: (template: IOfferLetterTemplate) => void;
  onDuplicate: (template: IOfferLetterTemplate) => void;
  onStatusChange: (id: string, status: boolean) => void;
}

const templateHeadCells = [
  { id: "name", label: "Template Name" },
  { id: "category", label: "Category" },
  { id: "department", label: "Department" },
  { id: "variables", label: "Variables" },
  { id: "usage", label: "Usage" },
  { id: "status", label: "Status" },
];

const TemplateTable: React.FC<TemplateTableProps> = ({
  data,
  onEdit,
  onDelete,
  onPreview,
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
      setSelected(data.map(template => template.id));
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

  // Filter data based on search query
  const filteredData = data.filter(template => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      template.name.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower) ||
      template.category.toLowerCase().includes(searchLower) ||
      template.department?.toLowerCase().includes(searchLower)
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === "name") {
      const valueA = a.name.toLowerCase();
      const valueB = b.name.toLowerCase();
      return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    if (orderBy === "usage") {
      return order === "asc" ? a.usedCount - b.usedCount : b.usedCount - a.usedCount;
    }
    if (orderBy === "category") {
      const valueA = a.category.toLowerCase();
      const valueB = b.category.toLowerCase();
      return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
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
    setSelected(selected.filter(item => item !== id));
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Standard': return 'primary';
      case 'Executive': return 'warning';
      case 'Contractor': return 'info';
      case 'Intern': return 'success';
      default: return 'default';
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = templateHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(template => {
      return [
        template.name,
        template.category,
        template.department || 'All',
        template.variables.join(', '),
        template.usedCount.toString(),
        template.isActive ? "Active" : "Inactive"
      ];
    });
    
    return {
      headers,
      rows,
      title: `Template Export - ${sortedData.length} records`
    };
  }, [sortedData]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            
            {/* Top Controls Row */}
            <Grid container spacing={2} alignItems="center" className="mb-4">
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
                    placeholder="Search templates..."
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `templates_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Template Report - ${new Date().toLocaleDateString()}`
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
                        {templateHeadCells.map((headCell) => (
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
                      {paginatedRows.map((template) => {
                        const categoryColor = getCategoryColor(template.category);
                        
                        return (
                          <TableRow
                            key={template.id}
                            hover
                            selected={selected.includes(template.id)}
                            onClick={() => handleClick(template.id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                className="custom-checkbox checkbox-small"
                                checked={selected.includes(template.id)}
                                onChange={() => handleClick(template.id)}
                                size="small"
                              />
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center">
                                <Description className="mr-2 text-gray-500" fontSize="small" />
                                <div>
                                  <div className="font-medium">{template.name}</div>
                                  {template.description && (
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {template.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Chip
                                label={template.category}
                                size="small"
                                color={categoryColor as any}
                                variant="outlined"
                              />
                            </TableCell>
                            
                            <TableCell>
                              <span className="font-medium">{template.department || 'All'}</span>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {template.variables.slice(0, 3).map((variable, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {variable}
                                  </span>
                                ))}
                                {template.variables.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{template.variables.length - 3} more
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="font-medium">
                                {template.usedCount} uses
                              </div>
                              <div className="text-sm text-gray-500">
                                Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Tooltip title={template.isActive ? "Deactivate" : "Activate"}>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onStatusChange(template.id, !template.isActive);
                                    }}
                                  >
                                    {template.isActive ? (
                                      <ToggleOn color="success" />
                                    ) : (
                                      <ToggleOff color="disabled" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                <span className={`bd-badge ${template.isActive ? 'bg-success' : 'bg-danger'}`}>
                                  {template.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </TableCell>
                            
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(template);
                                  }}
                                  title="Edit Template"
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon download"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onPreview(template);
                                  }}
                                  title="Preview Template"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicate(template);
                                  }}
                                  title="Duplicate Template"
                                >
                                  <ContentCopy fontSize="small" />
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(template.id);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Template"
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
                      <div className="text-sm text-gray-600">Total Templates</div>
                      <div className="text-xl font-semibold">{sortedData.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active Templates</div>
                      <div className="text-xl font-semibold text-green-600">
                        {sortedData.filter(t => t.isActive).length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Uses</div>
                      <div className="text-xl font-semibold">
                        {sortedData.reduce((sum, t) => sum + t.usedCount, 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Most Used</div>
                      <div className="text-xl font-semibold">
                        {sortedData.reduce((max, t) => t.usedCount > max.usedCount ? t : max, sortedData[0])?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls Row */}
            {sortedData.length > 0 && (
              <Grid container spacing={2} alignItems="center" className="mt-4">
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
                {selected.length} template(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedTemplates = data.filter(template => selected.includes(template.id));
                    console.log('Bulk action on templates:', selectedTemplates);
                  }}
                >
                  <ToggleOn fontSize="small" />
                  Toggle Status
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    console.log('Bulk export templates:', selected);
                  }}
                >
                  <i className="fa-solid fa-download mr-1"></i>
                  Export Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} template(s)?`)) {
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
              <Description fontSize="large" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Templates Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No templates found matching "${searchQuery}"`
                : "Create your first template to get started"}
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

export default TemplateTable;