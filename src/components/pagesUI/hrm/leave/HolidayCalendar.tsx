"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Autocomplete,
  Alert,
  Card,
  CardContent
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Download,
  Upload,
  Notifications,
  CalendarMonth,
  Public,
  Business,
  Star
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IHoliday, LOCATIONS } from "./LeaveTypes";

const HolidayCalendar: React.FC = () => {
  const [holidays, setHolidays] = useState<IHoliday[]>([
    {
      id: "HOL001",
      date: "2024-01-26",
      name: "Republic Day",
      type: "Public",
      applicableLocations: ["Bangalore", "Delhi", "Mumbai", "Chennai"],
      description: "Indian Republic Day",
      isActive: true,
      year: 2024
    },
    {
      id: "HOL002",
      date: "2024-08-15",
      name: "Independence Day",
      type: "Public",
      applicableLocations: ["All"],
      description: "Indian Independence Day",
      isActive: true,
      year: 2024
    },
    {
      id: "HOL003",
      date: "2024-10-02",
      name: "Gandhi Jayanti",
      type: "Public",
      applicableLocations: ["All"],
      description: "Mahatma Gandhi's Birthday",
      isActive: true,
      year: 2024
    },
    {
      id: "HOL004",
      date: "2024-12-25",
      name: "Christmas",
      type: "Optional",
      applicableLocations: ["All"],
      description: "Christmas Day",
      isActive: true,
      year: 2024
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<IHoliday | null>(null);
  const [formData, setFormData] = useState<Partial<IHoliday>>({
    date: new Date().toISOString().split('T')[0],
    name: "",
    type: "Public",
    applicableLocations: [],
    description: "",
    isActive: true,
    year: new Date().getFullYear()
  });
  const [notifyEmployees, setNotifyEmployees] = useState(true);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState("All");

  const holidayTypes = ["Public", "Optional", "Company", "Regional"];
  const years = [2023, 2024, 2025, 2026];

  const filteredHolidays = useMemo(() => {
    return holidays.filter(holiday => {
      if (filterYear !== 0 && holiday.year !== filterYear) return false;
      if (filterType !== "All" && holiday.type !== filterType) return false;
      return true;
    });
  }, [holidays, filterYear, filterType]);

  const handleAddHoliday = () => {
    setSelectedHoliday(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      name: "",
      type: "Public",
      applicableLocations: [],
      description: "",
      isActive: true,
      year: new Date().getFullYear()
    });
    setDialogOpen(true);
  };

  const handleEditHoliday = (holiday: IHoliday) => {
    setSelectedHoliday(holiday);
    setFormData(holiday);
    setDialogOpen(true);
  };

  const handleDeleteHoliday = (holidayId: string) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      setHolidays(holidays.filter(h => h.id !== holidayId));
    }
  };

  const handleToggleActive = (holidayId: string, isActive: boolean) => {
    setHolidays(holidays.map(h => 
      h.id === holidayId ? { ...h, isActive: !isActive } : h
    ));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.date) {
      alert("Please fill in all required fields");
      return;
    }

    const newHoliday: IHoliday = {
      id: selectedHoliday ? selectedHoliday.id : `HOL${(holidays.length + 1).toString().padStart(3, '0')}`,
      date: formData.date!,
      name: formData.name!,
      type: formData.type! as any,
      applicableLocations: formData.applicableLocations!,
      description: formData.description || "",
      isActive: formData.isActive!,
      year: new Date(formData.date!).getFullYear()
    };

    if (selectedHoliday) {
      setHolidays(holidays.map(h => h.id === selectedHoliday.id ? newHoliday : h));
    } else {
      setHolidays([...holidays, newHoliday]);
    }

    setDialogOpen(false);
  };

  const handlePublishCalendar = () => {
    const activeHolidays = holidays.filter(h => h.isActive && h.year === new Date().getFullYear());
    
    // In real app, this would make an API call to publish holidays
    console.log("Publishing holidays:", activeHolidays);
    
    setPublishDialogOpen(false);
    alert(`Calendar published successfully! ${activeHolidays.length} holidays are now visible to employees.`);
  };

  const getHolidayIcon = (type: string) => {
    switch(type) {
      case 'Public': return <Public fontSize="small" />;
      case 'Company': return <Business fontSize="small" />;
      case 'Optional': return <Star fontSize="small" />;
      default: return <CalendarMonth fontSize="small" />;
    }
  };

  const getHolidayColor = (type: string) => {
    switch(type) {
      case 'Public': return 'error';
      case 'Company': return 'primary';
      case 'Optional': return 'warning';
      case 'Regional': return 'info';
      default: return 'default';
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Parse CSV file (simplified - in real app use a CSV parser)
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Parse CSV and add holidays
        console.log("CSV content:", content);
        alert("CSV import would be processed here");
      };
      reader.readAsText(file);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Type', 'Locations', 'Description'];
    const csvContent = [
      headers.join(','),
      ...holidays.map(holiday => [
        holiday.date,
        `"${holiday.name}"`,
        holiday.type,
        `"${holiday.applicableLocations.join(', ')}"`,
        `"${holiday.description || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `holidays_${filterYear}.csv`;
    a.click();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth /> Holiday Calendar
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => document.getElementById('csv-upload')?.click()}
                size="small"
              >
                Import CSV
              </Button>
              
              <input
                type="file"
                id="csv-upload"
                accept=".csv"
                onChange={handleCSVUpload}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportCSV}
                size="small"
              >
                Export CSV
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Notifications />}
                onClick={() => setPublishDialogOpen(true)}
                className="!text-white"
              >
                Publish Calendar
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddHoliday}
                className="!text-white"
              >
                Add Holiday
              </Button>
            </Box>
          </Box>
          
          <Alert severity="info">
            <Typography variant="body2">
              Manage public holidays, company holidays, and optional days off. Published holidays are visible to all employees.
            </Typography>
          </Alert>
        </Box>

        {/* Filters and Stats */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Autocomplete
                fullWidth
                size="small"
                options={years}
                value={filterYear}
                onChange={(event, newValue) => {
                  setFilterYear(newValue || new Date().getFullYear());
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Year"
                    placeholder="Select year"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Autocomplete
                fullWidth
                size="small"
                options={["All", ...holidayTypes]}
                value={filterType}
                onChange={(event, newValue) => {
                  setFilterType(newValue || "All");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Holiday Type"
                    placeholder="Select type"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">{holidays.length}</Typography>
                  <Typography variant="caption" color="text.secondary">Total Holidays</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {holidays.filter(h => h.isActive).length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Active</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {new Set(holidays.map(h => h.year)).size}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Years</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Holidays Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>Date</TableCell>
                <TableCell>Holiday Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Applicable Locations</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Year</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {filteredHolidays.map((holiday) => (
                <TableRow key={holiday.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {new Date(holiday.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(holiday.date).toLocaleDateString('en-IN', {
                        weekday: 'short'
                      })}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="subtitle2">{holiday.name}</Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      icon={getHolidayIcon(holiday.type)}
                      label={holiday.type}
                      color={getHolidayColor(holiday.type) as any}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {holiday.applicableLocations.map((loc, idx) => (
                        <Chip key={idx} label={loc} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {holiday.description}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip label={holiday.year} size="small" />
                  </TableCell>
                  
                  <TableCell align="center">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={holiday.isActive}
                          onChange={() => handleToggleActive(holiday.id, holiday.isActive)}
                          size="small"
                        />
                      }
                      label={
                        <Chip
                          label={holiday.isActive ? "Active" : "Inactive"}
                          size="small"
                          color={holiday.isActive ? "success" : "default"}
                          variant="outlined"
                        />
                      }
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditHoliday(holiday)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteHoliday(holiday.id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Empty State */}
        {filteredHolidays.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography>
              No holidays found for the selected filters. Click {`"Add Holiday"`} to create one.
            </Typography>
          </Alert>
        )}

        {/* Holiday Form Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedHoliday ? "Edit Holiday" : "Add New Holiday"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Holiday Date *"
                    value={new Date(formData.date || '')}
                    onChange={(date) => setFormData({ 
                      ...formData, 
                      date: date ? date.toISOString().split('T')[0] : '' 
                    })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    fullWidth
                    options={holidayTypes}
                    value={formData.type}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, type: newValue as any });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Holiday Type *"
                        placeholder="Select type"
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Holiday Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    fullWidth
                    options={LOCATIONS}
                    value={formData.applicableLocations}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, applicableLocations: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Applicable Locations"
                        placeholder="Select locations"
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                    }
                    label="Active Holiday"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              className="!text-white"
            >
              {selectedHoliday ? "Update Holiday" : "Add Holiday"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Publish Calendar Dialog */}
        <Dialog 
          open={publishDialogOpen} 
          onClose={() => setPublishDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Notifications /> Publish Holiday Calendar
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Publishing the calendar will make holidays visible to all employees.
                </Typography>
              </Alert>
              
              <Typography variant="body2" gutterBottom>
                The following holidays for {new Date().getFullYear()} will be published:
              </Typography>
              
              <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                {holidays
                  .filter(h => h.isActive && h.year === new Date().getFullYear())
                  .map(holiday => (
                    <Card key={holiday.id} variant="outlined" sx={{ mb: 1, p: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {holiday.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(holiday.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip label={holiday.type} size="small" />
                      </Box>
                    </Card>
                  ))}
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                Total: {holidays.filter(h => h.isActive && h.year === new Date().getFullYear()).length} holidays
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={notifyEmployees}
                    onChange={(e) => setNotifyEmployees(e.target.checked)}
                  />
                }
                label="Send notification to employees"
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handlePublishCalendar} 
              variant="contained"
              color="primary"
              className="!text-white"
            >
              Publish Calendar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Upcoming Holidays */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Upcoming Holidays ({new Date().getFullYear()})
        </Typography>
        
        <Grid container spacing={2}>
          {holidays
            .filter(h => h.isActive && h.year === new Date().getFullYear())
            .filter(h => new Date(h.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 4)
            .map(holiday => (
              <Grid item xs={12} sm={6} md={3} key={holiday.id}>
                <Card 
                  sx={{ 
                    borderColor: getHolidayColor(holiday.type),
                    border: 2,
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getHolidayIcon(holiday.type)}
                      <Typography variant="subtitle2" fontWeight={600}>
                        {holiday.name}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" color="primary">
                      {new Date(holiday.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      {new Date(holiday.date).toLocaleDateString('en-IN', {
                        weekday: 'long'
                      })}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary">
                      {holiday.description}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" fontWeight={600}>
                        Locations:
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {holiday.applicableLocations.join(', ')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default HolidayCalendar;