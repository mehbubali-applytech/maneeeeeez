"use client";
import React, { useState, useMemo, useEffect } from "react";
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
import { Checkbox, Avatar, Typography, Chip, Select, MenuItem, TextField, Grid } from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import FinanceExecutiveDetailsModal from "../FinanceExecutiveDetailsModal";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { IFinanceExecutive } from "../finance-executives.interface";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

// Mock data - Filtered by company
const allFinanceExecutivesData: IFinanceExecutive[] = [
  {
    id: 1,
    executiveName: "Michael Rodriguez",
    executiveCode: "FE-001",
    department: "Finance & Accounting",
    company: "TechNova Solutions",
    companyId: "1",
    email: "michael.rodriguez@technova.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    extension: "456",
    jobTitle: "Chief Financial Officer",
    role: "CFO",
    location: "New York, NY",
    status: "Active",
    hireDate: "2018-06-15",
    yearsOfExperience: 15,
    qualifications: ["MBA Finance", "CPA", "CFA Level III"],
    certifications: ["CPA", "CFA", "CMA"],
    specializations: ["Financial Strategy", "M&A", "Risk Management"],
    managedBudget: 50000000,
    reportingTo: "CEO",
    address: "456 Finance Ave, New York, NY 10001",
    city: "New York",
    state: "New York",
    country: "USA",
    zipCode: "10001",
    dateOfBirth: "1980-08-12",
    gender: "Male",
    maritalStatus: "Married",
    emergencyContact: "Maria Rodriguez",
    emergencyPhone: "+1 (555) 555-1212",
    profileImage: "",
    accuracyRating: 4.9,
    tag: "Executive",
    notes: "Excellent financial leadership"
  },
  {
    id: 2,
    executiveName: "Jennifer Lee",
    executiveCode: "FE-002",
    department: "Financial Planning & Analysis",
    company: "Global Finance Group",
    companyId: "2",
    email: "jennifer.lee@globalfinance.com",
    phone: "+1 (555) 234-5678",
    mobile: "+1 (555) 876-5432",
    jobTitle: "Finance Director",
    role: "Director",
    location: "San Francisco, CA",
    status: "Active",
    hireDate: "2020-03-10",
    yearsOfExperience: 12,
    qualifications: ["MS Finance", "MBA"],
    certifications: ["CPA", "FP&A"],
    specializations: ["Budgeting", "Forecasting", "Financial Modeling"],
    managedBudget: 25000000,
    reportingTo: "CFO",
    accuracyRating: 4.8,
    tag: "FP&A"
  },
  {
    id: 3,
    executiveName: "David Wilson",
    executiveCode: "FE-003",
    department: "Accounts Payable",
    company: "TechNova Solutions", // Same company
    companyId: "1",
    email: "david.wilson@technova.com",
    phone: "+1 (555) 345-6789",
    mobile: "+1 (555) 765-4321",
    jobTitle: "Accounts Payable Manager",
    role: "Manager",
    location: "Boston, MA",
    status: "Active",
    hireDate: "2019-11-22",
    yearsOfExperience: 8,
    qualifications: ["BBA Accounting", "Certified Bookkeeper"],
    specializations: ["Vendor Management", "Payment Processing", "Compliance"],
    managedBudget: 5000000,
    reportingTo: "Finance Director",
    accuracyRating: 4.7,
    tag: "AP"
  },
  {
    id: 4,
    executiveName: "Sarah Thompson",
    executiveCode: "FE-004",
    department: "Accounts Receivable",
    company: "TechNova Solutions", // Same company
    companyId: "1",
    email: "sarah.t@technova.com",
    phone: "+44 20 7123 4567",
    mobile: "+44 20 7123 4568",
    jobTitle: "AR Specialist",
    role: "Specialist",
    location: "London, UK",
    status: "Inactive",
    hireDate: "2021-09-15",
    yearsOfExperience: 6,
    qualifications: ["BA Accounting", "Credit Management Certification"],
    specializations: ["Collections", "Credit Control", "Customer Billing"],
    managedBudget: 3000000,
    reportingTo: "Finance Manager",
    accuracyRating: 4.6,
    tag: "AR"
  },
  {
    id: 5,
    executiveName: "Robert Chen",
    executiveCode: "FE-005",
    department: "Taxation",
    company: "Global Finance Group",
    companyId: "2",
    email: "robert.chen@globalfinance.com",
    phone: "+1 (555) 567-8901",
    mobile: "+1 (555) 678-9012",
    jobTitle: "Tax Manager",
    role: "Manager",
    location: "Chicago, IL",
    status: "Active",
    hireDate: "2022-01-05",
    yearsOfExperience: 10,
    qualifications: ["MS Taxation", "CPA"],
    certifications: ["EA", "CPA"],
    specializations: ["Corporate Tax", "International Tax", "Tax Planning"],
    managedBudget: 8000000,
    reportingTo: "Finance Director",
    accuracyRating: 4.9,
    tag: "Tax"
  },
  {
    id: 6,
    executiveName: "Lisa Garcia",
    executiveCode: "FE-006",
    department: "Internal Audit",
    company: "TechNova Solutions", // Same company
    companyId: "1",
    email: "lisa.garcia@technova.com",
    phone: "+1 (555) 678-9012",
    mobile: "+1 (555) 789-0123",
    jobTitle: "Internal Auditor",
    role: "Auditor",
    location: "Seattle, WA",
    status: "On Leave",
    hireDate: "2020-08-20",
    yearsOfExperience: 7,
    qualifications: ["MBA", "CIA"],
    certifications: ["CIA", "CISA"],
    specializations: ["Risk Assessment", "Compliance Auditing", "Process Improvement"],
    managedBudget: 2000000,
    reportingTo: "Audit Director",
    accuracyRating: 4.8,
    tag: "Audit"
  }
];

// Table head cells
const financeExecutiveHeadCells = [
  { id: "executiveName", label: "Finance Executive" },
  { id: "executiveCode", label: "Employee Code" },
  { id: "department", label: "Department" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "jobTitle", label: "Job Title" },
  { id: "role", label: "Role" },
  { id: "status", label: "Status" },
  { id: "managedBudget", label: "Managed Budget" },
  { id: "yearsOfExperience", label: "Experience" },
  { id: "hireDate", label: "Hire Date" },
  { id: "accuracyRating", label: "Accuracy" },
];

interface CompanyFinanceExecutivesTableProps {
  companyId: string;
  companyName?: string;
  status?: string;
  department?: string;
  role?: string;
  dateRange?: { start: string; end: string };
  onEdit?: (executive: IFinanceExecutive) => void;
  onDelete?: (id: number) => void;
}

const CompanyFinanceExecutivesTable: React.FC<CompanyFinanceExecutivesTableProps> = ({ 
  companyId,
  companyName = "Company",
  status = "all",
  department = "all",
  role = "all",
  dateRange = { start: "", end: "" },
  onEdit,
  onDelete
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedFinanceExecutive, setSelectedFinanceExecutive] = useState<IFinanceExecutive | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
  // State for table controls
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("executiveName");

  // Filter by company first, then apply other filters
  const filteredData = useMemo(() => {
    // First filter by company ID
    let result = allFinanceExecutivesData.filter(executive => 
      executive.companyId === companyId
    );
    
    console.log(`Filtering for company ID: ${companyId}, Found: ${result.length} executives`);
    
    // Then apply other filters
    if (status && status !== "all") {
      result = result.filter(executive => {
        const executiveStatus = executive.status?.toLowerCase() || '';
        const filterStatus = status.toLowerCase();
        return executiveStatus === filterStatus;
      });
    }
    
    if (department && department !== "all") {
      result = result.filter(executive => {
        const executiveDept = executive.department?.toLowerCase() || '';
        const filterDept = department.toLowerCase();
        return executiveDept === filterDept;
      });
    }
    
    if (role && role !== "all") {
      result = result.filter(executive => {
        const executiveRole = executive.role?.toLowerCase() || '';
        const filterRole = role.toLowerCase();
        return executiveRole === filterRole;
      });
    }
    
    // Filter by date range
    if (dateRange?.start && dateRange?.end) {
      try {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setDate(endDate.getDate() + 1);
        
        result = result.filter(executive => {
          if (!executive.hireDate) return false;
          try {
            const hireDate = new Date(executive.hireDate);
            return hireDate >= startDate && hireDate <= endDate;
          } catch (error) {
            return true;
          }
        });
      } catch (error) {
        console.log("Error parsing date range:", error);
      }
    }
    
    console.log(`After all filters: ${result.length} executives`);
    return result;
  }, [companyId, status, department, role, dateRange]);

  // Search filter
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredData;
    }
    
    const query = searchQuery.toLowerCase();
    return filteredData.filter(executive => {
      const searchFields = [
        executive.executiveName,
        executive.executiveCode,
        executive.email,
        executive.jobTitle,
        executive.department,
        executive.company,
        executive.phone,
        executive.location,
        executive.status,
        executive.role
      ].filter(Boolean).map(field => field?.toString().toLowerCase());
      
      return searchFields.some(field => field.includes(query));
    });
  }, [filteredData, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    if (searchedData.length === 0) return [];
    
    return [...searchedData].sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';
      
      switch (orderBy) {
        case "executiveName":
        case "executiveCode":
        case "department":
        case "email":
        case "phone":
        case "jobTitle":
        case "role":
        case "status":
        case "hireDate":
          aValue = (a[orderBy as keyof IFinanceExecutive] || '').toString().toLowerCase();
          bValue = (b[orderBy as keyof IFinanceExecutive] || '').toString().toLowerCase();
          break;
        case "managedBudget":
        case "yearsOfExperience":
        case "accuracyRating":
          aValue = Number(a[orderBy as keyof IFinanceExecutive] || 0);
          bValue = Number(b[orderBy as keyof IFinanceExecutive] || 0);
          break;
        default:
          aValue = '';
          bValue = '';
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
  }, [searchedData, order, orderBy]);

  // Paginate data
  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, rowsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [companyId, status, department, role, dateRange, searchQuery]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && sortedData.length > 0) {
      setSelected(sortedData.map(executive => executive.id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1)
      ];
    }

    setSelected(newSelected);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  const getStatusClass = (status: string = "Active") => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("active")) return "success";
    if (statusLower.includes("inactive")) return "error";
    if (statusLower.includes("leave")) return "warning";
    if (statusLower.includes("pending")) return "info";
    return "default";
  };

  const getDepartmentClass = (department: string = "") => {
    const deptLower = department.toLowerCase();
    if (deptLower.includes("finance") || deptLower.includes("accounting")) return "primary";
    if (deptLower.includes("planning") || deptLower.includes("analysis")) return "info";
    if (deptLower.includes("payable")) return "secondary";
    if (deptLower.includes("receivable")) return "success";
    if (deptLower.includes("taxation") || deptLower.includes("tax")) return "warning";
    if (deptLower.includes("audit")) return "error";
    return "default";
  };

  const getRoleClass = (role: string = "") => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("cfo")) return "primary";
    if (roleLower.includes("director")) return "info";
    if (roleLower.includes("manager")) return "secondary";
    if (roleLower.includes("specialist")) return "success";
    if (roleLower.includes("auditor")) return "warning";
    if (roleLower.includes("analyst")) return "error";
    return "default";
  };

  const handleViewFinanceExecutive = (executive: IFinanceExecutive) => {
    setSelectedFinanceExecutive(executive);
    setDetailsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (onDelete) {
      onDelete(id);
    }
    setModalDeleteOpen(false);
    setSelected(selected.filter(item => item !== id));
  };

  const formatDate = (dateString: string = "") => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getInitials = (name: string = "") => {
    if (!name.trim()) return "FE";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = financeExecutiveHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(executive => [
      executive.executiveName,
      executive.executiveCode,
      executive.department,
      executive.email,
      executive.phone,
      executive.jobTitle,
      executive.role,
      executive.status,
      formatCurrency(executive.managedBudget),
      `${executive.yearsOfExperience} yrs`,
      formatDate(executive.hireDate),
      (executive.accuracyRating || 0).toFixed(1)
    ]);
    
    return {
      headers,
      rows,
      title: `${companyName} Finance Executives Export - ${sortedData.length} records`
    };
  }, [sortedData, companyName]);

  // Check if we should show data or empty state
  const shouldShowEmptyState = paginatedRows.length === 0;

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          {/* Company Header */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BusinessIcon className="mr-2 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{companyName} Finance Team</h3>
                  <p className="text-gray-600 text-sm">
                    {sortedData.length} finance executive(s) found for this company
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Managed Budget</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(sortedData.reduce((sum, m) => sum + (m.managedBudget || 0), 0))}
                </div>
              </div>
            </div>
          </div>

          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">

            {/* Top Controls Row */}
            <Grid container spacing={2} alignItems="center" className="mb-4 p-4">
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
                    placeholder="Search finance executives..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `${companyName.replace(/\s+/g, '_')}_finance_executives_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `${companyName} Finance Executives Report - ${new Date().toLocaleDateString()}`
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Main Table */}
            <Box sx={{ width: "100%" }} className="table-responsive px-4">
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer className="table mb-[20px] hover multiple_tables w-full">
                  <Table aria-labelledby="tableTitle" className="whitespace-nowrap">
                    <TableHead>
                      <TableRow className="table__title bg-gray-50">
                        <TableCell padding="checkbox" className="!font-semibold">
                          <Checkbox
                            className="custom-checkbox checkbox-small"
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < sortedData.length}
                            checked={sortedData.length > 0 && selected.length === sortedData.length}
                            onChange={handleSelectAllClick}
                            size="small"
                          />
                        </TableCell>
                        {financeExecutiveHeadCells.map((headCell) => (
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
                      {shouldShowEmptyState ? (
                        <TableRow>
                          <TableCell colSpan={financeExecutiveHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <AccountBalanceIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                {filteredData.length === 0
                                  ? `No finance executives found for ${companyName}`
                                  : "No finance executives found with current filters"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" className="mb-4">
                                {searchQuery.trim() 
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : `Try adjusting your filters to see ${companyName}'s finance executives`}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row) => {
                          const isSelected = selected.includes(row.id);
                          const statusClass = getStatusClass(row.status);
                          const deptClass = getDepartmentClass(row.department);
                          const roleClass = getRoleClass(row.role);

                          return (
                            <TableRow
                              key={row.id}
                              hover
                              selected={isSelected}
                              onClick={() => handleClick(row.id)}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="custom-checkbox checkbox-small"
                                  checked={isSelected}
                                  onChange={() => handleClick(row.id)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="mr-3 bg-primary">
                                    {getInitials(row.executiveName)}
                                  </Avatar>
                                  <div>
                                    <Typography variant="body2" className="font-medium">
                                      {row.executiveName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {row.jobTitle}
                                    </Typography>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {row.executiveCode}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.department}
                                  size="small"
                                  color={deptClass as any}
                                  variant="filled"
                                  className="font-medium"
                                />
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
                                <div className="flex items-center">
                                  <PhoneIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {row.phone}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <WorkIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {row.jobTitle}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.role}
                                  size="small"
                                  color={roleClass as any}
                                  variant="filled"
                                  className="font-medium"
                                />
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
                                  <AttachMoneyIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2" className="font-semibold">
                                    {formatCurrency(row.managedBudget)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-semibold">
                                  {row.yearsOfExperience} yrs
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <CalendarTodayIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {formatDate(row.hireDate)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="relative w-16 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                    <div 
                                      className="absolute h-full bg-green-500"
                                      style={{ width: `${(row.accuracyRating / 5) * 100}%` }}
                                    />
                                  </div>
                                  <Typography variant="body2" className="font-semibold">
                                    {(row.accuracyRating || 0).toFixed(1)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-2">
                                  <button
                                    type="button"
                                    className="table__icon view p-1.5 hover:bg-blue-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewFinanceExecutive(row);
                                    }}
                                    title="View Finance Executive Details"
                                  >
                                    <VisibilityIcon fontSize="small" className="text-blue-600" />
                                  </button>
                                  <button
                                    type="button"
                                    className="table__icon edit p-1.5 hover:bg-green-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onEdit) {
                                        onEdit(row);
                                      }
                                    }}
                                    title="Edit Finance Executive"
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
                                    title="Delete Finance Executive"
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

            {/* Finance Executive Summary */}
            {sortedData.length > 0 && (
              <>
                <div className="card__wrapper mb-4 mx-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Finance Executives</div>
                        <div className="text-xl font-semibold">{sortedData.length}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Active</div>
                        <div className="text-xl font-semibold text-green-600">
                          {sortedData.filter(m => m.status === "Active").length}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Managed Budget</div>
                        <div className="text-xl font-semibold text-blue-600">
                          {formatCurrency(sortedData.reduce((sum, m) => sum + (m.managedBudget || 0), 0))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Avg. Accuracy</div>
                        <div className="text-xl font-semibold">
                          {(sortedData.reduce((sum, m) => sum + (m.accuracyRating || 0), 0) / sortedData.length).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Controls Row */}
                <Grid container spacing={2} alignItems="center" className="mt-4 px-4 pb-4">
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
                        )} of ${sortedData.length} entries for ${companyName}`}
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
              </>
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
                {selected.length} finance executive(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedExecutives = sortedData.filter(executive => selected.includes(executive.id));
                    console.log('Bulk action on finance executives:', selectedExecutives);
                  }}
                >
                  <i className="fa-solid fa-toggle-on mr-1"></i>
                  Toggle Status
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedExecutives = sortedData.filter(executive => selected.includes(executive.id));
                    console.log('Bulk export finance executives:', selectedExecutives);
                  }}
                >
                  <i className="fa-solid fa-download mr-1"></i>
                  Export Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} finance executive(s)?`)) {
                      selected.forEach(id => {
                        if (onDelete) {
                          onDelete(id);
                        }
                      });
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

      {detailsModalOpen && selectedFinanceExecutive && (
        <FinanceExecutiveDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
          financeExecutiveData={selectedFinanceExecutive}
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

export default CompanyFinanceExecutivesTable;