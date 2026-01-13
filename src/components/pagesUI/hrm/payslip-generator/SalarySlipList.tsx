// app/hr/salary-slip/SalarySlipList.tsx
"use client";

import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider
} from "@mui/material";
import {
  PictureAsPdf,
  Download,
  Mail,
  Print,
  CalendarMonth,
  AttachMoney
} from "@mui/icons-material";
import { ISalarySlipData, formatCurrency } from "./SalarySlipTypes";

interface SalarySlipListProps {
  slips: ISalarySlipData[];
}

const SalarySlipList: React.FC<SalarySlipListProps> = ({ slips }) => {
  const handleDownload = (slip: ISalarySlipData) => {
    console.log('Download slip:', slip.slipId);
  };

  const handleEmail = (slip: ISalarySlipData) => {
    console.log('Email slip:', slip.slipId);
  };

  const handlePrint = (slip: ISalarySlipData) => {
    console.log('Print slip:', slip.slipId);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Generated Salary Slips
      </Typography>
      
      {slips.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PictureAsPdf sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Salary Slips Generated Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate your first salary slip using the generator above
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {slips.map((slip) => (
            <Grid item xs={12} md={6} lg={4} key={slip.slipId}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {slip.employeeInfo.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {slip.employeeInfo.department} • {slip.employeeInfo.employeeCode}
                      </Typography>
                    </Box>
                    <Chip
                      label="PDF"
                      size="small"
                      color="primary"
                      icon={<PictureAsPdf fontSize="small" />}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarMonth fontSize="small" color="action" />
                      <Typography variant="body2">
                        {slip.calculation.month} {slip.calculation.year}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AttachMoney fontSize="small" color="action" />
                      <Typography variant="body2">
                        Net Salary: {formatCurrency(slip.calculation.netSalary)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(slip.generatedOn).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={() => handleDownload(slip)}
                        variant="outlined"
                      >
                        Download
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Mail />}
                        onClick={() => handleEmail(slip)}
                        variant="outlined"
                      >
                        Email
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SalarySlipList;