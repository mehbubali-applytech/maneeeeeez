"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Person,
  Description,
  Send,
  Preview,
  Download,
  ContentCopy,
  Add,
  Search,
  CheckCircle
} from "@mui/icons-material";
import { toast } from "sonner";
import { IOfferLetterTemplate } from "./OfferLetterTypes";

interface CreateOfferLetterProps {
  templates: IOfferLetterTemplate[];
  onClose: () => void;
  onSave: (offerLetterData: any) => Promise<void>;
  candidates?: Array<{
    id: string;
    name: string;
    email: string;
    position: string;
    department: string;
  }>;
}

const CreateOfferLetter: React.FC<CreateOfferLetterProps> = ({
  templates,
  onClose,
  onSave,
  candidates = []
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<IOfferLetterTemplate | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps = ['Select Template', 'Select Candidate', 'Fill Details', 'Review & Send'];

  // Filter templates to only show active and published ones
  const availableTemplates = templates.filter(t => 
    t.isActive && t.status === 'Published'
  );

  // Initialize variable values when template is selected
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.versions[0]) {
      const initialValues: Record<string, string> = {};
      selectedTemplate.versions[0].variables.forEach(variable => {
        // Auto-fill candidate data if available
        if (selectedCandidate) {
          if (variable.key === 'candidateName') {
            initialValues[variable.key] = selectedCandidate.name;
          } else if (variable.key === 'position') {
            initialValues[variable.key] = selectedCandidate.position;
          } else if (variable.key === 'department') {
            initialValues[variable.key] = selectedCandidate.department;
          }
        }
        // Set default values
        if (!initialValues[variable.key]) {
          initialValues[variable.key] = variable.defaultValue || '';
        }
      });
      setVariableValues(initialValues);
    }
  }, [selectedTemplate, selectedCandidate]);

  const handleNext = () => {
    if (activeStep === 0 && !selectedTemplate) {
      toast.error('Please select a template');
      return;
    }
    
    if (activeStep === 1 && !selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }
    
    if (activeStep === 2) {
      // Validate required fields
      const missingRequired = selectedTemplate?.versions[0].variables
        .filter(v => v.required && !variableValues[v.key]?.trim())
        .map(v => v.name);
      
      if (missingRequired && missingRequired.length > 0) {
        toast.error(`Please fill required fields: ${missingRequired.join(', ')}`);
        return;
      }
      
      // Generate preview content
      if (selectedTemplate) {
        let content = selectedTemplate.versions[0].content;
        Object.entries(variableValues).forEach(([key, value]) => {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
          content = content.replace(regex, value);
        });
        setGeneratedContent(content);
      }
    }
    
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedTemplate || !selectedCandidate) {
      toast.error('Missing required information');
      return;
    }

    setIsSubmitting(true);
    try {
      const offerLetterData = {
        templateId: selectedTemplate.id,
        candidateName: selectedCandidate.name,
        candidateEmail: selectedCandidate.email,
        position: variableValues.position || selectedCandidate.position,
        department: variableValues.department || selectedCandidate.department,
        startDate: variableValues.startDate || new Date().toISOString().split('T')[0],
        salary: variableValues.salary || '',
        location: variableValues.location || '',
        reportingManager: variableValues.reportingManager || '',
        employeeId: variableValues.employeeId || `EMP${Date.now().toString().slice(-6)}`,
        status: 'Draft' as const,
        generatedContent,
        variables: variableValues,
        createdAt: new Date().toISOString(),
        createdBy: 'Current User'
      };

      await onSave(offerLetterData);
      toast.success('Offer letter created successfully');
      onClose();
    } catch (error) {
      console.error('Error creating offer letter:', error);
      toast.error('Failed to create offer letter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch(step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Offer Letter Template
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Choose a template to use for this offer letter
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {availableTemplates.map(template => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card
                    variant={selectedTemplate?.id === template.id ? "outlined" : "elevation"}
                    sx={{
                      cursor: 'pointer',
                      borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'transparent',
                      borderWidth: 2,
                      height: '100%',
                      '&:hover': {
                        borderColor: 'primary.light'
                      }
                    }}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Description sx={{ mr: 2, color: 'primary.main' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {template.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {template.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={template.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip label={`v${template.versions[0].version}`} size="small" />
                        <Chip label={template.department || 'All'} size="small" variant="outlined" />
                        <Chip label={`${template.usageCount} uses`} size="small" variant="outlined" />
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        Code: {template.code}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {availableTemplates.length === 0 && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                No active templates available. Please create or publish a template first.
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Candidate
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Choose a candidate for this offer letter
            </Typography>

            <Box sx={{ mt: 2, mb: 3 }}>
              <Autocomplete
                options={candidates}
                getOptionLabel={(option) => `${option.name} - ${option.position} (${option.email})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Candidate"
                    placeholder="Type to search..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                )}
                value={selectedCandidate}
                onChange={(_, newValue) => setSelectedCandidate(newValue)}
              />
            </Box>

            <Button
              startIcon={<Add />}
              variant="outlined"
              onClick={() => toast.info('Candidate creation feature coming soon')}
            >
              Add New Candidate
            </Button>

            {selectedCandidate && (
              <Card variant="outlined" sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Selected Candidate
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Name</Typography>
                      <Typography variant="body1">{selectedCandidate.name}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{selectedCandidate.email}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Position</Typography>
                      <Typography variant="body1">{selectedCandidate.position}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Department</Typography>
                      <Typography variant="body1">{selectedCandidate.department}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      case 2:
        return selectedTemplate && selectedTemplate.versions[0] ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fill Offer Details
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Complete all required information for the offer letter
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {selectedTemplate.versions[0].variables.map(variable => (
                <Grid item xs={12} md={6} key={variable.id}>
                  <TextField
                    label={`${variable.name} ${variable.required ? '*' : ''}`}
                    fullWidth
                    value={variableValues[variable.key] || ''}
                    onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                    required={variable.required}
                    type={variable.type === 'date' ? 'date' : 'text'}
                    InputLabelProps={
                      variable.type === 'date' ? { shrink: true } : {}
                    }
                    helperText={variable.description}
                    placeholder={
                      variable.key === 'startDate' 
                        ? 'Select start date'
                        : `Enter ${variable.name.toLowerCase()}`
                    }
                  />
                </Grid>
              ))}
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Required fields are marked with asterisk (*).
                This information will be included in the final offer letter sent to the candidate.
              </Typography>
            </Alert>
          </Box>
        ) : null;

      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Offer Letter
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Review the offer letter before sending
            </Typography>

            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Candidate</Typography>
                    <Typography variant="body1">{selectedCandidate?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{selectedCandidate?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Template</Typography>
                    <Typography variant="body1">{selectedTemplate?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Chip label="Draft" color="warning" size="small" />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Offer Details:
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(variableValues).map(([key, value]) => (
                      <Grid item xs={6} md={4} key={key}>
                        <Typography variant="caption" color="text.secondary">
                          {selectedTemplate?.versions[0].variables.find(v => v.key === key)?.name}:
                        </Typography>
                        <Typography variant="body2">
                          {value || 'Not set'}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={() => setPreviewOpen(true)}
                  >
                    Preview Letter
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => {
                      const blob = new Blob([generatedContent], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `offer-letter-${selectedCandidate?.name}-${new Date().toISOString().split('T')[0]}.html`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('Offer letter downloaded');
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                      toast.success('Content copied to clipboard');
                    }}
                  >
                    Copy Content
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Send Options:
              </Typography>
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <RadioGroup defaultValue="save">
                  <FormControlLabel 
                    value="save" 
                    control={<Radio />} 
                    label="Save as draft for later review" 
                  />
                  <FormControlLabel 
                    value="send" 
                    control={<Radio />} 
                    label="Send to candidate via email immediately" 
                  />
                  <FormControlLabel 
                    value="schedule" 
                    control={<Radio />} 
                    label="Schedule for later delivery" 
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          height: '85vh'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Create Offer Letter
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Follow the steps to create and send an offer letter
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          onClick={onClose}
          variant="text"
          color="inherit"
        >
          Cancel
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Offer Letter'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
          >
            Next
          </Button>
        )}
      </DialogActions>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Offer Letter Preview</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box 
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: 3,
              maxHeight: '60vh',
              overflow: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: generatedContent }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CreateOfferLetter;