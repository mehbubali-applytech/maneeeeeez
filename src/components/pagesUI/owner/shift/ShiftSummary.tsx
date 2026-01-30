"use client";

import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IShift } from "./ShiftTypes";

interface ShiftSummaryProps {
  shifts: IShift[];
}

const ShiftSummary: React.FC<ShiftSummaryProps> = ({ shifts }) => {
  const totalShifts = shifts.length;
  const activeShifts = shifts.filter((s) => s.active_status).length;
  const nightShifts = shifts.filter((s) => s.is_night_shift).length;
  
  const assignedEmployees = shifts.reduce(
    (sum, s) => sum + (s.assigned_employees || 0),
    0
  );

  // Get unique branches across all shifts
  const uniqueBranches = new Set<number>();
  shifts.forEach(shift => {
    shift.Branches?.forEach(branch => {
      uniqueBranches.add(branch.branch_id);
    });
  });

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
      title: "Branches Covered",
      value: uniqueBranches.size.toString(),
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