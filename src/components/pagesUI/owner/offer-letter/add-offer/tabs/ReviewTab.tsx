"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  IconButton
} from "@mui/material";
import {
  Person,
  Work,
  AttachMoney,
  Description,
  Email,
  Phone,
  LocationOn,
  Schedule,
  Edit,
  Send
} from "@mui/icons-material";
import { IOfferLetterForm } from "../../OfferLetterTypes";

interface ReviewTabProps {
  data: IOfferLetterForm;
}

const ReviewTab: React.FC<ReviewTabProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days until joining
  const calculateDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilJoining = calculateDaysUntil(data.joiningDate);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Review Offer Details
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'primary.light', bgcolor: 'primary.50' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
                {data.candidateName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Offer for {data.position} position
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Work />} 
                  label={data.department} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<LocationOn />} 
                  label={data.location} 
                  variant="outlined" 
                />
                <Chip 
                  icon={<AttachMoney />} 
                  label={formatCurrency(data.ctc)} 
                  color="success" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<Schedule />} 
                  label={`Joining: ${formatDate(data.joiningDate)}`} 
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Details Grid */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} /> Candidate Details
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={data.candidateName}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Address" 
                    secondary={data.candidateEmail}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone Number" 
                    secondary={data.candidatePhone}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="HR Contact" 
                    secondary={data.hrContact}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mr: 1 }} /> Position Details
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Position" 
                    secondary={data.position}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Department" 
                    secondary={data.department}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Employment Type" 
                    secondary={data.jobType}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Reporting Manager" 
                    secondary={data.reportingManager}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Compensation Details */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1 }} /> Compensation Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Base Salary</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {formatCurrency(data.baseSalary)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(data.baseSalary / 12)} per month
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Annual Bonus</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatCurrency(data.bonus)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {data.bonus > 0 ? `${Math.round((data.bonus / data.baseSalary) * 100)}% of base` : 'No bonus'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.light' }}>
                    <Typography variant="caption" color="primary">Total CTC</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {formatCurrency(data.ctc)}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {formatCurrency(data.ctc / 12)} per month
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {/* Benefits */}
              {data.benefits && data.benefits.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Benefits & Perks</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {data.benefits.map((benefit, index) => (
                      <Chip key={index} label={benefit} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline & Important Dates */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1 }} /> Timeline
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Offer Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatDate(data.offerDate)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: daysUntilJoining <= 7 ? 'warning.50' : 'success.50',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: daysUntilJoining <= 7 ? 'warning.light' : 'success.light'
                  }}>
                    <Typography variant="caption" color="text.secondary">Expected Joining Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatDate(data.joiningDate)}
                    </Typography>
                    <Typography variant="caption" color={daysUntilJoining <= 7 ? 'warning.main' : 'success.main'}>
                      {daysUntilJoining} days from now
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Probation Period</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.probationPeriod} months
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Offer Status</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'info.main' }}>
                      {data.offerStatus}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts and Warnings */}
        <Grid item xs={12}>
          {data.probationPeriod > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Probation Period:</strong> This offer includes a {data.probationPeriod}-month probation period.
                Performance will be reviewed before confirmation.
              </Typography>
            </Alert>
          )}
          
          {daysUntilJoining <= 7 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Quick Joining:</strong> Candidate is expected to join in {daysUntilJoining} days. 
                Ensure all onboarding preparations are complete.
              </Typography>
            </Alert>
          )}
          
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Ready to Send:</strong> All required information is complete. 
              Review the details carefully before sending the offer to the candidate.
            </Typography>
          </Alert>
        </Grid>

        {/* Final Actions */}
        <Grid item xs={12}>
          <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Final Steps
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  This offer will be sent to: <strong>{data.candidateEmail}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  CC: {data.hrContact}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Edit Details
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Send />}
                >
                  Send Offer Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewTab;