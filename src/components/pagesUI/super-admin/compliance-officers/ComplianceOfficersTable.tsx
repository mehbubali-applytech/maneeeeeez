"use client";
import React, { useMemo, useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Pagination,
  Checkbox,
  Avatar,
  Typography,
  Chip,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useRouter } from "next/navigation";

import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import DeleteModal from "@/components/common/DeleteModal";
import UpdateComplianceOfficerDetailsModal from "./UpdateComplianceOfficerDetailsModal";
import ComplianceOfficerDetailsModal from "./ComplianceOfficerDetailsModal";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import { IComplianceOfficer } from "./compliance-officers.interface";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

// Mock data - using the field names from your interface
const data: IComplianceOfficer[] = [
  {
    id: 1,
    officerName: "Michael Anderson",
    officerCode: "CO-001",
    department: "Legal & Compliance",
    company: "TechNova Solutions",
    email: "michael.anderson@technova.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    extension: "789",
    jobTitle: "Chief Compliance Officer",
    role: "CCO",
    location: "New York, NY",
    status: "Active",
    hireDate: "2019-05-15",
    yearsOfExperience: 14,
    qualifications: ["JD", "LLM in Corporate Law", "MBA"],
    certifications: ["CAMS", "CRCM", "CIPP"],
    specializations: ["AML", "Data Privacy", "Corporate Governance"],
    managedAudits: 125,
    reportingTo: "CEO",
    address: "789 Compliance Blvd, New York, NY 10001",
    city: "New York",
    state: "New York",
    country: "USA",
    zipCode: "10001",
    dateOfBirth: "1982-03-18",
    gender: "Male",
    maritalStatus: "Married",
    emergencyContact: "Sarah Anderson",
    emergencyPhone: "+1 (555) 555-1212",
    profileImage: "",
    complianceScore: 4.8,
    tag: "Executive",
    notes: "Expert in international compliance regulations"
  },
  {
    id: 2,
    officerName: "Jennifer Martinez",
    officerCode: "CO-002",
    department: "Risk & Compliance",
    company: "Global Finance Group",
    email: "jennifer.martinez@globalfinance.com",
    phone: "+1 (555) 234-5678",
    mobile: "+1 (555) 876-5432",
    jobTitle: "Compliance Director",
    role: "Director",
    location: "San Francisco, CA",
    status: "Active",
    hireDate: "2021-02-10",
    yearsOfExperience: 11,
    qualifications: ["JD", "MS in Risk Management"],
    certifications: ["CRCM", "CFE"],
    specializations: ["Financial Regulations", "Risk Assessment", "Compliance Training"],
    managedAudits: 89,
    reportingTo: "CCO",
    complianceScore: 4.7,
    tag: "Risk"
  },
  {
    id: 3,
    officerName: "David Kim",
    officerCode: "CO-003",
    department: "AML Compliance",
    company: "MediCare Innovations",
    email: "david.kim@medicareinnovations.com",
    phone: "+1 (555) 345-6789",
    mobile: "+1 (555) 765-4321",
    jobTitle: "AML Manager",
    role: "Manager",
    location: "Boston, MA",
    status: "Active",
    hireDate: "2020-08-22",
    yearsOfExperience: 9,
    qualifications: ["BA in Finance", "Certified AML Specialist"],
    specializations: ["Anti-Money Laundering", "KYC", "Transaction Monitoring"],
    managedAudits: 67,
    reportingTo: "Compliance Director",
    complianceScore: 4.6,
    tag: "AML"
  },
  {
    id: 4,
    officerName: "Sarah Johnson",
    officerCode: "CO-004",
    department: "Data Privacy",
    company: "RetailMax Corporation",
    email: "sarah.j@retailmax.co.uk",
    phone: "+44 20 7123 4567",
    mobile: "+44 20 7123 4568",
    jobTitle: "Privacy Officer",
    role: "Officer",
    location: "London, UK",
    status: "Inactive",
    hireDate: "2022-03-15",
    yearsOfExperience: 7,
    qualifications: ["LLB", "CIPP/E"],
    specializations: ["GDPR", "Data Protection", "Privacy Impact Assessments"],
    managedAudits: 42,
    reportingTo: "Compliance Manager",
    complianceScore: 4.9,
    tag: "Privacy"
  },
  {
    id: 5,
    officerName: "Robert Chen",
    officerCode: "CO-005",
    department: "Regulatory Affairs",
    company: "Alpha Industries",
    email: "robert.chen@alphaind.com",
    phone: "+1 (555) 567-8901",
    mobile: "+1 (555) 678-9012",
    jobTitle: "Regulatory Specialist",
    role: "Specialist",
    location: "Chicago, IL",
    status: "Active",
    hireDate: "2023-01-05",
    yearsOfExperience: 6,
    qualifications: ["JD", "Regulatory Affairs Certification"],
    specializations: ["FDA Regulations", "Industry Standards", "Compliance Reporting"],
    managedAudits: 35,
    reportingTo: "Regulatory Director",
    complianceScore: 4.5,
    tag: "Regulatory"
  },
  {
    id: 6,
    officerName: "Lisa Wang",
    officerCode: "CO-006",
    department: "Ethics & Compliance",
    company: "Beta Technologies",
    email: "lisa.wang@betatech.com",
    phone: "+1 (555) 678-9012",
    mobile: "+1 (555) 789-0123",
    jobTitle: "Ethics Officer",
    role: "Officer",
    location: "Seattle, WA",
    status: "On Leave",
    hireDate: "2021-11-20",
    yearsOfExperience: 8,
    qualifications: ["MBA", "Certified Ethics Professional"],
    specializations: ["Code of Conduct", "Ethics Training", "Whistleblower Programs"],
    managedAudits: 58,
    reportingTo: "Chief Ethics Officer",
    complianceScore: 4.8,
    tag: "Ethics"
  }
];

// Table head cells - using correct field names from IComplianceOfficer interface
const headCells = [
  { id: "officerName", label: "Compliance Officer" },
  { id: "officerCode", label: "Officer Code" },
  { id: "company", label: "Company" },
  { id: "department", label: "Department" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "role", label: "Role" },
  { id: "status", label: "Status" },
  { id: "complianceScore", label: "Score" },
];

interface ComplianceOfficersTableProps {
  status?: string;
  department?: string;
  company?: string;
  dateRange?: { start: string; end: string };
}

const ComplianceOfficersTable: React.FC<ComplianceOfficersTableProps> = ({ 
  status = "all",
  department = "all",
  company = "all",
  dateRange = { start: "", end: "" },
}) => {
  const router = useRouter();

  const [tableData, setTableData] = useState<IComplianceOfficer[]>(data);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editData, setEditData] = useState<IComplianceOfficer | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<IComplianceOfficer | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  // Apply filters
  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (status && status !== "all") {
      result = result.filter(officer => officer.status === status);
    }
    
    if (department && department !== "all") {
      result = result.filter(officer => officer.department === department);
    }
    
    if (company && company !== "all") {
      result = result.filter(officer => officer.company === company);
    }
    
    if (dateRange?.start && dateRange?.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      end.setDate(end.getDate() + 1);
      
      result = result.filter(officer => {
        const hireDate = new Date(officer.hireDate);
        return hireDate >= start && hireDate <= end;
      });
    }
    
    return result;
  }, [status, department, company, dateRange]);

  // Update table data when filters change
  useEffect(() => {
    setTableData(filteredData);
  }, [filteredData]);

  const memoData = useMemo(() => tableData, [tableData]);

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
    handleSelectAllClick,
  } = useMaterialTableHook<IComplianceOfficer>(memoData, 10);

  const handleUpdate = (updatedData: IComplianceOfficer) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === updatedData.id ? updatedData : item
      )
    );
  };

  const handleConfirmDelete = () => {
    if (deleteId !== undefined) {
      handleDelete(deleteId);
      setModalDeleteOpen(false);
    }
  };

  // FIX: Create a wrapper function that matches MUI Checkbox's onChange signature
  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    handleSelectAllClick(checked, filteredRows);
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
    if (deptLower.includes("legal") || deptLower.includes("compliance")) return "primary";
    if (deptLower.includes("risk")) return "warning";
    if (deptLower.includes("aml")) return "error";
    if (deptLower.includes("privacy")) return "info";
    if (deptLower.includes("regulatory")) return "secondary";
    if (deptLower.includes("ethics")) return "success";
    return "default";
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

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = headCells.map(cell => cell.label);
    
    const rows = filteredData.map(officer => [
      officer.officerName,
      officer.officerCode,
      officer.company,
      officer.department,
      officer.email,
      officer.phone,
      officer.role,
      officer.status,
      officer.complianceScore?.toFixed(1) || 'N/A',
      officer.jobTitle || '',
      formatDate(officer.hireDate),
      officer.location || '',
      officer.managedAudits?.toString() || '0',
      officer.yearsOfExperience?.toString() || '0'
    ]);
    
    return {
      headers: [...headers, 'Job Title', 'Hire Date', 'Location', 'Audits Managed', 'Years Exp'],
      rows,
      title: `Compliance Officers Export - ${filteredData.length} records`
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
                      fileName: `compliance_officers_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Compliance Officers Report - ${new Date().toLocaleDateString()}`
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
                        <TableCell padding="checkbox" className="!font-semibold">
                          <Checkbox
                            className="custom-checkbox checkbox-small"
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                            checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                            onChange={handleSelectAll}
                            size="small"
                          />
                        </TableCell>
                        {headCells.map((headCell) => (
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
                          <TableCell colSpan={headCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <GavelIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                No compliance officers found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {searchQuery.trim() 
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : "Try adjusting your filters to see more results"}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row, index) => {
                          const isSelected = selected.includes(index);
                          const statusClass = getStatusClass(row.status);
                          const deptClass = getDepartmentClass(row.department);

                          return (
                            <TableRow
                              key={row.id}
                              hover
                              selected={isSelected}
                              onClick={() => handleClick(index)}
                              className={`hover:bg-blue-50 ${isSelected ? 'bg-blue-50' : ''}`}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="custom-checkbox checkbox-small"
                                  checked={isSelected}
                                  onChange={() => handleClick(index)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="mr-3 bg-primary">
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
                                <div className="flex items-center">
                                  <BusinessIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {row.company}
                                  </Typography>
                                </div>
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
                                <Chip
                                  label={row.role}
                                  size="small"
                                  color="info"
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
                                  <SecurityIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <div className="relative w-16 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                    <div 
                                      className="absolute h-full bg-green-500"
                                      style={{ width: `${(row.complianceScore / 5) * 100}%` }}
                                    />
                                  </div>
                                  <Typography variant="body2" className="font-semibold">
                                    {(row.complianceScore || 0).toFixed(1)}
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
                                      setSelectedOfficer(row);
                                      setDetailsModalOpen(true);
                                    }}
                                    title="View Details"
                                  >
                                    <VisibilityIcon fontSize="small" className="text-blue-600" />
                                  </button>
                                  <button
                                    type="button"
                                    className="table__icon edit p-1.5 hover:bg-green-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditData(row);
                                      setEditModalOpen(true);
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

            {/* Summary Section */}
            {paginatedRows.length > 0 && (
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Compliance Officers</div>
                      <div className="text-xl font-semibold">{filteredRows.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active</div>
                      <div className="text-xl font-semibold text-green-600">
                        {filteredRows.filter(m => m.status === "Active").length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Audits Managed</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {filteredRows.reduce((sum, m) => sum + (m.managedAudits || 0), 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Avg. Compliance Score</div>
                      <div className="text-xl font-semibold">
                        {(filteredRows.reduce((sum, m) => sum + (m.complianceScore || 0), 0) / filteredRows.length).toFixed(1)}
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
                  {(searchQuery || status !== "all" || department !== "all" || company !== "all") && (
                    <Typography variant="caption" className="text-gray-600">
                      {searchQuery && `(Search: "${searchQuery}") `}
                      {status !== "all" && `• Status: ${status} `}
                      {department !== "all" && `• Department: ${department} `}
                      {company !== "all" && `• Company: ${company}`}
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
                  {selected.length} compliance officer{selected.length > 1 ? 's' : ''} selected
                </Typography>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
                    onClick={() => {
                      const selectedOfficers = selected.map(index => filteredRows[index]);
                      const exportData = {
                        headers: headCells.map(cell => cell.label),
                        rows: selectedOfficers.map(officer => [
                          officer.officerName,
                          officer.officerCode,
                          officer.company,
                          officer.department,
                          officer.email,
                          officer.phone,
                          officer.role,
                          officer.status,
                          officer.complianceScore?.toFixed(1) || 'N/A'
                        ]),
                        title: `Selected Compliance Officers - ${selected.length} records`
                      };
                      console.log('Exporting selected officers:', selectedOfficers);
                    }}
                  >
                    <i className="fa-regular fa-download mr-1"></i>
                    Export Selected
                  </button>
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
                    onClick={() => {
                      const selectedOfficers = paginatedRows.filter((_, index) => selected.includes(index));
                      console.log('Bulk toggle status on officers:', selectedOfficers);
                      alert(`Toggling status for ${selected.length} compliance officer${selected.length > 1 ? 's' : ''}...`);
                    }}
                  >
                    <i className="fa-solid fa-toggle-on mr-1"></i>
                    Toggle Status
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selected.length} compliance officer${selected.length > 1 ? 's' : ''}?`)) {
                        selected.forEach(index => {
                          const officer = filteredRows[index];
                          if (officer) handleDelete(officer.id);
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

      {/* Update Modal */}
      {editModalOpen && editData && (
        <UpdateComplianceOfficerDetailsModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          editData={editData}
          onUpdate={handleUpdate}
        />
      )}

      {/* Details Modal */}
      {detailsModalOpen && selectedOfficer && (
        <ComplianceOfficerDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
          complianceOfficerData={selectedOfficer}
        />
      )}

      {/* Delete Modal */}
      {modalDeleteOpen && (
        <DeleteModal
          open={modalDeleteOpen}
          setOpen={setModalDeleteOpen}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default ComplianceOfficersTable;