"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Card,
  CardContent,
  Avatar,
  Alert
} from "@mui/material";
import {
  Search,
  FilterList,
  Download,
  Refresh,
  Visibility,
  TrendingUp,
  TrendingDown,
  Person,
  CalendarMonth
} from "@mui/icons-material";
import { ILeaveBalance } from "./LeaveTypes";

interface LeaveBalancesProps {
  balances?: ILeaveBalance[];
  onExport?: (data: ILeaveBalance[]) => void;
  onRefresh?: () => void;
  onViewDetails?: (balance: ILeaveBalance) => void;
}

const LeaveBalances: React.FC<LeaveBalancesProps> = ({
  balances = [],
  onExport,
  onRefresh,
  onViewDetails
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<ILeaveBalance | null>(null);

  const departmentOptions = useMemo(() => {
    const depts = Array.from(new Set(balances.map(b => b.department)));
    return [{ label: "All Departments", value: "All" }, ...depts.map(dept => ({ label: dept, value: dept }))];
  }, [balances]);

  const filteredBalances = useMemo(() => {
    let filtered = [...balances];
    
    if (searchQuery) {
      filtered = filtered.filter(balance =>
        balance.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        balance.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterDepartment !== "All") {
      filtered = filtered.filter(balance => balance.department === filterDepartment);
    }
    
    return filtered;
  }, [balances, searchQuery, filterDepartment]);

  const getUtilizationPercentage = (balance: ILeaveBalance) => {
    const total = balance.annualLeave.total + balance.sickLeave.total + balance.casualLeave.total;
    const used = balance.annualLeave.used + balance.sickLeave.used + balance.casualLeave.used;
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage < 50) return 'success';
    if (percentage < 80) return 'warning';
    return 'error';
  };

  const handleViewDetails = (balance: ILeaveBalance) => {
    setSelectedBalance(balance);
    setDetailDialogOpen(true);
    onViewDetails?.(balance);
  };

  const handleExport = () => {
    onExport?.(filteredBalances);
  };

  const calculateSummary = () => {
    const totalEmployees = filteredBalances.length;
    const totalAnnualBalance = filteredBalances.reduce((sum, b) => sum + b.annualLeave.balance, 0);
    const totalSickBalance = filteredBalances.reduce((sum, b) => sum + b.sickLeave.balance, 0);
    const totalPending = filteredBalances.reduce((sum, b) => sum + b.annualLeave.pending, 0);
    const avgUtilization = filteredBalances.length > 0 
      ? filteredBalances.reduce((sum, b) => sum + getUtilizationPercentage(b), 0) / filteredBalances.length
      : 0;
    
    return {
      totalEmployees,
      totalAnnualBalance,
      totalSickBalance,
      totalPending,
      avgUtilization
    };
  };

  const summary = calculateSummary();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonth /> Leave Balances
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={onRefresh}
              size="small"
            >
              Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
              size="small"
            >
              Export
            </Button>
          </Box>
        </Box>
        
        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{summary.totalEmployees}</Typography>
                <Typography variant="caption" color="text.secondary">Total Employees</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderColor: 'success.main', border: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {summary.totalAnnualBalance}
                </Typography>
                <Typography variant="caption" color="text.secondary">Total Annual Balance</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderColor: 'info.main', border: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {summary.totalSickBalance}
                </Typography>
                <Typography variant="caption" color="text.secondary">Total Sick Balance</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderColor: getUtilizationColor(summary.avgUtilization), border: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color={getUtilizationColor(summary.avgUtilization)}>
                  {Math.round(summary.avgUtilization)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">Avg Utilization</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by employee name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Autocomplete
              fullWidth
              size="small"
              options={departmentOptions}
              value={departmentOptions.find(opt => opt.value === filterDepartment) || null}
              onChange={(event, newValue) => {
                setFilterDepartment(newValue?.value || "All");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department"
                  placeholder="Select department"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchQuery("");
                setFilterDepartment("All");
              }}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Leave Balances Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Employee</TableCell>
              <TableCell align="center">Annual Leave</TableCell>
              <TableCell align="center">Sick Leave</TableCell>
              <TableCell align="center">Casual Leave</TableCell>
              <TableCell align="center">Pending</TableCell>
              <TableCell align="center">Utilization</TableCell>
              <TableCell align="center">Last Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {filteredBalances.map((balance) => {
              const utilization = getUtilizationPercentage(balance);
              const utilizationColor = getUtilizationColor(utilization);
              
              return (
                <TableRow key={balance.employeeId} hover>
                  {/* Employee */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {balance.employeeName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {balance.employeeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {balance.department} • {balance.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {/* Annual Leave */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {balance.annualLeave.balance}/{balance.annualLeave.total}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {balance.annualLeave.used} used
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Sick Leave */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {balance.sickLeave.balance}/{balance.sickLeave.total}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {balance.sickLeave.used} used
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Casual Leave */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {balance.casualLeave.balance}/{balance.casualLeave.total}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {balance.casualLeave.used} used
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Pending */}
                  <TableCell align="center">
                    {balance.annualLeave.pending > 0 ? (
                      <Chip
                        label={`${balance.annualLeave.pending} pending`}
                        color="warning"
                        size="small"
                      />
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  
                  {/* Utilization */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: '100%', maxWidth: 100 }}>
                        <LinearProgress
                          variant="determinate"
                          value={utilization}
                          color={utilizationColor}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="caption" color={utilizationColor}>
                        {utilization}%
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Last Updated */}
                  <TableCell align="center">
                    <Typography variant="caption">
                      {new Date(balance.lastUpdated).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(balance)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredBalances.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>
            No leave balances found for the selected filters.
          </Typography>
        </Alert>
      )}

      {/* Balance Details Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedBalance && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 40, height: 40 }}>
                  {selectedBalance.employeeName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedBalance.employeeName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedBalance.department} • {selectedBalance.employeeId}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Annual Leave */}
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom color="success.main">
                      Annual Leave
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Total</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedBalance.annualLeave.total} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Used</Typography>
                      <Typography variant="body2" color="error">
                        {selectedBalance.annualLeave.used} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Balance</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedBalance.annualLeave.balance} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Pending</Typography>
                      <Chip
                        label={`${selectedBalance.annualLeave.pending} pending`}
                        color="warning"
                        size="small"
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Sick Leave */}
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom color="info.main">
                      Sick Leave
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Total</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedBalance.sickLeave.total} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Used</Typography>
                      <Typography variant="body2" color="error">
                        {selectedBalance.sickLeave.used} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Balance</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedBalance.sickLeave.balance} days
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Casual Leave */}
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom color="primary.main">
                      Casual Leave
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Total</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedBalance.casualLeave.total} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Used</Typography>
                      <Typography variant="body2" color="error">
                        {selectedBalance.casualLeave.used} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Balance</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedBalance.casualLeave.balance} days
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Maternity/Paternity Leave */}
                {selectedBalance.maternityLeave && (
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom color="secondary.main">
                        Maternity Leave
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption">Total</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedBalance.maternityLeave.total} days
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption">Used</Typography>
                        <Typography variant="body2" color="error">
                          {selectedBalance.maternityLeave.used} days
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Balance</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedBalance.maternityLeave.balance} days
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )}
                
                {/* Unpaid Leave */}
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Unpaid Leave
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Used</Typography>
                      <Typography variant="body2" color="error">
                        {selectedBalance.unpaidLeave.used} days
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Utilization Summary */}
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Leave Utilization Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" display="block" gutterBottom>
                          Annual Leave Utilization
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(selectedBalance.annualLeave.used / selectedBalance.annualLeave.total) * 100}
                          color={selectedBalance.annualLeave.used / selectedBalance.annualLeave.total > 0.8 ? "error" : "success"}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {selectedBalance.annualLeave.used}/{selectedBalance.annualLeave.total} days
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" display="block" gutterBottom>
                          Overall Utilization
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getUtilizationPercentage(selectedBalance)}
                          color={getUtilizationColor(getUtilizationPercentage(selectedBalance))}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {getUtilizationPercentage(selectedBalance)}% utilized
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                {/* Last Updated */}
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated: {new Date(selectedBalance.lastUpdated).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default LeaveBalances;