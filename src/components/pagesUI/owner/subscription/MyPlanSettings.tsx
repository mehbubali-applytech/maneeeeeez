"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const MyPlanSettings = () => {
  const [settings, setSettings] = useState({
    autoRenew: true,
    invoiceNotifications: true,
    usageAlerts: true,
    lowBalanceAlerts: true,
    currency: "USD",
    timezone: "America/New_York",
    language: "English"
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  const handleSaveSettings = () => {
    // Simulate save
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetSettings = () => {
    setSettings({
      autoRenew: true,
      invoiceNotifications: true,
      usageAlerts: true,
      lowBalanceAlerts: true,
      currency: "USD",
      timezone: "America/New_York",
      language: "English"
    });
  };

  return (
    <div className="card__wrapper">
      <div className="card__title-wrap mb-[25px]">
        <h5 className="card__heading-title">Plan Settings</h5>
      </div>
      
      <Card variant="outlined">
        <CardContent>
          {saveSuccess && (
            <Alert severity="success" className="mb-4">
              Settings saved successfully!
            </Alert>
          )}
          
          <Typography variant="h6" className="font-medium mb-4">
            Notification Settings
          </Typography>
          
          <div className="space-y-3 mb-6">
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoRenew}
                  onChange={(e) => handleSettingChange("autoRenew", e.target.checked)}
                  color="primary"
                />
              }
              label="Auto-renew subscription"
            />
            <Typography variant="body2" color="text.secondary" className="ml-10">
              Automatically renew your subscription before it expires
            </Typography>
            
            <Divider className="my-2" />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.invoiceNotifications}
                  onChange={(e) => handleSettingChange("invoiceNotifications", e.target.checked)}
                  color="primary"
                />
              }
              label="Invoice notifications"
            />
            <Typography variant="body2" color="text.secondary" className="ml-10">
              Receive email notifications for new invoices
            </Typography>
            
            <Divider className="my-2" />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.usageAlerts}
                  onChange={(e) => handleSettingChange("usageAlerts", e.target.checked)}
                  color="primary"
                />
              }
              label="Usage alerts"
            />
            <Typography variant="body2" color="text.secondary" className="ml-10">
              Get alerts when usage reaches 80% of limits
            </Typography>
            
            <Divider className="my-2" />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.lowBalanceAlerts}
                  onChange={(e) => handleSettingChange("lowBalanceAlerts", e.target.checked)}
                  color="primary"
                />
              }
              label="Low balance alerts"
            />
            <Typography variant="body2" color="text.secondary" className="ml-10">
              Receive alerts when account balance is low
            </Typography>
          </div>
          
          <Typography variant="h6" className="font-medium mb-4">
            General Settings
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={settings.currency}
                label="Currency"
                onChange={(e) => handleSettingChange("currency", e.target.value)}
              >
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
                <MenuItem value="GBP">GBP (£)</MenuItem>
                <MenuItem value="INR">INR (₹)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={settings.timezone}
                label="Timezone"
                onChange={(e) => handleSettingChange("timezone", e.target.value)}
              >
                <MenuItem value="America/New_York">America/New York</MenuItem>
                <MenuItem value="Europe/London">Europe/London</MenuItem>
                <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                <MenuItem value="Asia/Dubai">Asia/Dubai</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                label="Language"
                onChange={(e) => handleSettingChange("language", e.target.value)}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
                <MenuItem value="German">German</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Billing Email"
              type="email"
              value="billing@company.com"
              fullWidth
              disabled
              helperText="Contact support to change billing email"
            />
          </div>
          
          <Divider className="my-4" />
          
          <div className="flex justify-between">
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleResetSettings}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPlanSettings;