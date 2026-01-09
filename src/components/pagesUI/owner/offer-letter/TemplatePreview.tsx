"use client";

import React, { useState, useRef } from "react"; // Added useRef import
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent
} from "@mui/material";
import {
  Close,
  Download,
  ContentCopy,
  Send,
  Edit,
  Visibility,
  Print,
  Save,
  ArrowBack,
  CheckCircle
} from "@mui/icons-material";
import { IOfferLetterTemplate, formatTemplateContent } from "./OfferLetterTypes";

interface TemplatePreviewProps {
  template: IOfferLetterTemplate;
  previewData: any;
  onClose: () => void;
  onDownload: () => void;
  onGenerate: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  previewData,
  onClose,
  onDownload,
  onGenerate
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [showGeneratedPreview, setShowGeneratedPreview] = useState(false);
  
  // Create a ref for the print content
  const printContentRef = useRef<HTMLDivElement>(null);

  const latestVersion = template.versions[0];
  const steps = ['Enter Details', 'Preview', 'Download/Send'];

  // Initialize variable values with preview data or defaults
  React.useEffect(() => {
    const initialValues: Record<string, string> = {};
    latestVersion.variables.forEach(variable => {
      initialValues[variable.key] = previewData?.[variable.key] || variable.defaultValue || '';
    });
    setVariableValues(initialValues);
  }, [latestVersion.variables, previewData]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Generate content with variable values
      const content = formatTemplateContent(latestVersion.content, variableValues);
      setGeneratedContent(content);
      setShowGeneratedPreview(true);
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

  const handleGenerateOffer = () => {
    onGenerate();
    setActiveStep(2);
  };

  // Function to handle printing only the offer letter content
  const handlePrint = () => {
    if (!generatedContent) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print');
      return;
    }

    // Write the HTML content with print styles
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Offer Letter - ${template.name}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm; /* A4 width */
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #ccc;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
          }
          .document-title {
            font-size: 22px;
            font-weight: bold;
            margin: 30px 0 20px 0;
            color: #2c3e50;
          }
          .content {
            font-size: 14px;
            margin-bottom: 30px;
          }
          .signature-section {
            margin-top: 100px;
            page-break-inside: avoid;
          }
          .signature-line {
            border-top: 1px solid #000;
            width: 300px;
            margin-top: 60px;
          }
          .footer {
            margin-top: 50px;
            font-size: 12px;
            color: #666;
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${template.companyName || 'Company Name'}</div>
          <div>${template.companyAddress || 'Company Address'}</div>
        </div>
        <div class="content">
          ${generatedContent}
        </div>
        <div class="footer">
          <p>Confidential and Proprietary</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Alternative method using iframe (more reliable)
  const handlePrintAlternative = () => {
    if (!generatedContent) return;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    
    // Set iframe content
    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Offer Letter</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
          }
          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div style="max-width: 210mm; margin: 0 auto;">
          ${generatedContent}
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              document.body.removeChild(this.frameElement);
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;
    
    document.body.appendChild(iframe);
  };

  const renderStepContent = (step: number) => {
    switch(step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enter Details for {template.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Fill in the variables to generate the offer letter
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {latestVersion.variables.map(variable => (
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
                  />
                </Grid>
              ))}
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Required fields are marked with asterisk (*).
                All information will be included in the final offer letter.
              </Typography>
            </Alert>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Generated Offer Letter Preview
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<ContentCopy />}
                  onClick={() => {
                    navigator.clipboard.writeText(generatedContent);
                    // Show success message (you might want to add a snackbar/alert)
                  }}
                  size="small"
                >
                  Copy HTML
                </Button>
                <Button
                  startIcon={<Print />}
                  onClick={handlePrint} // Use the new print handler
                  size="small"
                >
                  Print
                </Button>
              </Box>
            </Box>

            <Paper variant="outlined" sx={{ p: 3, mt: 2, bgcolor: 'grey.50' }}>
              <Box
                sx={{ 
                  maxHeight: 400, 
                  overflow: 'auto',
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 1
                }}
                dangerouslySetInnerHTML={{ __html: generatedContent }}
              />
            </Paper>

            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Preview ready!</strong> Review the generated offer letter above.
                If everything looks good, proceed to download or send.
              </Typography>
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Download or Send Offer Letter
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Download sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Download Offer Letter
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Download the generated offer letter as PDF or HTML file
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={onDownload}
                        fullWidth
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopy />}
                        onClick={() => {
                          // Download HTML
                          const blob = new Blob([generatedContent], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `offer-letter-${template.name}-${new Date().toISOString().split('T')[0]}.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        fullWidth
                      >
                        Download HTML
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Print />}
                        onClick={handlePrint}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Print Directly
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Send sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Send via Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Send the offer letter directly to {`candidate's`} email
                    </Typography>
                    <TextField
                      fullWidth
                      label="Candidate Email"
                      type="email"
                      sx={{ mt: 2, mb: 2 }}
                      placeholder="candidate@example.com"
                    />
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={handleGenerateOffer}
                      fullWidth
                      color="success"
                    >
                      Send Offer Letter
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Tip:</strong> Always verify all details before sending. 
                Once sent, the offer letter will be recorded in the system.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  const allRequiredFilled = () => {
    return latestVersion.variables
      .filter(v => v.required)
      .every(v => variableValues[v.key]?.trim());
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
          height: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility color="primary" />
            <Typography variant="h6">
              Generate Offer Letter: ${template.name}
            </Typography>
            <Chip label={`v${latestVersion.version}`} size="small" color="primary" />
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Template Info */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Template</Typography>
                <Typography variant="body1">{template.name}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography variant="body1">{template.category}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">Department</Typography>
                <Typography variant="body1">{template.department || 'All'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Step Content */}
        {renderStepContent(activeStep)}

        {/* Variable Summary */}
        {activeStep > 0 && (
          <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Entered Details:
            </Typography>
            <Grid container spacing={1}>
              {Object.entries(variableValues).map(([key, value]) => (
                <Grid item xs={6} md={4} key={key}>
                  <Typography variant="caption" color="text.secondary">
                    {latestVersion.variables.find(v => v.key === key)?.name}:
                  </Typography>
                  <Typography variant="body2">
                    {value || 'Not set'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBack />}
          variant="outlined"
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
            onClick={onClose}
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
          >
            Done
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            disabled={activeStep === 0 && !allRequiredFilled()}
          >
            {activeStep === steps.length - 2 ? 'Generate Offer' : 'Next'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TemplatePreview;