"use client";

import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  AvatarGroup,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  Button
} from "@mui/material";
import {
  People,
  ArrowUpward,
  ArrowDownward,
  Warning,
  CheckCircle,
  Info,
  CalendarMonth,
  Download
} from "@mui/icons-material";
import { ILeaveRequest } from "./LeaveRequestsPanel";

interface TeamLeaveOverviewProps {
  requests: ILeaveRequest[];
}

interface TeamStats {
  department: string;
  totalEmployees: number;
  onLeave: number;
  pendingRequests: number;
  approvalRate: number;
  avgLeaveDays: number;
  upcomingLeaves: number;
  teamLead: string;
}

const TeamLeaveOverview: React.FC<TeamLeaveOverviewProps> = ({ requests }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // Calculate team statistics
  const departments = Array.from(new Set(requests.map(r => r.department)));
  
  const teamStats: TeamStats[] = departments.map(dept => {
    const deptRequests = requests.filter(r => r.department === dept);
    const approvedRequests = deptRequests.filter(r => r.status === 'approved').length;
    const pendingRequests = deptRequests.filter(r => r.status === 'pending').length;
    const totalRequests = deptRequests.length;
    
    // Mock data for team size and upcoming leaves
    const mockTeamSize = Math.floor(Math.random() * 20) + 10;
    const mockOnLeave = deptRequests.filter(r => 
      r.status === 'approved' && 
      new Date(r.startDate) <= new Date() && 
      new Date(r.endDate) >= new Date()
    ).length;
    
    const mockUpcomingLeaves = deptRequests.filter(r => 
      r.status === 'approved' && 
      new Date(r.startDate) > new Date()
    ).length;

    return {
      department: dept,
      totalEmployees: mockTeamSize,
      onLeave: mockOnLeave,
      pendingRequests,
      approvalRate: totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0,
      avgLeaveDays: deptRequests.length > 0 
        ? deptRequests.reduce((sum, r) => sum + r.totalDays, 0) / deptRequests.length 
        : 0,
      upcomingLeaves: mockUpcomingLeaves,
      teamLead: `Lead ${dept.charAt(0)}`
    };
  });

  const getCriticalityColor = (onLeave: number, totalEmployees: number) => {
    const percentage = (onLeave / totalEmployees) * 100;
    if (percentage > 30) return 'error';
    if (percentage > 15) return 'warning';
    return 'success';
  };

  const getApprovalRateColor = (rate: number) => {
    if (rate > 80) return 'success';
    if (rate > 60) return 'warning';
    return 'error';
  };

  const handleDepartmentSelect = (dept: string) => {
    setSelectedDepartment(dept === selectedDepartment ? null : dept);
  };

  const selectedDeptRequests = selectedDepartment 
    ? requests.filter(r => r.department === selectedDepartment)
    : [];

  return (
    <Box>
      {/* Team Statistics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {teamStats.map((team) => (
          <Grid item xs={12} md={6} lg={4} key={team.department}>
            <Paper 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                border: selectedDepartment === team.department ? 2 : 1,
                borderColor: selectedDepartment === team.department ? 'primary.main' : 'divider',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => handleDepartmentSelect(team.department)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6">{team.department}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {team.teamLead} • {team.totalEmployees} members
                  </Typography>
                </Box>
                
                <Chip
                  label={`${team.onLeave}/${team.totalEmployees}`}
                  color={getCriticalityColor(team.onLeave, team.totalEmployees)}
                  size="small"
                  icon={team.onLeave > 0 ? <Warning /> : <CheckCircle />}
                />
              </Box>
              
              {/* Progress bars */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">On Leave</Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {team.onLeave} ({((team.onLeave / team.totalEmployees) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(team.onLeave / team.totalEmployees) * 100}
                  color={getCriticalityColor(team.onLeave, team.totalEmployees)}
                  sx={{ mb: 2, height: 6, borderRadius: 3 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Approval Rate</Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {team.approvalRate.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={team.approvalRate}
                  color={getApprovalRateColor(team.approvalRate) as any}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              
              {/* Quick Stats */}
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Pending</Typography>
                    <Typography variant="h6" color="warning.main">
                      {team.pendingRequests}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Upcoming</Typography>
                    <Typography variant="h6" color="info.main">
                      {team.upcomingLeaves}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Selected Department Details */}
      {selectedDepartment && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {selectedDepartment} Team Details
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              size="small"
              onClick={() => console.log("Export department data")}
            >
              Export Report
            </Button>
          </Box>

          {/* Current Leaves */}
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People /> Currently on Leave
          </Typography>
          
          {selectedDeptRequests.filter(r => 
            r.status === 'approved' && 
            new Date(r.startDate) <= new Date() && 
            new Date(r.endDate) >= new Date()
          ).length > 0 ? (
            <AvatarGroup max={8} sx={{ mb: 3 }}>
              {selectedDeptRequests
                .filter(r => r.status === 'approved' && new Date(r.startDate) <= new Date() && new Date(r.endDate) >= new Date())
                .map((req, idx) => (
                  <Tooltip key={idx} title={`${req.employeeName} - ${req.leaveType} (${req.totalDays} days)`}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {req.employeeName.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
            </AvatarGroup>
          ) : (
            <Alert severity="success" sx={{ mb: 3 }}>
              No team members are currently on leave.
            </Alert>
          )}

          {/* Pending Requests Table */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning /> Pending Approval
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Applied On</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDeptRequests
                  .filter(r => r.status === 'pending')
                  .map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {req.employeeName.charAt(0)}
                          </Avatar>
                          {req.employeeName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={req.leaveTypeCode}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {req.totalDays} days
                      </TableCell>
                      <TableCell>
                        {new Date(req.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => console.log("Approve:", req.id)}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => console.log("Reject:", req.id)}
                            >
                              <Warning fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Upcoming Leaves */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonth /> Upcoming Leaves (Next 30 Days)
          </Typography>
          
          <Grid container spacing={2}>
            {selectedDeptRequests
              .filter(r => 
                r.status === 'approved' && 
                new Date(r.startDate) > new Date() && 
                new Date(r.startDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              )
              .map((req, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {req.employeeName}
                      </Typography>
                      <Chip
                        label={req.leaveTypeCode}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {req.totalDays} days • {req.reason}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Paper>
      )}

      {/* Summary Stats */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Overall Team Leave Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {teamStats.reduce((sum, team) => sum + team.totalEmployees, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Employees
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {teamStats.reduce((sum, team) => sum + team.pendingRequests, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Pending
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {teamStats.reduce((sum, team) => sum + team.onLeave, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Currently on Leave
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {(teamStats.reduce((sum, team) => sum + team.approvalRate, 0) / teamStats.length).toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average Approval Rate
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TeamLeaveOverview;