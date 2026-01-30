"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Box, Typography, Alert, Chip, CircularProgress } from "@mui/material";
import {
  PersonAdd,
  Download,
  Upload,
  Search,
  Person
} from "@mui/icons-material";
import EmployeeTable from "./EmployeeTable";
import EmployeeSummary from "./EmployeeSummary";
import BulkImportModal from "./BulkImportModal";
import { IEmployee } from "./EmployeeTypes";
import { isAuthenticated } from "@/app/helpers/authChecker";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const EmployeeMainArea: React.FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/employee`,
        {
          withCredentials: true
        }
      );
      
      console.log("API Response:", response.data); // Debug log
      
      if (response.data && response.data.data) {
        // Transform API response to match IEmployee interface
        const transformedEmployees = response.data.data.map((emp: any, index: number) => {
          const info = emp.info || emp; // Handle both formats
          
          // Calculate total salary from salary structure
          let totalSalary = 0;
          if (emp.salary_structure?.Earnings) {
            const earnings = emp.salary_structure.Earnings;
            totalSalary = Object.values(earnings).reduce((sum: number, val: any) => {
              return sum + (parseFloat(val) || 0);
            }, 0);
          }
          
          // Get employment type from attributes
          const employmentType = emp.attributes?.find((attr: any) => 
            attr.attribute_key === 'employment_type'
          )?.attribute_value || 'Full-Time';
          
          // Get work location from attributes
          const workLocation = emp.attributes?.find((attr: any) => 
            attr.attribute_key === 'work_location'
          )?.attribute_value || 'Not specified';
          
          return {
            // Basic info
            employeeId: info.employee_id?.toString() || index.toString(),
            employeeCode: info.employee_code || `EMP${info.employee_id || index}`,
            firstName: info.first_name || info.firstName || '',
            lastName: info.last_name || info.lastName || '',
            email: info.email || '',
            phoneNumber: info.phone || info.phoneNumber || '',
            designation: info.designation || '',
            dateOfJoining: info.date_of_joining || info.dateOfJoining || '',
            
            // Role information
            roleId: 0, // Not in current API response
            roleName: info.designation || 'Employee',
            
            // Department information
            departmentId: 0, // Not in current API response
            departmentName: info.department || 'Not assigned',
            
            // Work location
            workLocationId: 0,
            workLocationName: workLocation,
            
            // Work type from attributes
            workType: employmentType as any,
            
            // Employment status (assuming all are active since no is_active field)
            employmentStatus: "Active",
            attendanceType: "Biometric", // Default
            status: "Active",
            
            // Address (not in current API)
            presentAddress: {
              addressLine1: "",
              city: "",
              state: "",
              country: "",
              zipCode: ""
            },
            
            // Emergency contact (not in current API)
            emergencyContactName: "",
            emergencyContactRelation: "",
            emergencyContactPhone: "",
            
            // Documents
            documents: [],
            
            // Salary information
            costToCompany: totalSalary,
            payFrequency: "Monthly", // Default
            
            // System access
            systemUserEnabled: !!info.username,
            username: info.username || '',
            
            // Attendance summary (calculated)
            attendanceSummary: {
              present: Math.floor(Math.random() * 22), // Mock data
              absent: Math.floor(Math.random() * 5),
              leave: Math.floor(Math.random() * 3),
              holiday: Math.floor(Math.random() * 2),
              workingDays: 22,
              totalDays: 30,
              percentage: Math.floor(Math.random() * 30 + 70),
              lateArrivals: Math.floor(Math.random() * 5),
              earlyDepartures: Math.floor(Math.random() * 3),
              overtimeHours: Math.floor(Math.random() * 10),
              regularHours: 176,
              averageHoursPerDay: 8.0
            },
            
            // Additional fields
            sameAsPresentAddress: true,
            createdAt: info.created_at || new Date().toISOString(),
            updatedAt: info.updated_at || new Date().toISOString(),
            createdBy: "System",
            updatedBy: "System",
            
            // Include raw data for reference
            _rawData: emp
          };
        });
        
        console.log("Transformed employees:", transformedEmployees); // Debug log
        setEmployees(transformedEmployees);
      }
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      
      if (error.response?.status === 401) {
        router.push("/");
        return;
      }
      
      setError(error.response?.data?.message || "Failed to load employees");
      toast.error(error.response?.data?.message || "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        router.push("/");
        return;
      }
      fetchEmployees();
    };
    checkAuth();
  }, []);

  const handleAddEmployee = () => {
    router.push("/owner/employees/add-employee");
  };

  const handleBulkImport = () => {
    setImportModalOpen(true);
  };

  const handleExportEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/employee/export`,
        {
          withCredentials: true,
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Export started successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export employees");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || employee.employmentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle delete employee
  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/employee/${employeeId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Employee deleted successfully!");
        fetchEmployees(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete employee");
    }
  };

  // Handle status change
  const handleStatusChange = async (employeeId: string, status: string) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/employee/${employeeId}/status`,
        { status },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Employee status updated!");
        fetchEmployees(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Status change error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="app__slide-wrapper">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <CircularProgress />
            <p className="mt-2 text-gray-600">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app__slide-wrapper">
        <Alert severity="error" className="mb-4">
          <Typography variant="h6">Error loading employees</Typography>
          <Typography>{error}</Typography>
          <button
            onClick={fetchEmployees}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item active">Employee Management</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={handleBulkImport}
            size="small"
          >
            Bulk Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportEmployees}
            size="small"
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddEmployee}
            className="!text-white"
            size="small"
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            width: 56, 
            height: 56, 
            borderRadius: 2, 
            bgcolor: 'primary.light', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mr: 2
          }}>
            <Person sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Employee Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage all employee records, onboarding, and profiles
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary Cards */}
      <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0 mb-6">
        <EmployeeSummary employees={employees} />
      </div>

      {/* Search and Filter Bar */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        borderRadius: 1, 
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Search sx={{ mr: 1, color: 'text.secondary' }} />
          <input
            type="text"
            placeholder="Search employees by name, email, or employee code..."
            className="form-control border-0 bg-transparent focus:outline-none"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={statusFilter === "All" ? "contained" : "outlined"}
            size="small"
            className="!text-white"
            onClick={() => handleStatusFilter("All")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "Active" ? "contained" : "outlined"}
            size="small"
            color="success"
            onClick={() => handleStatusFilter("Active")}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "Inactive" ? "contained" : "outlined"}
            size="small"
            color="error"
            onClick={() => handleStatusFilter("Inactive")}
          >
            Inactive
          </Button>
        </Box>
      </Box>

      {/* Employee Table */}
      <EmployeeTable
        data={filteredEmployees}
        onEdit={(employee) => {
          router.push(`/owner/employees/edit-employee/${employee.employeeId}`);
        }}
        onDelete={handleDeleteEmployee}
        onStatusChange={handleStatusChange}
      />

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Use Bulk Import for adding multiple employees. Download the template CSV file first.
        </Typography>
      </Alert>

      {/* Bulk Import Modal */}
      {/* <BulkImportModal
        open={importModalOpen}
        employees={employees}
        onClose={() => setImportModalOpen(false)}
        onImportComplete={() => {
          setImportModalOpen(false);
          fetchEmployees(); // Refresh the list after import
        }}
      /> */}
    </div>
  );
};

export default EmployeeMainArea;