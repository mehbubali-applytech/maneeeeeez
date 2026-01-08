// EmployeeMainArea.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Box, Typography, Alert, Chip } from "@mui/material";
import {
  PersonAdd,
  Download,
  Upload,
  FilterList,
  Search,
  Person,
  Group,
  Business,
  LocationOn
} from "@mui/icons-material";
import EmployeeTable from "./EmployeeTable";
import EmployeeSummary from "./EmployeeSummary";
import BulkImportModal from "./BulkImportModal";
import { createMockEmployees, IEmployee } from "./EmployeeTypes";

const EmployeeMainArea: React.FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
 useEffect(() => {
  setEmployees(createMockEmployees(4));
}, []);

  const handleAddEmployee = () => {
    window.location.href = "/owner/employees/add-employee";
  };

  const handleBulkImport = () => {
    setImportModalOpen(true);
  };

  const handleExportEmployees = () => {
    // Export functionality
    console.log("Exporting employees...");
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
            variant={statusFilter === "On Probation" ? "contained" : "outlined"}
            size="small"
            color="warning"
            onClick={() => handleStatusFilter("On Probation")}
          >
            Probation
          </Button>
        </Box>
      </Box>

      {/* Employee Table */}
      <EmployeeTable
        data={filteredEmployees}
        onEdit={(employee) => {
          window.location.href = `/owner/employees/update-employee/${employee.employeeId}`;
        }}
        onDelete={(id) => {
          setEmployees(prev => prev.filter(emp => emp.employeeId !== id));
        }}
        onStatusChange={(id, status) => {
          setEmployees(prev => prev.map(emp => 
            emp.employeeId === id 
              ? { ...emp, employmentStatus: status as any, updatedAt: new Date().toISOString() } 
              : emp
          ));
        }}
      />

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Use Bulk Import for adding multiple employees. Download the template CSV file first.
        </Typography>
      </Alert>

      {/* Bulk Import Modal */}
      <BulkImportModal
        open={importModalOpen}
        employees={employees}
      />
    </div>
  );
};

export default EmployeeMainArea;