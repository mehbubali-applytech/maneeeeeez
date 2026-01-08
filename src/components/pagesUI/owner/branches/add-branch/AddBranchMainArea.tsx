"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Autocomplete,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Paper,
  Divider,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  LocationOn,
  Phone,
  Schedule,
  Delete,
  Cancel,
  Save,
  Map,
  MyLocation,
  Language,
} from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Types
interface ILocationForm {
  locationName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  officePhone: string;
  latitude?: string;
  longitude?: string;
  timezone: string;
  isActive: boolean;
}

// Mock data
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "China",
  "Brazil",
  "Mexico",
  "Singapore",
  "United Arab Emirates",
  "South Africa",
];

const timezones = [
  { value: "America/New_York", label: "Eastern Time (UTC-5)" },
  { value: "America/Chicago", label: "Central Time (UTC-6)" },
  { value: "America/Denver", label: "Mountain Time (UTC-7)" },
  { value: "America/Los_Angeles", label: "Pacific Time (UTC-8)" },
  { value: "Europe/London", label: "GMT (UTC+0)" },
  { value: "Europe/Paris", label: "CET (UTC+1)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (UTC+4)" },
  { value: "Asia/Kolkata", label: "India Standard Time (UTC+5:30)" },
  { value: "Asia/Singapore", label: "Singapore Time (UTC+8)" },
  { value: "Australia/Sydney", label: "AET (UTC+10)" },
];

// For auto-suggesting timezone based on country
const countryTimezoneMap: Record<string, string> = {
  "United States": "America/New_York",
  "Canada": "America/Toronto",
  "United Kingdom": "Europe/London",
  "Australia": "Australia/Sydney",
  "Germany": "Europe/Berlin",
  "France": "Europe/Paris",
  "Japan": "Asia/Tokyo",
  "India": "Asia/Kolkata",
  "China": "Asia/Shanghai",
  "Brazil": "America/Sao_Paulo",
};

const AddBranchMainArea: React.FC<{ isEdit?: boolean; locationId?: string }> = ({
  isEdit = false,
  locationId
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mapPreview, setMapPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ILocationForm>({
    defaultValues: {
      locationName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      officePhone: "",
      latitude: "",
      longitude: "",
      timezone: "",
      isActive: true,
    },
  });

  // Watch values for auto-updates
  const watchCountry = watch("country");
  const watchLatitude = watch("latitude");
  const watchLongitude = watch("longitude");

  // Auto-suggest timezone based on country
  useEffect(() => {
    if (watchCountry && countryTimezoneMap[watchCountry] && !watch("timezone")) {
      setValue("timezone", countryTimezoneMap[watchCountry]);
    }
  }, [watchCountry, setValue, watch]);

  // Generate map preview URL when coordinates change
  useEffect(() => {
    if (watchLatitude && watchLongitude) {
      const lat = parseFloat(watchLatitude);
      const lng = parseFloat(watchLongitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=400x200&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`;
        setMapPreview(mapUrl);
      }
    } else {
      setMapPreview(null);
    }
  }, [watchLatitude, watchLongitude]);

  // Handle current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude.toFixed(6));
          setValue("longitude", position.coords.longitude.toFixed(6));
          toast.success("Current location obtained");
        },
        (error) => {
          toast.error("Unable to get current location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const onSubmit = async (data: ILocationForm) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const payload = {
        ...data,
        id: isEdit ? locationId : Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Location Payload:", payload);

      toast.success(
        isEdit
          ? "Location updated successfully!"
          : "Location added successfully!"
      );

      setTimeout(() => {
        router.push("/owner/locations");
      }, 1000);

    } catch (error) {
      toast.error("Failed to save location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !locationId) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Location deleted successfully!");
      setDeleteDialogOpen(false);

      setTimeout(() => {
        router.push("/owner/locations");
      }, 500);

    } catch (error) {
      toast.error("Failed to delete location");
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        router.push("/owner/locations");
      }
    } else {
      router.push("/owner/locations");
    }
  };

  // Load data for edit mode (mock)
  useEffect(() => {
    if (isEdit && locationId) {
      // Mock loading data
      const mockData: ILocationForm = {
        locationName: "Headquarters",
        addressLine1: "123 Business Street",
        addressLine2: "Suite 500",
        city: "San Francisco",
        state: "California",
        country: "United States",
        postalCode: "94105",
        officePhone: "+1 415 555 1234",
        latitude: "37.7749",
        longitude: "-122.4194",
        timezone: "America/Los_Angeles",
        isActive: true,
      };
      reset(mockData);
    }
  }, [isEdit, locationId, reset]);

  return (
    <div className="app__slide-wrapper">
      <Box sx={{ p: 3 }}>
        {/* Breadcrumb */}
        <Box sx={{ mb: 3 }}>

          <div className="breadcrumb__wrapper mb-[25px]">
            <nav>
              <ol className="breadcrumb flex items-center mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/owner">Owner</Link>
                </li>
                <li className="breadcrumb-item active">All Branches</li>
              </ol>
            </nav>
          </div>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
              <LocationOn sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                {isEdit ? "Edit Office Location" : "Add New Office Location"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isEdit
                  ? "Update the details of your office location"
                  : "Fill in the details below to add a new office location"}
              </Typography>
            </Box>
          </Box>

          {isEdit && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Editing location: <strong>{watch("locationName") || "Unnamed Location"}</strong>
              <br />
              <small>Changes will affect all associated employees and departments.</small>
            </Alert>
          )}
        </Box>

        {/* Form Card */}
        <Paper elevation={0} sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3
        }}>
          <Box sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Location Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter all required information for the office location
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 3 }}>
              {/* Two-column layout for desktop */}
              <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} lg={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Location Name */}
                    <Controller
                      name="locationName"
                      control={control}
                      rules={{ required: "Location name is required" }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Office / Location Name"
                          required
                          fullWidth
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          placeholder="e.g., Headquarters, Mumbai Branch"
                        />
                      )}
                    />

                    {/* Address Line 1 */}
                    <Controller
                      name="addressLine1"
                      control={control}
                      rules={{ required: "Address line 1 is required" }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Address Line 1"
                          required
                          fullWidth
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          placeholder="e.g., 12 Park Street"
                          InputProps={{
                            startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
                          }}
                        />
                      )}
                    />

                    {/* Address Line 2 */}
                    <Controller
                      name="addressLine2"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Address Line 2"
                          fullWidth
                          placeholder="e.g., Near Central Mall, Suite 500"
                        />
                      )}
                    />

                    {/* City, State, Country Row */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name="city"
                          control={control}
                          rules={{ required: "City is required" }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              label="City"
                              required
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name="state"
                          control={control}
                          rules={{ required: "State/Province is required" }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              label="State / Province"
                              required
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name="country"
                          control={control}
                          rules={{ required: "Country is required" }}
                          render={({ field, fieldState }) => (
                            <Autocomplete
                              value={field.value}
                              onChange={(event, newValue) => {
                                field.onChange(newValue || "");
                              }}
                              options={countries}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Country"
                                  required
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  inputRef={field.ref}
                                />
                              )}
                              freeSolo
                              disableClearable
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    {/* Postal Code */}
                    <Controller
                      name="postalCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Postal Code / ZIP Code"
                          fullWidth
                          placeholder="e.g., 94105, 400001"
                        />
                      )}
                    />
                  </Box>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} lg={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Phone Number */}
                    <Controller
                      name="officePhone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Office Phone Number"
                          fullWidth
                          placeholder="+91 9876543210"
                          InputProps={{
                            startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                          }}
                        />
                      )}
                    />

                    {/* Timezone */}
                    <Controller
                      name="timezone"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          value={timezones.find(tz => tz.value === field.value) || null}
                          onChange={(event, newValue) => {
                            field.onChange(newValue ? newValue.value : "");
                          }}
                          options={timezones}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Timezone"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <Language sx={{ mr: 1, color: 'action.active' }} />
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }}
                              inputRef={field.ref}
                            />
                          )}
                          fullWidth
                        />
                      )}
                    />

                    {/* Active Status */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Active Status
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {watch("isActive")
                              ? "This location is active and visible"
                              : "This location is inactive and hidden"}
                          </Typography>
                        </Box>
                        <Controller
                          name="isActive"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={field.value}
                                  onChange={field.onChange}
                                  color="success"
                                  size="medium"
                                />
                              }
                              label={
                                <Chip
                                  label={field.value ? "ACTIVE" : "INACTIVE"}
                                  size="small"
                                  color={field.value ? "success" : "default"}
                                  variant={field.value ? "filled" : "outlined"}
                                />
                              }
                            />
                          )}
                        />
                      </Box>

                      {watch("isActive") ? (
                        <Alert severity="success" sx={{ mt: 1 }} icon={<></>}>
                          <Typography variant="caption">
                            ✓ Location is ready to accept operations and will be visible in listings.
                          </Typography>
                        </Alert>
                      ) : (
                        <Alert severity="warning" sx={{ mt: 1 }} icon={<></>}>
                          <Typography variant="caption">
                            ⚠ Location is currently disabled and will not be visible in listings.
                          </Typography>
                        </Alert>
                      )}
                    </Paper>
                  </Box>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Divider sx={{ my: 4 }} />
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box>
                  {isEdit && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialogOpen(true)}
                      sx={{ mr: 2 }}
                    >
                      Delete Location
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isSubmitting}
                    className="!text-white"
                  >
                    {isSubmitting ? "Saving..." : "Save Location"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        </Paper>

        {/* Tips Card */}
        <Paper elevation={0} sx={{
          border: '1px solid',
          borderColor: 'info.light',
          borderRadius: 2,
          bgcolor: 'info.50',
          p: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'info.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              flexShrink: 0
            }}>
              <Typography variant="h6" sx={{ color: 'info.main' }}>💡</Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'info.dark' }}>
                Tips for adding a new location
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
                <li>
                  <Typography variant="body2">
                    <strong>Location Name:</strong> Use a descriptive name that employees will recognize (e.g., NYC Office, Mumbai HQ).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Coordinates:</strong> Adding latitude/longitude enables GPS-based attendance tracking and geo-fencing.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Timezone:</strong> Set correctly for accurate time reporting and scheduling.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Active Status:</strong> Set to inactive for locations that are temporarily closed or under construction.
                  </Typography>
                </li>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Location
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this location?
            <br />
            <strong>This action cannot be undone.</strong>
            <br />
            <br />
            <strong>Location:</strong> {watch("locationName")}
            <br />
            <strong>Address:</strong> {watch("addressLine1")}, {watch("city")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBranchMainArea;