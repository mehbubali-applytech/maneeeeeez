"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Chip, Box, Divider } from "@mui/material";
import { moduleDetailsStatePropsType } from "./module.interface";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import CodeIcon from "@mui/icons-material/Code";

interface IModule {
  id: number;
  moduleName: string;
  moduleCode: string;
  category: string;
  status: string;
  tier: string;
  price: number;
  users: number;
  createdAt: string;
  lastUpdated: string;
  description: string;
}

const ModuleDetailsModal = ({ 
  open, 
  setOpen, 
  editData 
}: moduleDetailsStatePropsType & { editData: IModule | null }) => {
  
  const handleToggle = () => setOpen(!open);

  if (!editData) return null;

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "basic": return "info";
      case "pro": return "primary";
      case "enterprise": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "error";
      default: return "warning";
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Module Details</h5>
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
                <span className="label__subtitle">Module Name</span>
                <h6 className="label__title">{editData.moduleName}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <div className="flex items-center gap-2">
                  <CodeIcon fontSize="small" color="action" />
                  <span className="label__subtitle">Module Code</span>
                </div>
                <h6 className="label__title">{editData.moduleCode}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <div className="flex items-center gap-2">
                  <CategoryIcon fontSize="small" color="action" />
                  <span className="label__subtitle">Category</span>
                </div>
                <h6 className="label__title">{editData.category}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Status</span>
                <div className="mt-1">
                  <Chip 
                    label={editData.status} 
                    color={getStatusColor(editData.status) as any}
                    size="small"
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Tier</span>
                <div className="mt-1">
                  <Chip 
                    label={editData.tier} 
                    color={getTierColor(editData.tier) as any}
                    size="small"
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <div className="flex items-center gap-2">
                  <AttachMoneyIcon fontSize="small" color="action" />
                  <span className="label__subtitle">Monthly Price</span>
                </div>
                <h6 className="label__title">${editData.price}/month</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <div className="flex items-center gap-2">
                  <PeopleIcon fontSize="small" color="action" />
                  <span className="label__subtitle">User Limit</span>
                </div>
                <h6 className="label__title">{editData.users} users</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <div className="flex items-center gap-2">
                  <AccessTimeIcon fontSize="small" color="action" />
                  <span className="label__subtitle">Created Date</span>
                </div>
                <h6 className="label__title">{editData.createdAt}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <div className="flex items-center gap-2">
                  <AccessTimeIcon fontSize="small" color="action" />
                  <span className="label__subtitle">Last Updated</span>
                </div>
                <h6 className="label__title">{editData.lastUpdated}</h6>
              </div>
            </div>
            
            <Divider className="col-span-12 my-2" />
            
            <div className="col-span-12">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Description</span>
                <Box className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <Typography variant="body2">
                    {editData.description}
                  </Typography>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDetailsModal;