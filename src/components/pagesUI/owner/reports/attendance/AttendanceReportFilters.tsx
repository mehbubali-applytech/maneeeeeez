"use client";
import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import { useForm } from "react-hook-form";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";

interface AttendanceReportFiltersProps {
    selectedReportType: string;
    setSelectedReportType: (type: string) => void;
    selectedPeriod: string;
    setSelectedPeriod: (period: string) => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
}

const AttendanceReportFilters: React.FC<AttendanceReportFiltersProps> = ({
    selectedReportType,
    setSelectedReportType,
    selectedPeriod,
    setSelectedPeriod,
    dateRange,
    setDateRange,
}) => {
    const reportTypes = [
        { value: "all", label: "All Reports" },
        { value: "Daily", label: "Daily Reports" },
        { value: "Weekly", label: "Weekly Reports" },
        { value: "Monthly", label: "Monthly Reports" },
        { value: "Quarterly", label: "Quarterly Reports" },
        { value: "Yearly", label: "Yearly Reports" },
        { value: "Department", label: "Department Reports" },
        { value: "Employee", label: "Employee Reports" },
        { value: "Late Arrivals", label: "Late Arrival Reports" },
        { value: "Absenteeism", label: "Absenteeism Reports" },
        { value: "Overtime", label: "Overtime Reports" },
        { value: "Leave", label: "Leave Reports" },
    ];

    const periods = [
        { value: "all", label: "All Periods" },
        { value: "today", label: "Today" },
        { value: "yesterday", label: "Yesterday" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "quarter", label: "This Quarter" },
        { value: "year", label: "This Year" },
    ];

    const handleResetFilters = () => {
        setSelectedReportType("all");
        setSelectedPeriod("all");
        setDateRange({
            start: "2024-03-01",
            end: "2024-03-31"
        });
    };

    const handleQuickDateRange = (range: string) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (range) {
            case "today":
                start = today;
                end = today;
                break;
            case "yesterday":
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case "week":
                start.setDate(today.getDate() - 7);
                break;
            case "month":
                start.setMonth(today.getMonth() - 1);
                break;
            case "quarter":
                start.setMonth(today.getMonth() - 3);
                break;
            case "year":
                start.setFullYear(today.getFullYear() - 1);
                break;
            default:
                start = new Date("2024-03-01");
                end = new Date("2024-03-31");
        }

        setDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
    };

    const handleReportTypeToggle = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
        if (newType !== null) {
            setSelectedReportType(newType);
        }
    };

    const { control } = useForm({
        defaultValues: {
            reportType: selectedReportType,
            period: selectedPeriod,
            startDate: dateRange.start,
            endDate: dateRange.end
        },
    });

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, start: e.target.value });
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, end: e.target.value });
    };

    return (
        <Card variant="outlined" className="mb-6">
            <CardContent>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <FilterListIcon className="mr-2 text-primary" />
                        <Typography variant="h6" className="font-semibold">
                            Attendance Report Filters
                        </Typography>
                    </div>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<RefreshIcon />}
                        onClick={handleResetFilters}
                        size="small"
                    >
                        Reset All
                    </Button>
                </div>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <SelectBox
                            id="reportType"
                            label="Report Type"
                            options={reportTypes}
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <SelectBox
                            id="period"
                            label="Period"
                            options={periods}
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <div className="form__input-box">
                            <div className="form__input-title">
                                <label htmlFor="startDate">
                                    From Date
                                </label>
                            </div>
                            <div className="form__input">
                                <input
                                    className="form-control"
                                    id="startDate"
                                    type="date"
                                    value={dateRange.start}
                                    onChange={handleStartDateChange}
                                />
                            </div>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <div className="form__input-box">
                            <div className="form__input-title">
                                <label htmlFor="endDate">
                                    To Date
                                </label>
                            </div>
                            <div className="form__input">
                                <input
                                    className="form-control"
                                    id="endDate"
                                    type="date"
                                    value={dateRange.end}
                                    onChange={handleEndDateChange}
                                />
                            </div>
                        </div>
                    </Grid>
                </Grid>

                <Box className="mt-4">
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                        Quick Report Types:
                    </Typography>
                    <ToggleButtonGroup
                        value={selectedReportType}
                        exclusive
                        onChange={handleReportTypeToggle}
                        aria-label="report type"
                        size="small"
                        className="flex-wrap"
                    >
                        <ToggleButton value="Daily" aria-label="Daily">
                            <CalendarTodayIcon className="mr-1" fontSize="small" />
                            Daily
                        </ToggleButton>
                        <ToggleButton value="Weekly" aria-label="Weekly">
                            Weekly
                        </ToggleButton>
                        <ToggleButton value="Monthly" aria-label="Monthly">
                            <AccessTimeIcon className="mr-1" fontSize="small" />
                            Monthly
                        </ToggleButton>
                        <ToggleButton value="Department" aria-label="Department">
                            <PeopleIcon className="mr-1" fontSize="small" />
                            Department
                        </ToggleButton>
                        <ToggleButton value="Late Arrivals" aria-label="Late Arrivals">
                            Late
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box className="mt-4">
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                        Quick Date Filters:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuickDateRange("today")}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuickDateRange("yesterday")}
                        >
                            Yesterday
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuickDateRange("week")}
                        >
                            Last 7 Days
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuickDateRange("month")}
                        >
                            Last Month
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuickDateRange("quarter")}
                        >
                            Last Quarter
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuickDateRange("year")}
                        >
                            Last Year
                        </Button>
                    </div>
                </Box>

                {(selectedReportType !== "all" || selectedPeriod !== "all") && (
                    <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <Typography variant="body2" className="text-blue-800">
                            <strong>Active Filters:</strong>
                            {selectedReportType !== "all" && ` ${selectedReportType} reports`}
                            {selectedPeriod !== "all" && ` • ${selectedPeriod} period`}
                            {` • Date range: ${dateRange.start} to ${dateRange.end}`}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default AttendanceReportFilters;