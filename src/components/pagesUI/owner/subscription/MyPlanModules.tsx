"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Box
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const MyPlanModules = () => {
  const [modules, setModules] = useState([
    { id: 1, name: "CRM", enabled: true, description: "Customer Relationship Management" },
    { id: 2, name: "HR", enabled: true, description: "Human Resources Management" },
    { id: 3, name: "Projects", enabled: true, description: "Project Management" },
    { id: 4, name: "Finance", enabled: false, description: "Financial Management" },
    { id: 5, name: "Inventory", enabled: true, description: "Inventory Management" },
    { id: 6, name: "Support", enabled: false, description: "Customer Support" },
    { id: 7, name: "Payroll", enabled: false, description: "Payroll Management" },
    { id: 8, name: "Analytics", enabled: true, description: "Advanced Analytics" }
  ]);

  const [addModuleDialog, setAddModuleDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const availableModules = [
    "CRM",
    "HR", 
    "Projects",
    "Finance",
    "Inventory",
    "Support",
    "Payroll",
    "Analytics",
    "Reporting",
    "Marketing"
  ];

  const handleToggleModule = (id: number) => {
    setModules(modules.map(module => 
      module.id === id ? { ...module, enabled: !module.enabled } : module
    ));
  };

  const handleAddModule = () => {
    if (selectedModule && !modules.find(m => m.name === selectedModule)) {
      setModules([
        ...modules,
        {
          id: modules.length + 1,
          name: selectedModule,
          enabled: true,
          description: `${selectedModule} Module`
        }
      ]);
      setSelectedModule(null);
      setAddModuleDialog(false);
    }
  };

  const enabledModules = modules.filter(m => m.enabled);
  const disabledModules = modules.filter(m => !m.enabled);

  return (
    <>
      <div className="card__wrapper">
        <div className="card__title-wrap mb-[25px]">
          <div className="flex justify-between items-center">
            <h5 className="card__heading-title">Active Modules</h5>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setAddModuleDialog(true)}
            >
              Add Module
            </Button>
          </div>
        </div>
        
        <Card variant="outlined" className="mb-6">
          <CardContent>
            <Typography variant="h6" className="font-medium mb-4">
              Enabled Modules ({enabledModules.length})
            </Typography>
            
            <Grid container spacing={2}>
              {enabledModules.map((module) => (
                <Grid item xs={12} sm={6} key={module.id}>
                  <Card variant="outlined">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Typography variant="subtitle1" className="font-semibold">
                            {module.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {module.description}
                          </Typography>
                        </div>
                        <Chip 
                          icon={<CheckCircleIcon />}
                          label="Active" 
                          color="success" 
                          size="small"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={module.enabled}
                              onChange={() => handleToggleModule(module.id)}
                              size="small"
                              color="primary"
                            />
                          }
                          label="Enabled"
                        />
                        <Button
                          size="small"
                          startIcon={<SettingsIcon />}
                          variant="text"
                        >
                          Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {disabledModules.length > 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" className="font-medium mb-4">
                Available Modules ({disabledModules.length})
              </Typography>
              
              <Grid container spacing={2}>
                {disabledModules.map((module) => (
                  <Grid item xs={12} sm={6} key={module.id}>
                    <Card variant="outlined" className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Typography variant="subtitle1" className="font-semibold">
                              {module.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {module.description}
                            </Typography>
                          </div>
                          <Chip 
                            icon={<CancelIcon />}
                            label="Inactive" 
                            color="default" 
                            size="small"
                            variant="outlined"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={module.enabled}
                                onChange={() => handleToggleModule(module.id)}
                                size="small"
                                color="primary"
                              />
                            }
                            label="Enable"
                          />
                          <Typography variant="body2" color="text.secondary">
                            Add to activate
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Module Dialog */}
      <Dialog 
        open={addModuleDialog} 
        onClose={() => setAddModuleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <Typography variant="body2" color="text.secondary">
              Select a module to add to your plan. Some modules may require plan upgrade.
            </Typography>
            
            <Autocomplete
              options={availableModules.filter(module => 
                !modules.find(m => m.name === module)
              )}
              value={selectedModule}
              onChange={(event, newValue) => {
                setSelectedModule(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Module"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            
            {selectedModule && (
              <Card variant="outlined" className="p-3">
                <Typography variant="subtitle2" className="font-medium mb-2">
                  Module Information
                </Typography>
                <Typography variant="body2">
                  Adding the <strong>{selectedModule}</strong> module will give you access to:
                </Typography>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    <Typography variant="body2">
                      All {selectedModule} features
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      {selectedModule} dashboard and reports
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Integration with existing modules
                    </Typography>
                  </li>
                </ul>
              </Card>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModuleDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddModule}
            variant="contained"
              className="!text-white"
            disabled={!selectedModule}
          >
            Add Module
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPlanModules;