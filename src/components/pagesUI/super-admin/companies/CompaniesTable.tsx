"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { Checkbox, Avatar, Chip, Select, MenuItem, TextField, Grid, Typography, Tooltip, IconButton } from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useRouter } from "next/navigation";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import { toast } from "sonner";
import axios from "axios";

// Table head cells based on new API response structure
const companyHeadCells = [
  { id: "company_name", label: "Company Name" },
  { id: "GSTIN", label: "GSTIN" },
  { id: "contact_person", label: "Contact Person" },
  { id: "contact_email", label: "Email" },
  { id: "contact_phone", label: "Phone" },
  { id: "industry_type", label: "Industry" },
  { id: "location", label: "Location" },
  { id: "contract_start_date", label: "Contract Start" },
  { id: "contract_end_date", label: "Contract End" },
  { id: "status", label: "Status" },
  { id: "created_at", label: "Created At" },
];

interface AllCompaniesTableProps {
  status?: string;
  industry?: string;
  country?: string;
  dateRange?: { start: string; end: string };
}

const CompaniesTable: React.FC<AllCompaniesTableProps> = ({
  status = "all",
  industry = "all",
  country = "all",
  dateRange
}) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  // Format company data from API response
  const formatCompanyData = (company: any) => {
    try {
      // Company details is already an object in the response
      const companyDetails = company.company_details || {};
      const address = companyDetails.address || {};
      const bankDetails = companyDetails.bank_details || {};

      return {
        // Main fields from API response
        id: company.id.toString(),
        company_name: company.company_name || "",
        GSTIN: company.GSTIN || "",
        contact_person: company.contact_person || "",
        contact_email: company.contact_email || company.email || "",
        contact_phone: company.contact_phone || company.phone || "",
        
        // Extracted from company_details
        industry_type: companyDetails.industry_type || company.industry_type || company.industry || "",
        street: address.street || company.address || "",
        city: address.city || company.city || "",
        state: address.state || company.state || "",
        country: address.country || company.country || "",
        postal_code: address.postal_code || company.zipCode || "",
        tax_id: companyDetails.tax_id || company.taxId || "",
        
        // Bank details
        bank_name: bankDetails.bank_name || "",
        account_number: bankDetails.account_number || "",
        account_holder_name: bankDetails.account_holder_name || "",
        ifsc_code: bankDetails.ifsc_code || "",
        branch_name: bankDetails.branch_name || "",
        account_type: bankDetails.account_type || "",
        
        // Other details
        payment_terms: companyDetails.payment_terms || "",
        role_name: companyDetails.role_name || "",
        
        // Contract details
        contract_start_date: company.contract_start_date || "",
        contract_end_date: company.contract_end_date || "",
        
        // Status
        status: company.status || "Pending",
        
        // Location from API (already formatted)
        location: company.location || "",
        
        // Timestamps
        created_at: company.created_at || "",
        updated_at: company.updated_at || "",
        
        // For backward compatibility
        client_id: company.id.toString(),
        company_details: companyDetails
      };
    } catch (error) {
      console.error('Error formatting company data:', error, company);
      return {
        id: company.id?.toString() || "",
        client_id: company.id?.toString() || "",
        company_name: company.company_name || "",
        contact_person: company.contact_person || "",
        contact_email: company.contact_email || "",
        status: company.status || "Pending",
        created_at: company.created_at || ""
      };
    }
  };

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const params: any = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery || ''
      };

      // Add status filter if not 'all'
      if (status !== 'all') {
        params.status = status;
      }

      // Add date range if provided
      if (dateRange?.start && dateRange?.end) {
        params.startDate = dateRange.start;
        params.endDate = dateRange.end;
      }

      console.log("Fetching companies with params:", params);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/company/getAllCompanies`,
        { params }
      );

      const data = response.data;
      console.log("API Response:", data);

      if (data.error?.errorCode === 0 && data.data) {
        const companiesArray = data.data.companies || [];
        const pagination = data.data.pagination || { total: companiesArray.length };
        
        const formattedCompanies = companiesArray.map(formatCompanyData);

        setCompanies(formattedCompanies);
        setTotalCount(pagination.total || formattedCompanies.length);
      } else {
        toast.error(data.error?.errorMessage || "Failed to fetch companies");
        setCompanies([]);
        setTotalCount(0);
      }
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error(error.response?.data?.error?.errorMessage || 'Failed to load companies');
      setCompanies([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, rowsPerPage, status, searchQuery, orderBy, order, dateRange]);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle sort
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setCurrentPage(1);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/company/${id}`
      );

      if (response.data.error?.errorCode === 0) {
        toast.success("Company deleted successfully");
        fetchCompanies();
        setModalDeleteOpen(false);
      } else {
        toast.error(response.data.error?.errorMessage || "Failed to delete company");
      }
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(error.response?.data?.error?.errorMessage || "Failed to delete company");
    }
  };

  // Get status chip color
  const getStatusClass = (status: string) => {
    if (!status) return "default";

    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "error";
      case "suspended":
        return "error";
      default:
        return "default";
    }
  };

  // Get industry chip color
  const getIndustryClass = (industry: string) => {
    if (!industry) return "default";

    const industryLower = industry.toLowerCase();
    if (industryLower.includes("it") || industryLower.includes("tech")) return "primary";
    if (industryLower.includes("manufact")) return "warning";
    if (industryLower.includes("health")) return "info";
    if (industryLower.includes("finance") || industryLower.includes("bank")) return "success";
    if (industryLower.includes("retail")) return "error";
    if (industryLower.includes("educat")) return "secondary";
    return "default";
  };

  // Handle view company
  const handleViewCompany = (company: any) => {
    router.push(`/super-admin/companies/${company.id}`);
  };

  // Handle edit company
  const handleEditCompany = (company: any) => {
    router.push(`/super-admin/companies/update-company/${company.id}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Invalid Date";
    }
  };

  // Get location display - updated to use location field from API
  const getLocationDisplay = (company: any) => {
    // Use the location field from API if available
    if (company.location && company.location !== "N/A") {
      return company.location;
    }
    
    // Fallback to constructing from city/state
    if (company.city && company.state) {
      return `${company.city}, ${company.state}`;
    } else if (company.city) {
      return company.city;
    } else if (company.state) {
      return company.state;
    } else if (company.country) {
      return company.country;
    }
    return "N/A";
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = companyHeadCells.map(cell => cell.label);

    const rows = companies.map(company => [
      company.company_name || "N/A",
      company.GSTIN || "N/A",
      company.contact_person || "N/A",
      company.contact_email || "N/A",
      company.contact_phone || "N/A",
      company.industry_type || "N/A",
      getLocationDisplay(company),
      formatDate(company.contract_start_date),
      company.contract_end_date ? formatDate(company.contract_end_date) : "Ongoing",
      company.status || "N/A",
      formatDate(company.created_at)
    ]);

    return {
      headers,
      rows,
      title: `Companies Export - ${companies.length} records`
    };
  }, [companies]);

  // Sort companies locally for now (or implement server-side sorting)
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      
      if (order === "asc") {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });
  }, [companies, orderBy, order]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            {/* Top Controls Row */}
            <Grid container spacing={2} alignItems="center" className="mb-4">
              {/* Search Bar */}
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
                    placeholder="Search by company name, GSTIN, contact..."
                  />
                </Box>
              </Grid>

              {/* Export Options */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `companies_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Companies Report - ${new Date().toLocaleDateString()}`
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Loading State */}
            {loading ? (
              <Box className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <Typography className="ml-4 text-gray-600">Loading companies...</Typography>
              </Box>
            ) : (
              <>
                {/* Main Table */}
                <Box sx={{ width: "100%" }} className="table-responsive">
                  <Paper sx={{ width: "100%", mb: 2 }}>
                    <TableContainer className="table mb-[20px] hover multiple_tables w-full">
                      <Table aria-labelledby="tableTitle" className="whitespace-nowrap">
                        <TableHead>
                          <TableRow className="table__title bg-gray-50">
                            <TableCell padding="checkbox" className="!font-semibold">
                              <Checkbox
                                className="custom-checkbox checkbox-small"
                                color="primary"
                                size="small"
                              />
                            </TableCell>
                            {companyHeadCells.map((headCell) => (
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
                          {sortedCompanies.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={companyHeadCells.length + 2} className="text-center py-8">
                                <div className="flex flex-col items-center justify-center">
                                  <BusinessIcon className="text-gray-400 mb-2" fontSize="large" />
                                  <Typography variant="body1" className="text-gray-600">
                                    No companies found
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {searchQuery || status !== "all"
                                      ? "Try adjusting your filters or search query"
                                      : "No companies have been added yet"}
                                  </Typography>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            sortedCompanies.map((company, index) => {
                              const statusClass = getStatusClass(company.status);
                              const industryClass = getIndustryClass(company.industry_type);

                              return (
                                <TableRow
                                  key={company.id || index}
                                  hover
                                  className="hover:bg-blue-50"
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      className="custom-checkbox checkbox-small"
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Avatar className="mr-3 bg-primary">
                                        <BusinessIcon />
                                      </Avatar>
                                      <div>
                                        <Typography variant="body2" className="font-medium">
                                          {company.company_name || "N/A"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          ID: #{company.id ? company.id.toString().substring(0, 8) : "N/A"}
                                        </Typography>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip title={company.GSTIN || "No GSTIN"}>
                                      <Typography variant="body2" className="font-mono text-sm">
                                        {company.GSTIN || "—"}
                                      </Typography>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <PersonIcon className="mr-1 text-gray-500" fontSize="small" />
                                      <Typography variant="body2">
                                        {company.contact_person || "N/A"}
                                      </Typography>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <EmailIcon className="mr-1 text-gray-500" fontSize="small" />
                                      <Typography variant="body2" className="truncate max-w-[150px]">
                                        {company.contact_email || "N/A"}
                                      </Typography>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <PhoneIcon className="mr-1 text-gray-500" fontSize="small" />
                                      <Typography variant="body2">
                                        {company.contact_phone || "N/A"}
                                      </Typography>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {company.industry_type ? (
                                      <Chip
                                        label={company.industry_type}
                                        size="small"
                                        color={industryClass as any}
                                        variant="filled"
                                        className="font-medium"
                                      />
                                    ) : (
                                      <Typography variant="body2" color="text.secondary">
                                        —
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <LocationOnIcon className="mr-1 text-gray-500" fontSize="small" />
                                      <Typography variant="body2">
                                        {getLocationDisplay(company)}
                                      </Typography>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <CalendarTodayIcon className="mr-1 text-gray-500" fontSize="small" />
                                      <Typography variant="body2" className="font-medium">
                                        {formatDate(company.contract_start_date)}
                                      </Typography>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <CalendarTodayIcon className="mr-1 text-gray-500" fontSize="small" />
                                      <Typography variant="body2" className="font-medium">
                                        {company.contract_end_date ? formatDate(company.contract_end_date) : "Ongoing"}
                                      </Typography>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={company.status || "N/A"}
                                      size="small"
                                      color={statusClass as any}
                                      variant="filled"
                                      className="font-medium"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" className="font-medium">
                                      {formatDate(company.created_at)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell className="table__icon-box">
                                    <div className="flex items-center justify-start gap-2">
                                      <Tooltip title="View Details">
                                        <IconButton
                                          size="small"
                                          className="p-1.5 hover:bg-blue-100"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewCompany(company);
                                          }}
                                        >
                                          <VisibilityIcon fontSize="small" className="text-blue-600" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Edit Company">
                                        <IconButton
                                          size="small"
                                          className="p-1.5 hover:bg-green-100"
                                          onClick={() => handleEditCompany(company)}
                                        >
                                          <EditIcon fontSize="small" className="text-green-600" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete Company">
                                        <IconButton
                                          size="small"
                                          className="p-1.5 hover:bg-red-100"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteId(company.id);
                                            setModalDeleteOpen(true);
                                          }}
                                        >
                                          <i className="fa-regular fa-trash text-red-600"></i>
                                        </IconButton>
                                      </Tooltip>
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

                {/* Bottom Controls Row */}
                <Grid container spacing={2} alignItems="center" className="mt-4">
                  {/* Number of Entries Dropdown */}
                  <Grid item xs={12} md={3}>
                    <Box className="flex items-center gap-2">
                      <Typography variant="body2" className="whitespace-nowrap">
                        Show
                      </Typography>
                      <Select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
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

                  {/* Showing Entries Info */}
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col items-center">
                      <Typography variant="body2">
                        {`Showing ${Math.min(((currentPage - 1) * rowsPerPage) + 1, totalCount)} to ${Math.min(
                          currentPage * rowsPerPage,
                          totalCount
                        )} of ${totalCount} entries`}
                      </Typography>
                      {(status !== "all" || searchQuery) && (
                        <Typography variant="caption" className="text-gray-600">
                          {status !== "all" ? `Status: ${status}` : ""}
                          {searchQuery ? ` • Search: "${searchQuery}"` : ""}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Pagination */}
                  <Grid item xs={12} md={3}>
                    <Box className="flex justify-end">
                      <Pagination
                        count={Math.ceil(totalCount / rowsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        className="manaz-pagination-button"
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
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

export default CompaniesTable;