// components/finance/dashboard/BankProcessingStatus.tsx
"use client";
import React from "react";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import { financeDropdownItems } from "./finance-data";
import { bankProcessingData } from "./finance-data";

const BankProcessingStatus = () => {
  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="card__wrapper">
        <div className="card__title-wrap flex items-center justify-between mb-5">
          <h5 className="card__heading-title">Bank Processing Status</h5>
          <CustomDropdown items={financeDropdownItems} />
        </div>
        <div className="space-y-4">
          {bankProcessingData.map((item: any, index:number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.status === 'Processed' ? 'bg-success' : item.status === 'Processing' ? 'bg-warning' : 'bg-secondary'}`}></div>
                <div>
                  <h6 className="font-medium">{item.bankName}</h6>
                  <p className="text-sm text-gray-600">{item.mode}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{item.amount.toLocaleString()}</div>
                <div className={`text-sm ${item.status === 'Processed' ? 'text-success' : item.status === 'Processing' ? 'text-warning' : 'text-secondary'}`}>
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Processed Today:</span>
            <span className="font-semibold text-lg">₹8,42,750</span>
          </div>
          <button className="mt-4 w-full btn btn-primary">Generate Bank Files</button>
        </div>
      </div>
    </div>
  );
};

export default BankProcessingStatus;