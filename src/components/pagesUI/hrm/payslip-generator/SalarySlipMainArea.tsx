// app/hr/salary-slip/SalarySlipMainArea.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  AttachMoney,
  Description,
  Download,
  PictureAsPdf,
  Print,
  Mail,
  History,
  People,
  CalendarMonth,
  Calculate,
  Visibility
} from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";

// Import components
import SalarySlipGenerator from "./SalarySlipGenerator";
import SalarySlipList from "./SalarySlipList";
import SalarySlipHistory from "./SalarySlipHistory";
import EmployeeSalarySearch from "./EmployeeSalarySearch";
import { IEmployeeSalaryInfo } from "./SalarySlipTypes";

// Mock data
const generateMockEmployees = (): IEmployeeSalaryInfo[] => [
  {
    id: "EMP001",
    employeeId: "E001",
    employeeName: "Mainak Mukherjee",
    employeeCode: "EMP001",
    department: "Engineering",
    designation: "Data Analyst I",
    dateOfJoining: "2023-01-15",
    bankAccount: "XXXXXX1234",
    bankName: "Union Bank of India",
    bankIFSC: "HDFC0001234",
    panNumber: "ABCDE1234F",
    uanNumber: "100123456789",
    salaryGradeId: "SG001",
    salaryGrade: {
      id: "SG001",
      name: "Grade A - Executive",
      code: "EXEC-A",
      description: "Executive level salary grade",
      components: [
        { id: "1", name: "Basic Salary", calculationType: "Percentage", calculated: "Monthly", value: 50, order: 1, isActive: true },
        { id: "2", name: "House Rent Allowance", calculationType: "Percentage", calculated: "Monthly", value: 50, order: 2, isActive: true },
        { id: "3", name: "Leave Travel Allowance", calculationType: "Flat", calculated: "Monthly", value: 5000, order: 3, isActive: true },
        { id: "4", name: "Medical Allowance", calculationType: "Flat", calculated: "Monthly", value: 6000, order: 4, isActive: true },
        { id: "5", name: "Special Allowance", calculationType: "Flat", calculated: "Monthly", value: 8000, order: 5, isActive: true },
        { id: "6", name: "Provident Fund", calculationType: "Percentage", calculated: "Monthly", value: 12, order: 6, isActive: true },
        { id: "7", name: "Professional Tax", calculationType: "Flat", calculated: "Monthly", value: 200, order: 7, isActive: true },
        { id: "8", name: "ESIC", calculationType: "Percentage", calculated: "Monthly", value: 0.75, order: 8, isActive: true }
      ],
      totalCTC: 1200000,
      monthlyGross: 100000,
      annualGross: 1200000,
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      createdBy: "Admin",
      updatedBy: "Admin"
    },
    basicSalary: 50000,
    grossSalary: 100000,
    ctc: 1200000
  },
  {
    id: "EMP002",
    employeeId: "E002",
    employeeName: "Priya Verma",
    employeeCode: "EMP002",
    department: "HR",
    designation: "HR Manager",
    dateOfJoining: "2022-03-10",
    bankAccount: "XXXXXX5678",
    bankName: "ICICI Bank",
    bankIFSC: "ICIC0005678",
    panNumber: "XYZAB5678C",
    uanNumber: "100987654321",
    salaryGradeId: "SG002",
    salaryGrade: {
      id: "SG002",
      name: "Grade B - Manager",
      code: "MGR-B",
      description: "Manager level salary grade",
      components: [
        { id: "1", name: "Basic Salary", calculationType: "Percentage", calculated: "Monthly", value: 48, order: 1, isActive: true },
        { id: "2", name: "House Rent Allowance", calculationType: "Percentage", calculated: "Monthly", value: 48, order: 2, isActive: true },
        { id: "3", name: "Leave Travel Allowance", calculationType: "Flat", calculated: "Monthly", value: 4000, order: 3, isActive: true },
        { id: "4", name: "Medical Allowance", calculationType: "Flat", calculated: "Monthly", value: 5000, order: 4, isActive: true },
        { id: "5", name: "Provident Fund", calculationType: "Percentage", calculated: "Monthly", value: 12, order: 5, isActive: true },
        { id: "6", name: "Professional Tax", calculationType: "Flat", calculated: "Monthly", value: 200, order: 6, isActive: true }
      ],
      totalCTC: 900000,
      monthlyGross: 75000,
      annualGross: 900000,
      isActive: true,
      createdAt: "2024-01-10T14:20:00Z",
      updatedAt: "2024-01-12T11:15:00Z",
      createdBy: "Admin",
      updatedBy: "HR"
    },
    basicSalary: 36000,
    grossSalary: 75000,
    ctc: 900000
  },
  {
    id: "EMP003",
    employeeId: "E003",
    employeeName: "Amit Patel",
    employeeCode: "EMP003",
    department: "Sales",
    designation: "Sales Executive",
    dateOfJoining: "2023-06-20",
    bankAccount: "XXXXXX9012",
    bankName: "Axis Bank",
    bankIFSC: "UTIB0009012",
    panNumber: "PQRST9012U",
    uanNumber: "100456789123",
    salaryGradeId: "SG003",
    salaryGrade: {
      id: "SG003",
      name: "Grade C - Associate",
      code: "ASSC-C",
      description: "Associate level salary grade",
      components: [
        { id: "1", name: "Basic Salary", calculationType: "Percentage", calculated: "Monthly", value: 45, order: 1, isActive: true },
        { id: "2", name: "House Rent Allowance", calculationType: "Percentage", calculated: "Monthly", value: 45, order: 2, isActive: true },
        { id: "3", name: "Special Allowance", calculationType: "Flat", calculated: "Monthly", value: 3000, order: 3, isActive: true },
        { id: "4", name: "Provident Fund", calculationType: "Percentage", calculated: "Monthly", value: 12, order: 4, isActive: true },
        { id: "5", name: "Professional Tax", calculationType: "Flat", calculated: "Monthly", value: 200, order: 5, isActive: true }
      ],
      totalCTC: 600000,
      monthlyGross: 50000,
      annualGross: 600000,
      isActive: true,
      createdAt: "2024-01-05T09:15:00Z",
      updatedAt: "2024-01-05T09:15:00Z",
      createdBy: "HR",
      updatedBy: "HR"
    },
    basicSalary: 22500,
    grossSalary: 50000,
    ctc: 600000
  }
];

const SalarySlipMainArea: React.FC = () => {
  const [viewMode, setViewMode] = useState<'generator' | 'list' | 'history'>('generator');
  const [employees, setEmployees] = useState<IEmployeeSalaryInfo[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployeeSalaryInfo | null>(null);
  const [generatedSlips, setGeneratedSlips] = useState<any[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Load mock data
  useEffect(() => {
    setEmployees(generateMockEmployees());
    // Load generated slips from localStorage
    const savedSlips = localStorage.getItem('salarySlips');
    if (savedSlips) {
      setGeneratedSlips(JSON.parse(savedSlips));
    }
  }, []);

  // Stats
  const stats = {
    totalEmployees: employees.length,
    pendingPayslips: 3,
    processedThisMonth: 45,
    totalAmount: 4500000
  };

  // Handle employee selection
  const handleEmployeeSelect = (employee: IEmployeeSalaryInfo) => {
    setSelectedEmployee(employee);
    setViewMode('generator');
    toast.success(`Selected ${employee.employeeName} for salary slip generation`);
  };

  // Handle slip generation
  const handleSlipGenerated = (slipData: any) => {
    const newSlips = [...generatedSlips, slipData];
    setGeneratedSlips(newSlips);
    localStorage.setItem('salarySlips', JSON.stringify(newSlips));
    toast.success('Salary slip generated successfully!');
  };

  // Handle bulk action
  const handleBulkGenerate = () => {
    toast.info('Bulk generation feature will be available soon');
  };

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/hr">HR Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Salary Slip Generator</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() => setViewMode('history')}
            size="small"
          >
            History
          </Button>
          <Button
            variant="outlined"
            startIcon={<People />}
            onClick={handleBulkGenerate}
            size="small"
          >
            Bulk Generate
          </Button>
          <Button
            variant="contained"
            startIcon={<Description />}
            onClick={() => setViewMode('generator')}
            size="small"
            className="!text-white"
          >
            New Slip
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
            <AttachMoney sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Salary Slip Generator
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and manage employee salary slips with PDF export
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{stats.totalEmployees}</Typography>
                  <Typography variant="caption" color="text.secondary">Total Employees</Typography>
                </Box>
                <People sx={{ fontSize: 40, color: 'primary.light' }} />
              </Box>
              <Chip
                label="Ready for processing"
                size="small"
                color="success"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{stats.pendingPayslips}</Typography>
                  <Typography variant="caption" color="text.secondary">Pending Slips</Typography>
                </Box>
                <Description sx={{ fontSize: 40, color: 'warning.light' }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                For current month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">
                    ₹{(stats.totalAmount / 100000).toFixed(1)}L
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Total Salary</Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'success.light' }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{stats.processedThisMonth}</Typography>
                  <Typography variant="caption" color="text.secondary">Processed</Typography>
                </Box>
                <Calculate sx={{ fontSize: 40, color: 'info.light' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                <Chip label="PDF" size="small" />
                <Chip label="Print" size="small" />
                <Chip label="Email" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Search Bar */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <EmployeeSalarySearch
          employees={employees}
          onSelect={handleEmployeeSelect}
        />
      </Paper>

      {/* Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Select an employee to generate salary slip. The system will automatically fetch salary grade details and calculate components based on attendance.
        </Typography>
      </Alert>

      {/* Main Content */}
      {viewMode === 'generator' && selectedEmployee && (
        <SalarySlipGenerator
          employee={selectedEmployee}
          onSlipGenerated={handleSlipGenerated}
        />
      )}

      {viewMode === 'generator' && !selectedEmployee && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Description sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Select an employee to generate salary slip
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the search bar above or view recent slips below
          </Typography>
        </Box>
      )}

      {viewMode === 'list' && (
        <SalarySlipList slips={generatedSlips} />
      )}

      {viewMode === 'history' && (
        <SalarySlipHistory slips={generatedSlips} />
      )}

      {/* Recent Generated Slips (Mini Preview) */}
      {viewMode === 'generator' && generatedSlips.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Recently Generated Slips
          </Typography>
          <Grid container spacing={2}>
            {generatedSlips.slice(-3).map((slip, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {slip.employeeInfo.employeeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {slip.calculation.month} {slip.calculation.year}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Net Salary: ₹{slip.calculation.netSalary.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => {
                          // Preview slip
                          toast.info(`Previewing ${slip.employeeInfo.employeeName}'s slip`);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={() => {
                          // Download slip
                          toast.success('Download started');
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Tips Section */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.50', borderColor: 'info.light' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'info.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Calculate sx={{ color: 'info.main' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
              Salary Calculation Guidelines
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
              <li>
                <Typography variant="body2">
                  <strong>Working Days:</strong> System automatically calculates based on selected month
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>LOP Deduction:</strong> Basic salary deduction for unpaid leaves
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Overtime:</strong> Calculated at 2x hourly rate for extra hours
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Tax Calculation:</strong> TDS calculated based on annual projection
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Statutory Deductions:</strong> PF, ESIC calculated as per government norms
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Verification:</strong> Always verify calculations before finalizing
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default SalarySlipMainArea;