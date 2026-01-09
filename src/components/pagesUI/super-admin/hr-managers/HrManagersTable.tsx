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
  Rating, 
  Typography, 
  Chip,
  Grid,
  TextField,
  Select,
  MenuItem 
} from "@mui/material";
import DeleteModal from "@/components/common/DeleteModal";
import HrManagerDetailsModal from "./HrManagerDetailsModal";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import { IHrManager } from "./hr-managers.interface";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";
import { useRouter } from "next/navigation";

// Mock data - Ensure this is properly structured
const allHrManagersData: IHrManager[] = [
  {
    id: 1,
    hrName: "John Smith",
    hrCode: "HR-001",
    department: "Human Resources",
    company: "TechNova Solutions",
    email: "john.smith@technova.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    extension: "123",
    jobTitle: "HR Director",
    location: "San Francisco, CA",
    status: "Active",
    hireDate: "2020-03-15",
    yearsOfExperience: 12,
    qualifications: ["MBA", "PHR Certification", "MS in HR"],
    certifications: ["SHRM-CP", "PHR"],
    specializations: ["Talent Acquisition", "Employee Relations", "Compensation"],
    managedEmployees: 1250,
    reportingTo: "CEO",
    address: "123 Tech Street, San Francisco, CA 94105",
    city: "San Francisco",
    state: "California",
    country: "USA",
    zipCode: "94105",
    dateOfBirth: "1985-05-20",
    gender: "Male",
    maritalStatus: "Married",
    emergencyContact: "Jane Smith",
    emergencyPhone: "+1 (555) 555-1212",
    profileImage: "",
    rating: 4.8,
    tag: "Senior HR",
    notes: "Excellent leadership skills"
  },
  {
    id: 2,
    hrName: "Sarah Johnson",
    hrCode: "HR-002",
    department: "HR Operations",
    company: "Global Finance Group",
    email: "sarah.j@globalfinance.com",
    phone: "+1 (555) 234-5678",
    mobile: "+1 (555) 876-5432",
    jobTitle: "HR Manager",
    location: "New York, NY",
    status: "Active",
    hireDate: "2021-06-10",
    yearsOfExperience: 8,
    qualifications: ["MS in HRM", "BBA"],
    certifications: ["SPHR"],
    specializations: ["HR Analytics", "Performance Management"],
    managedEmployees: 850,
    reportingTo: "HR Director",
    rating: 4.5,
    tag: "Operations"
  },
  {
    id: 3,
    hrName: "Michael Chen",
    hrCode: "HR-003",
    department: "Talent Acquisition",
    company: "MediCare Innovations",
    email: "michael.chen@medicareinnovations.com",
    phone: "+1 (555) 345-6789",
    mobile: "+1 (555) 765-4321",
    jobTitle: "Recruitment Manager",
    location: "Boston, MA",
    status: "Active",
    hireDate: "2019-11-22",
    yearsOfExperience: 10,
    qualifications: ["MBA", "BS in Psychology"],
    specializations: ["Executive Search", "Campus Recruitment"],
    managedEmployees: 620,
    reportingTo: "HR Director",
    rating: 4.7,
    tag: "Recruitment"
  },
  {
    id: 4,
    hrName: "Emma Wilson",
    hrCode: "HR-004",
    department: "Employee Relations",
    company: "RetailMax Corporation",
    email: "emma.w@retailmax.co.uk",
    phone: "+44 20 7123 4567",
    mobile: "+44 20 7123 4568",
    jobTitle: "Employee Relations Specialist",
    location: "London, UK",
    status: "Inactive",
    hireDate: "2022-01-15",
    yearsOfExperience: 6,
    qualifications: ["LLB", "MA in Industrial Relations"],
    specializations: ["Conflict Resolution", "Labor Laws"],
    managedEmployees: 750,
    reportingTo: "HR Manager",
    rating: 4.6,
    tag: "Relations"
  },
  {
    id: 5,
    hrName: "David Miller",
    hrCode: "HR-005",
    department: "Compensation & Benefits",
    company: "Alpha Industries",
    email: "david.m@alphaind.com",
    phone: "+1 (555) 567-8901",
    mobile: "+1 (555) 678-9012",
    jobTitle: "Compensation Analyst",
    location: "Chicago, IL",
    status: "Active",
    hireDate: "2023-03-01",
    yearsOfExperience: 4,
    qualifications: ["BA in Finance", "CCP"],
    specializations: ["Salary Surveys", "Bonus Plans"],
    managedEmployees: 0,
    reportingTo: "HR Manager",
    rating: 4.3,
    tag: "Compensation"
  },
  {
    id: 6,
    hrName: "Lisa Wang",
    hrCode: "HR-006",
    department: "Learning & Development",
    company: "Beta Technologies",
    email: "lisa.w@betatech.com",
    phone: "+1 (555) 678-9012",
    mobile: "+1 (555) 789-0123",
    jobTitle: "Training Manager",
    location: "Seattle, WA",
    status: "On Leave",
    hireDate: "2020-08-15",
    yearsOfExperience: 7,
    qualifications: ["MA in Education", "CPLP"],
    specializations: ["Leadership Development", "E-Learning"],
    managedEmployees: 420,
    reportingTo: "HR Director",
    rating: 4.9,
    tag: "Training"
  }
];

// Table head cells
const hrManagerHeadCells = [
  { id: "hrName", label: "HR Manager" },
  { id: "hrCode", label: "HR Code" },
  { id: "department", label: "Department" },
  { id: "company", label: "Company" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "jobTitle", label: "Job Title" },
  { id: "status", label: "Status" },
  { id: "managedEmployees", label: "Managed Employees" },
  { id: "yearsOfExperience", label: "Experience" },
  { id: "hireDate", label: "Hire Date" },
  { id: "rating", label: "Rating" },
];

interface HrManagersTableProps {
  status?: string;
  department?: string;
  company?: string;
  dateRange?: { start: string; end: string };
  onEdit?: (manager: IHrManager) => void;
  onDelete?: (id: number) => void;
}

const HrManagersTable: React.FC<HrManagersTableProps> = ({ 
  status = "all",
  department = "all",
  company = "all",
  dateRange = { start: "", end: "" },
  onEdit,
  onDelete
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedHrManager, setSelectedHrManager] = useState<IHrManager | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const router = useRouter();
  
  // State for table controls
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("hrName");

  // DEBUG: Log the props to see what's being passed
  useEffect(() => {
    console.log("=== HR MANAGERS TABLE DEBUG ===");
    console.log("Props received:", { 
      status, 
      department, 
      company, 
      dateRange,
      hasStartDate: !!dateRange?.start,
      hasEndDate: !!dateRange?.end
    });
    console.log("Total data items:", allHrManagersData.length);
    console.log("Sample hire dates:", allHrManagersData.map(m => ({ name: m.hrName, hireDate: m.hireDate })));
  }, [status, department, company, dateRange]);

  // SIMPLIFIED FILTERING - FIXED VERSION
  const filteredData = useMemo(() => {
    console.log("=== FILTERING DATA ===");
    console.log("Filters:", { status, department, company, dateRange });
    
    let result = [...allHrManagersData];
    
    // Filter by status
    if (status && status !== "all") {
      console.log(`Filtering status: looking for "${status}"`);
      result = result.filter(manager => {
        const managerStatus = manager.status?.toLowerCase() || '';
        const filterStatus = status.toLowerCase();
        const matches = managerStatus === filterStatus;
        console.log(`  ${manager.hrName}: ${managerStatus} === ${filterStatus} ? ${matches}`);
        return matches;
      });
    }
    
    // Filter by department
    if (department && department !== "all") {
      console.log(`Filtering department: looking for "${department}"`);
      result = result.filter(manager => {
        const managerDept = manager.department?.toLowerCase() || '';
        const filterDept = department.toLowerCase();
        const matches = managerDept === filterDept;
        console.log(`  ${manager.hrName}: ${managerDept} === ${filterDept} ? ${matches}`);
        return matches;
      });
    }
    
    // Filter by company
    if (company && company !== "all") {
      console.log(`Filtering company: looking for "${company}"`);
      result = result.filter(manager => {
        const managerCompany = manager.company?.toLowerCase() || '';
        const filterCompany = company.toLowerCase();
        const matches = managerCompany === filterCompany;
        console.log(`  ${manager.hrName}: ${managerCompany} === ${filterCompany} ? ${matches}`);
        return matches;
      });
    }
    
    // Filter by date range (only if both dates are provided)
    if (dateRange?.start && dateRange?.end) {
      console.log(`Filtering date range: ${dateRange.start} to ${dateRange.end}`);
      try {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        // Add one day to end date to make it inclusive
        endDate.setDate(endDate.getDate() + 1);
        
        result = result.filter(manager => {
          if (!manager.hireDate) return false;
          try {
            const hireDate = new Date(manager.hireDate);
            const isInRange = hireDate >= startDate && hireDate <= endDate;
            console.log(`  ${manager.hrName}: ${manager.hireDate} (${hireDate.toISOString()}) in range? ${isInRange}`);
            return isInRange;
          } catch (error) {
            console.log(`  ${manager.hrName}: Error parsing hire date ${manager.hireDate}`);
            return true; // Keep if date parsing fails
          }
        });
      } catch (error) {
        console.log("Error parsing date range:", error);
        // If date parsing fails, don't filter by date
      }
    }
    
    console.log(`After filtering: ${result.length} items remaining`);
    console.log("Filtered items:", result.map(m => ({ 
      name: m.hrName, 
      status: m.status, 
      dept: m.department, 
      company: m.company,
      hireDate: m.hireDate 
    })));
    return result;
  }, [status, department, company, dateRange]);

  // Filter by search query
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredData;
    }
    
    const query = searchQuery.toLowerCase();
    console.log(`Searching with query: "${query}"`);
    
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
      
      const matches = searchFields.some(field => field.includes(query));
      if (matches) {
        console.log(`  Match found: ${manager.hrName}`);
      }
      return matches;
    });
  }, [filteredData, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    if (searchedData.length === 0) return [];
    
    return [...searchedData].sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';
      
      // Get values for sorting
      switch (orderBy) {
        case "hrName":
        case "hrCode":
        case "company":
        case "department":
        case "email":
        case "phone":
        case "jobTitle":
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
      
      // Sort based on order
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
  }, [status, department, company, dateRange, searchQuery]);

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
    if (deptLower.includes("human resources")) return "primary";
    if (deptLower.includes("operations")) return "info";
    if (deptLower.includes("talent") || deptLower.includes("recruitment")) return "secondary";
    if (deptLower.includes("employee")) return "success";
    if (deptLower.includes("compensation")) return "warning";
    if (deptLower.includes("learning") || deptLower.includes("training")) return "info";
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
      manager.company,
      manager.email,
      manager.phone,
      manager.jobTitle,
      manager.status,
      (manager.managedEmployees || 0).toLocaleString(),
      `${manager.yearsOfExperience} yrs`,
      formatDate(manager.hireDate),
      manager.rating?.toFixed(1) || 'N/A',
      manager.location || '',
      manager.mobile || '',
      manager.reportingTo || 'N/A',
      manager.qualifications?.join(', ') || '',
      manager.certifications?.join(', ') || ''
    ]);
    
    return {
      headers: [...headers, 'Location', 'Mobile', 'Reporting To', 'Qualifications', 'Certifications'],
      rows,
      title: `HR Managers Export - ${sortedData.length} records`
    };
  }, [sortedData]);

  // Check if we should show data or empty state
  const shouldShowEmptyState = paginatedRows.length === 0;
  const hasDateFilter = dateRange?.start && dateRange?.end;

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
                    placeholder="Search HR managers..."
                  />
                </Box>
              </Grid>
              
              {/* Export Options - Top Right */}
              <Grid item xs={12} md={6}>
                <Box className="flex justify-end">
                  <DownloadButtonGroup
                    data={exportData}
                    options={{
                      fileName: `hr_managers_${new Date().toISOString().split('T')[0]}`,
                      includeHeaders: true,
                      pdfTitle: `HR Managers Report - ${new Date().toLocaleDateString()}`
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
                              <PersonIcon className="text-gray-400 mb-2" fontSize="large" />
                              <Typography variant="body1" className="text-gray-600 mb-2">
                                {filteredData.length === 0
                                  ? "No HR managers match your filters"
                                  : "No HR managers found with current search"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" className="mb-4">
                                {searchQuery.trim() 
                                  ? `Try adjusting your search query: "${searchQuery}"`
                                  : "Try adjusting your filters to see more results"}
                              </Typography>
                              
                              {/* Enhanced Debug info */}
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left max-w-md">
                                <Typography variant="caption" className="text-gray-700 block mb-2 font-medium">
                                  <strong>Debug Information:</strong>
                                </Typography>
                                <div className="text-sm text-gray-600 space-y-2">
                                  <div className="flex justify-between">
                                    <span>Status filter:</span>
                                    <code className="bg-gray-200 px-2 py-1 rounded">{status}</code>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Department filter:</span>
                                    <code className="bg-gray-200 px-2 py-1 rounded">{department}</code>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Company filter:</span>
                                    <code className="bg-gray-200 px-2 py-1 rounded">{company}</code>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Date range:</span>
                                    <code className="bg-gray-200 px-2 py-1 rounded">
                                      {dateRange?.start || "N/A"} to {dateRange?.end || "N/A"}
                                    </code>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Total data items:</span>
                                    <code className="bg-gray-200 px-2 py-1 rounded">{allHrManagersData.length}</code>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>After filtering:</span>
                                    <code className="bg-gray-200 px-2 py-1 rounded">{filteredData.length}</code>
                                  </div>
                                  
                                  {/* Date Range Issue Warning */}
                                  {hasDateFilter && filteredData.length === 0 && (
                                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                      <Typography variant="caption" className="text-yellow-700 block">
                                        <strong>⚠️ Date Range Issue:</strong> Your hire dates are: 2020-2023, 
                                        but you are filtering for 2024. Try changing the date range to include earlier years.
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Quick filter test buttons */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    onClick={() => {
                                      // Show all data in console
                                      console.log("All HR Managers Data:", allHrManagersData);
                                      alert(
                                        `All HR Managers (${allHrManagersData.length}):\n\n` +
                                        allHrManagersData.map(m => 
                                          `• ${m.hrName} (${m.status})\n  Hire Date: ${m.hireDate}\n  Company: ${m.company}`
                                        ).join('\n\n')
                                      );
                                    }}
                                  >
                                    Show All Data
                                  </button>
                                  <button
                                    type="button"
                                    className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                    onClick={() => {
                                      // Clear date range
                                      if (hasDateFilter) {
                                        console.log("Clearing date range filter");
                                        // This would require passing a callback up to parent
                                        // For now, just show message
                                        alert("To clear date filter, remove the dates from the date range inputs above.");
                                      } else {
                                        window.location.reload();
                                      }
                                    }}
                                  >
                                    {hasDateFilter ? "Clear Date Filter" : "Reset All Filters"}
                                  </button>
                                  <button
                                    type="button"
                                    className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                    onClick={() => {
                                      // Show sample data that should match
                                      const sampleData = allHrManagersData.slice(0, 3);
                                      console.log("Sample data:", sampleData);
                                      alert(
                                        `Sample HR Managers:\n\n` +
                                        sampleData.map(m => 
                                          `• ${m.hrName}\n  Status: ${m.status}\n  Department: ${m.department}\n  Hire Date: ${m.hireDate}`
                                        ).join('\n\n')
                                      );
                                    }}
                                  >
                                    Show Sample Data
                                  </button>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row) => {
                          const isSelected = selected.includes(row.id);
                          const statusClass = getStatusClass(row.status);
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
                                  label={row.status}
                                  size="small"
                                  color={statusClass as any}
                                  variant="filled"
                                  className="font-medium"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <PersonIcon className="mr-1 text-gray-500" fontSize="small" />
                                  <Typography variant="body2" className="font-semibold">
                                    {(row.managedEmployees || 0).toLocaleString()}
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
                                  <Rating
                                    value={row.rating || 0}
                                    readOnly
                                    size="small"
                                    precision={0.1}
                                  />
                                  <Typography variant="body2" className="ml-2 font-semibold">
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
                                    onClick={()=>router.push(`/super-admin/hr-manager/update-hr-manager/${row.id}`)}
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
                        <div className="text-sm text-gray-600">Total Managed Employees</div>
                        <div className="text-xl font-semibold text-blue-600">
                          {sortedData.reduce((sum, m) => sum + (m.managedEmployees || 0), 0).toLocaleString()}
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Typography variant="body2">
            {selected.length} HR manager{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              onClick={() => {
                const selectedManagers = selected.map(id => sortedData.find(manager => manager.id === id)).filter(Boolean);
                const exportData = {
                  headers: hrManagerHeadCells.map(cell => cell.label),
                  rows: selectedManagers.map(manager => [
                    manager!.hrName,
                    manager!.hrCode,
                    manager!.department,
                    manager!.company,
                    manager!.email,
                    manager!.phone,
                    manager!.jobTitle,
                    manager!.status,
                    (manager!.managedEmployees || 0).toLocaleString(),
                    `${manager!.yearsOfExperience} yrs`,
                    formatDate(manager!.hireDate),
                    manager!.rating?.toFixed(1) || 'N/A'
                  ]),
                  title: `Selected HR Managers - ${selected.length} records`
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

export default HrManagersTable;