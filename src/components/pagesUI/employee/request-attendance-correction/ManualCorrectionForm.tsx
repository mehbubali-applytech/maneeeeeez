// app/components/attendance/ManualCorrectionForm.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  CircularProgress,
  Chip,
  Grid,
  Container,
  Breadcrumbs,
  Link,
  Autocomplete,
} from "@mui/material";
import {
  AttachFile,
  Delete,
  CalendarToday,
  AccessTime,
  Description,
  CheckCircle,
  Pending,
  Home,
  KeyboardArrowLeft,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useRouter } from "next/navigation";

interface CorrectionFormData {
  date: Date | null;
  correctionType: string;
  originalTime: Date | null;
  correctedTime: Date | null;
  reason: string;
  documents: File[];
}

interface ManualCorrectionFormProps {
  onSubmit: (data: any) => Promise<void> | void;
}

const correctionTypes = [
  { value: "missing_checkin", label: "Missing Check-In" },
  { value: "missing_checkout", label: "Missing Check-Out" },
  { value: "incorrect_time", label: "Incorrect Time" },
  { value: "marked_absent", label: "Marked Absent by Mistake" },
];

const steps = ["Select Details", "Provide Reason", "Review & Submit"];

export default function ManualCorrectionForm({ onSubmit }: ManualCorrectionFormProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CorrectionFormData>({
    date: new Date(),
    correctionType: "",
    originalTime: null,
    correctedTime: null,
    reason: "",
    documents: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: keyof CorrectionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newFiles],
      }));
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.date) {
        newErrors.date = "Please select a date";
      }
      if (!formData.correctionType) {
        newErrors.correctionType = "Please select a correction type";
      }
      if (!formData.correctedTime) {
        newErrors.correctedTime = "Please select a corrected time";
      }
    }

    if (step === 1) {
      if (!formData.reason.trim()) {
        newErrors.reason = "Please provide a reason for the correction";
      } else if (formData.reason.trim().length < 20) {
        newErrors.reason = "Reason must be at least 20 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsSubmitting(true);

    try {
      const submissionData = {
        date: formData.date?.toISOString().split('T')[0],
        correctionType: formData.correctionType,
        originalTime: formData.originalTime?.toTimeString().slice(0, 5),
        correctedTime: formData.correctedTime?.toTimeString().slice(0, 5),
        reason: formData.reason,
        documents: formData.documents.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
      };

      // Call the onSubmit prop
      await onSubmit(submissionData);

      setSubmitSuccess(true);

    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Failed to submit request. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <div className="breadcrumb__wrapper mb-[25px]">
          <nav>
            <ol className="breadcrumb flex items-center mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/employee">Employee</Link>
              </li>
              <li className="breadcrumb-item active">Request for Correction</li>
            </ol>
          </nav>
        </div>


        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }} color="white">
            Manual Correction Request
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
            Request attendance record correction for missing or incorrect check-in/out times
          </Typography>
        </Paper>

        {/* Main Content */}
        <Paper sx={{ p: 4, mb: 4 }}>
          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Content */}
          {submitSuccess ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              textAlign: 'center'
            }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Correction Request Submitted!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Your attendance correction request has been submitted successfully.
                You can track its status in {"My Attendance → Requests"} tab.
              </Typography>

              <Chip
                label="Status: Pending Review"
                color="warning"
                icon={<Pending />}
                sx={{ mt: 2, mb: 4 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => router.push('/employee/attendance/requests')}
                >
                  View My Requests
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setActiveStep(0);
                    setFormData({
                      date: new Date(),
                      correctionType: "",
                      originalTime: null,
                      correctedTime: null,
                      reason: "",
                      documents: [],
                    });
                  }}
                >
                  Submit Another Request
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {/* Step 1: Select Details */}
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Select correction details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Date of Record *"
                      value={formData.date}
                      onChange={(newValue) => handleInputChange("date", newValue)}
                      maxDate={new Date()}
                      enableAccessibleFieldDOMStructure={false}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date,
                          InputProps: {
                            startAdornment: (
                              <CalendarToday sx={{ mr: 1, color: "action.active" }} />
                            ),
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={correctionTypes}
                      getOptionLabel={(option) => option.label}
                      value={correctionTypes.find(type => type.value === formData.correctionType) || null}
                      onChange={(event, newValue) => {
                        handleInputChange('correctionType', newValue?.value || "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Correction Type *"
                          error={!!errors.correctionType}
                          helperText={errors.correctionType}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <Description sx={{ mr: 1, color: 'action.active' }} />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.value}>
                          {option.label}
                        </li>
                      )}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      fullWidth
                    />
                  </Grid>

                  {formData.correctionType === 'incorrect_time' && (
                    <Grid item xs={12} md={6}>
                      <TimePicker
                        label="Original Time (if any)"
                        value={formData.originalTime}
                        onChange={(newValue) => handleInputChange("originalTime", newValue)}
                        enableAccessibleFieldDOMStructure={false}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            InputProps: {
                              startAdornment: (
                                <AccessTime sx={{ mr: 1, color: "action.active" }} />
                              ),
                            },
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
                        Current recorded timestamp
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12} md={6}>
                    <TimePicker
                      label="Corrected Time *"
                      value={formData.correctedTime}
                      onChange={(newValue) => handleInputChange("correctedTime", newValue)}
                      enableAccessibleFieldDOMStructure={false}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.correctedTime,
                          helperText: errors.correctedTime,
                          InputProps: {
                            startAdornment: (
                              <AccessTime sx={{ mr: 1, color: "action.active" }} />
                            ),
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 2: Provide Reason */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                    Provide details for correction
                  </Typography>

                  <TextField
                    label="Reason for Correction *"
                    multiline
                    rows={6}
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    error={!!errors.reason}
                    helperText={
                      errors.reason ||
                      `Minimum 20 characters (${formData.reason.length}/20)`
                    }
                    fullWidth
                    placeholder="Please provide detailed reason for the attendance correction..."
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <Description sx={{ mr: 1, mt: 2, color: 'action.active', alignSelf: 'flex-start' }} />
                      ),
                    }}
                  />

                  {/* Document Upload */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      border: 2,
                      borderColor: 'divider',
                      borderStyle: 'dashed',
                      borderRadius: 2,
                      textAlign: 'center',
                      bgcolor: 'background.default',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleDocumentUpload}
                      style={{ display: 'none' }}
                    />
                    <AttachFile sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Upload Supporting Documents
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Upload images or PDF files (e.g., gate slip, meeting invitation, email proof)
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AttachFile />}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('file-upload')?.click();
                      }}
                    >
                      Choose Files
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Maximum file size: 5MB per file
                    </Typography>
                  </Paper>

                  {/* Uploaded Files List */}
                  {formData.documents.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Uploaded Documents ({formData.documents.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {formData.documents.map((file, index) => (
                          <Paper
                            key={index}
                            variant="outlined"
                            sx={{
                              p: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <AttachFile sx={{ color: 'primary.main' }} />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatFileSize(file.size)}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveDocument(index)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Step 3: Review & Submit */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                    Review your correction request
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Date of Record
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formData.date?.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Correction Type
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {correctionTypes.find(t => t.value === formData.correctionType)?.label}
                        </Typography>
                      </Grid>

                      {formData.originalTime && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">
                            Original Time
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formData.originalTime.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </Grid>
                      )}

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Corrected Time
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formData.correctedTime?.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Reason for Correction
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                          {formData.reason}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Supporting Documents
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formData.documents.length > 0
                            ? `${formData.documents.length} file(s) attached`
                            : 'No documents attached'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Important:</strong> Once submitted, this request cannot be edited.
                      You will be notified via email when HR reviews your request.
                    </Typography>
                  </Alert>

                  {errors.submit && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      <Typography variant="body2">{errors.submit}</Typography>
                    </Alert>
                  )}
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button
                  onClick={activeStep === 0 ? handleGoBack : handleBack}
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  {activeStep === 0 ? 'Cancel' : 'Back'}
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep < steps.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      disabled={isSubmitting}
                      className="!text-white"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      className="!text-white"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Paper>

        {/* Help Section */}
        <Paper sx={{ p: 3, bgcolor: 'info.50', borderColor: 'info.light' }}>
          <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600, mb: 2 }}>
            Need Help?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            If {`you're`} unsure about which correction type to select or need assistance:
          </Typography>
          <ul style={{ marginLeft: '20px', color: 'info.700' }}>
            <li><Typography variant="body2">Contact HR at hr@company.com </Typography></li>
            <li><Typography variant="body2">Visit the HR office on 3rd floor </Typography></li>
            <li><Typography variant="body2">Check FAQ section for common issues</Typography></li>
          </ul>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}