"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { subscriptionDetailsStatePropsType } from "@/interface/common.interface";

interface ISubscription {
  id: number;
  subscriptionName: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  startDate: string;
  endDate: string;
  users: number;
  modules: string[];
  owner: string;
  email: string;
  description?: string;
}

const SubscriptionsDetailsModal = ({
  open,
  setOpen,
  editData,
}: subscriptionDetailsStatePropsType) => {

  
  const handleToggle = () => setOpen(!open);

  if (!editData) return null;

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Subscription Details</h5>
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
                <span className="label__subtitle">Subscription Name</span>
                <h6 className="label__title">{editData.subscriptionName}</h6>
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Plan</span>
                <h6 className="label__title">{editData.plan}</h6>
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Status</span>
                <h6 className="label__title">{editData.status}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Amount</span>
                <h6 className="label__title">{editData.currency} {editData.amount}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Currency</span>
                <h6 className="label__title">{editData.currency}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Start Date</span>
                <h6 className="label__title">{editData.startDate}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">End Date</span>
                <h6 className="label__title">{editData.endDate}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Number of Users</span>
                <h6 className="label__title">{editData.users}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Modules</span>
                <h6 className="label__title">{editData.modules.join(", ")}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Owner</span>
                <h6 className="label__title">{editData.owner}</h6>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <div className="label__content-wrapper">
                <span className="label__subtitle">Email Address</span>
                <h6 className="label__title">{editData.email}</h6>
              </div>
            </div>
            
            {editData.description && (
              <div className="col-span-12">
                <div className="label__content-wrapper">
                  <span className="label__subtitle">Description</span>
                  <p className="mt-2">{editData.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionsDetailsModal;