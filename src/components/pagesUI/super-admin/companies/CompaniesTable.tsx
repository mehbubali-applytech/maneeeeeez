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
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { Checkbox, Avatar, Rating, Typography, Chip, Select, MenuItem, TextField, Grid } from "@mui/material";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import CompanyDetailsModal from "./CompanyDetailsModal";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ICompany } from "./companies.interface";
import { useRouter } from "next/navigation";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

const companiesData: ICompany[] = [
  {
    id: 1,
    name: "TechNova Solutions",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    websites: "technova.com",
    industry: "Technology",
    currencyType: "USD",
    source: "Direct",
    description: "Leading technology solutions provider specializing in cloud computing and AI",
    language: "English",
    country: "USA",
    city: "San Francisco",
    zipCode: "94105",
    state: "California",
    address: "123 Tech Street, San Francisco, CA 94105",
    email: "info@technova.com",
    owner: "John Smith",
    rating: 4.8,
    tag: "Premium Partner",
    status: "Active",
    employees: 1250,
    departments: 12,
    projects: 48,
    revenue: 45000000,
    established: "2015",
    licenseNumber: "TECH-12345",
    taxId: "TAX-78901"
  },
  {
    id: 2,
    name: "Global Finance Group",
    location: "New York, NY",
    phone: "+1 (555) 234-5678",
    websites: "globalfinance.com",
    industry: "Finance",
    currencyType: "USD",
    source: "Referral",
    description: "International financial services and investment banking",
    language: "English",
    country: "USA",
    city: "New York",
    zipCode: "10001",
    state: "New York",
    address: "456 Wall Street, New York, NY 10001",
    email: "contact@globalfinance.com",
    owner: "Sarah Johnson",
    rating: 4.5,
    tag: "Enterprise",
    status: "Active",
    employees: 850,
    departments: 8,
    projects: 32,
    revenue: 32000000,
    established: "2010",
    licenseNumber: "FIN-23456",
    taxId: "TAX-78902"
  },
  {
    id: 3,
    name: "MediCare Innovations",
    location: "Boston, MA",
    phone: "+1 (555) 345-6789",
    websites: "medicareinnovations.com",
    industry: "Healthcare",
    currencyType: "USD",
    source: "Direct",
    description: "Healthcare technology and medical device manufacturer",
    language: "English",
    country: "USA",
    city: "Boston",
    zipCode: "02108",
    state: "Massachusetts",
    email: "info@medicareinnovations.com",
    owner: "Dr. Michael Chen",
    rating: 4.7,
    tag: "Medical",
    status: "Active",
    employees: 620,
    departments: 6,
    projects: 24,
    revenue: 28000000,
    established: "2018",
    licenseNumber: "MED-34567",
    taxId: "TAX-78903"
  },
  {
    id: 4,
    name: "EcoManufacture Inc",
    location: "Toronto, ON",
    phone: "+1 (416) 555-7890",
    websites: "ecomanufacture.ca",
    industry: "Manufacturing",
    currencyType: "CAD",
    source: "Partner",
    description: "Sustainable manufacturing and eco-friendly products",
    language: "English, French",
    country: "Canada",
    city: "Toronto",
    zipCode: "M5H 2N2",
    state: "Ontario",
    email: "contact@ecomanufacture.ca",
    owner: "Robert Williams",
    rating: 4.3,
    tag: "Green Tech",
    status: "Active",
    employees: 420,
    departments: 5,
    projects: 18,
    revenue: 18500000,
    established: "2012",
    licenseNumber: "MAN-45678",
    taxId: "TAX-78904"
  },
  {
    id: 5,
    name: "RetailMax Corporation",
    location: "London, UK",
    phone: "+44 20 7123 4567",
    websites: "retailmax.co.uk",
    industry: "Retail",
    currencyType: "GBP",
    source: "Direct",
    description: "Omni-channel retail and e-commerce solutions",
    language: "English",
    country: "UK",
    city: "London",
    zipCode: "EC1A 1BB",
    state: "England",
    email: "sales@retailmax.co.uk",
    owner: "Emma Wilson",
    rating: 4.6,
    tag: "Retail",
    status: "Active",
    employees: 750,
    departments: 7,
    projects: 28,
    revenue: 31000000,
    established: "2016",
    licenseNumber: "RET-56789",
    taxId: "TAX-78905"
  },
  {
    id: 6,
    name: "EduTech Solutions",
    location: "Sydney, NSW",
    phone: "+61 2 8765 4321",
    websites: "edutechsolutions.au",
    industry: "Education",
    currencyType: "AUD",
    source: "Referral",
    description: "Educational technology and online learning platforms",
    language: "English",
    country: "Australia",
    city: "Sydney",
    zipCode: "2000",
    state: "NSW",
    email: "hello@edutechsolutions.au",
    owner: "David Brown",
    rating: 4.4,
    tag: "Education",
    status: "Pending",
    employees: 180,
    departments: 4,
    projects: 12,
    revenue: 8500000,
    established: "2020",
    licenseNumber: "EDU-67890",
    taxId: "TAX-78906"
  },
  {
    id: 7,
    name: "RealEstate Pro",
    location: "Dubai, UAE",
    phone: "+971 4 123 4567",
    websites: "realestatepro.ae",
    industry: "Real Estate",
    currencyType: "AED",
    source: "Direct",
    description: "Luxury real estate development and property management",
    language: "Arabic, English",
    country: "UAE",
    city: "Dubai",
    zipCode: "00000",
    state: "Dubai",
    email: "info@realestatepro.ae",
    owner: "Ahmed Al-Mansoori",
    rating: 4.2,
    tag: "Luxury",
    status: "Active",
    employees: 320,
    departments: 4,
    projects: 16,
    revenue: 22000000,
    established: "2014",
    licenseNumber: "RE-78901",
    taxId: "TAX-78907"
  },
  {
    id: 8,
    name: "LogiTrans Global",
    location: "Frankfurt, DE",
    phone: "+49 69 12345678",
    websites: "logitrans.de",
    industry: "Transportation",
    currencyType: "EUR",
    source: "Partner",
    description: "International logistics and transportation services",
    language: "German, English",
    country: "Germany",
    city: "Frankfurt",
    zipCode: "60311",
    state: "Hesse",
    email: "contact@logitrans.de",
    owner: "Klaus Schmidt",
    rating: 4.1,
    tag: "Logistics",
    status: "Inactive",
    employees: 280,
    departments: 3,
    projects: 10,
    revenue: 15000000,
    established: "2011",
    licenseNumber: "LOG-89012",
    taxId: "TAX-78908"
  },
  {
    id: 9,
    name: "EnergyPlus Corp",
    location: "Houston, TX",
    phone: "+1 (713) 555-9012",
    websites: "energyplus.com",
    industry: "Energy",
    currencyType: "USD",
    source: "Direct",
    description: "Renewable energy solutions and power generation",
    language: "English",
    country: "USA",
    city: "Houston",
    zipCode: "77002",
    state: "Texas",
    email: "support@energyplus.com",
    owner: "Mark Thompson",
    rating: 4.0,
    tag: "Renewable",
    status: "Active",
    employees: 190,
    departments: 3,
    projects: 8,
    revenue: 12000000,
    established: "2019",
    licenseNumber: "ENG-90123",
    taxId: "TAX-78909"
  },
  {
    id: 10,
    name: "TeleConnect Ltd",
    location: "Tokyo, Japan",
    phone: "+81 3 1234 5678",
    websites: "teleconnect.co.jp",
    industry: "Telecommunications",
    currencyType: "JPY",
    source: "Referral",
    description: "Telecommunication infrastructure and services",
    language: "Japanese, English",
    country: "Japan",
    city: "Tokyo",
    zipCode: "100-0001",
    state: "Tokyo",
    email: "info@teleconnect.co.jp",
    owner: "Yuki Tanaka",
    rating: 4.3,
    tag: "Telecom",
    status: "Pending",
    employees: 150,
    departments: 3,
    projects: 6,
    revenue: 9500000,
    established: "2021",
    licenseNumber: "TEL-01234",
    taxId: "TAX-78910"
  }
];

// Table head cells
const companyHeadCells = [
  { id: "name", label: "Company Name" },
  { id: "industry", label: "Industry" },
  { id: "location", label: "Location" },
  { id: "owner", label: "Owner" },
  { id: "email", label: "Email" },
  { id: "status", label: "Status" },
  { id: "rating", label: "Rating" },
  { id: "employees", label: "Employees" },
  { id: "revenue", label: "Revenue" },
  { id: "established", label: "Established" },
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
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('CompaniesTable Props:', { status, industry, country, dateRange });
    console.log('Total companies:', companiesData.length);
  }, [status, industry, country, dateRange]);

  const filteredData = companiesData.filter(company => {
    // Status filter
    if (status !== "all" && company.status !== status) return false;

    // Industry filter
    if (industry !== "all" && company.industry !== industry) return false;

    // Country filter - simple exact match
    if (country !== "all" && company.country !== country) return false;

    return true;
  });

  // Update debug info
  useEffect(() => {
    setDebugInfo(`Showing ${filteredData.length} of ${companiesData.length} companies. Filters: status=${status}, industry=${industry}, country=${country}`);
    console.log('Filtered data count:', filteredData.length);
    console.log('Filtered companies:', filteredData.map(c => c.name));
  }, [filteredData, status, industry, country]);

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
  } = useMaterialTableHook<ICompany>(filteredData, 10);

  const getIndustryClass = (industry?: string) => {
    if (!industry) return "default";

    const industryLower = industry.toLowerCase();
    switch (industryLower) {
      case "technology":
        return "primary";
      case "finance":
        return "success";
      case "healthcare":
      case "medical":
        return "info";
      case "manufacturing":
        return "warning";
      case "retail":
        return "error";
      case "education":
        return "secondary";
      case "real estate":
        return "default";
      case "transportation":
      case "logistics":
        return "info";
      case "energy":
        return "success";
      case "telecommunications":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusClass = (status?: string) => {
    if (!status) return "default";

    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const handleViewCompany = (company: ICompany) => {
    router.push(`/super-admin/companies/${company.id}`)
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return "N/A";

    // Map currency codes to proper format
    const currencyMap: Record<string, string> = {
      'USD': 'USD',
      'CAD': 'CAD',
      'GBP': 'GBP',
      'AUD': 'AUD',
      'EUR': 'EUR',
      'JPY': 'JPY',
      'AED': 'AED'
    };

    const currencyCode = currencyMap[currency || 'USD'] || 'USD';

    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      return formatter.format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `$${amount.toLocaleString()}`;
    }
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = companyHeadCells.map(cell => cell.label);
    
    const rows = filteredData.map(company => [
      company.name,
      company.industry,
      company.location,
      company.owner,
      company.email,
      company.status,
      company.rating?.toFixed(1) || 'N/A',
      company.employees?.toLocaleString() || 'N/A',
      formatCurrency(company.revenue, company.currencyType),
      company.established || 'N/A'
    ]);
    
    return {
      headers,
      rows,
      title: `Companies Export - ${filteredData.length} records`
    };
  }, [filteredData]);

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">

            {/* Top Controls Row */}
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
                    placeholder="Search companies..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
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
                            indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                            checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                            onChange={(e) => handleSelectAllClick(e.target.checked, filteredRows)}
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
                      {paginatedRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={companyHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <BusinessIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600">
                                No companies found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {filteredData.length === 0
                                  ? "Try adjusting your filters to see more results"
                                  : "Check your search query or try different keywords"}
                              </Typography>
                              {(status !== "all" || industry !== "all" || country !== "all") && (
                                <div className="mt-2">
                                  <button
                                    onClick={() => window.location.reload()}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                  >
                                    Clear All Filters
                                  </button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row, index) => {
                          const statusClass = getStatusClass(row.status);
                          const industryClass = getIndustryClass(row.industry);
                          const isRowSelected = selected.includes(index);

                          return (
                            <TableRow
                              key={row.id}
                              selected={isRowSelected}
                              onClick={() => handleClick(index)}
                              className={`hover:bg-blue-50 ${isRowSelected ? 'bg-blue-50' : ''}`}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="custom-checkbox checkbox-small"
                                  checked={isRowSelected}
                                  size="small"
                                  onChange={() => handleClick(index)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="mr-3 bg-primary">
                                    <BusinessIcon />
                                  </Avatar>
                                  <div>
                                    <Typography variant="body2" className="font-medium">
                                      {row.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      ID: #{row.id.toString().padStart(5, '0')}
                                    </Typography>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.industry || "N/A"}
                                  size="small"
                                  color={industryClass as any}
                                  variant="filled"
                                  className="font-medium"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <LocationOnIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <div>
                                    <Typography variant="body2">
                                      {row.location}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {row.country || "N/A"}
                                    </Typography>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <PersonIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                      {row.owner}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <EmailIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2" className="truncate max-w-[150px]">
                                    {row.email}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.status}
                                  size="small"
                                  color={statusClass as any}
                                  variant="filled"
                                  className="font-medium"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Rating
                                    value={row.rating}
                                    readOnly
                                    size="small"
                                    precision={0.1}
                                  />
                                  <Typography variant="body2" className="ml-2 font-semibold">
                                    {row.rating.toFixed(1)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-semibold">
                                  {row.employees?.toLocaleString() || "N/A"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-semibold text-green-600">
                                  {formatCurrency(row.revenue, row.currencyType)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-semibold">
                                  {row.established || "N/A"}
                                </Typography>
                              </TableCell>
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-2">
                                  <button
                                    type="button"
                                    className="table__icon view p-1.5 hover:bg-blue-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewCompany(row);
                                    }}
                                    title="View Company Details"
                                  >
                                    <VisibilityIcon fontSize="small" className="text-blue-600" />
                                  </button>
                                  <button
                                    type="button"
                                    className="table__icon edit p-1.5 hover:bg-green-100 rounded"
                                    onClick={()=>router.push(`/super-admin/companies/update-company/${row.id}`)}
                                  >
                                    <EditIcon fontSize="small" className="text-green-600" />
                                  </button>
                                  <button
                                    type="button"
                                    className="table__icon delete p-1.5 hover:bg-red-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteId(row.id);
                                      setModalDeleteOpen(true);
                                    }}
                                    title="Delete Company"
                                  >
                                    <i className="fa-regular fa-trash text-red-600"></i>
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
                  {(status !== "all" || industry !== "all" || country !== "all") && (
                    <Typography variant="caption" className="text-gray-600">
                      (Filtered: {status !== "all" ? `Status: ${status}` : ""}
                      {industry !== "all" ? ` • Industry: ${industry}` : ""}
                      {country !== "all" ? ` • Country: ${country}` : ""})
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

            {/* Bulk Actions Bar */}
            {selected.length > 0 && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
                <Typography variant="body2">
                  {selected.length} company{selected.length > 1 ? 'ies' : ''} selected
                </Typography>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
                    onClick={() => {
                      const selectedCompanies = selected.map(index => filteredRows[index]);
                      alert(`Exporting ${selected.length} companies...`);
                      console.log('Selected companies:', selectedCompanies);
                    }}
                  >
                    <i className="fa-regular fa-download mr-1"></i>
                    Export Selected
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selected.length} compan${selected.length > 1 ? 'ies' : 'y'}?`)) {
                        selected.forEach(index => {
                          const company = filteredRows[index];
                          if (company) handleDelete(company.id);
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
          </div>
        </div>
      </div>

      {detailsModalOpen && selectedCompany && (
        <CompanyDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
          companyData={selectedCompany}
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

export default CompaniesTable;