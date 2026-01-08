"use client";
import React from "react";
import { Card, CardContent, Typography, Box, Chip, Button, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import BusinessIcon from "@mui/icons-material/Business";
import CheckIcon from "@mui/icons-material/Check";

const ModuleTiers = () => {
  const tiers = [
    {
      name: "Basic Tier",
      icon: <CheckCircleIcon />,
      color: "info",
      price: "$29/month",
      description: "Essential modules for small teams",
      moduleCount: 5,
      features: [
        "Up to 50 users",
        "Basic HR modules",
        "Email support",
        "5GB storage",
        "Standard reports"
      ],
      popular: false
    },
    {
      name: "Pro Tier",
      icon: <StarIcon />,
      color: "primary",
      price: "$99/month",
      description: "Advanced features for growing businesses",
      moduleCount: 12,
      features: [
        "Up to 200 users",
        "All HR & Finance modules",
        "Priority support",
        "50GB storage",
        "Advanced analytics",
        "API access",
        "Custom reports"
      ],
      popular: true
    },
    {
      name: "Enterprise Tier",
      icon: <BusinessIcon />,
      color: "success",
      price: "$199/month",
      description: "Complete solution for large organizations",
      moduleCount: 20,
      features: [
        "Unlimited users",
        "All modules included",
        "24/7 dedicated support",
        "500GB storage",
        "Advanced analytics",
        "Full API access",
        "Custom integrations",
        "Personal account manager",
        "White-label option"
      ],
      popular: false
    }
  ];

  const getColor = (color: string) => {
    switch (color) {
      case "info": return "#0288d1";
      case "primary": return "#1976d2";
      case "success": return "#2e7d32";
      default: return "#757575";
    }
  };

  return (
    <div className="card__wrapper">
      <div className="card__title-wrap mb-[25px]">
        <h5 className="card__heading-title">Module Tiers</h5>
      </div>
      
      {tiers.map((tier, index) => (
        <Card 
          key={index} 
          variant="outlined" 
          className="mb-6 relative"
          sx={{
            borderColor: tier.popular ? getColor(tier.color) : undefined,
            borderWidth: tier.popular ? 2 : 1
          }}
        >
          {tier.popular && (
            <Chip
              label="Most Popular"
              color="primary"
              size="small"
              className="absolute -top-3 left-1/2 transform -translate-x-1/2"
            />
          )}
          
          <CardContent>
            <div className="flex items-center mb-4">
              <Box
                sx={{
                  backgroundColor: `${tier.color}.light`,
                  color: `${tier.color}.main`,
                  borderRadius: '50%',
                  padding: '12px',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {tier.icon}
              </Box>
              <div>
                <Typography variant="h6" className="font-semibold">
                  {tier.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tier.description}
                </Typography>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <Typography variant="h4" className="font-bold">
                {tier.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tier.moduleCount} modules included
              </Typography>
            </div>
            
            <Divider className="my-4" />
            
            <Typography variant="subtitle2" className="font-medium mb-3">
              Features Included:
            </Typography>
            
            <div className="space-y-2 mb-6">
              {tier.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start">
                  <CheckIcon 
                    fontSize="small" 
                    className="mr-2 mt-0.5" 
                    sx={{ color: getColor(tier.color) }}
                  />
                  <Typography variant="body2">{feature}</Typography>
                </div>
              ))}
            </div>
            
            <Button
              variant={tier.popular ? "contained" : "outlined"}
              fullWidth
              sx={{
                backgroundColor: tier.popular ? getColor(tier.color) : undefined,
                color: tier.popular ? 'white' : undefined,
                '&:hover': {
                  backgroundColor: tier.popular ? getColor(tier.color) : undefined,
                  opacity: 0.9
                }
              }}
            >
              {tier.popular ? "Get Started" : "Learn More"}
            </Button>
          </CardContent>
        </Card>
      ))}
      
      <Card variant="outlined" className="bg-blue-50">
        <CardContent>
          <Typography variant="body2" className="text-blue-800">
            <strong>Note:</strong> You can mix modules from different tiers based on your subscription plan.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleTiers;