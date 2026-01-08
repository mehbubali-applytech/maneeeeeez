"use client";
import React from "react";
import MyPlanDetails from "./MyPlanDetails";
import MyPlanUsage from "./MyPlanUsage";
import MyPlanBilling from "./MyPlanBilling";
import MyPlanModules from "./MyPlanModules";

const MyPlanMainArea = () => {
  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__area">
        <div className="breadcrumb__wrapper mb-[25px]">
          <nav>
            <ol className="breadcrumb flex items-center mb-0">
              <li className="breadcrumb-item">Dashboard</li>
              <li className="breadcrumb-item active">My Plan</li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
        {/* Current Plan Details */}
        <div className="col-span-12 lg:col-span-8">
          <MyPlanDetails />
        </div>
        
        {/* Plan Usage */}
        <div className="col-span-12 lg:col-span-4">
          <MyPlanUsage />
        </div>
        
        {/* Billing Information */}
        <div className="col-span-12 lg:col-span-7">
          <MyPlanBilling />
        </div>
        
        {/* Active Modules */}
        <div className="col-span-12 lg:col-span-5">
          <MyPlanModules />
        </div>
      </div>
    </div>
  );
};

export default MyPlanMainArea;