// app/hr/salary-slip/EmployeeSalarySearch.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  Paper,
  Avatar,
  Divider
} from "@mui/material";
import { Search, Person, Work, AttachMoney } from "@mui/icons-material";
import { IEmployeeSalaryInfo } from "./SalarySlipTypes";

interface EmployeeSalarySearchProps {
  employees: IEmployeeSalaryInfo[];
  onSelect: (employee: IEmployeeSalaryInfo) => void;
}

const EmployeeSalarySearch: React.FC<EmployeeSalarySearchProps> = ({
  employees,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<IEmployeeSalaryInfo[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees.slice(0, 5));
    } else {
      const filtered = employees.filter(emp =>
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered.slice(0, 10));
    }
  }, [searchTerm, employees]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        freeSolo
        options={filteredEmployees}
        getOptionLabel={(option) => 
          typeof option === 'string' ? option : 
          `${option.employeeName} (${option.employeeCode}) - ${option.department}`
        }
        onInputChange={(event, newValue) => {
          setSearchTerm(newValue);
        }}
        onChange={(event, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            onSelect(newValue);
            setSearchTerm("");
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search employee by name, code, or department..."
            variant="outlined"
            size="medium"
            InputProps={{
              ...params.InputProps,
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        )}
        renderOption={(props, employee) => (
          <li {...props}>
            <Paper sx={{ p: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {employee.employeeName.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {employee.employeeName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                    <Chip
                      label={employee.employeeCode}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={employee.department}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={employee.designation}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Salary Grade
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {employee.salaryGrade.name}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                    {formatCurrency(employee.grossSalary)}/month
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Work fontSize="small" color="action" />
                  <Typography variant="caption">
                    {employee.salaryGrade.components.length} components
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney fontSize="small" color="action" />
                  <Typography variant="caption">
                    CTC: {formatCurrency(employee.ctc)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </li>
        )}
        sx={{
          '& .MuiAutocomplete-popper': {
            width: '100% !important'
          }
        }}
      />
      
      {/* Quick Stats */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Chip
          icon={<Person />}
          label={`${employees.length} Employees`}
          variant="outlined"
          size="small"
        />
        <Chip
          icon={<Work />}
          label={`${new Set(employees.map(e => e.department)).size} Departments`}
          variant="outlined"
          size="small"
        />
        <Chip
          icon={<AttachMoney />}
          label={`${new Set(employees.map(e => e.salaryGradeId)).size} Salary Grades`}
          variant="outlined"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default EmployeeSalarySearch;