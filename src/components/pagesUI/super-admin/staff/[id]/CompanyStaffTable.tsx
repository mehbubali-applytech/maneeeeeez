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
import StaffDetailsModal from "../StaffDetailsModal";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import GroupsIcon from "@mui/icons-material/Groups";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DownloadIcon from "@mui/icons-material/Download";
import { IStaff } from "../staff.interface";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

// Mock data - Filtered by company
const allStaffData: IStaff[] = [
  {
    id: 1,
    employeeId: "EMP-001",
    firstName: "John",
    lastName: "Smith",
    fullName: "John Smith",
    email: "john.smith@technova.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    position: "Senior Software Engineer",
    department: "Engineering",
    company: "TechNova Solutions",
    companyId: 1,
    location: "San Francisco, CA",
    joinDate: "2020-03-15",
    status: "Active",
    employmentType: "Full-time",
    salary: 125000,
    currency: "USD",
    supervisor: "Sarah Johnson",
    gender: "Male",
    dateOfBirth: "1990-05-20",
    address: "123 Tech Street, San Francisco, CA",
    city: "San Francisco",
    country: "USA",
    zipCode: "94105",
    emergencyContact: "Jane Smith",
    skills: ["JavaScript", "React", "Node.js", "AWS"],
    education: "MS Computer Science",
    experience: 8,
    performanceRating: 4.8,
    attendanceRate: 98,
    projectsCompleted: 12,
    lastLogin: "2024-01-15",
    notes: "Top performer"
  },
  {
    id: 2,
    employeeId: "EMP-002",
    firstName: "Emily",
    lastName: "Chen",
    fullName: "Emily Chen",
    email: "emily.chen@globalfinance.com",
    phone: "+1 (555) 234-5678",
    position: "Financial Analyst",
    department: "Finance",
    company: "Global Finance Group",
    companyId: 2,
    location: "New York, NY",
    joinDate: "2021-08-10",
    status: "Active",
    employmentType: "Full-time",
    salary: 85000,
    currency: "USD",
    supervisor: "Robert Wilson",
    gender: "Female",
    dateOfBirth: "1992-11-15",
    skills: ["Excel", "Financial Modeling", "SQL", "Tableau"],
    education: "MBA Finance",
    experience: 5,
    performanceRating: 4.6,
    attendanceRate: 96,
    projectsCompleted: 8
  },
  {
    id: 3,
    employeeId: "EMP-003",
    firstName: "Michael",
    lastName: "Rodriguez",
    fullName: "Michael Rodriguez",
    email: "michael.rodriguez@technova.com",
    phone: "+1 (555) 345-6789",
    position: "DevOps Engineer",
    department: "Engineering",
    company: "TechNova Solutions",
    companyId: 1,
    location: "Remote",
    joinDate: "2022-01-22",
    status: "Active",
    employmentType: "Contract",
    salary: 110000,
    currency: "USD",
    supervisor: "John Smith",
    gender: "Male",
    dateOfBirth: "1988-07-30",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    education: "BS Computer Engineering",
    experience: 6,
    performanceRating: 4.7,
    attendanceRate: 95,
    projectsCompleted: 6
  },
  {
    id: 4,
    employeeId: "EMP-004",
    firstName: "Sarah",
    lastName: "Williams",
    fullName: "Sarah Williams",
    email: "sarah.williams@technova.com",
    phone: "+1 (555) 456-7890",
    position: "Marketing Manager",
    department: "Marketing",
    company: "TechNova Solutions",
    companyId: 1,
    location: "Boston, MA",
    joinDate: "2019-11-15",
    status: "On Leave",
    employmentType: "Full-time",
    salary: 95000,
    currency: "USD",
    supervisor: "David Brown",
    gender: "Female",
    dateOfBirth: "1985-03-12",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    education: "BA Marketing",
    experience: 10,
    performanceRating: 4.9,
    attendanceRate: 97,
    projectsCompleted: 15
  },
  {
    id: 5,
    employeeId: "EMP-005",
    firstName: "David",
    lastName: "Kim",
    fullName: "David Kim",
    email: "david.kim@globalfinance.com",
    phone: "+1 (555) 567-8901",
    position: "Sales Executive",
    department: "Sales",
    company: "Global Finance Group",
    companyId: 2,
    location: "Chicago, IL",
    joinDate: "2020-06-05",
    status: "Active",
    employmentType: "Full-time",
    salary: 75000,
    currency: "USD",
    supervisor: "Lisa Thompson",
    gender: "Male",
    dateOfBirth: "1991-09-22",
    skills: ["Sales", "CRM", "Negotiation", "Client Relations"],
    education: "BS Business",
    experience: 4,
    performanceRating: 4.5,
    attendanceRate: 99,
    projectsCompleted: 20
  },
  {
    id: 6,
    employeeId: "EMP-006",
    firstName: "Jennifer",
    lastName: "Miller",
    fullName: "Jennifer Miller",
    email: "jennifer.miller@technova.com",
    phone: "+1 (555) 678-9012",
    position: "UX Designer",
    department: "Product",
    company: "TechNova Solutions",
    companyId: 1,
    location: "Seattle, WA",
    joinDate: "2021-09-20",
    status: "Active",
    employmentType: "Full-time",
    salary: 105000,
    currency: "USD",
    supervisor: "Mark Davis",
    gender: "Female",
    dateOfBirth: "1993-02-18",
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
    education: "MS Human-Computer Interaction",
    experience: 4,
    performanceRating: 4.8,
    attendanceRate: 98,
    projectsCompleted: 9
  },
  {
    id: 7,
    employeeId: "EMP-007",
    firstName: "Robert",
    lastName: "Taylor",
    fullName: "Robert Taylor",
    email: "robert.taylor@technova.com",
    phone: "+1 (555) 789-0123",
    position: "QA Engineer",
    department: "Engineering",
    company: "TechNova Solutions",
    companyId: 1,
    location: "Austin, TX",
    joinDate: "2022-03-10",
    status: "Active",
    employmentType: "Part-time",
    salary: 60000,
    currency: "USD",
    supervisor: "John Smith",
    gender: "Male",
    dateOfBirth: "1994-08-05",
    skills: ["Testing", "Automation", "Selenium", "Jest"],
    education: "BS Software Engineering",
    experience: 3,
    performanceRating: 4.4,
    attendanceRate: 94,
    projectsCompleted: 5
  },
  {
    id: 8,
    employeeId: "EMP-008",
    firstName: "Lisa",
    lastName: "Anderson",
    fullName: "Lisa Anderson",
    email: "lisa.anderson@technova.com",
    phone: "+1 (555) 890-1234",
    position: "HR Coordinator",
    department: "Human Resources",
    company: "TechNova Solutions",
    companyId: 1,
    location: "Remote",
    joinDate: "2020-12-01",
    status: "Inactive",
    employmentType: "Full-time",
    salary: 65000,
    currency: "USD",
    supervisor: "Maria Garcia",
    gender: "Female",
    dateOfBirth: "1990-11-30",
    skills: ["Recruitment", "Onboarding", "HRIS", "Employee Relations"],
    education: "BA Human Resources",
    experience: 5,
    performanceRating: 4.3,
    attendanceRate: 90,
    projectsCompleted: 8
  }
];

// Table head cells
const staffHeadCells = [
  { id: "fullName", label: "Employee" },
  { id: "employeeId", label: "Employee ID" },
  { id: "department", label: "Department" },
  { id: "position", label: "Position" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "location", label: "Location" },
  { id: "status", label: "Status" },
  { id: "employmentType", label: "Type" },
  { id: "salary", label: "Salary" },
  { id: "joinDate", label: "Join Date" },
  { id: "experience", label: "Experience" },
  { id: "performanceRating", label: "Rating" },
];

interface CompanyStaffTableProps {
  companyId: string;
  companyName?: string;
  status?: string;
  department?: string;
  position?: string;
  employmentType?: string;
  dateRange?: { start: string; end: string };
  onEdit?: (staff: IStaff) => void;
  onDelete?: (id: number) => void;
}

const CompanyStaffTable: React.FC<CompanyStaffTableProps> = ({ 
  companyId,
  companyName = "Company",
  status = "all",
  department = "all",
  position = "all",
  employmentType = "all",
  dateRange = { start: "", end: "" },
  onEdit,
  onDelete
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
  // State for table controls
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("fullName");

  // Filter by company first, then apply other filters
  const filteredData = useMemo(() => {
    // First filter by company ID
    let result = allStaffData.filter(staff => 
      staff.companyId.toString() === companyId
    );
    
    // Apply other filters
    if (status && status !== "all") {
      result = result.filter(staff => {
        const staffStatus = staff.status?.toLowerCase() || '';
        const filterStatus = status.toLowerCase();
        return staffStatus === filterStatus;
      });
    }
    
    if (department && department !== "all") {
      result = result.filter(staff => {
        const staffDept = staff.department?.toLowerCase() || '';
        const filterDept = department.toLowerCase();
        return staffDept === filterDept;
      });
    }
    
    if (position && position !== "all") {
      result = result.filter(staff => {
        const staffPosition = staff.position?.toLowerCase() || '';
        const filterPosition = position.toLowerCase();
        return staffPosition.includes(filterPosition);
      });
    }
    
    if (employmentType && employmentType !== "all") {
      result = result.filter(staff => {
        const staffType = staff.employmentType?.toLowerCase() || '';
        const filterType = employmentType.toLowerCase();
        return staffType === filterType;
      });
    }
    
    // Filter by date range
    if (dateRange?.start && dateRange?.end) {
      try {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setDate(endDate.getDate() + 1);
        
        result = result.filter(staff => {
          if (!staff.joinDate) return false;
          try {
            const joinDate = new Date(staff.joinDate);
            return joinDate >= startDate && joinDate <= endDate;
          } catch (error) {
            return true;
          }
        });
      } catch (error) {
        console.log("Error parsing date range:", error);
      }
    }
    
    return result;
  }, [companyId, status, department, position, employmentType, dateRange]);

  // Search filter
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredData;
    }
    
    const query = searchQuery.toLowerCase();
    return filteredData.filter(staff => {
      const searchFields = [
        staff.fullName,
        staff.employeeId,
        staff.email,
        staff.position,
        staff.department,
        staff.company,
        staff.phone,
        staff.location,
        staff.status,
        staff.employmentType
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
        case "fullName":
        case "employeeId":
        case "department":
        case "position":
        case "email":
        case "phone":
        case "location":
        case "status":
        case "employmentType":
        case "joinDate":
          aValue = (a[orderBy as keyof IStaff] || '').toString().toLowerCase();
          bValue = (b[orderBy as keyof IStaff] || '').toString().toLowerCase();
          break;
        case "salary":
        case "experience":
        case "performanceRating":
          aValue = Number(a[orderBy as keyof IStaff] || 0);
          bValue = Number(b[orderBy as keyof IStaff] || 0);
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
  }, [companyId, status, department, position, employmentType, dateRange, searchQuery]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && sortedData.length > 0) {
      setSelected(sortedData.map(staff => staff.id));
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
    if (statusLower.includes("terminated")) return "error";
    return "default";
  };

  const getDepartmentClass = (department: string = "") => {
    const deptLower = department.toLowerCase();
    if (deptLower.includes("engineering") || deptLower.includes("tech")) return "primary";
    if (deptLower.includes("sales")) return "info";
    if (deptLower.includes("marketing")) return "secondary";
    if (deptLower.includes("finance")) return "success";
    if (deptLower.includes("human resources") || deptLower.includes("hr")) return "warning";
    if (deptLower.includes("operations")) return "error";
    if (deptLower.includes("product")) return "default";
    if (deptLower.includes("customer")) return "info";
    return "default";
  };

  const getEmploymentTypeClass = (type: string = "") => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("full-time")) return "success";
    if (typeLower.includes("part-time")) return "warning";
    if (typeLower.includes("contract")) return "info";
    if (typeLower.includes("intern")) return "secondary";
    return "default";
  };

  const handleViewStaff = (staff: IStaff) => {
    setSelectedStaff(staff);
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

  const formatCurrency = (amount: number = 0, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getInitials = (name: string = "") => {
    if (!name.trim()) return "EMP";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = staffHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(staff => [
      staff.fullName,
      staff.employeeId,
      staff.department,
      staff.position,
      staff.email,
      staff.phone,
      staff.location,
      staff.status,
      staff.employmentType,
      formatCurrency(staff.salary, staff.currency),
      formatDate(staff.joinDate),
      `${staff.experience} yrs`,
      staff.performanceRating?.toFixed(1) || 'N/A',
      staff.gender || '',
      staff.supervisor || 'N/A',
      staff.skills?.join(', ') || '',
      staff.education || '',
      staff.attendanceRate ? `${staff.attendanceRate}%` : 'N/A'
    ]);
    
    return {
      headers: [...headers, 'Gender', 'Supervisor', 'Skills', 'Education', 'Attendance'],
      rows,
      title: `${companyName} - Staff Export (${sortedData.length} records)`
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
                  <h3 className="font-semibold text-lg text-gray-800">{companyName} Staff Team</h3>
                  <p className="text-gray-600 text-sm">
                    {sortedData.length} staff member(s) found for this company
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Annual Salary</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(sortedData.reduce((sum, s) => sum + (s.salary || 0), 0), "USD")}
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
                    placeholder={`Search ${companyName} staff...`}
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `${companyName.replace(/\s+/g, '_')}_staff_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `${companyName} - Staff Report (${new Date().toLocaleDateString()})`
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
                        {staffHeadCells.map((headCell) => (
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
                          <TableCell colSpan={staffHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <GroupsIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                {filteredData.length === 0
                                  ? `No staff members found for ${companyName}`
                                  : "No staff members found with current filters"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" className="mb-4">
                                {searchQuery.trim() 
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : `Try adjusting your filters to see ${companyName}'s staff members`}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row) => {
                          const isSelected = selected.includes(row.id);
                          const statusClass = getStatusClass(row.status);
                          const deptClass = getDepartmentClass(row.department);
                          const typeClass = getEmploymentTypeClass(row.employmentType);

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
                                  <Avatar className="mr-3 bg-blue-500">
                                    {getInitials(row.fullName)}
                                  </Avatar>
                                  <div>
                                    <Typography variant="body2" className="font-medium">
                                      {row.fullName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {row.position}
                                    </Typography>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {row.employeeId}
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
                                <Typography variant="body2">
                                  {row.position}
                                </Typography>
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
                                <Chip
                                  label={row.employmentType}
                                  size="small"
                                  color={typeClass as any}
                                  variant="filled"
                                  className="font-medium"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <AttachMoneyIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2" className="font-semibold text-green-600">
                                    {formatCurrency(row.salary, row.currency)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <CalendarTodayIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {formatDate(row.joinDate)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-semibold">
                                  {row.experience} yrs
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Typography variant="body2" className="font-semibold mr-2">
                                    {(row.performanceRating || 0).toFixed(1)}
                                  </Typography>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(row.performanceRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="table__icon-box">
                                <div className="flex items-center justify-start gap-2">
                                  <button
                                    type="button"
                                    className="table__icon view p-1.5 hover:bg-blue-100 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewStaff(row);
                                    }}
                                    title="View Staff Details"
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
                                    title="Edit Staff"
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
                                    title="Delete Staff"
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

            {/* Staff Summary */}
            {sortedData.length > 0 && (
              <>
                <div className="card__wrapper mb-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Staff</div>
                        <div className="text-xl font-semibold">{sortedData.length}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Active</div>
                        <div className="text-xl font-semibold text-green-600">
                          {sortedData.filter(s => s.status === "Active").length}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Salary</div>
                        <div className="text-xl font-semibold text-green-600">
                          {formatCurrency(sortedData.reduce((sum, s) => sum + (s.salary || 0), 0), "USD")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Avg. Rating</div>
                        <div className="text-xl font-semibold">
                          {(sortedData.reduce((sum, s) => sum + (s.performanceRating || 0), 0) / sortedData.length).toFixed(1)}
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
                      {(searchQuery || status !== "all" || department !== "all" || position !== "all" || employmentType !== "all") && (
                        <Typography variant="caption" className="text-gray-600">
                          {searchQuery && `(Search: "${searchQuery}") `}
                          {status !== "all" && `• Status: ${status} `}
                          {department !== "all" && `• Department: ${department} `}
                          {position !== "all" && `• Position: ${position} `}
                          {employmentType !== "all" && `• Type: ${employmentType}`}
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
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2">
            {selected.length} staff member{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedStaffMembers = selected.map(id => sortedData.find(staff => staff.id === id)).filter(Boolean);
                const exportData = {
                  headers: staffHeadCells.map(cell => cell.label),
                  rows: selectedStaffMembers.map(staff => [
                    staff!.fullName,
                    staff!.employeeId,
                    staff!.department,
                    staff!.position,
                    staff!.email,
                    staff!.phone,
                    staff!.location,
                    staff!.status,
                    staff!.employmentType,
                    formatCurrency(staff!.salary, staff!.currency),
                    formatDate(staff!.joinDate),
                    `${staff!.experience} yrs`,
                    staff!.performanceRating?.toFixed(1) || 'N/A'
                  ]),
                  title: `${companyName} - Selected Staff (${selected.length} records)`
                };
                console.log('Exporting selected staff members:', selectedStaffMembers);
              }}
            >
              <i className="fa-regular fa-download mr-1"></i>
              Export Selected
            </button>
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
              onClick={() => {
                const selectedStaffMembers = paginatedRows.filter((staff) => selected.includes(staff.id));
                console.log('Bulk update status on staff members:', selectedStaffMembers);
                alert(`Updating status for ${selected.length} staff member${selected.length > 1 ? 's' : ''}...`);
              }}
            >
              <i className="fa-solid fa-toggle-on mr-1"></i>
              Update Status
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selected.length} staff member${selected.length > 1 ? 's' : ''}?`)) {
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

      {detailsModalOpen && selectedStaff && (
        <StaffDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
          staffData={selectedStaff}
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

export default CompanyStaffTable;