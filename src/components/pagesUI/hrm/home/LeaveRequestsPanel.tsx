"use client";
import React from "react";
import { dropdownItems } from "@/data/dropdown-data";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import { leaveRequestsData } from "./leave-data";
import Image from "next/image";

const LeaveRequestsPanel = () => {
  return (
    <>
      <div className="col-span-12 xxl:col-span-7">
        <div className="card__wrapper">
          <div className="card__title-wrap flex items-center justify-between mb-5">
            <h5 className="card__heading-title">Pending Leave Requests</h5>
            <CustomDropdown items={dropdownItems} />
          </div>
          <div className="table__wrapper table-responsive">
            <table className="table w-full">
              <thead>
                <tr className="table__title">
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From - To</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table__body">
                {leaveRequestsData.map((request, index) => (
                  <tr key={index}>
                    <td className="flex items-center gap-2">
                      <Image
                        src={request.avatar}
                        alt={request.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        priority={false}
                      />

                      <div>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-sm text-gray-500">
                          {request.department}
                        </div>
                      </div>
                    </td>
                    <td>{request.leaveType}</td>
                    <td>{request.dateRange}</td>
                    <td>{request.duration}</td>
                    <td>
                      <span
                        className={`bd-badge ${
                          request.status === "Pending"
                            ? "bg-warning"
                            : request.status === "Approved"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="bd-badge bg-success">
                          <i className="fa-light fa-check"></i>
                        </button>
                        <button className="bd-badge bg-danger">
                          <i className="fa-light fa-xmark"></i>
                        </button>
                        <button className="bd-badge bg-info">
                          <i className="fa-light fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button className="btn btn-primary">
              <i className="fa-light fa-check-double mr-2"></i>
              Approve All
            </button>
            <button className="btn btn-outline-primary">
              View All Requests
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaveRequestsPanel;
