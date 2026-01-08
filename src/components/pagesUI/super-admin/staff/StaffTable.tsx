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
import { 
  Checkbox, 
  Avatar, 
  Rating, 
  Typography, 
  Chip,
  Grid,
  TextField,
  Select,
  MenuItem 
} from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import StaffDetailsModal from "./StaffDetailsModal";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { IStaff } from "./staff.interface";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

// Mock data for all staff across companies
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
    joinDate: "2024-03-15",
    status: "Active",
    employmentType: "Full-time",
    salary: 125000,
    currency: "USD",
    supervisor: "Sarah Johnson",
    gender: "Male",
    dateOfBirth: "1990-05-20",
    address: "123 Tech Street, San Francisco, CA 94105",
    city: "San Francisco",
    country: "USA",
    zipCode: "94105",
    emergencyContact: "+1 (555) 111-2222",
    skills: ["JavaScript", "React", "Node.js", "AWS", "TypeScript"],
    education: "MS Computer Science, Stanford University",
    experience: 8,
    performanceRating: 4.8,
    attendanceRate: 97.5,
    projectsCompleted: 42,
    lastLogin: "2024-03-28 09:15:23",
    notes: "Top performer, leads the React team"
  },
  {
    id: 2,
    employeeId: "EMP-002",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@technova.com",
    phone: "+1 (555) 234-5678",
    mobile: "+1 (555) 876-5432",
    position: "Engineering Manager",
    department: "Engineering",
    company: "TechNova Solutions",
    companyId: 1,
    location: "San Francisco, CA",
    joinDate: "2024-02-01",
    status: "Active",
    employmentType: "Full-time",
    salary: 150000,
    currency: "USD",
    supervisor: "Michael Chen",
    gender: "Female",
    dateOfBirth: "1985-08-12",
    address: "456 Manager Ave, San Francisco, CA 94107",
    city: "San Francisco",
    country: "USA",
    zipCode: "94107",
    emergencyContact: "+1 (555) 222-3333",
    skills: ["Management", "Project Planning", "Agile", "Python", "Cloud Architecture"],
    education: "MBA, Harvard Business School",
    experience: 12,
    performanceRating: 4.9,
    attendanceRate: 98.2,
    projectsCompleted: 28,
    lastLogin: "2024-03-28 08:30:15",
    notes: "Department head, excellent leadership skills"
  },
  {
    id: 3,
    employeeId: "EMP-003",
    firstName: "Michael",
    lastName: "Chen",
    fullName: "Michael Chen",
    email: "michael.chen@globalcorp.com",
    phone: "+1 (555) 345-6789",
    mobile: "+1 (555) 765-4321",
    position: "Finance Director",
    department: "Finance",
    company: "Global Corp",
    companyId: 2,
    location: "New York, NY",
    joinDate: "2024-01-10",
    status: "Active",
    employmentType: "Full-time",
    salary: 180000,
    currency: "USD",
    supervisor: "CEO",
    gender: "Male",
    dateOfBirth: "1980-11-25",
    address: "789 Finance St, New York, NY 10001",
    city: "New York",
    country: "USA",
    zipCode: "10001",
    emergencyContact: "+1 (555) 333-4444",
    skills: ["Financial Analysis", "Budgeting", "Risk Management", "Excel", "SAP"],
    education: "PhD Economics, MIT",
    experience: 15,
    performanceRating: 4.7,
    attendanceRate: 99.0,
    projectsCompleted: 15,
    lastLogin: "2024-03-27 10:45:30",
    notes: "Key player in financial planning"
  },
  {
    id: 4,
    employeeId: "EMP-004",
    firstName: "Emma",
    lastName: "Wilson",
    fullName: "Emma Wilson",
    email: "emma.wilson@globalcorp.com",
    phone: "+1 (555) 456-7890",
    mobile: "+1 (555) 654-3210",
    position: "HR Manager",
    department: "Human Resources",
    company: "Global Corp",
    companyId: 2,
    location: "New York, NY",
    joinDate: "2023-12-05",
    status: "Inactive",
    employmentType: "Full-time",
    salary: 95000,
    currency: "USD",
    supervisor: "Michael Chen",
    gender: "Female",
    dateOfBirth: "1992-03-18",
    address: "321 HR Blvd, New York, NY 10002",
    city: "New York",
    country: "USA",
    zipCode: "10002",
    emergencyContact: "+1 (555) 444-5555",
    skills: ["Recruitment", "Employee Relations", "Compensation", "HRIS", "Training"],
    education: "BA Psychology, Columbia University",
    experience: 6,
    performanceRating: 4.5,
    attendanceRate: 96.8,
    projectsCompleted: 8,
    lastLogin: "2024-02-15 14:20:45",
    notes: "On maternity leave until June 2024"
  }
];

// Table head cells
const staffHeadCells = [
  { id: "fullName", label: "Staff Name" },
  { id: "employeeId", label: "Employee ID" },
  { id: "company", label: "Company" },
  { id: "department", label: "Department" },
  { id: "position", label: "Position" },
  { id: "status", label: "Status" },
  { id: "employmentType", label: "Type" },
  { id: "joinDate", label: "Join Date" },
  { id: "performanceRating", label: "Rating" },
  { id: "salary", label: "Salary" },
];

interface AllStaffTableProps {
  status?: string;
  department?: string;
  company?: string;
  dateRange?: { start: string; end: string };
  onEdit?: (staff: IStaff) => void;
  onDelete?: (id: number) => void;
}

const StaffTable: React.FC<AllStaffTableProps> = ({ 
  status = "all",
  department = "all",
  company = "all",
  dateRange,
  onEdit,
  onDelete
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
  // State for table controls (same as DepartmentTable)
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("fullName");

  // Filter data based on props (same as DepartmentTable)
  const filteredData = useMemo(() => {
    return allStaffData.filter(staff => {
      // Filter by status
      if (status !== "all" && staff.status.toLowerCase() !== status.toLowerCase()) {
        return false;
      }
      
      // Filter by department
      if (department !== "all" && staff.department.toLowerCase() !== department.toLowerCase()) {
        return false;
      }
      
      // Filter by company
      if (company !== "all" && staff.company.toLowerCase() !== company.toLowerCase()) {
        return false;
      }
      
      // Filter by date range
      if (dateRange && dateRange.start && dateRange.end) {
        const joinDate = new Date(staff.joinDate);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        if (joinDate < startDate || joinDate > endDate) {
          return false;
        }
      }
      
      return true;
    });
  }, [status, department, company, dateRange]);

  // Filter by search query
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return filteredData;
    
    const query = searchQuery.toLowerCase();
    return filteredData.filter(staff => 
      staff.fullName.toLowerCase().includes(query) ||
      staff.employeeId.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.position.toLowerCase().includes(query) ||
      staff.department.toLowerCase().includes(query) ||
      staff.company.toLowerCase().includes(query)
    );
  }, [filteredData, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...searchedData].sort((a, b) => {
      if (orderBy === "fullName" || orderBy === "employeeId" || orderBy === "company" || 
          orderBy === "department" || orderBy === "position" || orderBy === "status" || 
          orderBy === "employmentType" || orderBy === "joinDate") {
        const valueA = a[orderBy]?.toLowerCase() || '';
        const valueB = b[orderBy]?.toLowerCase() || '';
        return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      if (orderBy === "performanceRating" || orderBy === "salary") {
        return order === "asc" ? (a[orderBy] || 0) - (b[orderBy] || 0) : (b[orderBy] || 0) - (a[orderBy] || 0);
      }
      return 0;
    });
  }, [searchedData, order, orderBy]);

  // Paginate data
  const paginatedRows = useMemo(() => {
    return sortedData.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(sortedData.map(staff => staff.id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

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

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "on leave":
        return "warning";
      case "terminated":
        return "error";
      default:
        return "default";
    }
  };

  const getEmploymentTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "primary";
      case "part-time":
        return "info";
      case "contract":
        return "warning";
      case "intern":
        return "secondary";
      default:
        return "default";
    }
  };

  const getDepartmentClass = (dept: string) => {
    switch (dept.toLowerCase()) {
      case "engineering":
        return "primary";
      case "sales":
        return "success";
      case "marketing":
        return "info";
      case "operations":
        return "warning";
      case "finance":
        return "error";
      case "human resources":
        return "secondary";
      default:
        return "default";
    }
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
    // Remove from selected if it was selected
    setSelected(selected.filter(item => item !== id));
  };

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      return `$${amount.toLocaleString()}`;
    }
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
    const headers = staffHeadCells.map(cell => cell.label);
    
    const rows = sortedData.map(staff => [
      staff.fullName,
      staff.employeeId,
      staff.company,
      staff.department,
      staff.position,
      staff.status,
      staff.employmentType,
      formatDate(staff.joinDate),
      staff.performanceRating?.toFixed(1) || 'N/A',
      formatCurrency(staff.salary, staff.currency),
      staff.email,
      staff.phone,
      staff.location,
      staff.experience?.toString() || '0',
      staff.skills?.join(', ') || '',
      staff.supervisor || 'N/A'
    ]);
    
    return {
      headers: [...headers, 'Email', 'Phone', 'Location', 'Experience (Years)', 'Skills', 'Supervisor'],
      rows,
      title: `Staff Export - ${sortedData.length} records`
    };
  }, [sortedData]);

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
                    placeholder="Search staff members..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `staff_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `Staff Report - ${new Date().toLocaleDateString()}`
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
                      {paginatedRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={staffHeadCells.length + 2} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <PersonIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600">
                                No staff found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {sortedData.length === 0
                                  ? "Try adjusting your filters to see more results"
                                  : "Check your search query or try different keywords"}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row) => {
                          const isSelected = selected.includes(row.id);
                          const statusClass = getStatusClass(row.status);
                          const typeClass = getEmploymentTypeClass(row.employmentType);
                          const deptClass = getDepartmentClass(row.department);

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
                                  <Avatar className="mr-3 bg-primary">
                                    {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
                                  </Avatar>
                                  <div>
                                    <Typography variant="body2" className="font-medium">
                                      {row.fullName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {row.email}
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
                                <div className="flex items-center">
                                  <BusinessIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <div>
                                    <Typography variant="body2">
                                      {row.company}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {row.location}
                                    </Typography>
                                  </div>
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
                                  <WorkIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {row.position}
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
                                  <CalendarTodayIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2">
                                    {formatDate(row.joinDate)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Rating
                                    value={row.performanceRating || 0}
                                    readOnly
                                    size="small"
                                    precision={0.1}
                                  />
                                  <Typography variant="body2" className="ml-2 font-semibold">
                                    {(row.performanceRating || 0).toFixed(1)}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" className="font-semibold text-green-600">
                                  {formatCurrency(row.salary, row.currency)}
                                </Typography>
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
              <div className="card__wrapper mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Staff</div>
                      <div className="text-xl font-semibold">{sortedData.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Active Staff</div>
                      <div className="text-xl font-semibold text-green-600">
                        {sortedData.filter(s => s.status === "Active").length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Avg. Rating</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {(sortedData.reduce((sum, s) => sum + (s.performanceRating || 0), 0) / sortedData.length).toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Salary</div>
                      <div className="text-xl font-semibold">
                        {formatCurrency(
                          sortedData.reduce((sum, s) => sum + s.salary, 0),
                          sortedData[0]?.currency || "USD"
                        )}
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
                      sortedData.length
                    )} of ${sortedData.length} entries`}
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
                      const selectedStaff = selected.map(id => sortedData.find(staff => staff.id === id)).filter(Boolean);
                      const exportData = {
                        headers: staffHeadCells.map(cell => cell.label),
                        rows: selectedStaff.map(staff => [
                          staff!.fullName,
                          staff!.employeeId,
                          staff!.company,
                          staff!.department,
                          staff!.position,
                          staff!.status,
                          staff!.employmentType,
                          formatDate(staff!.joinDate),
                          staff!.performanceRating?.toFixed(1) || 'N/A',
                          formatCurrency(staff!.salary, staff!.currency)
                        ]),
                        title: `Selected Staff Members - ${selected.length} records`
                      };
                      console.log('Exporting selected staff:', selectedStaff);
                    }}
                  >
                    <i className="fa-regular fa-download mr-1"></i>
                    Export Selected
                  </button>
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
                    onClick={() => {
                      const selectedStaff = paginatedRows.filter((staff) => selected.includes(staff.id));
                      console.log('Bulk toggle status on staff:', selectedStaff);
                      alert(`Toggling status for ${selected.length} staff member${selected.length > 1 ? 's' : ''}...`);
                    }}
                  >
                    <i className="fa-solid fa-toggle-on mr-1"></i>
                    Toggle Status
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
          </div>
        </div>
      </div>

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

export default StaffTable;