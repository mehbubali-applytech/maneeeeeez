"use client";
import React from "react";
import { Card, CardContent, Typography, Chip, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface ModuleSingleCardProps {
  iconClass: string;
  title: string;
  description: string;
  status?: "active" | "inactive";
  tier?: "basic" | "pro" | "enterprise";
  price?: number;
}

const ModuleSingleCard: React.FC<ModuleSingleCardProps> = ({
  iconClass,
  title,
  description,
  status = "active",
  tier = "basic",
  price = 0
}) => {
  
  const getTierColor = () => {
    switch (tier) {
      case "basic": return "info";
      case "pro": return "primary";
      case "enterprise": return "success";
      default: return "default";
    }
  };

  const getStatusColor = () => {
    return status === "active" ? "success" : "error";
  };

  return (
    <Card variant="outlined" className="h-full">
      <CardContent className="h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Box
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.main',
                borderRadius: '50%',
                padding: '10px',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px'
              }}
            >
              <i className={iconClass}></i>
            </Box>
            <div>
              <Typography variant="h6" className="font-semibold">
                {title}
              </Typography>
            </div>
          </div>
          <Chip
            label={tier}
            color={getTierColor()}
            size="small"
          />
        </div>
        
        <Typography variant="body2" color="text.secondary" className="mb-4 flex-grow">
          {description}
        </Typography>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            {status === "active" ? (
              <CheckCircleIcon color="success" fontSize="small" />
            ) : (
              <CancelIcon color="error" fontSize="small" />
            )}
            <Typography variant="body2" className="ml-1">
              {status === "active" ? "Active" : "Inactive"}
            </Typography>
          </div>
          <Typography variant="body1" className="font-semibold">
            ${price}/month
          </Typography>
        </div>
        
        <Button
          variant="outlined"
          size="small"
          fullWidth
          color={status === "active" ? "secondary" : "primary"}
        >
          {status === "active" ? "Deactivate" : "Activate"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuleSingleCard;