"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Chip, Box, Divider, Grid } from "@mui/material";
import { vendorDetailsStatePropsType } from "./vendor.interface";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotesIcon from "@mui/icons-material/Notes";

interface IVendor {
  id: number;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  vendorType: string;
  status: string;
  totalPurchases: number;
  outstandingBalance: number;
  lastTransaction: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  notes?: string;
}

const VendorDetailsModal = ({ 
  open, 
  setOpen, 
  editData 
}: vendorDetailsStatePropsType & { editData: IVendor | null }) => {
  
  const handleToggle = () => setOpen(!open);

  if (!editData) return null;

  const getVendorTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "it equipment":
        return "info-badge";
      case "furniture":
        return "warning-badge";
      case "software":
        return "primary-badge";
      case "services":
        return "success-badge";
      default:
        return "default-badge";
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Vendor Details</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        <div className="card__wrapper">
          <div className="grid grid-cols-12 gap-y-5">
            <div className="col-span-12">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Vendor Name</span>
                <h6 className="label__title">{editData.vendorName}</h6>
              </div>
            </div>
            
            <Grid container spacing={2} className="col-span-12">
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <BusinessIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Vendor Type</span>
                  </div>
                  <div className="mt-1">
                    <Chip 
                      label={editData.vendorType} 
                      className={getVendorTypeClass(editData.vendorType)}
                      size="small"
                    />
                  </div>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <span className="label__subtitle">Status</span>
                  <div className="mt-1">
                    <Chip 
                      label={editData.status} 
                      className={getTableStatusClass(editData.status)}
                      size="small"
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
            
            <Divider className="col-span-12 my-2" />
            
            <Typography variant="h6" className="col-span-12 font-medium">
              Contact Information
            </Typography>
            
            <Grid container spacing={2} className="col-span-12">
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <PhoneIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Contact Person</span>
                  </div>
                  <h6 className="label__title">{editData.contactPerson}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <PhoneIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Phone</span>
                  </div>
                  <h6 className="label__title">{editData.phone}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <EmailIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Email</span>
                  </div>
                  <h6 className="label__title">
                    <a href={`mailto:${editData.email}`} className="text-primary hover:underline">
                      {editData.email}
                    </a>
                  </h6>
                </div>
              </Grid>
              
              {editData.address && (
                <Grid item xs={12}>
                  <div className="label__content-wrapper">
                    <div className="flex items-center gap-2">
                      <LocationOnIcon fontSize="small" color="action" />
                      <span className="label__subtitle">Address</span>
                    </div>
                    <h6 className="label__title">{editData.address}</h6>
                    {editData.city && (
                      <Typography variant="body2" className="text-gray-600">
                        {editData.city}, {editData.state} {editData.zipCode}
                      </Typography>
                    )}
                  </div>
                </Grid>
              )}
            </Grid>
            
            <Divider className="col-span-12 my-2" />
            
            <Typography variant="h6" className="col-span-12 font-medium">
              Financial Information
            </Typography>
            
            <Grid container spacing={2} className="col-span-12">
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <span className="label__subtitle">Total Purchases</span>
                  <h6 className="label__title">${editData.totalPurchases.toLocaleString()}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <span className="label__subtitle">Outstanding Balance</span>
                  <h6 className={`label__title ${editData.outstandingBalance > 0 ? 'text-danger' : 'text-success'}`}>
                    ${editData.outstandingBalance.toLocaleString()}
                  </h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <span className="label__subtitle">Last Transaction</span>
                  <h6 className="label__title">{editData.lastTransaction}</h6>
                </div>
              </Grid>
              
              {editData.paymentTerms && (
                <Grid item xs={12} md={6}>
                  <div className="label__content-wrapper">
                    <div className="flex items-center gap-2">
                      <AccountBalanceIcon fontSize="small" color="action" />
                      <span className="label__subtitle">Payment Terms</span>
                    </div>
                    <h6 className="label__title">{editData.paymentTerms}</h6>
                  </div>
                </Grid>
              )}
              
              {editData.creditLimit && (
                <Grid item xs={12} md={6}>
                  <div className="label__content-wrapper">
                    <span className="label__subtitle">Credit Limit</span>
                    <h6 className="label__title">${editData.creditLimit.toLocaleString()}</h6>
                  </div>
                </Grid>
              )}
              
              {editData.taxId && (
                <Grid item xs={12} md={6}>
                  <div className="label__content-wrapper">
                    <span className="label__subtitle">Tax ID</span>
                    <h6 className="label__title">{editData.taxId}</h6>
                  </div>
                </Grid>
              )}
            </Grid>
            
            {editData.notes && (
              <>
                <Divider className="col-span-12 my-2" />
                <Grid item xs={12}>
                  <div className="label__content-wrapper">
                    <div className="flex items-center gap-2">
                      <NotesIcon fontSize="small" color="action" />
                      <span className="label__subtitle">Notes</span>
                    </div>
                    <Box className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <Typography variant="body2">
                        {editData.notes}
                      </Typography>
                    </Box>
                  </div>
                </Grid>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorDetailsModal;