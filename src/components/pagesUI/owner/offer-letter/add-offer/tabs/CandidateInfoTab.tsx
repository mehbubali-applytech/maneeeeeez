"use client";
import Image from "next/image";
import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";

interface CandidateInfoTabProps {
  profileImage?: string | null;
  onProfileImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CandidateInfoTab: React.FC<CandidateInfoTabProps> = ({
  profileImage,
  onProfileImageUpload
}) => {
  const { control } = useFormContext();

  const handleFileClick = () => {
    const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Candidate Information
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Picture Upload - FIXED */}
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box 
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: '2px dashed',
                borderColor: 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={handleFileClick}
            >
              {profileImage ? (
                <Image 
                  src={profileImage} 
                  alt="Candidate" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary">Click to</Typography>
                  <Typography color="text.secondary">Upload</Typography>
                </Box>
              )}
            </Box>
            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={onProfileImageUpload}
                style={{ display: 'none' }}
                id="profile-image-upload"
              />
              <button
                type="button"
                onClick={handleFileClick}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Upload Photo
              </button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                JPG or PNG, max 5MB
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Rest of the form remains the same */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
            Basic Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="candidateName"
            control={control}
            rules={{ required: "Candidate name is required" }}
            render={({ field, fieldState }) => (
              <InputField
                {...field}
                id="candidateName"
                label="Full Name *"
                error={fieldState.error}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="candidateEmail"
            control={control}
            rules={{ 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            }}
            render={({ field, fieldState }) => (
              <InputField
                {...field}
                id="candidateEmail"
                label="Email Address *"
                type="email"
                error={fieldState.error}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="candidatePhone"
            control={control}
            rules={{ 
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+\-\s]+$/,
                message: "Invalid phone number"
              }
            }}
            render={({ field, fieldState }) => (
              <InputField
                {...field}
                id="candidatePhone"
                label="Phone Number *"
                error={fieldState.error}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="hrContact"
            control={control}
            rules={{ required: "HR contact is required" }}
            render={({ field, fieldState }) => (
              <InputField
                {...field}
                id="hrContact"
                label="HR Contact Person *"
                error={fieldState.error}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'info.dark' }}>
              <strong>💡 Tip:</strong> Ensure candidate information is accurate before sending the offer. 
              This information will be used for all communication and onboarding.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidateInfoTab;