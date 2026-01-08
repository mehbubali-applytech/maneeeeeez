"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Grid
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { useForm } from "react-hook-form";


interface ReportFiltersProps {
  selectedReportType: string;
  setSelectedReportType: (type: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  selectedReportType,
  setSelectedReportType,
  dateRange,
  setDateRange,
}) => {
  const reportTypes = [
    { value: "All", label: "All Reports" },
    { value: "Attendance", label: "Attendance" },
    { value: "Payroll", label: "Payroll" },
    { value: "Leave", label: "Leave" },
    { value: "Performance", label: "Performance" },
    { value: "Recruitment", label: "Recruitment" },
    { value: "Training", label: "Training" },
    { value: "Analytics", label: "Analytics" },
    { value: "Compliance", label: "Compliance" },
    { value: "Benefits", label: "Benefits" },
  ];

  const handleResetFilters = () => {
    setSelectedReportType("All");
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
      default:
        start = new Date("2024-01-01");
        end = new Date("2024-03-31");
    }

    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, start: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, end: e.target.value });
  };

  const { control } = useForm({
    defaultValues: {
      reportType: selectedReportType,
    },
  });


  return (
    <Card variant="outlined" className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FilterListIcon className="mr-2 text-primary" />
            <Typography variant="h6" className="font-semibold">
              Report Filters
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
            <FormControl fullWidth size="small">
              <SelectBox
                id="reportType"
                label="Report Type"
                options={reportTypes}
                control={control}
              />

            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <div className="form__input-box">
              <div className="form__input-title">
                <label htmlFor="startDate">
                  Start Date
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
                  End Date
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

          <Grid item xs={12} md={2}>
            <div className="flex items-center h-full">
            </div>
          </Grid>
        </Grid>

        <Box className="mt-4">
          <Typography variant="body2" color="text.secondary" className="mb-2">
            Quick Date Filters:
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="contained"
              size="small"
              color="primary"
              className="!text-white"
              onClick={() => handleQuickDateRange("today")}
            >
              Today
            </Button>
            <Button
              variant="contained"
              size="small"
              className="!text-white"
              onClick={() => handleQuickDateRange("week")}
            >
              Last 7 Days
            </Button>
            <Button
              variant="contained"
              size="small"
              className="!text-white"
              onClick={() => handleQuickDateRange("month")}
            >
              Last Month
            </Button>
            <Button
              variant="contained"
              size="small"
              className="!text-white"
              onClick={() => handleQuickDateRange("quarter")}
            >
              Last Quarter
            </Button>
          </div>
        </Box>

        {selectedReportType !== "All" && (
          <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
            <Typography variant="body2" className="text-blue-800">
              <strong>Filter Active:</strong> Showing {selectedReportType} reports from {dateRange.start} to {dateRange.end}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportFilters;