"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";

const MyPlanBilling = () => {
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const billingInfo = {
    cardType: "Visa",
    cardNumber: "**** **** **** 1234",
    expiryDate: "12/25",
    billingEmail: "billing@company.com",
    nextBillingDate: "2024-04-15",
    billingCycle: "Monthly"
  };

  const invoiceHistory = [
    {
      id: "INV-001",
      date: "2024-03-15",
      amount: "$79.00",
      status: "Paid",
      plan: "Pro Plan"
    },
    {
      id: "INV-002",
      date: "2024-02-15",
      amount: "$79.00",
      status: "Paid",
      plan: "Pro Plan"
    },
    {
      id: "INV-003",
      date: "2024-01-15",
      amount: "$79.00",
      status: "Paid",
      plan: "Pro Plan"
    },
    {
      id: "INV-004",
      date: "2023-12-15",
      amount: "$29.00",
      status: "Paid",
      plan: "Basic Plan"
    },
    {
      id: "INV-005",
      date: "2023-11-15",
      amount: "$29.00",
      status: "Failed",
      plan: "Basic Plan"
    }
  ];

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setInvoiceDialogOpen(true);
  };

  const handleDownloadInvoice = (invoice: any) => {
    // Simulate download
    console.log(`Downloading invoice: ${invoice.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <div className="card__wrapper">
        <div className="card__title-wrap mb-[25px]">
          <h5 className="card__heading-title">Billing Information</h5>
        </div>
        
        <Card variant="outlined" className="mb-6">
          <CardContent>
            <div className="flex items-center mb-4">
              <CreditCardIcon className="mr-3 text-primary" />
              <div>
                <Typography variant="h6" className="font-semibold">
                  Payment Method
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {billingInfo.cardType} {billingInfo.cardNumber} • Expires {billingInfo.expiryDate}
                </Typography>
              </div>
              <Button 
                variant="outlined" 
                size="small" 
                className="ml-auto"
                startIcon={<PaymentIcon />}
              >
                Update Card
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" color="text.secondary">
                  Billing Email
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {billingInfo.billingEmail}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="text.secondary">
                  Next Billing Date
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {billingInfo.nextBillingDate}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="text.secondary">
                  Billing Cycle
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {billingInfo.billingCycle}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="text.secondary">
                  Next Invoice Amount
                </Typography>
                <Typography variant="body1" className="font-medium">
                  $79.00
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="card__title-wrap mb-[25px]">
          <h5 className="card__heading-title">Invoice History</h5>
        </div>
        
        <Card variant="outlined">
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Typography variant="body2" className="font-medium">
                          {invoice.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.plan}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" className="font-medium">
                          {invoice.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={invoice.status} 
                          color={getStatusColor(invoice.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewInvoice(invoice)}
                          title="View Invoice"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDownloadInvoice(invoice)}
                          title="Download Invoice"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <div className="flex justify-between items-center mt-4">
              <Typography variant="body2" color="text.secondary">
                Showing {invoiceHistory.length} invoices
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<ReceiptIcon />}
              >
                View All Invoices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog 
        open={invoiceDialogOpen} 
        onClose={() => setInvoiceDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedInvoice && (
          <>
            <DialogTitle>
              <div className="flex justify-between items-center">
                <span>Invoice Details</span>
                <Button 
                  size="small" 
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">
                    Invoice ID:
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {selectedInvoice.id}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">
                    Date:
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {selectedInvoice.date}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">
                    Plan:
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {selectedInvoice.plan}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">
                    Amount:
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {selectedInvoice.amount}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip 
                    label={selectedInvoice.status} 
                    color={getStatusColor(selectedInvoice.status) as any}
                    size="small"
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setInvoiceDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default MyPlanBilling;