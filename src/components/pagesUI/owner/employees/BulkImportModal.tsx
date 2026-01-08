// EmployeeSummary.tsx
"use client";

import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IEmployee } from "./EmployeeTypes";

interface EmployeeSummaryProps {
    open: boolean;
  employees: IEmployee[];
}

const EmployeeSummary: React.FC<EmployeeSummaryProps> = ({ open, employees }) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.employmentStatus === 'Active').length;
  const probationEmployees = employees.filter(emp => emp.employmentStatus === 'On Probation').length;
  const contractEmployees = employees.filter(emp => emp.workType === 'Contract').length;
  const recentJoinees = employees.filter(emp => {
    const joiningDate = new Date(emp.dateOfJoining);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joiningDate >= thirtyDaysAgo;
  }).length;

  const summaryData = [
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: totalEmployees.toString(),
      description: "",
      percentageChange: "+12%",
      isIncrease: true,
      color: "primary"
    },
    {
      iconClass: "fa-light fa-user-check",
      title: "Active Employees",
      value: activeEmployees.toString(),
      description: "",
      percentageChange: "+5%",
      isIncrease: true,
      color: "success"
    },
    {
      iconClass: "fa-light fa-hourglass-half",
      title: "On Probation",
      value: probationEmployees.toString(),
      description: "",
      percentageChange: "-2%",
      isIncrease: false,
      color: "warning"
    },
    {
      iconClass: "fa-light fa-file-contract",
      title: "Contract Staff",
      value: contractEmployees.toString(),
      description: "",
      percentageChange: "+8%",
      isIncrease: true,
      color: "info"
    },
    {
      iconClass: "fa-light fa-user-plus",
      title: "Recent Joinees (30d)",
      value: recentJoinees.toString(),
      description: "",
      percentageChange: "+15%",
      isIncrease: true,
      color: "secondary"
    },
    {
      iconClass: "fa-light fa-building",
      title: "Departments",
      value: "8",
      description: "",
      percentageChange: "",
      isIncrease: false,
      color: "default"
    }
  ];

  return (
    <>
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="col-span-12 sm:col-span-6 xxl:col-span-4"
        >
          {/* <SummarySingleCard {...item} /> */}
        </div>
      ))}
    </>
  );
};

export default EmployeeSummary;