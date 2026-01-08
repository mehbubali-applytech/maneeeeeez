"use client";
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import StorageIcon from "@mui/icons-material/Storage";
import ApiIcon from "@mui/icons-material/Api";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const MyPlanUsage = () => {
  const usageStats = [
    {
      title: "Active Users",
      value: "18/25",
      percent: 72,
      icon: <PeopleIcon />,
      color: "primary",
      trend: "up",
      trendValue: "+12%"
    },
    {
      title: "Storage Used",
      value: "45/100 GB",
      percent: 45,
      icon: <StorageIcon />,
      color: "success",
      trend: "up",
      trendValue: "+8%"
    },
    {
      title: "API Calls",
      value: "8.5K/10K",
      percent: 85,
      icon: <ApiIcon />,
      color: "warning",
      trend: "up",
      trendValue: "+15%"
    },
    {
      title: "Data Transfer",
      value: "2.1/5 TB",
      percent: 42,
      icon: <TrendingUpIcon />,
      color: "info",
      trend: "down",
      trendValue: "-3%"
    }
  ];

  return (
    <div className="card__wrapper">
      <div className="card__title-wrap mb-[25px]">
        <h5 className="card__heading-title">Usage Statistics</h5>
      </div>
      
      <Card variant="outlined">
        <CardContent>
          {usageStats.map((stat, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Box 
                    sx={{ 
                      backgroundColor: `${stat.color}.light`, 
                      color: `${stat.color}.main`,
                      borderRadius: '50%',
                      padding: '8px',
                      marginRight: '12px'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" className="font-semibold">
                      {stat.value}
                    </Typography>
                  </div>
                </div>
                <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  <Typography variant="body2" className="ml-1">
                    {stat.trendValue}
                  </Typography>
                </div>
              </div>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        stat.percent < 70 ? 'bg-green-500' : 
                        stat.percent < 90 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {stat.percent}%
                  </Typography>
                </Box>
              </Box>
            </div>
          ))}
          
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <Typography variant="body2" className="text-blue-800">
              <strong>Tip:</strong> Upgrade to Enterprise plan for unlimited users and storage.
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPlanUsage;