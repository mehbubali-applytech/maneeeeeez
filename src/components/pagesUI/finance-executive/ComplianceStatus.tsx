// components/finance/dashboard/ComplianceStatus.tsx
"use client";
import React from "react";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import { financeDropdownItems } from "./finance-data";
import { complianceStatusData } from "./finance-data";

const ComplianceStatus = () => {
  return (
    <div className="col-span-12 lg:col-span-6">
      <div className="card__wrapper no-height">
        <div className="card__title-wrap flex items-center justify-between mb-[20px]">
          <h5 className="card__heading-title">Compliance Status</h5>
          <CustomDropdown items={financeDropdownItems} />
        </div>
        <div className="table__wrapper meeting-table table-responsive">
          <table className="table mb-[20px] w-full">
            <thead>
              <tr className="table__title">
                <th>Compliance Type</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Challan No.</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table__body">
              {complianceStatusData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.status === 'Submitted' ? 'bg-success' : item.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}></span>
                      {item.type}
                    </div>
                  </td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`badge ${item.status === 'Submitted' ? 'bg-success' : item.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.challanNo || '—'}</td>
                  <td>
                    {item.status === 'Pending' ? (
                      <button className="btn btn-sm btn-warning">Submit</button>
                    ) : (
                      <button className="btn btn-sm btn-outline-primary">Download</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStatus;