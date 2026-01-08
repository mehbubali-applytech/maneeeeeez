"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Button,
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useForm } from "react-hook-form";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import InputField from "@/components/elements/SharedInputs/InputField";

interface PerformanceReportFiltersProps {
  selectedReportType: string;
  setSelectedReportType: (type: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const PerformanceReportFilters: React.FC<PerformanceReportFiltersProps> = ({
  selectedReportType,
  setSelectedReportType,
  selectedPeriod,
  setSelectedPeriod,
  dateRange,
  setDateRange,
}) => {
  const reportTypes = [
    { value: "all", label: "All Reports" },
    { value: "Quarterly Review", label: "Quarterly Reviews" },
    { value: "Annual Review", label: "Annual Reviews" },
    { value: "360 Feedback", label: "360 Feedback" },
    { value: "Competency Assessment", label: "Competency Assessments" },
    { value: "Goal Tracking", label: "Goal Tracking" },
    { value: "Leadership Assessment", label: "Leadership Assessments" },
    { value: "Development Plan", label: "Development Plans" },
    { value: "Performance Scorecard", label: "Performance Scorecards" },
    { value: "Talent Review", label: "Talent Reviews" },
  ];

  const periods = [
    { value: "all", label: "All Periods" },
    { value: "Q1 2024", label: "Q1 2024" },
    { value: "Q2 2024", label: "Q2 2024" },
    { value: "Q3 2024", label: "Q3 2024" },
    { value: "Q4 2024", label: "Q4 2024" },
    { value: "2023", label: "FY 2023" },
    { value: "2024", label: "FY 2024" },
  ];

  const departments = [
    { value: "all", label: "All Departments" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "engineering", label: "Engineering" },
    { value: "hr", label: "Human Resources" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
  ];

  const handleResetFilters = () => {
    setSelectedReportType("all");
    setSelectedPeriod("all");
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
      case "today":
        start = today;
        end = today;
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
        start = new Date("2024-01-01");
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
      department: "all",
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
              Performance Report Filters
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
              id="reportType"
              label="Report Type"
              options={reportTypes}
              control={control}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <SelectBox
              id="period"
              label="Evaluation Period"
              options={periods}
              control={control}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <SelectBox
              id="department"
              label="Department"
              options={departments}
              control={control}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <div className="flex gap-2">
              <div className="form__input-box flex-1">
                <div className="form__input-title">
                  <label htmlFor="startDate">Start Date</label>
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
              
              <div className="form__input-box flex-1">
                <div className="form__input-title">
                  <label htmlFor="endDate">End Date</label>
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
            <ToggleButton value="Quarterly Review" aria-label="Quarterly">
              <TrendingUpIcon className="mr-1" fontSize="small" />
              Quarterly
            </ToggleButton>
            <ToggleButton value="Annual Review" aria-label="Annual">
              <AssessmentIcon className="mr-1" fontSize="small" />
              Annual
            </ToggleButton>
            <ToggleButton value="360 Feedback" aria-label="360 Feedback">
              <GroupsIcon className="mr-1" fontSize="small" />
              360°
            </ToggleButton>
            <ToggleButton value="Goal Tracking" aria-label="Goals">
              <EmojiEventsIcon className="mr-1" fontSize="small" />
              Goals
            </ToggleButton>
            <ToggleButton value="Competency Assessment" aria-label="Competency">
              Competency
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
              {selectedReportType !== "all" && ` ${selectedReportType}`}
              {selectedPeriod !== "all" && ` • ${selectedPeriod}`}
              {` • Date range: ${dateRange.start} to ${dateRange.end}`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceReportFilters;