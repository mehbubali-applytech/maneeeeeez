// tabs/PersonalInfoTab.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  IconButton,
  FormControlLabel,
  Checkbox,
  Chip,
  Alert,
  Autocomplete,
  TextField,
  CircularProgress
} from "@mui/material";
import {
  Person,
  Home,
  Emergency,
  CloudUpload,
  Delete,
  Male,
  Female,
  Transgender
} from "@mui/icons-material";
import { useFormContext, Controller } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";

// Types for API response
interface PostOffice {
  Name: string;
  District: string;
  State: string;
  Country: string;
  Pincode: string;
}

interface ApiResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[];
}

interface PersonalInfoTabProps {
  profileImage: string | null;
  onProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  watchSameAsPresentAddress: boolean;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  profileImage,
  onProfileImageUpload,
  watchSameAsPresentAddress
}) => {
  const {
    control,
    watch,
    setValue,
    register,
    trigger,
    formState: { errors }
  } = useFormContext();

  const presentAddress = watch('presentAddress');
  const sameAsPresent = watch('sameAsPresentAddress');
  const presentZipCode = watch('presentAddress.zipCode');

  const [loading, setLoading] = useState(false);
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const zipDebounceTimer = React.useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (sameAsPresent && presentAddress) {
      setValue('permanentAddress', presentAddress);
    }
  }, [sameAsPresent, presentAddress, setValue]);

useEffect(() => {
  const fetchPostOfficeData = async (zipCode: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${zipCode}`);
      const data: ApiResponse[] = await response.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const offices = data[0].PostOffice;
        setPostOffices(offices);

        const cities = Array.from(new Set(offices.map(o => o.Name)));
        setCityOptions(cities);

        const firstOffice = offices[0];
        setValue('presentAddress.state', firstOffice.State);
        setValue('presentAddress.country', firstOffice.Country);

        setValue('presentAddress.city', cities.length === 1 ? cities[0] : '');
        trigger(['presentAddress.state', 'presentAddress.country']);
      } else {
        setPostOffices([]);
        setCityOptions([]);
        setValue('presentAddress.city', '');
        setValue('presentAddress.state', '');
        setValue('presentAddress.country', '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const zipCode = presentZipCode?.trim();

  if (!zipCode || zipCode.length !== 6 || !/^\d+$/.test(zipCode)) {
    setPostOffices([]);
    setCityOptions([]);
    return;
  }

  if (zipDebounceTimer.current) {
    clearTimeout(zipDebounceTimer.current);
  }

  zipDebounceTimer.current = setTimeout(() => {
    fetchPostOfficeData(zipCode);
  }, 800);

  return () => {
    if (zipDebounceTimer.current) {
      clearTimeout(zipDebounceTimer.current);
    }
  };
}, [presentZipCode, setValue, trigger]);


  const handleGenderSelect = (gender: string) => {
    setValue('gender', gender as any);
  };

  const handleCityChange = (value: string | null) => {
    setValue('presentAddress.city', value || '');
  };


  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 3
      }}>
        <Person sx={{ mr: 1 }} />
        Personal Information
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={profileImage || ''}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '3px solid',
                    borderColor: 'primary.light'
                  }}
                >
                  <Person sx={{ fontSize: 48 }} />
                </Avatar>
                <input
                  accept="image/jpeg,image/png,image/jpg"
                  type="file"
                  id="profile-photo-upload"
                  style={{ display: 'none' }}
                  onChange={onProfileImageUpload}
                />
                <label htmlFor="profile-photo-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    <CloudUpload fontSize="small" />
                  </IconButton>
                </label>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Profile Photo
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  JPG or PNG, max 5MB
                </Typography>
                {profileImage && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setValue('profilePhoto', '');
                      // @ts-ignore
                      setProfileImage(null);
                    }}
                    color="error"
                    sx={{ mt: 1 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Name Fields */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <InputField
                  label="First Name *"
                  id="firstName"
                  type="text"
                  required={true}
                  register={register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" }
                  })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputField
                  label="Middle Name"
                  id="middleName"
                  type="text"
                  required={false}
                  register={register("middleName")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputField
                  label="Last Name *"
                  id="lastName"
                  type="text"
                  required={true}
                  register={register("lastName", {
                    required: "Last name is required"
                  })}
                />
              </Grid>
            </Grid>

            {/* Preferred Name */}
            <InputField
              label="Preferred Name (Display Name)"
              id="preferredName"
              type="text"
              required={false}
              register={register("preferredName")}
            />

            {/* Email */}
            <InputField
              label="Email Address *"
              id="email"
              type="email"
              required={true}
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />

            {/* Phone Number */}
            <InputField
              label="Phone Number"
              id="phoneNumber"
              type="tel"
              required={false}
              register={register("phoneNumber", {
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: "Invalid phone number format"
                }
              })}
            />

            {/* Date of Birth */}
            <InputField
              label="Date of Birth"
              id="dateOfBirth"
              type="date"
              required={false}
              register={register("dateOfBirth")}
            />

            {/* Gender Selection */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                Gender
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <Chip
                    key={gender}
                    label={gender}
                    onClick={() => handleGenderSelect(gender)}
                    variant={watch('gender') === gender ? "filled" : "outlined"}
                    color={watch('gender') === gender ? "primary" : "default"}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Home sx={{ mr: 1 }} />
                Present Address *
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputField
                    label="Address Line 1"
                    id="presentAddress.addressLine1"
                    type="text"
                    required={true}
                    register={register("presentAddress.addressLine1", {
                      required: "Address line 1 is required"
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    label="Address Line 2"
                    id="presentAddress.addressLine2"
                    type="text"
                    required={false}
                    register={register("presentAddress.addressLine2")}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Controller
                    name="presentAddress.zipCode"
                    control={control}
                    rules={{
                      required: "ZIP code is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "ZIP code must be 6 digits"
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="ZIP Code *"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          endAdornment: loading && (
                            <CircularProgress size={20} />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="presentAddress.city"
                    control={control}
                    rules={{
                      required: "City is required"
                    }}
                    render={({ field, fieldState }) => (
                      <Autocomplete
                        {...field}
                        freeSolo
                        options={cityOptions}
                        loading={loading}
                        value={field.value || ''}
                        onChange={(_, newValue) => {
                          field.onChange(newValue);
                        }}
                        onInputChange={(_, newInputValue) => {
                          field.onChange(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="City *"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || (cityOptions.length > 0 ? `Found ${cityOptions.length} cities` : '')}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        disabled={loading}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="presentAddress.state"
                    control={control}
                    rules={{
                      required: "State is required"
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="State *"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            backgroundColor: 'action.hover',
                            cursor: 'default'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="presentAddress.country"
                    control={control}
                    rules={{
                      required: "Country is required"
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Country *"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            backgroundColor: 'action.hover',
                            cursor: 'default'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                  Permanent Address
                </Typography>
                <Controller
                  name="sameAsPresentAddress"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Same as Present Address
                        </Typography>
                      }
                    />
                  )}
                />
              </Box>

              {!sameAsPresent && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputField
                      label="Address Line 1"
                      id="permanentAddress.addressLine1"
                      type="text"
                      required={!sameAsPresent}
                      register={register("permanentAddress.addressLine1", {
                        required: !sameAsPresent ? "Address line 1 is required" : false
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputField
                      label="Address Line 2"
                      id="permanentAddress.addressLine2"
                      type="text"
                      required={false}
                      register={register("permanentAddress.addressLine2")}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputField
                      label="City"
                      id="permanentAddress.city"
                      type="text"
                      required={!sameAsPresent}
                      register={register("permanentAddress.city", {
                        required: !sameAsPresent ? "City is required" : false
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputField
                      label="State"
                      id="permanentAddress.state"
                      type="text"
                      required={!sameAsPresent}
                      register={register("permanentAddress.state", {
                        required: !sameAsPresent ? "State is required" : false
                      })}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Emergency sx={{ mr: 1 }} />
                Emergency Contact *
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Contact Name"
                    id="emergencyContactName"
                    type="text"
                    required={true}
                    register={register("emergencyContactName", {
                      required: "Emergency contact name is required"
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Relation"
                    id="emergencyContactRelation"
                    type="text"
                    required={true}
                    register={register("emergencyContactRelation", {
                      required: "Relation is required"
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    label="Phone Number"
                    id="emergencyContactPhone"
                    type="tel"
                    required={true}
                    register={register("emergencyContactPhone", {
                      required: "Emergency contact phone is required",
                      pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: "Invalid phone number format"
                      }
                    })}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mt: 3 }}>
          <Typography variant="subtitle2">
            Please fix the following errors:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>
                <Typography variant="body2">
                  {(error as any)?.message || 'Invalid field'}
                </Typography>
              </li>
            ))}
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default PersonalInfoTab;