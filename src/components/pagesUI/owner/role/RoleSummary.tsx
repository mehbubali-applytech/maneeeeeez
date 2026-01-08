// RoleSummary.tsx
"use client";

import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IRole } from "./RoleTypes";

interface Props {
  roles: IRole[];
}

const RoleSummary: React.FC<Props> = ({ roles }) => {
  const totalRoles = roles.length;
  const activeRoles = roles.filter((r) => r.activeStatus).length;
  const inactiveRoles = roles.filter((r) => !r.activeStatus).length;
  
  const assignedUsers = roles.reduce(
    (sum, r) => sum + (r.assignedUsers || 0),
    0
  );

  // Count roles with custom permissions (not predefined)
  const customRoles = roles.filter((r) => r.roleCode && r.roleCode.startsWith("CUST_")).length;

  const summaryData = [
    {
      iconClass: "fa-light fa-user-tie",
      title: "Total Roles",
      value: totalRoles.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Active Roles",
      value: activeRoles.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-pause-circle",
      title: "Inactive Roles",
      value: inactiveRoles.toString(),
      description: "",
      percentageChange: "",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-users",
      title: "Assigned Users",
      value: assignedUsers.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-gears",
      title: "Custom Roles",
      value: customRoles.toString(),
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

export default RoleSummary;