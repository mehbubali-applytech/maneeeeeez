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
import { 
  Checkbox, 
  Avatar, 
  Typography, 
  Chip,
  Grid,
  TextField,
  Select,
  MenuItem 
} from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import HrManagerDetailsModal from "../HrManagerDetailsModal";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import DownloadIcon from "@mui/icons-material/Download";
import { IHrManager } from "../hr-managers.interface";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

// Mock data - Filtered by company
const allHrManagersData: IHrManager[] = [
  {
    id: 1,
    hrName: "Sarah Johnson",
    hrCode: "HR-001",
    department: "Human Resources",
    company: "TechNova Solutions",
    companyId: "1",
    email: "sarah.johnson@technova.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    extension: "101",
    jobTitle: "HR Director",
    location: "New York, NY",
    status: "Active",
    hireDate: "2019-03-15",
    yearsOfExperience: 12,
    qualifications: ["MBA Human Resources", "SPHR"],
    certifications: ["SPHR", "SHRM-SCP"],
    specializations: ["Strategic HR", "Talent Management", "Organizational Development"],
    managedEmployees: 150,
    reportingTo: "CEO",
    address: "123 HR Ave, New York, NY 10001",
    city: "New York",
    state: "New York",
    country: "USA",
    zipCode: "10001",
    dateOfBirth: "1982-05-20",
    gender: "Female",
    maritalStatus: "Married",
    emergencyContact: "Michael Johnson",
    emergencyPhone: "+1 (555) 555-1212",
    profileImage: "",
    rating: 4.9,
    tag: "Executive",
    notes: "Excellent HR leadership"
  },
  {
    id: 2,
    hrName: "Robert Chen",
    hrCode: "HR-002",
    department: "Recruitment",
    company: "Global Finance Group",
    companyId: "2",
    email: "robert.chen@globalfinance.com",
    phone: "+1 (555) 234-5678",
    mobile: "+1 (555) 876-5432",
    jobTitle: "Recruitment Manager",
    location: "San Francisco, CA",
    status: "Active",
    hireDate: "2020-08-10",
    yearsOfExperience: 8,
    qualifications: ["MS in HR Management"],
    certifications: ["PHR", "Recruitment Specialist"],
    specializations: ["Technical Recruitment", "Campus Hiring", "Employer Branding"],
    managedEmployees: 80,
    reportingTo: "HR Director",
    rating: 4.7,
    tag: "Recruitment"
  },
  {
    id: 3,
    hrName: "Maria Garcia",
    hrCode: "HR-003",
    department: "Employee Relations",
    company: "TechNova Solutions",
    companyId: "1",
    email: "maria.garcia@technova.com",
    phone: "+1 (555) 345-6789",
    mobile: "+1 (555) 765-4321",
    jobTitle: "Employee Relations Manager",
    location: "Boston, MA",
    status: "Active",
    hireDate: "2021-02-22",
    yearsOfExperience: 6,
    qualifications: ["BA Psychology", "HR Certification"],
    specializations: ["Conflict Resolution", "Employee Engagement", "Policy Development"],
    managedEmployees: 120,
    reportingTo: "HR Director",
    rating: 4.8,
    tag: "ER"
  },
  {
    id: 4,
    hrName: "David Wilson",
    hrCode: "HR-004",
    department: "Training & Development",
    company: "TechNova Solutions",
    companyId: "1",
    email: "david.wilson@technova.com",
    phone: "+44 20 7123 4567",
    mobile: "+44 20 7123 4568",
    jobTitle: "Training Specialist",
    location: "London, UK",
    status: "Inactive",
    hireDate: "2021-09-15",
    yearsOfExperience: 5,
    qualifications: ["MA Education", "Training Certification"],
    specializations: ["Leadership Training", "Soft Skills", "Technical Training"],
    managedEmployees: 60,
    reportingTo: "Training Manager",
    rating: 4.6,
    tag: "Training"
  },
  {
    id: 5,
    hrName: "Lisa Thompson",
    hrCode: "HR-005",
    department: "Compensation & Benefits",
    company: "Global Finance Group",
    companyId: "2",
    email: "lisa.thompson@globalfinance.com",
    phone: "+1 (555) 567-8901",
    mobile: "+1 (555) 678-9012",
    jobTitle: "Compensation Analyst",
    location: "Chicago, IL",
    status: "Active",
    hireDate: "2022-01-05",
    yearsOfExperience: 7,
    qualifications: ["BS Finance", "Compensation Certification"],
    certifications: ["CCP", "GRP"],
    specializations: ["Salary Benchmarking", "Bonus Planning", "Benefits Administration"],
    managedEmployees: 90,
    reportingTo: "Compensation Manager",
    rating: 4.9,
    tag: "Compensation"
  },
  {
    id: 6,
    hrName: "James Miller",
    hrCode: "HR-006",
    department: "Human Resources",
    company: "TechNova Solutions",
    companyId: "1",
    email: "james.miller@technova.com",
    phone: "+1 (555) 678-9012",
    mobile: "+1 (555) 789-0123",
    jobTitle: "HR Generalist",
    location: "Seattle, WA",
    status: "On Leave",
    hireDate: "2020-08-20",
    yearsOfExperience: 4,
    qualifications: ["BA Business", "HR Generalist Certification"],
    certifications: ["PHR", "SHRM-CP"],
    specializations: ["HR Operations", "Onboarding", "Employee Queries"],
    managedEmployees: 75,
    reportingTo: "HR Manager",
    rating: 4.7,
    tag: "Generalist"
  }
];

// Table head cells
const hrManagerHeadCells = [
  { id: "hrName", label: "HR Manager" },
  { id: "hrCode", label: "Employee Code" },
  { id: "department", label: "Department" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "jobTitle", label: "Job Title" },
  { id: "location", label: "Location" },
  { id: "status", label: "Status" },
  { id: "managedEmployees", label: "Employees Managed" },
  { id: "yearsOfExperience", label: "Experience" },
  { id: "hireDate", label: "Hire Date" },
  { id: "rating", label: "Rating" },
];

interface CompanyHrManagersTableProps {
  companyId: string;
  companyName?: string;
  status?: string;
  department?: string;
  role?: string;
  dateRange?: { start: string; end: string };
  onEdit?: (manager: IHrManager) => void;
  onDelete?: (id: number) => void;
}

const CompanyHrManagersTable: React.FC<CompanyHrManagersTableProps> = ({ 
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
  const [selectedHrManager, setSelectedHrManager] = useState<IHrManager | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
  // State for table controls
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("hrName");

  // Filter by company first, then apply other filters
  const filteredData = useMemo(() => {
    // First filter by company ID
    let result = allHrManagersData.filter(manager => 
      manager.companyId === companyId
    );
    
    // Apply other filters
    if (status && status !== "all") {
      result = result.filter(manager => {
        const managerStatus = manager.status?.toLowerCase() || '';
        const filterStatus = status.toLowerCase();
        return managerStatus === filterStatus;
      });
    }
    
    if (department && department !== "all") {
      result = result.filter(manager => {
        const managerDept = manager.department?.toLowerCase() || '';
        const filterDept = department.toLowerCase();
        return managerDept === filterDept;
      });
    }
    
    if (role && role !== "all") {
      result = result.filter(manager => {
        const managerJobTitle = manager.jobTitle?.toLowerCase() || '';
        const filterRole = role.toLowerCase();
        return managerJobTitle.includes(filterRole);
      });
    }
    
    // Filter by date range
    if (dateRange?.start && dateRange?.end) {
      try {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setDate(endDate.getDate() + 1);
        
        result = result.filter(manager => {
          if (!manager.hireDate) return false;
          try {
            const hireDate = new Date(manager.hireDate);
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
    return filteredData.filter(manager => {
      const searchFields = [
        manager.hrName,
        manager.hrCode,
        manager.email,
        manager.jobTitle,
        manager.department,
        manager.company,
        manager.phone,
        manager.location,
        manager.status
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
        case "hrName":
        case "hrCode":
        case "department":
        case "email":
        case "phone":
        case "jobTitle":
        case "location":
        case "status":
        case "hireDate":
          aValue = (a[orderBy as keyof IHrManager] || '').toString().toLowerCase();
          bValue = (b[orderBy as keyof IHrManager] || '').toString().toLowerCase();
          break;
        case "managedEmployees":
        case "yearsOfExperience":
        case "rating":
          aValue = Number(a[orderBy as keyof IHrManager] || 0);
          bValue = Number(b[orderBy as keyof IHrManager] || 0);
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
      setSelected(sortedData.map(manager => manager.id));
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
    if (deptLower.includes("human resources") || deptLower.includes("hr")) return "primary";
    if (deptLower.includes("recruitment")) return "info";
    if (deptLower.includes("employee relations")) return "secondary";
    if (deptLower.includes("training")) return "success";
    if (deptLower.includes("compensation") || deptLower.includes("benefits")) return "warning";
    if (deptLower.includes("operations")) return "error";
    return "default";
  };

  const getRoleClass = (jobTitle: string = "") => {
    const titleLower = jobTitle.toLowerCase();
    if (titleLower.includes("director")) return "primary";
    if (titleLower.includes("manager")) return "info";
    if (titleLower.includes("generalist")) return "secondary";
    if (titleLower.includes("specialist")) return "success";
    if (titleLower.includes("analyst")) return "warning";
    if (titleLower.includes("coordinator")) return "error";
    return "default";
  };

  const handleViewHrManager = (manager: IHrManager) => {
    setSelectedHrManager(manager);
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
    if (!name.trim()) return "HR";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = hrManagerHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(manager => [
      manager.hrName,
      manager.hrCode,
      manager.department,
      manager.email,
      manager.phone,
      manager.jobTitle,
      manager.location,
      manager.status,
      formatNumber(manager.managedEmployees || 0),
      `${manager.yearsOfExperience} yrs`,
      formatDate(manager.hireDate),
      manager.rating?.toFixed(1) || 'N/A',
      manager.mobile || '',
      manager.reportingTo || 'N/A',
      manager.qualifications?.join(', ') || '',
      manager.certifications?.join(', ') || '',
      manager.specializations?.join(', ') || ''
    ]);
    
    return {
      headers: [...headers, 'Mobile', 'Reporting To', 'Qualifications', 'Certifications', 'Specializations'],
      rows,
      title: `${companyName} - HR Managers Export (${sortedData.length} records)`
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
                <GroupsIcon className="mr-2 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{companyName} HR Team</h3>
                  <p className="text-gray-600 text-sm">
                    {sortedData.length} HR manager(s) found for this company
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Employees Managed</div>
                <div className="text-xl font-bold text-indigo-600">
                  {formatNumber(sortedData.reduce((sum, m) => sum + (m.managedEmployees || 0), 0))}
                </div>
              </div>
            </div>
          </div>

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
                    placeholder={`Search ${companyName} HR managers...`}
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `${companyName.replace(/\s+/g, '_')}_hr_managers_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `${companyName} - HR Managers Report (${new Date().toLocaleDateString()})`
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
                            indeterminate={selected.length > 0 && selected.length < sortedData.length}
                            checked={sortedData.length > 0 && selected.length === sortedData.length}
                            onChange={handleSelectAllClick}
                            size="small"
                          />
                        </TableCell>
                        {hrManagerHeadCells.map((headCell) => (
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
                          <TableCell colSpan={hrManagerHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <GroupsIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                {filteredData.length === 0
                                  ? `No HR managers found for ${companyName}`
                                  : "No HR managers found with current filters"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" className="mb-4">
                                {searchQuery.trim() 
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : `Try adjusting your filters to see ${companyName}'s HR managers`}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row) => {
                          const isSelected = selected.includes(row.id);
                          const statusClass = getStatusClass(row.status);
                          const deptClass = getDepartmentClass(row.department);
                          const roleClass = getRoleClass(row.jobTitle);

                          return (
                            <TableRow
                              key={row.id}
                              hover
                              selected={isSelected}
                              onClick={() => handleClick(row.id)}
                              className={`hover:bg-blue-50 ${isSelected ? 'bg-blue-50' : ''}`}
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
                                  <Avatar className="mr-3 bg-indigo-500">
                                    {getInitials(row.hrName)}
                                  </Avatar>
                                  <div>
                                    <Typography variant="body2" className="font-medium">
                                      {row.hrName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {row.jobTitle}
                                    </Typography>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {row.hrCode}
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
                                  <GroupsIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2" className="font-semibold">
                                    {formatNumber(row.managedEmployees)}
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
                                  <StarIcon className="mr-1 text-yellow-500" fontSize="small" />
                                  <Typography variant="body2" className="font-semibold">
                                    {(row.rating || 0).toFixed(1)}
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
                                      handleViewHrManager(row);
                                    }}
                                    title="View HR Manager Details"
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
                                    title="Edit HR Manager"
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
                                    title="Delete HR Manager"
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

            {/* HR Manager Summary */}
            {sortedData.length > 0 && (
              <>
                <div className="card__wrapper mb-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total HR Managers</div>
                        <div className="text-xl font-semibold">{sortedData.length}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Active</div>
                        <div className="text-xl font-semibold text-green-600">
                          {sortedData.filter(m => m.status === "Active").length}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Employees Managed</div>
                        <div className="text-xl font-semibold text-indigo-600">
                          {formatNumber(sortedData.reduce((sum, m) => sum + (m.managedEmployees || 0), 0))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Avg. Rating</div>
                        <div className="text-xl font-semibold">
                          {(sortedData.reduce((sum, m) => sum + (m.rating || 0), 0) / sortedData.length).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                          sortedData.length
                        )} of ${sortedData.length} entries for ${companyName}`}
                      </Typography>
                      {(searchQuery || status !== "all" || department !== "all" || role !== "all") && (
                        <Typography variant="caption" className="text-gray-600">
                          {searchQuery && `(Search: "${searchQuery}") `}
                          {status !== "all" && `• Status: ${status} `}
                          {department !== "all" && `• Department: ${department} `}
                          {role !== "all" && `• Role: ${role}`}
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
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2">
            {selected.length} HR manager{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-indigo-600 rounded text-sm font-medium hover:bg-indigo-50"
              onClick={() => {
                const selectedManagers = selected.map(id => sortedData.find(manager => manager.id === id)).filter(Boolean);
                const exportData = {
                  headers: hrManagerHeadCells.map(cell => cell.label),
                  rows: selectedManagers.map(manager => [
                    manager!.hrName,
                    manager!.hrCode,
                    manager!.department,
                    manager!.email,
                    manager!.phone,
                    manager!.jobTitle,
                    manager!.location,
                    manager!.status,
                    formatNumber(manager!.managedEmployees || 0),
                    `${manager!.yearsOfExperience} yrs`,
                    formatDate(manager!.hireDate),
                    manager!.rating?.toFixed(1) || 'N/A'
                  ]),
                  title: `${companyName} - Selected HR Managers (${selected.length} records)`
                };
                console.log('Exporting selected HR managers:', selectedManagers);
              }}
            >
              <i className="fa-regular fa-download mr-1"></i>
              Export Selected
            </button>
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
              onClick={() => {
                const selectedManagers = paginatedRows.filter((manager) => selected.includes(manager.id));
                console.log('Bulk toggle status on HR managers:', selectedManagers);
                alert(`Toggling status for ${selected.length} HR manager${selected.length > 1 ? 's' : ''}...`);
              }}
            >
              <i className="fa-solid fa-toggle-on mr-1"></i>
              Toggle Status
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selected.length} HR manager${selected.length > 1 ? 's' : ''}?`)) {
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
            <button
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
              onClick={() => setSelected([])}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {detailsModalOpen && selectedHrManager && (
        <HrManagerDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
          hrManagerData={selectedHrManager}
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

export default CompanyHrManagersTable;