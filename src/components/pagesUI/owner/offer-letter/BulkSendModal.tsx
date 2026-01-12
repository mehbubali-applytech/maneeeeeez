"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Chip
} from "@mui/material";
import { IOfferLetter } from "./OfferLetterTypes";

interface BulkSendModalProps {
  open: boolean;
  offers: IOfferLetter[];
}

const BulkSendModal: React.FC<BulkSendModalProps> = ({ open, offers }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [emailTemplate, setEmailTemplate] = useState("standard");
  const [scheduleSend, setScheduleSend] = useState(false);
  const [sendDate, setSendDate] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const steps = ['Select Offers', 'Configure Email', 'Review & Send'];

  const handleSelectAll = () => {
    if (selectedOffers.length === offers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(offers.map(offer => offer.id));
    }
  };

  const handleSelectOffer = (id: string) => {
    if (selectedOffers.includes(id)) {
      setSelectedOffers(selectedOffers.filter(offerId => offerId !== id));
    } else {
      setSelectedOffers([...selectedOffers, id]);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSend = () => {
    console.log('Sending offers:', selectedOffers);
    // API call to send offers
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select offers to send in bulk:
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOffers.length === offers.length}
                  indeterminate={selectedOffers.length > 0 && selectedOffers.length < offers.length}
                  onChange={handleSelectAll}
                />
              }
              label="Select All Offers"
            />
            
            <Box sx={{ maxHeight: '300px', overflowY: 'auto', mt: 2 }}>
              {offers.map((offer) => (
                <Box
                  key={offer.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Checkbox
                    checked={selectedOffers.includes(offer.id)}
                    onChange={() => handleSelectOffer(offer.id)}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">
                      {offer.candidateName} - {offer.position}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {offer.offerId} • {offer.department}
                    </Typography>
                  </Box>
                  <Chip
                    label={offer.offerStatus}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
              ))}
            </Box>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Only offers with status {`"Draft"`} can be sent. Sent offers will be updated.
            </Alert>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Email Template</InputLabel>
              <Select
                value={emailTemplate}
                label="Email Template"
                onChange={(e) => setEmailTemplate(e.target.value)}
              >
                <MenuItem value="standard">Standard Offer Email</MenuItem>
                <MenuItem value="executive">Executive Package Email</MenuItem>
                <MenuItem value="contract">Contract Agreement Email</MenuItem>
                <MenuItem value="intern">Internship Offer Email</MenuItem>
                <MenuItem value="custom">Custom Template</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={scheduleSend}
                  onChange={(e) => setScheduleSend(e.target.checked)}
                />
              }
              label="Schedule Send"
            />
            
            {scheduleSend && (
              <TextField
                fullWidth
                type="datetime-local"
                label="Schedule Date & Time"
                value={sendDate}
                onChange={(e) => setSendDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
              />
            )}
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Custom Message (Optional)"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personalized message for the candidates..."
              sx={{ mt: 3 }}
            />
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="body2" gutterBottom>
              <strong>Summary:</strong>
            </Typography>
            
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2">
                {selectedOffers.length} offer(s) will be sent to:
              </Typography>
              <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                {offers
                  .filter(offer => selectedOffers.includes(offer.id))
                  .map(offer => (
                    <li key={offer.id}>
                      <Typography variant="body2">
                        {offer.candidateName} ({offer.candidateEmail})
                      </Typography>
                    </li>
                  ))
                }
              </Box>
            </Box>
            
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Please review all details before sending. Once sent, offers cannot be recalled.
              </Typography>
            </Alert>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Bulk Send Offer Letters</DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button
          onClick={activeStep === steps.length - 1 ? handleSend : handleNext}
          variant="contained"
          disabled={selectedOffers.length === 0}
        >
          {activeStep === steps.length - 1 ? 'Send Offers' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkSendModal;