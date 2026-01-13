"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tabs,
  Tab,
  Paper,
  CircularProgress
} from "@mui/material";
import {
  Policy,
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Upload,
  Refresh,
  MoreVert,
  Settings,
  History,
  Assignment,
  CalendarMonth,
  Group,
  Warning,
  CheckCircle,
  Error
} from "@mui/icons-material";
import LeaveTypesManager from "./LeaveTypesManager";
import LeavePoliciesManager from "./LeavePoliciesManager";
import HolidayCalendar from "./HolidayCalendar";
import LeaveRulesEngine from "./LeaveRulesEngine";
import { ILeaveType, ILeavePolicy, IHoliday, DEFAULT_LEAVE_TYPES, createMockLeavePolicy } from "./LeavePolicyTypes";

const LeavePolicyMainArea: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [leaveTypes, setLeaveTypes] = useState<ILeaveType[]>(DEFAULT_LEAVE_TYPES);
  const [leavePolicies, setLeavePolicies] = useState<ILeavePolicy[]>([]);
  const [holidays, setHolidays] = useState<IHoliday[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      
      // Load mock data
      const mockPolicies = [
        createMockLeavePolicy({ id: 'POL001', name: 'Standard Policy' }),
        createMockLeavePolicy({ 
          id: 'POL002', 
          name: 'Executive Policy',
          description: 'Special policy for executives',
          priority: 2
        }),
        createMockLeavePolicy({ 
          id: 'POL003', 
          name: 'Probation Policy',
          description: 'Policy for probationary employees',
          applicableTo: { 
            employmentType: ['Full-time'], 
            departments: ['All'], 
            locations: ['All'], 
            designations: ['All'],
            tenure: { minMonths: 0, maxMonths: 6 }
          },
          priority: 3
        })
      ];

      const mockHolidays: IHoliday[] = [
        {
          id: 'HOL001',
          name: 'Republic Day',
          date: '2024-01-26',
          type: 'National',
          locations: ['All'],
          departments: ['All'],
          recurring: true,
          description: 'National holiday',
          createdAt: new Date().toISOString(),
          createdBy: 'System'
        },
        {
          id: 'HOL002',
          name: 'Holi',
          date: '2024-03-25',
          type: 'Regional',
          locations: ['All'],
          departments: ['All'],
          recurring: true,
          description: 'Festival of colors',
          createdAt: new Date().toISOString(),
          createdBy: 'System'
        }
      ];

      setLeavePolicies(mockPolicies);
      setHolidays(mockHolidays);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const tabs = [
    {
      label: "Leave Types",
      icon: <Assignment />,
      component: <LeaveTypesManager 
        leaveTypes={leaveTypes}
        onAddLeaveType={() => console.log("Add leave type")}
        onEditLeaveType={(id) => console.log("Edit leave type", id)}
        onDeleteLeaveType={(id) => {
          setLeaveTypes(prev => prev.filter(lt => lt.id !== id));
        }}
        onToggleActive={(id, active) => {
          setLeaveTypes(prev => prev.map(lt => 
            lt.id === id ? { ...lt, active, updatedAt: new Date().toISOString() } : lt
          ));
        }}
      />
    },
    {
      label: "Policies",
      icon: <Policy />,
      component: <LeavePoliciesManager 
        policies={leavePolicies}
        leaveTypes={leaveTypes}
        onAddPolicy={() => console.log("Add policy")}
        onEditPolicy={(id) => console.log("Edit policy", id)}
        onDeletePolicy={(id) => {
          setLeavePolicies(prev => prev.filter(p => p.id !== id));
        }}
        onToggleActive={(id, active) => {
          setLeavePolicies(prev => prev.map(p => 
            p.id === id ? { ...p, active, updatedAt: new Date().toISOString() } : p
          ));
        }}
      />
    },
    {
      label: "Holiday Calendar",
      icon: <CalendarMonth />,
      component: <HolidayCalendar 
        holidays={holidays}
        onAddHoliday={() => console.log("Add holiday")}
        onEditHoliday={(id) => console.log("Edit holiday", id)}
        onDeleteHoliday={(id) => {
          setHolidays(prev => prev.filter(h => h.id !== id));
        }}
      />
    },
    {
      label: "Rules Engine",
      icon: <Settings />,
      component: <LeaveRulesEngine />
    }
  ];

  const stats = {
    totalLeaveTypes: leaveTypes.length,
    activeLeaveTypes: leaveTypes.filter(lt => lt.active).length,
    totalPolicies: leavePolicies.length,
    activePolicies: leavePolicies.filter(p => p.active).length,
    totalHolidays: holidays.length,
    upcomingHolidays: holidays.filter(h => new Date(h.date) > new Date()).length
  };

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
              <Link href="/hr">HR Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Leave Policy Setup</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => console.log("Export policies")}
            size="small"
          >
            Export
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              if (activeTab === 0) console.log("Add leave type");
              else if (activeTab === 1) console.log("Add policy");
              else if (activeTab === 2) console.log("Add holiday");
            }}
            className="!text-white"
            size="small"
          >
            Add New
          </Button>
          
          <IconButton
            size="small"
            onClick={handleMenuOpen}
          >
            <MoreVert />
          </IconButton>
        </div>
      </div>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              <Policy sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Leave Policy Setup
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Define and manage leave types, policies, holidays, and rules
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip icon={<CheckCircle />} label={`${stats.activePolicies} Active Policies`} color="success" variant="outlined" />
            <Chip icon={<Warning />} label={`${stats.upcomingHolidays} Upcoming Holidays`} color="warning" variant="outlined" />
          </Box>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{stats.totalLeaveTypes}</Typography>
              <Typography variant="caption" color="text.secondary">Leave Types</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ borderColor: 'success.main', border: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">{stats.activeLeaveTypes}</Typography>
              <Typography variant="caption" color="text.secondary">Active Types</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{stats.totalPolicies}</Typography>
              <Typography variant="caption" color="text.secondary">Policies</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ borderColor: 'success.main', border: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">{stats.activePolicies}</Typography>
              <Typography variant="caption" color="text.secondary">Active Policies</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{stats.totalHolidays}</Typography>
              <Typography variant="caption" color="text.secondary">Holidays</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ borderColor: 'warning.main', border: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">{stats.upcomingHolidays}</Typography>
              <Typography variant="caption" color="text.secondary">Upcoming</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      <Box sx={{ mb: 3 }}>
        {leaveTypes.filter(lt => !lt.active).length > 0 && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>{leaveTypes.filter(lt => !lt.active).length} leave type(s) are inactive.</strong> 
              Employees cannot apply for these leave types.
            </Typography>
          </Alert>
        )}
        
        {leavePolicies.filter(p => new Date(p.effectiveFrom) > new Date()).length > 0 && (
          <Alert severity="info">
            <Typography variant="body2">
              <strong>{leavePolicies.filter(p => new Date(p.effectiveFrom) > new Date()).length} policy(s) scheduled for future.</strong>
              They will become active on their effective date.
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Main Content */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  py: 2,
                  minHeight: 64
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  iconPosition="start"
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2">{tab.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {index === 0 && `${stats.totalLeaveTypes} types`}
                        {index === 1 && `${stats.totalPolicies} policies`}
                        {index === 2 && `${stats.totalHolidays} holidays`}
                        {index === 3 && "Configure rules"}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabs[activeTab].component}
            </Box>
          </>
        )}
      </Paper>

      {/* Quick Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          console.log("Import policies");
          handleMenuClose();
        }}>
          <Upload sx={{ mr: 1 }} />
          Import from CSV
        </MenuItem>
        <MenuItem onClick={() => {
          console.log("View audit log");
          handleMenuClose();
        }}>
          <History sx={{ mr: 1 }} />
          View Audit Log
        </MenuItem>
        <MenuItem onClick={() => {
          console.log("Clone policy");
          handleMenuClose();
        }}>
          <Settings sx={{ mr: 1 }} />
          Clone Policy
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          console.log("Refresh all data");
          window.location.reload();
          handleMenuClose();
        }}>
          <Refresh sx={{ mr: 1 }} />
          Refresh Data
        </MenuItem>
      </Menu>

      {/* Tips Section */}
      <Paper sx={{ p: 3, bgcolor: 'info.50', borderColor: 'info.light' }}>
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
            <Typography sx={{ color: 'info.main', fontWeight: 'bold' }}>💡</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
              Leave Policy Setup Best Practices
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
              <li>
                <Typography variant="body2">
                  <strong>Clear Definitions:</strong> Ensure each leave type has clear eligibility criteria and documentation requirements
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Compliance:</strong> Align policies with local labor laws and regulations
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Communication:</strong> Clearly communicate policy changes to all employees
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Testing:</strong> Test new policies with a small group before company-wide rollout
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Audit:</strong> Regularly review and update policies based on usage patterns
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default LeavePolicyMainArea;