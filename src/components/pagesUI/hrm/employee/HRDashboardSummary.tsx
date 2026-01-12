// HRDashboardSummary.tsx
"use client";

import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IHREmployee } from "./HREmployeeTypes";

interface Props {
  employees: IHREmployee[];
}

const HRDashboardSummary: React.FC<Props> = ({ employees }) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.workflowStatus === "Active").length;
  const onProbation = employees.filter(e => e.employmentStatus === "On Probation").length;
  const onboardingPending = employees.filter(e => 
    e.onboardingStatus === "Pending" || e.onboardingStatus === "In Progress"
  ).length;
  const onNoticePeriod = employees.filter(e => e.workflowStatus === "Notice Period").length;

  const summaryData = [
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: totalEmployees.toString(),
      description: `Active: ${activeEmployees}`,
      percentageChange: "+12%",
      isIncrease: true,
      trend: "up"
    },
    {
      iconClass: "fa-light fa-user-check",
      title: "Active Employees",
      value: activeEmployees.toString(),
      description: `${Math.round((activeEmployees / totalEmployees) * 100)}% of total`,
      percentageChange: "+5%",
      isIncrease: true,
      trend: "up"
    },
    {
      iconClass: "fa-light fa-user-clock",
      title: "On Probation",
      value: onProbation.toString(),
      description: `${Math.round((onProbation / totalEmployees) * 100)}% of total`,
      percentageChange: "-2%",
      isIncrease: false,
      trend: "down"
    },
    {
      iconClass: "fa-light fa-clipboard-list",
      title: "Onboarding Pending",
      value: onboardingPending.toString(),
      description: "Need HR action",
      percentageChange: "+3",
      isIncrease: false,
      trend: "up",
      alert: true
    },
    {
      iconClass: "fa-light fa-calendar-xmark",
      title: "Notice Period",
      value: onNoticePeriod.toString(),
      description: "Exit process pending",
      percentageChange: "+1",
      isIncrease: false,
      trend: "up"
    },
    {
      iconClass: "fa-light fa-chart-line",
      title: "Attrition Rate",
      value: `${Math.round((employees.filter(e => e.workflowStatus === "Exit").length / totalEmployees) * 100)}%`,
      description: "Last 12 months",
      percentageChange: "-1.2%",
      isIncrease: true,
      trend: "down"
    }
  ];

  return (
    <>
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="col-span-12 sm:col-span-6 lg:col-span-4 xxl:col-span-2"
        >
          <SummarySingleCard {...item} />
        </div>
      ))}
    </>
  );
};

export default HRDashboardSummary;