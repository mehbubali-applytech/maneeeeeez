"use client";

import React, { useState } from "react";
import { Box, Typography, Grid, MenuItem } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";
import DatePicker from "react-datepicker";

interface PositionDetailsTabProps {
  watchJobType?: string;
}

const PositionDetailsTab: React.FC<PositionDetailsTabProps> = ({
  watchJobType
}) => {
  const { control, watch, setValue } = useFormContext();

  // Department options
  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Product', label: 'Product' },
    { value: 'Design', label: 'Design' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Support', label: 'Customer Support' }
  ];

  // Job type options
  const jobTypeOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Intern', label: 'Intern' }
  ];

  // Location options
  const locationOptions = [
    { value: 'Bangalore Office', label: 'Bangalore Office' },
    { value: 'Mumbai HQ', label: 'Mumbai HQ' },
    { value: 'Delhi Office', label: 'Delhi Office' },
    { value: 'Hyderabad Office', label: 'Hyderabad Office' },
    { value: 'Chennai Office', label: 'Chennai Office' },
    { value: 'Pune Office', label: 'Pune Office' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

  // Reporting manager options
  const reportingManagerOptions = [
    { value: 'Jane Smith', label: 'Jane Smith (Engineering Manager)' },
    { value: 'John Doe', label: 'John Doe (Product Lead)' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson (Design Director)' },
    { value: 'Mike Wilson', label: 'Mike Wilson (Data Science Head)' },
    { value: 'Emily Brown', label: 'Emily Brown (Marketing Director)' }
  ];




  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Position Details
      </Typography>

      <Grid container spacing={3}>
        {/* Job Details */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
            Job Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="position"
            control={control}
            rules={{ required: "Position is required" }}
            render={({ field, fieldState }) => (
              <InputField
                {...field}
                id="position"
                label="Job Position *"
                error={fieldState.error}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SelectBox
            id="department"
            label="Department *"
            options={departmentOptions}
            control={control}
            isRequired
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SelectBox
            id="jobType"
            label="Employment Type *"
            options={jobTypeOptions}
            control={control}
            isRequired
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SelectBox
            id="location"
            label="Work Location *"
            options={locationOptions}
            control={control}
            isRequired
          />
        </Grid>

        {/* Probation Period */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="probationPeriod"
            control={control}
            rules={{
              required: "Probation period is required",
              min: { value: 0, message: "Must be 0 or more" },
              max: { value: 24, message: "Maximum 24 months" }
            }}
            render={({ field, fieldState }) => (
              <InputField
                {...field}
                id="probationPeriod"
                label="Probation Period (months) *"
                type="number"
                error={fieldState.error}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SelectBox
            id="reportingManager"
            label="Reporting Manager *"
            options={reportingManagerOptions}
            control={control}
            isRequired
          />
        </Grid>

        {/* Dates */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mt: 3, mb: 2 }}>
            Important Dates
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="offerDate"
            control={control}
            rules={{ required: "Offer date is required" }}
            render={({ field, fieldState }) => (
              <div>
                <FormLabel id="offerDate" label="Offer Date *" />
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date?.toISOString().split("T")[0])
                  }
                  className="w-full p-2 border rounded"
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="Select offer date"
                />
                {fieldState.error && (
                  <Typography color="error" variant="caption">
                    {fieldState.error.message}
                  </Typography>
                )}
              </div>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="joiningDate"
            control={control}
            rules={{ required: "Joining date is required" }}
            render={({ field, fieldState }) => (
              <div>
                <FormLabel id="joiningDate" label="Expected Joining Date *" />
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date?.toISOString().split("T")[0])
                  }
                  className="w-full p-2 border rounded"
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="Select joining date"
                />
                {fieldState.error && (
                  <Typography color="error" variant="caption">
                    {fieldState.error.message}
                  </Typography>
                )}
              </div>
            )}
          />
        </Grid>


        {/* Contract Specific Fields */}
        {watchJobType === 'Contract' && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'warning.dark' }}>
                Contract Specific Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="contractStartDate"
                    control={control}
                    rules={{ required: "Contract start date is required" }}
                    render={({ field }) => (
                      <div>
                        <FormLabel id="contractStartDate" label="Contract Start Date *" />
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          className="w-full p-2 border rounded"
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                          placeholderText="Select start date"
                        />
                      </div>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="contractEndDate"
                    control={control}
                    rules={{ required: "Contract end date is required" }}
                    render={({ field }) => (
                      <div>
                        <FormLabel id="contractEndDate" label="Contract End Date *" />
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          className="w-full p-2 border rounded"
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                          placeholderText="Select end date"
                        />
                      </div>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}

        {/* Intern Specific Fields */}
        {watchJobType === 'Intern' && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'info.dark' }}>
                Internship Specific Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="internshipDuration"
                    control={control}
                    rules={{ required: "Internship duration is required" }}
                    render={({ field, fieldState }) => (
                      <InputField
                        {...field}
                        id="internshipDuration"
                        label="Internship Duration (months) *"
                        type="number"
                        error={fieldState.error}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="mentorName"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        id="mentorName"
                        label="Assigned Mentor"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Info Box */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: 'info.dark' }}>
          <strong>💡 Tip:</strong> For contract positions, clearly define the contract period.
          For internships, specify the duration and mentor assignment.
        </Typography>
      </Box>
    </Box>
  );
};

export default PositionDetailsTab;