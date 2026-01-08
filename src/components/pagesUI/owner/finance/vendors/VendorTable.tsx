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
import { Checkbox } from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import VendorDetailsModal from "./VendorDetailsModal";
import EditVendorModal from "./EditVendorModal";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import {
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { Business, Phone, Email, AttachMoney } from "@mui/icons-material";

// Define Vendor interface
interface IVendor {
  id: number;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  vendorType: string;
  status: string;
  totalPurchases: number;
  outstandingBalance: number;
  lastTransaction: string;
  [key: string]: any;
}

// Mock data
const vendorsData: IVendor[] = [
  {
    id: 1,
    vendorName: "Tech Supplies Inc.",
    contactPerson: "John Smith",
    email: "john@techsupplies.com",
    phone: "+1 (555) 123-4567",
    vendorType: "IT Equipment",
    status: "Active",
    totalPurchases: 125000,
    outstandingBalance: 15000,
    lastTransaction: "2024-03-15"
  },
  {
    id: 2,
    vendorName: "Office Furniture Co.",
    contactPerson: "Sarah Johnson",
    email: "sarah@officefurniture.com",
    phone: "+1 (555) 987-6543",
    vendorType: "Furniture",
    status: "Active",
    totalPurchases: 75000,
    outstandingBalance: 5000,
    lastTransaction: "2024-03-10"
  },
  {
    id: 3,
    vendorName: "Cloud Services Ltd.",
    contactPerson: "Mike Wilson",
    email: "mike@cloudservices.com",
    phone: "+1 (555) 456-7890",
    vendorType: "Software",
    status: "Pending",
    totalPurchases: 45000,
    outstandingBalance: 10000,
    lastTransaction: "2024-03-05"
  },
  {
    id: 4,
    vendorName: "Cleaning Solutions",
    contactPerson: "Emily Brown",
    email: "emily@cleaningsolutions.com",
    phone: "+1 (555) 234-5678",
    vendorType: "Services",
    status: "Inactive",
    totalPurchases: 30000,
    outstandingBalance: 0,
    lastTransaction: "2024-02-28"
  },
  {
    id: 5,
    vendorName: "Marketing Pro Agency",
    contactPerson: "David Lee",
    email: "david@marketingpro.com",
    phone: "+1 (555) 876-5432",
    vendorType: "Marketing",
    status: "Active",
    totalPurchases: 95000,
    outstandingBalance: 25000,
    lastTransaction: "2024-03-12"
  },
  {
    id: 6,
    vendorName: "Legal Consultancy",
    contactPerson: "Robert Taylor",
    email: "robert@legalconsult.com",
    phone: "+1 (555) 345-6789",
    vendorType: "Legal",
    status: "Active",
    totalPurchases: 65000,
    outstandingBalance: 8000,
    lastTransaction: "2024-03-08"
  },
  {
    id: 7,
    vendorName: "Printing Services",
    contactPerson: "Lisa Anderson",
    email: "lisa@printservices.com",
    phone: "+1 (555) 765-4321",
    vendorType: "Printing",
    status: "Rejected",
    totalPurchases: 28000,
    outstandingBalance: 3000,
    lastTransaction: "2024-02-20"
  },
  {
    id: 8,
    vendorName: "Security Systems Co.",
    contactPerson: "James Miller",
    email: "james@securitysystems.com",
    phone: "+1 (555) 654-3210",
    vendorType: "Security",
    status: "Active",
    totalPurchases: 120000,
    outstandingBalance: 20000,
    lastTransaction: "2024-03-14"
  }
];

// Table head cells
const vendorHeadCells = [
  { id: "vendorName", label: "Vendor Name" },
  { id: "contactPerson", label: "Contact Person" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "vendorType", label: "Type" },
  { id: "status", label: "Status" },
  { id: "totalPurchases", label: "Total Purchases" },
  { id: "outstandingBalance", label: "Outstanding Balance" },
  { id: "lastTransaction", label: "Last Transaction" },
];

const VendorTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editData, setEditData] = useState<IVendor | null>(null);
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
  } = useMaterialTableHook<IVendor>(vendorsData, 10);

  // Helper function for vendor type badge
  const getVendorTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "it equipment":
        return "info-badge";
      case "furniture":
        return "warning-badge";
      case "software":
        return "primary-badge";
      case "services":
        return "success-badge";
      case "marketing":
        return "danger-badge";
      case "legal":
        return "secondary-badge";
      case "printing":
        return "info-badge";
      case "security":
        return "dark-badge";
      default:
        return "default-badge";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = vendorHeadCells.map(cell => cell.label);
    
    const rows = filteredRows.map(vendor => {
      return [
        vendor.vendorName,
        vendor.contactPerson,
        vendor.email,
        vendor.phone,
        vendor.vendorType,
        vendor.status,
        formatCurrency(vendor.totalPurchases),
        formatCurrency(vendor.outstandingBalance),
        vendor.lastTransaction
      ];
    });
    
    return {
      headers,
      rows,
      title: `Vendors Report - ${filteredRows.length} records`
    };
  }, [filteredRows]);

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
                    placeholder="Search vendors..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right (Only new addition) */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `vendors_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Vendors Report - ${new Date().toLocaleDateString()}`
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
                      <TableRow className="table__title bg-gray-50">
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
                        {vendorHeadCells.map((headCell) => (
                          <TableCell
                            className="table__title !font-semibold"
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
                        <TableCell className="!font-semibold">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    
                    <TableBody className="table__body">
                      {paginatedRows.map((row, index) => {
                        const statusClass = getTableStatusClass(row.status);
                        const typeClass = getVendorTypeClass(row.vendorType);
                        
                        return (
                          <TableRow
                            key={row.id}
                            selected={selected.includes(index)}
                            onClick={() => handleClick(index)}
                            className={`hover:bg-blue-50 ${selected.includes(index) ? 'bg-blue-50' : ''}`}
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
                              <div className="flex items-center gap-2">
                                <Business fontSize="small" className="text-gray-400" />
                                <span className="font-medium">{row.vendorName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{row.contactPerson}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Email fontSize="small" className="text-gray-400" />
                                <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline">
                                  {row.email}
                                </a>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Phone fontSize="small" className="text-gray-400" />
                                <a href={`tel:${row.phone}`} className="text-gray-600">
                                  {row.phone}
                                </a>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`bd-badge ${typeClass}`}>
                                {row.vendorType}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`bd-badge ${statusClass}`}>
                                {row.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <AttachMoney fontSize="small" className="text-green-500" />
                                <span className="font-semibold">{formatCurrency(row.totalPurchases)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <AttachMoney fontSize="small" className={row.outstandingBalance > 0 ? 'text-red-500' : 'text-green-500'} />
                                <span className={`font-semibold ${row.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {formatCurrency(row.outstandingBalance)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-600">{row.lastTransaction}</span>
                            </TableCell>
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-2">
                                <button
                                  type="button"
                                  className="table__icon download p-1.5 hover:bg-blue-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditData(row);
                                    setDetailsModalOpen(true);
                                  }}
                                  title="View Details"
                                >
                                  <i className="fa-regular fa-eye text-blue-600"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon edit p-1.5 hover:bg-green-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditData(row);
                                    setModalOpen(true);
                                  }}
                                  title="Edit Vendor"
                                >
                                  <i className="fa-sharp fa-light fa-pen text-green-600"></i>
                                </button>
                                <button
                                  className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(row.id);
                                    setModalDeleteOpen(true);
                                  }}
                                  title="Delete Vendor"
                                >
                                  <i className="fa-regular fa-trash text-red-600"></i>
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

            {/* Vendor Summary */}
            {filteredRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Vendors</div>
                      <div className="text-xl font-semibold">{filteredRows.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active Vendors</div>
                      <div className="text-xl font-semibold text-green-600">
                        {filteredRows.filter(v => v.status === 'Active').length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Purchases</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {formatCurrency(filteredRows.reduce((sum, v) => sum + v.totalPurchases, 0))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Outstanding</div>
                      <div className="text-xl font-semibold text-red-600">
                        {formatCurrency(filteredRows.reduce((sum, v) => sum + v.outstandingBalance, 0))}
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

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2" className="text-white">
            {selected.length} vendor{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedVendors = selected.map(index => filteredRows[index]);
                console.log('Bulk export vendors:', selectedVendors);
              }}
            >
              <i className="fa-solid fa-download mr-1"></i>
              Export Selected
            </button>
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
              onClick={() => {
                const selectedVendors = selected.map(index => filteredRows[index]);
                console.log('Bulk update status:', selectedVendors);
              }}
            >
              <i className="fa-solid fa-toggle-on mr-1"></i>
              Update Status
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selected.length} vendor${selected.length > 1 ? 's' : ''}?`)) {
                  selected.forEach(index => {
                    const vendor = filteredRows[index];
                    if (vendor) handleDelete(vendor.id);
                  });
                }
              }}
            >
              <i className="fa-regular fa-trash mr-1"></i>
              Delete Selected
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
              onClick={() => handleSelectAllClick(false, [])}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {modalOpen && editData && (
        <EditVendorModal
          open={modalOpen}
          setOpen={setModalOpen}
          editData={editData}
        />
      )}
      
      {detailsModalOpen && editData && (
        <VendorDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
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

export default VendorTable;