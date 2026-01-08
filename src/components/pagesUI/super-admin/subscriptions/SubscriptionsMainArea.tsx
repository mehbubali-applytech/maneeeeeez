"use client";

import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import SubscriptionPlan from "./SubscriptionPlan";

const moduleOptions = [
  "CRM",
  "HR",
  "Projects",
  "Payroll",
  "Inventory",
  "Finance",
  "Support",
];

const planOptions = [
  { value: "free", label: "Free", limits: "Up to 5 users, Basic Support" },
  { value: "pro", label: "Pro", limits: "Unlimited users, Priority Support" },
  { value: "enterprise", label: "Enterprise", limits: "Custom limit, Dedicated Support" },
];

const timezoneList = [
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
  "Asia/Dubai",
];

const currencyList = [
  "INR",
  "USD",
  "GBP",
  "AED",
];

const SubscriptionsMainArea = () => {

  return (
    <SubscriptionPlan/>
  );
};

export default SubscriptionsMainArea;
