// ShiftSummary.tsx
"use client";

import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IShift } from "./ShiftTypes";

interface ShiftSummaryProps {
  shifts: IShift[];
}

const ShiftSummary: React.FC<ShiftSummaryProps> = ({ shifts }) => {
  const totalShifts = shifts.length;
  const activeShifts = shifts.filter((s) => s.activeStatus).length;
  const inactiveShifts = shifts.filter((s) => !s.activeStatus).length;
  const nightShifts = shifts.filter((s) => s.isNightShift).length;
  
  const assignedEmployees = shifts.reduce(
    (sum, s) => sum + (s.assignedEmployees || 0),
    0
  );

  const summaryData = [
    {
      iconClass: "fa-light fa-clock",
      title: "Total Shifts",
      value: totalShifts.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Active Shifts",
      value: activeShifts.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-moon",
      title: "Night Shifts",
      value: nightShifts.toString(),
      description: "",
      percentageChange: "",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-users",
      title: "Assigned Employees",
      value: assignedEmployees.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-building",
      title: "Active Locations",
      value: "10",
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
  ];

  return (
    <>
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="col-span-12 sm:col-span-6 xxl:col-span-3"
        >
          <SummarySingleCard {...item} />
        </div>
      ))}
    </>
  );
};

export default ShiftSummary;