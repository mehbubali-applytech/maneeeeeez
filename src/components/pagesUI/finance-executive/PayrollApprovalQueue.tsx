// components/finance/dashboard/PayrollApprovalQueue.tsx
"use client";
import React from "react";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import { payrollApprovalData } from "./finance-data";

// Define dropdown items with proper links
const dropdownItems = [
  { label: "View All", link: "/finance/payroll/all" },
  { label: "Pending Only", link: "/finance/payroll/pending" },
  { label: "Approved Only", link: "/finance/payroll/approved" },
  { label: "Export CSV", link: "/finance/payroll/export" },
  { label: "Settings", link: "/finance/payroll/settings" },
];

const PayrollApprovalQueue = () => {
  return (
    <div className="col-span-12 lg:col-span-6">
      <div className="card__wrapper no-height">
        <div className="card__title-wrap flex items-center justify-between mb-[20px]">
          <h5 className="card__heading-title">Payroll Approval Queue</h5>
          <CustomDropdown items={dropdownItems} />
        </div>
        <div className="table__wrapper meeting-table table-responsive">
          <table className="table mb-[20px] w-full">
            <thead>
              <tr className="table__title">
                <th>Payroll ID</th>
                <th>Department</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table__body">
              {payrollApprovalData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span className="font-medium text-primary">{item.id}</span>
                  </td>
                  <td>{item.department}</td>
                  <td className="font-semibold">₹{item.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${
                      item.status === 'Pending' ? 'bg-warning' : 
                      item.status === 'Approved' ? 'bg-success' : 
                      'bg-info'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-primary">
                      {item.status === 'Pending' ? 'Review' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {payrollApprovalData.length} of 12 pending approvals
          </div>
          <button className="btn btn-outline-primary btn-sm">
            View All Queues
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollApprovalQueue;