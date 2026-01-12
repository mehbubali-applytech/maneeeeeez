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
  Chip,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Pagination,
  Grid,
  TextField,
  Select,
  Tooltip,
  IconButton,
  TableSortLabel
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Email,
  Phone,
  Business,
  LocationOn,
  AccessTime,
  Send,
  FileDownload,
  Visibility,
  ContentCopy,
  Schedule,
  CheckCircle
} from "@mui/icons-material";
import { IOfferLetter, getStatusColor, formatCurrency, calculateDaysUntil } from "./OfferLetterTypes";
import { visuallyHidden } from "@mui/utils";
import DeleteModal from "@/components/common/DeleteModal";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface OfferLetterTableProps {
  data: IOfferLetter[];
  onEdit: (offer: IOfferLetter) => void;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const offerLetterHeadCells = [
  { id: "candidate", label: "Candidate" },
  { id: "position", label: "Position" },
  { id: "offerDetails", label: "Offer Details" },
  { id: "compensation", label: "Compensation" },
  { id: "timeline", label: "Timeline" },
  { id: "status", label: "Status" },
];

const OfferLetterTable: React.FC<OfferLetterTableProps> = ({
  data,
  onEdit,
  onDelete,
  onSend,
  onStatusChange
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOffer, setSelectedOffer] = useState<IOfferLetter | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("candidate");

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map(offer => offer.id));
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, offer: IOfferLetter) => {
    setAnchorEl(event.currentTarget);
    setSelectedOffer(offer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOffer(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter data based on search query
  const filteredData = data.filter(offer => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      offer.candidateName.toLowerCase().includes(searchLower) ||
      offer.candidateEmail.toLowerCase().includes(searchLower) ||
      offer.position.toLowerCase().includes(searchLower) ||
      offer.offerId.toLowerCase().includes(searchLower) ||
      offer.department.toLowerCase().includes(searchLower)
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === "candidate") {
      const nameA = a.candidateName.toLowerCase();
      const nameB = b.candidateName.toLowerCase();
      return order === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    if (orderBy === "position") {
      const posA = a.position.toLowerCase();
      const posB = b.position.toLowerCase();
      return order === "asc" ? posA.localeCompare(posB) : posB.localeCompare(posA);
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

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Candidate Name",
      "Email",
      "Position",
      "Department",
      "Offer ID",
      "Status",
      "Offer Date",
      "Joining Date",
      "Base Salary",
      "CTC",
      "Job Type",
      "Location"
    ];
    
    const rows = sortedData.map(offer => {
      return [
        offer.candidateName,
        offer.candidateEmail,
        offer.position,
        offer.department,
        offer.offerId,
        offer.offerStatus,
        formatDate(offer.offerDate),
        formatDate(offer.joiningDate),
        formatCurrency(offer.baseSalary),
        formatCurrency(offer.ctc),
        offer.jobType,
        offer.location
      ];
    });
    
    return {
      headers,
      rows,
      title: `Offer Letters Export - ${sortedData.length} records`
    };
  }, [sortedData]);

  const renderStatusActions = (offer: IOfferLetter) => {
    if (offer.offerStatus === 'Draft') {
      return (
        <button
          type="button"
          className="table__icon success"
          onClick={(e) => {
            e.stopPropagation();
            onSend(offer.id);
          }}
          title="Send Offer"
        >
          <Send fontSize="small" />
        </button>
      );
    }
    
    if (offer.offerStatus === 'Sent') {
      return (
        <button
          type="button"
          className="table__icon info"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/owner/offers/track/${offer.id}`, '_blank');
          }}
          title="Track Offer"
        >
          <Visibility fontSize="small" />
        </button>
      );
    }
    
    return null;
  };

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
                    placeholder="Search offers..."
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `offer_letters_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Offer Letters Report - ${new Date().toLocaleDateString()}`
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>
            
            {/* Main Table */}
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
                        {offerLetterHeadCells.map((headCell) => (
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
                      {paginatedRows.map((offer) => {
                        const statusClass = getStatusColor(offer.offerStatus);
                        const daysUntilJoining = calculateDaysUntil(offer.joiningDate);
                        
                        return (
                          <TableRow
                            key={offer.id}
                            hover
                            selected={selected.includes(offer.id)}
                            onClick={() => handleClick(offer.id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                className="custom-checkbox checkbox-small"
                                checked={selected.includes(offer.id)}
                                onChange={() => handleClick(offer.id)}
                                size="small"
                              />
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar
                                  sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}
                                >
                                  {getInitials(offer.candidateName)}
                                </Avatar>
                                <div>
                                  <div className="font-medium">{offer.candidateName}</div>
                                  <div className="text-sm text-gray-500">
                                    {offer.offerId}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium">{offer.position}</div>
                                <div className="text-sm text-gray-500">
                                  {offer.department}
                                </div>
                                <Chip
                                  label={offer.jobType}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mt: 0.5 }}
                                />
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center">
                                  <LocationOn className="mr-1 text-gray-500" fontSize="small" />
                                  <span className="text-sm">{offer.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <Business className="mr-1 text-gray-500" fontSize="small" />
                                  <span className="text-sm">Reports to: {offer.reportingManager}</span>
                                </div>
                                <div className="flex items-center">
                                  <AccessTime className="mr-1 text-gray-500" fontSize="small" />
                                  <span className="text-sm">Probation: {offer.probationPeriod} months</span>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium">{formatCurrency(offer.baseSalary)}</div>
                                <div className="text-sm text-gray-500">
                                  CTC: {formatCurrency(offer.ctc)}
                                </div>
                                {offer.bonus > 0 && (
                                  <div className="text-sm text-green-600">
                                    Bonus: {formatCurrency(offer.bonus)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium">
                                  Offer: {formatDate(offer.offerDate)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Joining: {formatDate(offer.joiningDate)}
                                </div>
                                {daysUntilJoining > 0 && (
                                  <div className={`text-xs ${daysUntilJoining <= 7 ? 'text-warning' : 'text-success'}`}>
                                    {daysUntilJoining} days to join
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={`bd-badge ${statusClass}`}>
                                  {offer.offerStatus}
                                </span>
                                {renderStatusActions(offer)}
                              </div>
                            </TableCell>
                            
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(offer);
                                  }}
                                  title="Edit Offer"
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon download"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/owner/offers/preview/${offer.id}`, '_blank');
                                  }}
                                  title="Preview Offer"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Duplicate offer logic
                                  }}
                                  title="Duplicate Offer"
                                >
                                  <ContentCopy fontSize="small" />
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(offer.id);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Offer"
                                >
                                  <i className="fa-regular fa-trash"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMenuOpen(e, offer);
                                  }}
                                  title="More Actions"
                                >
                                  <MoreVert fontSize="small" />
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
            
            {/* Bottom Controls */}
            <Box className="table-search-box mt-[30px]" sx={{ p: 2 }}>
              <Box>
                {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                  page * rowsPerPage,
                  filteredData.length
                )} of ${filteredData.length} entries`}
                {searchQuery && (
                  <span className="ml-2 text-sm text-gray-600">
                    (Filtered by: `{searchQuery}`)
                  </span>
                )}
              </Box>
              <Pagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
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

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="card__wrapper mb-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-primary-700 font-medium">
                {selected.length} offer(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedOffers = data.filter(offer => selected.includes(offer.id));
                    console.log('Bulk send offers:', selectedOffers);
                  }}
                >
                  <Send fontSize="small" />
                  Send Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    console.log('Bulk export offers:', selected);
                  }}
                >
                  <FileDownload fontSize="small" />
                  Export Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} offer(s)?`)) {
                      selected.forEach(id => onDelete(id));
                      setSelected([]);
                    }
                  }}
                >
                  <Delete fontSize="small" />
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedOffer && (
          <>
            <MenuItem onClick={() => {
              onEdit(selectedOffer);
              handleMenuClose();
            }}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Edit Offer
            </MenuItem>
            
            <MenuItem onClick={() => {
              if (selectedOffer.offerStatus === 'Draft') {
                onSend(selectedOffer.id);
              }
              handleMenuClose();
            }}>
              <Send fontSize="small" sx={{ mr: 1 }} />
              Send Offer
            </MenuItem>
            
            <MenuItem onClick={() => {
              window.open(`/owner/offers/preview/${selectedOffer.id}`, '_blank');
              handleMenuClose();
            }}>
              <Visibility fontSize="small" sx={{ mr: 1 }} />
              Preview Document
            </MenuItem>
            
            <MenuItem onClick={() => {
              // Download PDF logic
              console.log('Download offer:', selectedOffer.id);
              handleMenuClose();
            }}>
              <FileDownload fontSize="small" sx={{ mr: 1 }} />
              Download PDF
            </MenuItem>
            
            {selectedOffer.offerStatus === 'Sent' && (
              <MenuItem onClick={() => {
                window.open(`/owner/offers/track/${selectedOffer.id}`, '_blank');
                handleMenuClose();
              }}>
                <Schedule fontSize="small" sx={{ mr: 1 }} />
                Track Status
              </MenuItem>
            )}
            
            {onStatusChange && (
              <MenuItem onClick={() => {
                onStatusChange(selectedOffer.id, 'Accepted');
                handleMenuClose();
              }}>
                <CheckCircle fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                Mark as Accepted
              </MenuItem>
            )}
            
            <MenuItem onClick={() => {
              setDeleteId(selectedOffer.id);
              setModalDeleteOpen(true);
              handleMenuClose();
            }} sx={{ color: 'error.main' }}>
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete Offer
            </MenuItem>
          </>
        )}
      </Menu>

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

export default OfferLetterTable;