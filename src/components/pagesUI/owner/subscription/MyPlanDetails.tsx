"use client";
import React from "react";
import { Card, CardContent, Typography, Button, Box, Chip, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";

const MyPlanDetails = () => {
    const currentPlan = {
        name: "Pro Plan",
        price: "$79/month",
        status: "Active",
        renewalDate: "2024-04-15",
        users: 25,
        storage: "100GB",
        support: "Priority Support",
        features: [
            "Unlimited Users",
            "All Modules Access",
            "Priority Support",
            "Advanced Analytics",
            "Custom Reports",
            "API Access",
            "100GB Storage",
            "Email & Chat Support"
        ]
    };

    const planLimits = [
        { label: "Users", used: 18, total: 25, percent: 72 },
        { label: "Storage", used: 45, total: 100, unit: "GB", percent: 45 },
        { label: "API Calls", used: 8500, total: 10000, percent: 85 },
    ];

    return (
        <div className="card__wrapper">
            <div className="card__title-wrap mb-[25px]">
                <h5 className="card__heading-title">Current Plan Details</h5>
            </div>

            <Card variant="outlined" className="mb-6">
                <CardContent>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <Typography variant="h5" component="h2" className="font-semibold">
                                {currentPlan.name}
                            </Typography>
                            <Typography variant="h4" className="text-2xl font-bold mt-2">
                                {currentPlan.price}
                            </Typography>
                            <Chip
                                label={currentPlan.status}
                                color="success"
                                size="small"
                                className="mt-2"
                                icon={<CheckCircleIcon />}
                            />
                        </div>
                        <div className="text-right">
                            <Typography variant="body2" color="text.secondary">
                                Renews on
                            </Typography>
                            <Typography variant="body1" className="font-medium">
                                {currentPlan.renewalDate}
                            </Typography>
                        </div>
                    </div>

                    <Divider className="my-4" />

                    <div className="mb-6">
                        <Typography variant="h6" className="font-medium mb-3">
                            Plan Features
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {currentPlan.features.map((feature, index) => (
                                <div key={index} className="flex items-center">
                                    <CheckCircleIcon className="text-green-500 mr-2" fontSize="small" />
                                    <Typography variant="body2">{feature}</Typography>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Divider className="my-4" />

                    <div>
                        <Typography variant="h6" className="font-medium mb-3">
                            Usage Limits
                        </Typography>
                        {planLimits.map((limit, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <Typography variant="body2">
                                        {limit.label}
                                    </Typography>
                                    <Typography variant="body2" className="font-medium">
                                        {limit.used}{limit.unit ? limit.unit : ''} / {limit.total}{limit.unit ? limit.unit : ''} ({limit.percent}%)
                                    </Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ width: '100%', mr: 1 }}>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${limit.percent < 70 ? 'bg-green-500' :
                                                        limit.percent < 90 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${limit.percent}%` }}
                                            />
                                        </div>
                                    </Box>
                                </Box>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                     <Button 
  variant="contained" 
  color="primary"
  className="!text-white"
  startIcon={<InfoIcon />}
>
  Upgrade Plan
</Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                        >
                            Cancel Subscription
                        </Button>
                        <Button
                            variant="text"
                            color="inherit"
                        >
                            View Invoice History
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyPlanDetails;