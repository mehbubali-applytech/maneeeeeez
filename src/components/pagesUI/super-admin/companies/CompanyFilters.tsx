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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import { useForm } from "react-hook-form";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";

interface CompanyFiltersProps {
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    selectedIndustry: string;
    setSelectedIndustry: (industry: string) => void;
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({
    selectedStatus,
    setSelectedStatus,
    selectedIndustry,
    setSelectedIndustry,
    selectedCountry,
    setSelectedCountry,
    dateRange,
    setDateRange,
}) => {
    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Pending", label: "Pending" },
    ];

    const industryOptions = [
        { value: "all", label: "All Industries" },
        { value: "Technology", label: "Technology" },
        { value: "Finance", label: "Finance & Banking" },
        { value: "Healthcare", label: "Healthcare" },
        { value: "Manufacturing", label: "Manufacturing" },
        { value: "Retail", label: "Retail & E-commerce" },
        { value: "Education", label: "Education" },
        { value: "Real Estate", label: "Real Estate" },
        { value: "Hospitality", label: "Hospitality" },
        { value: "Transportation", label: "Transportation" },
        { value: "Energy", label: "Energy" },
        { value: "Telecommunications", label: "Telecommunications" },
    ];

    const countryOptions = [
        { value: "all", label: "All Countries" },
        { value: "USA", label: "United States" },
        { value: "UK", label: "United Kingdom" },
        { value: "Canada", label: "Canada" },
        { value: "Australia", label: "Australia" },
        { value: "Germany", label: "Germany" },
        { value: "France", label: "France" },
        { value: "Japan", label: "Japan" },
        { value: "China", label: "China" },
        { value: "India", label: "India" },
        { value: "UAE", label: "United Arab Emirates" },
        { value: "Singapore", label: "Singapore" },
    ];

    const handleResetFilters = () => {
        setSelectedStatus("all");
        setSelectedIndustry("all");
        setSelectedCountry("all");
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

    const handleStatusToggle = (event: React.MouseEvent<HTMLElement>, newStatus: string | null) => {
        if (newStatus !== null) {
            setSelectedStatus(newStatus);
        }
    };

    const { control } = useForm({
        defaultValues: {
            status: selectedStatus,
            industry: selectedIndustry,
            country: selectedCountry,
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
                            Company Filters
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
                    <Grid item xs={12} md={3}>
                        <SelectBox
                            id="status"
                            label="Status"
                            options={statusOptions}
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <SelectBox
                            id="industry"
                            label="Industry"
                            options={industryOptions}
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <SelectBox
                            id="country"
                            label="Country"
                            options={countryOptions}
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} md={1.5}>
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

                    <Grid item xs={12} md={1.5}>
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
                        Quick Status Filters:
                    </Typography>
                    <ToggleButtonGroup
                        value={selectedStatus}
                        exclusive
                        onChange={handleStatusToggle}
                        aria-label="company status"
                        size="small"
                        className="flex-wrap"
                    >
                        <ToggleButton value="Active" aria-label="Active">
                            <BusinessIcon className="mr-1" fontSize="small" />
                            Active
                        </ToggleButton>
                        <ToggleButton value="Inactive" aria-label="Inactive">
                            Inactive
                        </ToggleButton>
                        <ToggleButton value="Pending" aria-label="Pending">
                            Pending
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box className="mt-4">
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                        Quick Industry Filters:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedIndustry("Technology")}
                        >
                            <CategoryIcon className="mr-1" fontSize="small" />
                            Technology
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedIndustry("Finance")}
                        >
                            Finance
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedIndustry("Healthcare")}
                        >
                            Healthcare
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedIndustry("Retail")}
                        >
                            Retail
                        </Button>
                    </div>
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

                {(selectedStatus !== "all" || selectedIndustry !== "all" || selectedCountry !== "all") && (
                    <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <Typography variant="body2" className="text-blue-800">
                            <strong>Active Filters:</strong>
                            {selectedStatus !== "all" && ` ${selectedStatus} status`}
                            {selectedIndustry !== "all" && ` • ${selectedIndustry} industry`}
                            {selectedCountry !== "all" && ` • ${selectedCountry}`}
                            {` • Registered between: ${dateRange.start} to ${dateRange.end}`}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default CompanyFilters;