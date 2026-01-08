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
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useForm } from "react-hook-form";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";

interface DepartmentFiltersProps {
    selectedDepartmentType: string;
    setSelectedDepartmentType: (type: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
}

const DepartmentFilters: React.FC<DepartmentFiltersProps> = ({
    selectedDepartmentType,
    setSelectedDepartmentType,
    selectedStatus,
    setSelectedStatus,
    dateRange,
    setDateRange,
}) => {
    const departmentTypes = [
        { value: "all", label: "All Departments" },
        { value: "Sales", label: "Sales" },
        { value: "Marketing", label: "Marketing" },
        { value: "Engineering", label: "Engineering" },
        { value: "Operations", label: "Operations" },
        { value: "Finance", label: "Finance" },
        { value: "Human Resources", label: "Human Resources" },
        { value: "IT", label: "IT" },
        { value: "Customer Support", label: "Customer Support" },
        { value: "Research & Development", label: "Research & Development" },
    ];

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Under Review", label: "Under Review" },
        { value: "Consolidating", label: "Consolidating" },
    ];

    const handleResetFilters = () => {
        setSelectedDepartmentType("all");
        setSelectedStatus("all");
        setDateRange({
            start: "2024-01-01",
            end: "2024-03-31"
        });
    };

    const handleQuickDateRange = (range: string) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (range) {
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
                start = new Date("2024-01-01");
                end = new Date("2024-03-31");
        }

        setDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
    };

    const handleDepartmentTypeToggle = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
        if (newType !== null) {
            setSelectedDepartmentType(newType);
        }
    };

    const { control } = useForm({
        defaultValues: {
            departmentType: selectedDepartmentType,
            status: selectedStatus,
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
                            Department Filters
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
                            id="departmentType"
                            label="Department Type"
                            options={departmentTypes}
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <SelectBox
                            id="status"
                            label="Status"
                            options={statusOptions}
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <div className="form__input-box">
                            <div className="form__input-title">
                                <label htmlFor="startDate">
                                    Created From
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
                                    Created To
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
                        Quick Department Types:
                    </Typography>
                    <ToggleButtonGroup
                        value={selectedDepartmentType}
                        exclusive
                        onChange={handleDepartmentTypeToggle}
                        aria-label="department type"
                        size="small"
                        className="flex-wrap"
                    >
                        <ToggleButton value="Sales" aria-label="Sales">
                            <BusinessIcon className="mr-1" fontSize="small" />
                            Sales
                        </ToggleButton>
                        <ToggleButton value="Marketing" aria-label="Marketing">
                            Marketing
                        </ToggleButton>
                        <ToggleButton value="Engineering" aria-label="Engineering">
                            <GroupsIcon className="mr-1" fontSize="small" />
                            Engineering
                        </ToggleButton>
                        <ToggleButton value="Finance" aria-label="Finance">
                            <AccountBalanceIcon className="mr-1" fontSize="small" />
                            Finance
                        </ToggleButton>
                        <ToggleButton value="Operations" aria-label="Operations">
                            Operations
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

                {(selectedDepartmentType !== "all" || selectedStatus !== "all") && (
                    <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <Typography variant="body2" className="text-blue-800">
                            <strong>Active Filters:</strong>
                            {selectedDepartmentType !== "all" && ` ${selectedDepartmentType} departments`}
                            {selectedStatus !== "all" && ` • ${selectedStatus} status`}
                            {` • Created between: ${dateRange.start} to ${dateRange.end}`}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default DepartmentFilters;