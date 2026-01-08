"use client";
import React from "react";
import { dropdownItems } from "@/data/dropdown-data";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import { departmentAttendanceData } from "./leave-data";

const TeamAttendanceSummary = () => {
  return (
    <>
      <div className="col-span-12 xl:col-span-6 xxl:col-span-4">
        <div className="card__wrapper height-equal not-height">
          <div className="card__title-wrap flex items-center justify-between mb-5">
            <h5 className="card__heading-title">Department Attendance</h5>
            <CustomDropdown items={dropdownItems} />
          </div>
          <div className="space-y-4">
            {departmentAttendanceData.map((dept, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-b"
              >
                <div className="flex-1">
                  <h6 className="font-medium">{dept.department}</h6>
                  <div className="text-sm text-gray-500">
                    {dept.presentCount}/{dept.totalCount} present
                  </div>
                </div>
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{dept.attendanceRate}%</span>
                    <span
                      className={`text-sm ${
                        dept.change >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {dept.change >= 0 ? "+" : ""}
                      {dept.change}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className={`progress-bar ${
                        dept.attendanceRate >= 90
                          ? "bg-success"
                          : dept.attendanceRate >= 80
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                      style={{ width: `${dept.attendanceRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-light rounded">
            <div className="flex items-center justify-between mb-2">
              <h6 className="font-medium">{`Today's`} Summary</h6>
              <span className="bd-badge bg-primary">Live</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">240</div>
                <div className="text-sm text-gray-500">Present</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">18</div>
                <div className="text-sm text-gray-500">Late</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-danger">55</div>
                <div className="text-sm text-gray-500">Absent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamAttendanceSummary;
