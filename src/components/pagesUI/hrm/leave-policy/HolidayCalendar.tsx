"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Alert,
  Pagination,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Paper
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Download,
  MoreVert,
  CalendarMonth,
  LocationOn,
  Business,
  Notifications,
  ContentCopy,
  Star
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IHoliday } from "./LeavePolicyTypes";

interface HolidayCalendarProps {
  holidays: IHoliday[];
  onAddHoliday: () => void;
  onEditHoliday: (id: string) => void;
  onDeleteHoliday: (id: string) => void;
}

const HolidayCalendar: React.FC<HolidayCalendarProps> = ({
  holidays,
  onAddHoliday,
  onEditHoliday,
  onDeleteHoliday
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [filterType, setFilterType] = useState("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(9); // 3x3 grid
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuHoliday, setSelectedMenuHoliday] = useState<IHoliday | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i - 1); // Previous, current, next year

  const holidayTypes = ['All', 'National', 'Regional', 'Company', 'Optional'];

  const filteredHolidays = useMemo(() => {
    return holidays.filter(holiday => {
      // Search filter
      if (searchQuery && !holiday.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Year filter
      const holidayYear = new Date(holiday.date).getFullYear();
      if (holidayYear !== filterYear) {
        return false;
      }
      
      // Type filter
      if (filterType !== "All" && holiday.type !== filterType) {
        return false;
      }
      
      return true;
    });
  }, [holidays, searchQuery, filterYear, filterType]);

  const paginatedHolidays = filteredHolidays.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getHolidayTypeColor = (type: string) => {
    switch (type) {
      case 'National': return 'error';
      case 'Regional': return 'warning';
      case 'Company': return 'primary';
      case 'Optional': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getDaysUntilHoliday = (dateString: string) => {
    const holidayDate = new Date(dateString);
    const today = new Date();
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Passed', color: 'default' };
    if (diffDays === 0) return { text: 'Today', color: 'error' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'warning' };
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'info' };
    return { text: `${diffDays} days`, color: 'success' };
  };

  const handleDeleteClick = (id: string) => {
    setHolidayToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (holidayToDelete) {
      onDeleteHoliday(holidayToDelete);
      setDeleteDialogOpen(false);
      setHolidayToDelete(null);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, holiday: IHoliday) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMenuHoliday(holiday);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMenuHoliday(null);
  };

  const upcomingHolidays = holidays
    .filter(h => new Date(h.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Holiday Calendar
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => console.log("Export calendar")}
                size="small"
              >
                Export Calendar
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddHoliday}
                className="!text-white"
                size="small"
              >
                Add Holiday
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search holidays..."
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
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={filterYear}
                    onChange={(e) => setFilterYear(Number(e.target.value))}
                    label="Year"
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Type"
                  >
                    {holidayTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setSearchQuery("");
                    setFilterYear(new Date().getFullYear());
                    setFilterType("All");
                  }}
                  fullWidth
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Upcoming Holidays Alert */}
        {upcomingHolidays.length > 0 && (
          <Alert 
            severity="info" 
            icon={<Notifications />}
            sx={{ mb: 3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                <strong>Upcoming Holidays:</strong> {upcomingHolidays.map(h => h.name).join(', ')}
              </Typography>
              <Button size="small" onClick={() => setFilterYear(currentYear)}>
                View Calendar
              </Button>
            </Box>
          </Alert>
        )}

        {/* Holidays Grid */}
        <Grid container spacing={2}>
          {paginatedHolidays.map((holiday) => {
            const daysInfo = getDaysUntilHoliday(holiday.date);
            const isUpcoming = daysInfo.color !== 'default';
            
            return (
              <Grid item xs={12} md={4} key={holiday.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderLeft: `4px solid ${
                      holiday.type === 'National' ? '#f44336' :
                      holiday.type === 'Regional' ? '#ff9800' :
                      holiday.type === 'Company' ? '#2196f3' : '#4caf50'
                    }`
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {holiday.name}
                        </Typography>
                        <Chip
                          label={holiday.type}
                          size="small"
                          color={getHolidayTypeColor(holiday.type) as any}
                          variant="outlined"
                        />
                      </Box>
                      
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, holiday)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarMonth fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(holiday.date)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {getDayOfWeek(holiday.date)}
                    </Typography>
                    
                    {holiday.description && (
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {holiday.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Locations: {holiday.locations.join(', ')}
                      </Typography>
                    </Box>
                    
                    {holiday.departments[0] !== 'All' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Business fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Departments: {holiday.departments.join(', ')}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Chip
                        label={daysInfo.text}
                        size="small"
                        color={daysInfo.color as any}
                        icon={isUpcoming ? <Star fontSize="small" /> : undefined}
                      />
                      
                      {holiday.recurring && (
                        <Chip
                          label="Recurring"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Pagination */}
        {filteredHolidays.length > rowsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(filteredHolidays.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}

        {/* Empty State */}
        {filteredHolidays.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography>
              No holidays found for {filterYear}. Add holidays to create your calendar.
            </Typography>
          </Alert>
        )}

        {/* Statistics */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{holidays.length}</Typography>
                <Typography variant="caption" color="text.secondary">Total Holidays</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {holidays.filter(h => h.recurring).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">Recurring</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {holidays.filter(h => new Date(h.date) >= new Date()).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">Upcoming</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {holidays.filter(h => h.type === 'National').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">National</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Holiday</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this holiday? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained" 
              color="error"
              className="!text-white"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          {selectedMenuHoliday && (
            <>
              <MenuItem onClick={() => {
                onEditHoliday(selectedMenuHoliday.id);
                handleMenuClose();
              }}>
                <Edit fontSize="small" sx={{ mr: 1 }} />
                Edit Holiday
              </MenuItem>
              
              <MenuItem onClick={() => {
                console.log("Clone holiday:", selectedMenuHoliday);
                handleMenuClose();
              }}>
                <ContentCopy fontSize="small" sx={{ mr: 1 }} />
                Clone for Next Year
              </MenuItem>
              
              <MenuItem onClick={() => {
                handleDeleteClick(selectedMenuHoliday.id);
                handleMenuClose();
              }} sx={{ color: 'error.main' }}>
                <Delete fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </>
          )}
        </Menu>
      </Box>
    </LocalizationProvider>
  );
};

export default HolidayCalendar;