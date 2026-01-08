// SalaryGradeMainArea.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  AttachMoney,
  Add,
  TrendingUp,
  Group,
  Settings,
  Download,
  ContentCopy,
  HelpOutline
} from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";

// Import components
import SalaryGradeTable from "./SalaryGradeTable";
import AddEditSalaryGrade from "./AddEditSalaryGrade";
import { ISalaryGrade, ISalaryGradeForm, calculateMonthlyGross, calculateTotalCTC } from "./SalaryGradeTypes";

// Mock data generator
const generateMockSalaryGrades = (): ISalaryGrade[] => [
  {
    id: "SG001",
    name: "Grade A - Executive",
    code: "EXEC-A",
    description: "Executive level salary grade with comprehensive benefits",
    components: [
      { id: "1", name: "Basic Salary", calculationType: "Percentage", calculated: "Monthly", value: 50, order: 1, isActive: true },
      { id: "2", name: "House Rent Allowance", calculationType: "Percentage", calculated: "Monthly", value: 50, order: 2, isActive: true },
      { id: "3", name: "Leave Travel Allowance", calculationType: "Flat", calculated: "Monthly", value: 5000, order: 3, isActive: true },
      { id: "4", name: "Medical Allowance", calculationType: "Flat", calculated: "Monthly", value: 6000, order: 4, isActive: true },
      { id: "5", name: "Special Allowance", calculationType: "Flat", calculated: "Monthly", value: 8000, order: 5, isActive: true }
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
  {
    id: "SG002",
    name: "Grade B - Manager",
    code: "MGR-B",
    description: "Manager level salary grade",
    components: [
      { id: "1", name: "Basic Salary", calculationType: "Percentage", calculated: "Monthly", value: 48, order: 1, isActive: true },
      { id: "2", name: "House Rent Allowance", calculationType: "Percentage", calculated: "Monthly", value: 48, order: 2, isActive: true },
      { id: "3", name: "ESIC", calculationType: "Flat", calculated: "Monthly", value: 500, order: 3, isActive: true },
      { id: "4", name: "Professional Tax", calculationType: "Flat", calculated: "Monthly", value: 200, order: 4, isActive: true }
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
  {
    id: "SG003",
    name: "Grade C - Associate",
    code: "ASSC-C",
    description: "Associate level salary grade",
    components: [
      { id: "1", name: "Basic Salary", calculationType: "Percentage", calculated: "Monthly", value: 45, order: 1, isActive: true },
      { id: "2", name: "House Rent Allowance", calculationType: "Percentage", calculated: "Monthly", value: 45, order: 2, isActive: true },
      { id: "3", name: "Statutory Bonus", calculationType: "Flat", calculated: "Monthly", value: 1000, order: 3, isActive: true }
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
  {
    id: "SG004",
    name: "Grade D - Intern",
    code: "INT-D",
    description: "Intern level salary grade",
    components: [
      { id: "1", name: "Basic Salary", calculationType: "Flat", calculated: "Monthly", value: 20000, order: 1, isActive: true },
      { id: "2", name: "Stipend", calculationType: "Flat", calculated: "Monthly", value: 5000, order: 2, isActive: true }
    ],
    totalCTC: 300000,
    monthlyGross: 25000,
    annualGross: 300000,
    isActive: false,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-20T16:45:00Z",
    createdBy: "HR",
    updatedBy: "Admin"
  }
];

const SalaryGradeMainArea: React.FC = () => {
  // State
  const [grades, setGrades] = useState<ISalaryGrade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<ISalaryGrade | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<string | null>(null);

  // Load mock data
  useEffect(() => {
    setGrades(generateMockSalaryGrades());
  }, []);

  // Calculate statistics
  const stats = {
    totalGrades: grades.length,
    activeGrades: grades.filter(g => g.isActive).length,
    totalComponents: grades.reduce((sum, grade) => sum + grade.components.length, 0),
    avgCTC: grades.reduce((sum, grade) => sum + grade.totalCTC, 0) / (grades.length || 1)
  };

  // Handlers
  const handleAddNew = () => {
    setSelectedGrade(undefined);
    setViewMode('add');
  };

  const handleEdit = (grade: ISalaryGrade) => {
    setSelectedGrade(grade);
    setViewMode('edit');
  };

  const handleDelete = (id: string) => {
    setGradeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (gradeToDelete) {
      setGrades(prev => prev.filter(grade => grade.id !== gradeToDelete));
      toast.success('Salary grade deleted successfully');
      setDeleteDialogOpen(false);
      setGradeToDelete(null);
    }
  };

  const handleView = (grade: ISalaryGrade) => {
    // Show grade details
    console.log('View grade:', grade);
    toast.info(`Viewing ${grade.name} details`);
  };

  const handleDuplicate = (grade: ISalaryGrade) => {
    const newGrade: ISalaryGrade = {
      ...grade,
      id: `SG${Date.now()}`,
      name: `${grade.name} (Copy)`,
      code: `${grade.code}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGrades(prev => [...prev, newGrade]);
    toast.success('Salary grade duplicated successfully');
  };

  const handleStatusChange = (id: string, status: boolean) => {
    setGrades(prev => prev.map(grade =>
      grade.id === id ? { ...grade, isActive: status, updatedAt: new Date().toISOString() } : grade
    ));
    toast.success(`Grade ${status ? 'activated' : 'deactivated'} successfully`);
  };

  const handleSaveGrade = async (data: ISalaryGradeForm) => {
    // Add temporary IDs for calculation
    const componentsWithIds = data.components.map((comp, idx) => ({
      ...comp,
      id: `comp-${Date.now()}-${idx}`
    }));

    // Calculate totals
    const monthlyGross = calculateMonthlyGross(componentsWithIds);
    const totalCTC = calculateTotalCTC(componentsWithIds);

    const newGrade: ISalaryGrade = {
      id: viewMode === 'add' ? `SG${Date.now()}` : selectedGrade!.id,
      name: data.name,
      code: data.code,
      description: data.description,
      components: componentsWithIds.map((comp, idx) => ({
        ...comp,
        order: idx + 1
      })),
      totalCTC,
      monthlyGross,
      annualGross: totalCTC,
      isActive: data.isActive,
      createdAt: viewMode === 'add' ? new Date().toISOString() : selectedGrade!.createdAt,
      updatedAt: new Date().toISOString(),
      createdBy: viewMode === 'add' ? 'Admin' : selectedGrade!.createdBy,
      updatedBy: 'Admin'
    };

    if (viewMode === 'add') {
      setGrades(prev => [...prev, newGrade]);
    } else {
      setGrades(prev => prev.map(grade =>
        grade.id === selectedGrade!.id ? newGrade : grade
      ));
    }

    setViewMode('list');
    return Promise.resolve();
  };

  const handleExport = () => {
    // Export functionality
    const csvContent = [
      ['Grade Name', 'Code', 'Status', 'Total CTC', 'Monthly Gross', 'Components'],
      ...grades.map(grade => [
        grade.name,
        grade.code,
        grade.isActive ? 'Active' : 'Inactive',
        grade.totalCTC.toString(),
        grade.monthlyGross.toString(),
        grade.components.map(c => c.name).join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary_grades_export.csv';
    a.click();

    toast.success('Salary grades exported successfully');
  };

  // Render based on view mode
  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <AddEditSalaryGrade
        grade={selectedGrade}
        mode={viewMode}
        onSave={handleSaveGrade}
      />
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
            <li className="breadcrumb-item active">Salary Grades</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            size="small"
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNew}
            size="small"
            className="!text-white"
          >
            New Salary Grade
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
              Salary Grade Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Define and manage salary structures for different employee levels
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
                  <Typography variant="h4">{stats.totalGrades}</Typography>
                  <Typography variant="caption" color="text.secondary">Total Grades</Typography>
                </Box>
                <Settings sx={{ fontSize: 40, color: 'primary.light' }} />
              </Box>
              <Chip
                label={`${stats.activeGrades} Active`}
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
                  <Typography variant="h4">{stats.totalComponents}</Typography>
                  <Typography variant="caption" color="text.secondary">Total Components</Typography>
                </Box>
                <Group sx={{ fontSize: 40, color: 'info.light' }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Across all grades
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
                    ₹{(stats.avgCTC / 100000).toFixed(1)}L
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Avg. CTC</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'success.light' }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Per annum
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">4</Typography>
                  <Typography variant="caption" color="text.secondary">Usage Levels</Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'warning.light' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                <Chip label="Executive" size="small" />
                <Chip label="Manager" size="small" />
                <Chip label="Associate" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Salary grades define the structure of employee compensation.
          Each grade can have multiple components with different calculation types.
        </Typography>
      </Alert>

      {/* Main Table */}
      <SalaryGradeTable
        data={grades}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDuplicate={handleDuplicate}
        onStatusChange={handleStatusChange}
      />

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
            <HelpOutline sx={{ color: 'info.main' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
              Best Practices for Salary Grades
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
              <li>
                <Typography variant="body2">
                  <strong>Consistent Structure:</strong> Maintain similar component structures across grades for easy comparison
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Clear Naming:</strong> Use descriptive names like
                  &nbsp;&quot;Grade A - Executive&quot;, &quot;Grade B - Manager&quot;
                </Typography>

              </li>
              <li>
                <Typography variant="body2">
                  <strong>Tax Optimization:</strong> Structure components to maximize tax benefits for employees
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Regular Reviews:</strong> Review and update salary grades annually for market competitiveness
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Documentation:</strong> Add descriptions to explain the purpose and usage of each grade
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Compliance:</strong> Ensure all statutory components are included in appropriate grades
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Salary Grade</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this salary grade? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Deleting this grade will affect any employees currently assigned to it.
              Consider deactivating the grade instead.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SalaryGradeMainArea;