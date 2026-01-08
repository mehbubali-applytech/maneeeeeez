// AccessTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Slider,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Autocomplete
} from "@mui/material";
import {
  AccessTime,
  Lock,
  LockOpen,
  Person,
  Map,
  LocationOn,
  Schedule,
  Security,
  Send,
  Refresh,
  Visibility,
  VisibilityOff,
  Delete
} from "@mui/icons-material";
import { useFormContext, Controller } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";
import { ATTENDANCE_TYPE_OPTIONS } from "../EmployeeTypes";

interface AccessTabProps {
  watchSystemUserEnabled: boolean;
}

const AccessTab: React.FC<AccessTabProps> = ({ watchSystemUserEnabled }) => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const [generatingPassword, setGeneratingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoRadius, setGeoRadius] = useState<number>(100);

  const watchAttendanceType = watch('attendanceType');
  const watchUsername = watch('username');
  const watchTemporaryAccess = watch('temporaryAccessUntil');

  // Mock roles data (would come from API)
  const ROLES = [
    { id: 1, name: "Employee", description: "Basic employee access" },
    { id: 2, name: "Team Lead", description: "Team management access" },
    { id: 3, name: "Manager", description: "Department management access" },
    { id: 4, name: "Admin", description: "Full system access" },
    { id: 5, name: "HR", description: "HR management access" },
    { id: 6, name: "Finance", description: "Finance department access" }
  ];

  // Get current location for geo-fencing
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeoLocation({ lat: latitude, lng: longitude });
          setValue('geoFence', {
            latitude,
            longitude,
            radius: geoRadius
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get current location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const generatePassword = () => {
    setGeneratingPassword(true);
    // Simulate password generation
    setTimeout(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setValue('password', password);
      setGeneratingPassword(false);
    }, 1000);
  };

  const generateUsername = () => {
    const firstName = watch('firstName')?.toLowerCase() || '';
    const lastName = watch('lastName')?.toLowerCase() || '';
    const email = watch('email')?.split('@')[0] || '';

    if (firstName && lastName) {
      setValue('username', `${firstName}.${lastName}`);
    } else if (email) {
      setValue('username', email);
    }
  };

  const sendOnboardingEmail = () => {
    const email = watch('email');
    const username = watch('username');

    if (!email || !username) {
      alert("Please fill in email and username first");
      return;
    }

    // Simulate sending email
    console.log(`Sending onboarding email to ${email} with username: ${username}`);
    alert(`Onboarding email would be sent to ${email}`);
  };

  const getAttendanceTypeDescription = (type: string) => {
    switch (type) {
      case 'App': return 'Employee marks attendance via mobile app';
      case 'Biometric': return 'Employee uses biometric device for attendance';
      case 'GPS': return 'Employee attendance based on GPS location';
      default: return '';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 3
      }}>
        <Security sx={{ mr: 1 }} />
        Attendance & System Access
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Attendance Settings */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Attendance Type */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600
              }}>
                <AccessTime sx={{ mr: 1 }} />
                Attendance Settings *
              </Typography>

              <Controller
                name="attendanceType"
                control={control}
                rules={{ required: "Attendance type is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={ATTENDANCE_TYPE_OPTIONS}
                    getOptionLabel={(option) => option.label}
                    value={ATTENDANCE_TYPE_OPTIONS.find(option => option.value === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.value || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select attendance type"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {option.label}
                        </Box>
                      </MenuItem>
                    )}
                  />
                )}
              />

              {watchAttendanceType && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {getAttendanceTypeDescription(watchAttendanceType)}
                  </Typography>
                </Alert>
              )}

              {/* GPS Geo-fencing (Conditional) */}
              {watchAttendanceType === 'GPS' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Map sx={{ mr: 1 }} />
                    Geo-fence Settings
                  </Typography>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2">
                          Current Location
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<LocationOn />}
                          onClick={getCurrentLocation}
                          variant="outlined"
                        >
                          {geoLocation ? 'Update Location' : 'Get Location'}
                        </Button>
                      </Box>

                      {geoLocation ? (
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              label="Latitude"
                              value={geoLocation.lat.toFixed(6)}
                              size="small"
                              fullWidth
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="Longitude"
                              value={geoLocation.lng.toFixed(6)}
                              size="small"
                              fullWidth
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>
                        </Grid>
                      ) : (
                        <Alert severity="warning">
                          <Typography variant="body2">
                            Location not set. Click Get Location to enable GPS attendance.
                          </Typography>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {/* Geo-fence Radius */}
                  <Box sx={{ mt: 2 }}>
                    <Typography gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Geo-fence Radius</span>
                      <Chip label={`${geoRadius} meters`} size="small" />
                    </Typography>
                    <Slider
                      value={geoRadius}
                      onChange={(_, value) => {
                        setGeoRadius(value as number);
                        if (geoLocation) {
                          setValue('geoFence', {
                            latitude: geoLocation.lat,
                            longitude: geoLocation.lng,
                            radius: value as number
                          });
                        }
                      }}
                      min={50}
                      max={500}
                      step={50}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}m`}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Set the allowed distance from the location for attendance marking
                    </Typography>
                  </Box>

                  {/* Map Preview (Mock) */}
                  <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <LocationOn sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="body2" gutterBottom>
                        {geoLocation ? 'Location set for GPS attendance' : 'No location set'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {geoLocation
                          ? `Lat: ${geoLocation.lat.toFixed(4)}, Lng: ${geoLocation.lng.toFixed(4)}`
                          : 'Enable location services to continue'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Paper>

            {/* Temporary Access */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600
              }}>
                <Schedule sx={{ mr: 1 }} />
                Temporary Access
              </Typography>

              <InputField
                label="Access Valid Until"
                id="temporaryAccessUntil"
                type="date"
                required={false}
                register={useFormContext().register("temporaryAccessUntil")}
              />

              {watchTemporaryAccess && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Access will expire on {new Date(watchTemporaryAccess).toLocaleDateString()}
                  </Typography>
                </Alert>
              )}
            </Paper>

            {/* System Access Toggle */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    {watchSystemUserEnabled ? <LockOpen sx={{ mr: 1 }} /> : <Lock sx={{ mr: 1 }} />}
                    System User Account
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {watchSystemUserEnabled
                      ? "Employee will have login access to the system"
                      : "No system access will be created"}
                  </Typography>
                </Box>
                <Controller
                  name="systemUserEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      color="primary"
                    />
                  )}
                />
              </Box>

              {watchSystemUserEnabled && (
                <Alert severity="info">
                  <Typography variant="body2">
                    System user account will be created upon saving. Login credentials will be sent via email.
                  </Typography>
                </Alert>
              )}
            </Paper>
          </Box>
        </Grid>

        {/* Right Column - System Access (Conditional) */}
        <Grid item xs={12} md={6}>
          {watchSystemUserEnabled ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username */}
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Username *
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<Refresh />}
                    onClick={generateUsername}
                    variant="outlined"
                  >
                    Generate
                  </Button>
                </Box>

                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: "Username is required",
                    minLength: { value: 3, message: "Minimum 3 characters" }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Username must be unique across the system
                </Typography>
              </Paper>

              {/* Password (Auto-generated) */}
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Initial Password
                  </Typography>
                  <Button
                    size="small"
                    startIcon={generatingPassword ? <CircularProgress size={16} /> : <Refresh />}
                    onClick={generatePassword}
                    variant="outlined"
                    disabled={generatingPassword}
                  >
                    {generatingPassword ? 'Generating...' : 'Generate'}
                  </Button>
                </Box>

                <Box sx={{ position: 'relative' }}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        type={showPassword ? "text" : "password"}
                        value={field.value || ''}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          )
                        }}
                      />
                    )}
                  />
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Password will be auto-generated and sent to employee&apos;s email.
                    Employee will be prompted to change password on first login.
                  </Typography>
                </Alert>
              </Paper>

              {/* Roles & Permissions */}
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Roles & Permissions *
                </Typography>

                <Controller
                  name="roleIds"
                  control={control}
                  rules={{
                    required: "At least one role is required",
                    validate: value => value && value.length > 0
                  }}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      multiple
                      options={ROLES}
                      getOptionLabel={(option) => option.name}
                      value={ROLES.filter(role => (field.value || []).includes(role.id))}
                      onChange={(_, value) => {
                        const ids = value.map(role => role.id);
                        field.onChange(ids);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select roles"
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                        />
                      )}
                      renderOption={(props, option) => (
                        <MenuItem {...props} key={option.id}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2">{option.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.name}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))
                      }
                    />
                  )}
                />

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Select the roles that determine system access permissions
                </Typography>

                {/* Selected Roles Preview */}
                {watch('roleIds') && watch('roleIds').length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Selected Roles:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(watch('roleIds') || []).map((roleId: number) => {
                        const role = ROLES.find(r => r.id === roleId);
                        return (
                          <Chip
                            key={roleId}
                            label={role?.name}
                            size="small"
                            color="primary"
                            onDelete={() => {
                              const current = watch('roleIds') || [];
                              setValue('roleIds', current.filter((id: number) => id !== roleId));
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Paper>

              {/* Onboarding Email */}
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Onboarding Communication
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      Send welcome email with login credentials and system access instructions.
                    </Typography>
                  </Alert>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={sendOnboardingEmail}
                      fullWidth
                      className="!text-white"
                    >
                      Send Onboarding Email
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        // Preview email
                        console.log("Preview onboarding email");
                      }}
                    >
                      Preview
                    </Button>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Email will be sent to: {watch('email') || 'No email set'}
                  </Typography>
                </Box>
              </Paper>

              {/* Access Summary */}
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Access Summary
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">System Access:</Typography>
                    <Chip label="Enabled" size="small" color="success" />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Username:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {watchUsername || 'Not set'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Roles Assigned:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {(watch('roleIds') || []).length} role(s)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Temporary Access:</Typography>
                    <Typography variant="body2">
                      {watchTemporaryAccess ?
                        `Until ${new Date(watchTemporaryAccess).toLocaleDateString()}` :
                        'Permanent'
                      }
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Attendance Type:</Typography>
                    <Chip label={watchAttendanceType} size="small" variant="outlined" />
                  </Box>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              p: 4
            }}>
              <Lock sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom color="text.secondary">
                System Access Disabled
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Enable System User Account to configure login credentials and permissions
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This is suitable for contractors or employees who don&apos;t need system access.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Final Notes */}
      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Important:</strong> System access settings can only be modified before the employee&apos;s first login.
          After first login, changes must be made through the user management system.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AccessTab;