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
import { Checkbox, Avatar, Typography, Chip, LinearProgress, Grid, TextField, Select, MenuItem } from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import ComplianceOfficerDetailsModal from "../ComplianceOfficerDetailsModal";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import GavelIcon from "@mui/icons-material/Gavel";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { IComplianceOfficer } from "../compliance-officers.interface";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

// Mock data - Filtered by company
const allComplianceOfficersData: IComplianceOfficer[] = [
  {
    id: 1,
    officerName: "Michael Rodriguez",
    officerCode: "CO-001",
    department: "Compliance & Risk",
    company: "TechNova Solutions",
    companyId: "1",
    email: "michael.rodriguez@technova.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    extension: "201",
    jobTitle: "Chief Compliance Officer",
    role: "Chief Compliance Officer",
    location: "New York, NY",
    status: "Active",
    hireDate: "2018-06-10",
    yearsOfExperience: 15,
    qualifications: ["JD Law", "MBA Risk Management"],
    certifications: ["CCEP", "CRCM", "CAMS"],
    specializations: ["Regulatory Compliance", "Risk Assessment", "Anti-Money Laundering"],
    managedAudits: 45,
    reportingTo: "CEO",
    address: "456 Compliance St, New York, NY 10001",
    city: "New York",
    state: "New York",
    country: "USA",
    zipCode: "10001",
    dateOfBirth: "1978-09-15",
    gender: "Male",
    maritalStatus: "Married",
    emergencyContact: "Sarah Rodriguez",
    emergencyPhone: "+1 (555) 555-1212",
    profileImage: "",
    complianceScore: 98,
    tag: "Executive",
    notes: "Excellent compliance track record"
  },
  {
    id: 2,
    officerName: "Jennifer Chen",
    officerCode: "CO-002",
    department: "Legal & Regulatory",
    company: "Global Finance Group",
    companyId: "2",
    email: "jennifer.chen@globalfinance.com",
    phone: "+1 (555) 234-5678",
    mobile: "+1 (555) 876-5432",
    jobTitle: "Compliance Manager",
    role: "Compliance Manager",
    location: "San Francisco, CA",
    status: "Active",
    hireDate: "2020-03-22",
    yearsOfExperience: 9,
    qualifications: ["LLM Corporate Law", "MS Compliance"],
    certifications: ["CRCP", "Series 24"],
    specializations: ["SEC Regulations", "FINRA Compliance", "Investment Advisory"],
    managedAudits: 32,
    reportingTo: "Chief Compliance Officer",
    complianceScore: 95,
    tag: "Financial"
  },
  {
    id: 3,
    officerName: "David Kim",
    officerCode: "CO-003",
    department: "Internal Audit",
    company: "TechNova Solutions",
    companyId: "1",
    email: "david.kim@technova.com",
    phone: "+1 (555) 345-6789",
    mobile: "+1 (555) 765-4321",
    jobTitle: "Senior Internal Auditor",
    role: "Internal Auditor",
    location: "Boston, MA",
    status: "Active",
    hireDate: "2021-01-15",
    yearsOfExperience: 7,
    qualifications: ["CPA", "CIA"],
    certifications: ["CISA", "CFE"],
    specializations: ["IT Audits", "SOX Compliance", "Financial Controls"],
    managedAudits: 28,
    reportingTo: "Audit Director",
    complianceScore: 92,
    tag: "Audit"
  },
  {
    id: 4,
    officerName: "Sarah Williams",
    officerCode: "CO-004",
    department: "Quality Assurance",
    company: "TechNova Solutions",
    companyId: "1",
    email: "sarah.williams@technova.com",
    phone: "+44 20 7123 4567",
    mobile: "+44 20 7123 4568",
    jobTitle: "Quality Assurance Specialist",
    role: "Quality Assurance",
    location: "London, UK",
    status: "Inactive",
    hireDate: "2021-11-05",
    yearsOfExperience: 6,
    qualifications: ["MS Quality Management", "Six Sigma Black Belt"],
    certifications: ["CQA", "CSQE"],
    specializations: ["Process Improvement", "ISO Standards", "Quality Control"],
    managedAudits: 24,
    reportingTo: "QA Manager",
    complianceScore: 90,
    tag: "QA"
  },
  {
    id: 5,
    officerName: "Robert Johnson",
    officerCode: "CO-005",
    department: "Financial Compliance",
    company: "Global Finance Group",
    companyId: "2",
    email: "robert.johnson@globalfinance.com",
    phone: "+1 (555) 567-8901",
    mobile: "+1 (555) 678-9012",
    jobTitle: "Compliance Analyst",
    role: "Compliance Analyst",
    location: "Chicago, IL",
    status: "Active",
    hireDate: "2022-02-18",
    yearsOfExperience: 5,
    qualifications: ["BS Finance", "MS Regulatory Affairs"],
    certifications: ["Series 7", "Series 63"],
    specializations: ["Banking Regulations", "Anti-Fraud", "Compliance Monitoring"],
    managedAudits: 38,
    reportingTo: "Compliance Manager",
    complianceScore: 97,
    tag: "Analyst"
  },
  {
    id: 6,
    officerName: "Lisa Martinez",
    officerCode: "CO-006",
    department: "Corporate Governance",
    company: "TechNova Solutions",
    companyId: "1",
    email: "lisa.martinez@technova.com",
    phone: "+1 (555) 678-9012",
    mobile: "+1 (555) 789-0123",
    jobTitle: "Governance Officer",
    role: "Corporate Governance",
    location: "Seattle, WA",
    status: "On Leave",
    hireDate: "2020-09-30",
    yearsOfExperience: 8,
    qualifications: ["JD", "MBA Corporate Governance"],
    certifications: ["CGAP", "CCSA"],
    specializations: ["Board Governance", "Policy Development", "Ethics Compliance"],
    managedAudits: 31,
    reportingTo: "Corporate Secretary",
    complianceScore: 94,
    tag: "Governance"
  }
];

// Table head cells
const complianceOfficerHeadCells = [
  { id: "officerName", label: "Compliance Officer" },
  { id: "officerCode", label: "Officer Code" },
  { id: "department", label: "Department" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "jobTitle", label: "Job Title" },
  { id: "location", label: "Location" },
  { id: "status", label: "Status" },
  { id: "managedAudits", label: "Audits Managed" },
  { id: "yearsOfExperience", label: "Experience" },
  { id: "complianceScore", label: "Compliance Score" },
  { id: "hireDate", label: "Hire Date" },
];

interface CompanyComplianceOfficersTableProps {
  companyId: string;
  companyName?: string;
  status?: string;
  department?: string;
  role?: string;
  dateRange?: { start: string; end: string };
  onEdit?: (officer: IComplianceOfficer) => void;
  onDelete?: (id: number) => void;
}

const CompanyComplianceOfficersTable: React.FC<CompanyComplianceOfficersTableProps> = ({ 
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
  const [selectedComplianceOfficer, setSelectedComplianceOfficer] = useState<IComplianceOfficer | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
  // State for table controls
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("officerName");

  // Filter by company first, then apply other filters
  const filteredData = useMemo(() => {
    // First filter by company ID
    let result = allComplianceOfficersData.filter(officer => 
      officer.companyId === companyId
    );
    
    // Apply other filters
    if (status && status !== "all") {
      result = result.filter(officer => {
        const officerStatus = officer.status?.toLowerCase() || '';
        const filterStatus = status.toLowerCase();
        return officerStatus === filterStatus;
      });
    }
    
    if (department && department !== "all") {
      result = result.filter(officer => {
        const officerDept = officer.department?.toLowerCase() || '';
        const filterDept = department.toLowerCase();
        return officerDept === filterDept;
      });
    }
    
    if (role && role !== "all") {
      result = result.filter(officer => {
        const officerRole = officer.role?.toLowerCase() || '';
        const filterRole = role.toLowerCase();
        return officerRole.includes(filterRole);
      });
    }
    
    // Filter by date range
    if (dateRange?.start && dateRange?.end) {
      try {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setDate(endDate.getDate() + 1);
        
        result = result.filter(officer => {
          if (!officer.hireDate) return false;
          try {
            const hireDate = new Date(officer.hireDate);
            return hireDate >= startDate && hireDate <= endDate;
          } catch (error) {
            return true;
          }
        });
      } catch (error) {
        console.log("Error parsing date range:", error);
      }
    }
    
    return result;
  }, [companyId, status, department, role, dateRange]);

  // Search filter
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredData;
    }
    
    const query = searchQuery.toLowerCase();
    return filteredData.filter(officer => {
      const searchFields = [
        officer.officerName,
        officer.officerCode,
        officer.email,
        officer.jobTitle,
        officer.department,
        officer.company,
        officer.phone,
        officer.location,
        officer.status
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
        case "officerName":
        case "officerCode":
        case "department":
        case "email":
        case "phone":
        case "jobTitle":
        case "location":
        case "status":
        case "hireDate":
          aValue = (a[orderBy as keyof IComplianceOfficer] || '').toString().toLowerCase();
          bValue = (b[orderBy as keyof IComplianceOfficer] || '').toString().toLowerCase();
          break;
        case "managedAudits":
        case "yearsOfExperience":
        case "complianceScore":
          aValue = Number(a[orderBy as keyof IComplianceOfficer] || 0);
          bValue = Number(b[orderBy as keyof IComplianceOfficer] || 0);
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
      setSelected(sortedData.map(officer => officer.id));
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
    if (deptLower.includes("compliance") || deptLower.includes("risk")) return "primary";
    if (deptLower.includes("legal") || deptLower.includes("regulatory")) return "info";
    if (deptLower.includes("audit")) return "secondary";
    if (deptLower.includes("quality")) return "success";
    if (deptLower.includes("governance")) return "warning";
    if (deptLower.includes("ethics")) return "error";
    if (deptLower.includes("financial")) return "primary";
    if (deptLower.includes("data")) return "info";
    return "default";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 80) return "info";
    if (score >= 70) return "warning";
    return "error";
  };

  const handleViewComplianceOfficer = (officer: IComplianceOfficer) => {
    setSelectedComplianceOfficer(officer);
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

  const formatNumber = (num: number = 0) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getInitials = (name: string = "") => {
    if (!name.trim()) return "CO";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = complianceOfficerHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(officer => [
      officer.officerName,
      officer.officerCode,
      officer.department,
      officer.email,
      officer.phone,
      officer.jobTitle,
      officer.location,
      officer.status,
      formatNumber(officer.managedAudits),
      `${officer.yearsOfExperience} yrs`,
      `${officer.complianceScore}%`,
      formatDate(officer.hireDate)
    ]);
    
    return {
      headers,
      rows,
      title: `${companyName} Compliance Officers Export - ${sortedData.length} records`
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
                <GavelIcon className="mr-2 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{companyName} Compliance Team</h3>
                  <p className="text-gray-600 text-sm">
                    {sortedData.length} compliance officer(s) found for this company
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Audits Managed</div>
                <div className="text-xl font-bold text-purple-600">
                  {formatNumber(sortedData.reduce((sum, m) => sum + (m.managedAudits || 0), 0))}
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
                    placeholder="Search compliance officers..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `${companyName.replace(/\s+/g, '_')}_compliance_officers_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `${companyName} Compliance Officers Report - ${new Date().toLocaleDateString()}`
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
                        {complianceOfficerHeadCells.map((headCell) => (
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
                          <TableCell colSpan={complianceOfficerHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <GavelIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                {filteredData.length === 0
                                  ? `No compliance officers found for ${companyName}`
                                  : "No compliance officers found with current filters"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" className="mb-4">
                                {searchQuery.trim() 
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : `Try adjusting your filters to see ${companyName}'s compliance officers`}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row) => {
                          const isSelected = selected.includes(row.id);
                          const statusClass = getStatusClass(row.status);
                          const deptClass = getDepartmentClass(row.department);
                          const scoreColor = getScoreColor(row.complianceScore);

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
                                  <Avatar className="mr-3 bg-purple-500">
                                    {getInitials(row.officerName)}
                                  </Avatar>
                                  <div>
                                    <Typography variant="body2" className="font-medium">
                                      {row.officerName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {row.jobTitle}
                                    </Typography>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {row.officerCode}
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
                                <Typography variant="body2">
                                  {row.location}
                                </Typography>
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
                                  <AssessmentIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2" className="font-semibold">
                                    {formatNumber(row.managedAudits)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-semibold">
                                  {row.yearsOfExperience} yrs
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center justify-between">
                                    <Typography variant="body2" className="font-semibold">
                                      {row.complianceScore}%
                                    </Typography>
                                    <TrendingUpIcon className="text-green-500" fontSize="small" />
                                  </div>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={row.complianceScore} 
                                    color={scoreColor as any}
                                    className="h-2 rounded"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <CalendarTodayIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {formatDate(row.hireDate)}
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
                                      handleViewComplianceOfficer(row);
                                    }}
                                    title="View Compliance Officer Details"
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
                                    title="Edit Compliance Officer"
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
                                    title="Delete Compliance Officer"
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

            {/* Compliance Officer Summary */}
            {sortedData.length > 0 && (
              <>
                <div className="card__wrapper mb-4 mx-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Officers</div>
                        <div className="text-xl font-semibold">{sortedData.length}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Active</div>
                        <div className="text-xl font-semibold text-green-600">
                          {sortedData.filter(m => m.status === "Active").length}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Audits Managed</div>
                        <div className="text-xl font-semibold text-purple-600">
                          {formatNumber(sortedData.reduce((sum, m) => sum + (m.managedAudits || 0), 0))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Avg. Compliance Score</div>
                        <div className="text-xl font-semibold">
                          {(sortedData.reduce((sum, m) => sum + (m.complianceScore || 0), 0) / sortedData.length).toFixed(0)}%
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
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-purple-700 font-medium">
                {selected.length} compliance officer(s) selected
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedOfficers = sortedData.filter(officer => selected.includes(officer.id));
                    console.log('Bulk action on compliance officers:', selectedOfficers);
                  }}
                >
                  <i className="fa-solid fa-toggle-on mr-1"></i>
                  Toggle Status
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-1 text-sm"
                  onClick={() => {
                    const selectedOfficers = sortedData.filter(officer => selected.includes(officer.id));
                    console.log('Bulk export compliance officers:', selectedOfficers);
                  }}
                >
                  <i className="fa-solid fa-download mr-1"></i>
                  Export Selected
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 text-sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selected.length} compliance officer(s)?`)) {
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

      {detailsModalOpen && selectedComplianceOfficer && (
        <ComplianceOfficerDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
          complianceOfficerData={selectedComplianceOfficer}
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

export default CompanyComplianceOfficersTable;