"use client";

import React from "react";
import { Tooltip, Box, Typography, Chip } from "@mui/material";
import { Edit, History } from "@mui/icons-material";

interface ManualEditHighlightProps {
  isManualEntry: boolean;
  overriddenBy?: string;
  overriddenAt?: string;
  children: React.ReactNode;
}

const ManualEditHighlight: React.FC<ManualEditHighlightProps> = ({
  isManualEntry,
  overriddenBy,
  overriddenAt,
  children
}) => {
  if (!isManualEntry) return <>{children}</>;

  const tooltipText = `Manually corrected by ${overriddenBy || 'HR'} on ${
    overriddenAt ? new Date(overriddenAt).toLocaleDateString() : 'unknown date'
  }`;

  return (
    <Tooltip title={tooltipText} arrow>
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#fff9e6',
          border: '1px solid #ffd54f',
          borderRadius: 1,
          p: 1,
          '&:hover': {
            bgcolor: '#fff3cd'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Edit fontSize="small" color="warning" />
          <Typography variant="caption" color="warning.dark">
            Manual Entry
          </Typography>
          {overriddenBy && (
            <Chip
              label={`By: ${overriddenBy}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.6rem' }}
            />
          )}
        </Box>
        {children}
      </Box>
    </Tooltip>
  );
};

export default ManualEditHighlight;