// SalaryGradeSummary.tsx
"use client";

import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { ISalaryGrade } from "./SalaryGradeTypes";

interface SalaryGradeSummaryProps {
  grades: ISalaryGrade[];
}

const SalaryGradeSummary: React.FC<SalaryGradeSummaryProps> = ({ grades }) => {
  const totalGrades = grades.length;
  const activeGrades = grades.filter(g => g.isActive).length;
  const totalComponents = grades.reduce((sum, grade) => sum + grade.components.length, 0);
  const avgCTC = grades.reduce((sum, grade) => sum + grade.totalCTC, 0) / (grades.length || 1);
  const totalAssigned = grades.reduce((sum, grade) => sum + (grade as any).assignedCount || 0, 0);

  const summaryData = [
    {
      iconClass: "fa-light fa-layer-group",
      title: "Total Grades",
      value: totalGrades.toString(),
      description: `${activeGrades} active`,
      percentageChange: "+12%",
      isIncrease: true,
      color: "primary"
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Active Grades",
      value: activeGrades.toString(),
      description: `${totalGrades - activeGrades} inactive`,
      percentageChange: "+5%",
      isIncrease: true,
      color: "success"
    },
    {
      iconClass: "fa-light fa-puzzle-piece",
      title: "Components",
      value: totalComponents.toString(),
      description: "Across all grades",
      percentageChange: "+8%",
      isIncrease: true,
      color: "info"
    },
    {
      iconClass: "fa-light fa-money-bill-wave",
      title: "Avg. CTC",
      value: `₹${(avgCTC / 100000).toFixed(1)}L`,
      description: "Per annum",
      percentageChange: "+15%",
      isIncrease: true,
      color: "warning"
    },
    {
      iconClass: "fa-light fa-users",
      title: "Assigned Employees",
      value: totalAssigned.toString(),
      description: "Using these grades",
      percentageChange: "+20%",
      isIncrease: true,
      color: "secondary"
    },
    {
      iconClass: "fa-light fa-chart-line",
      title: "Highest Grade",
      value: `₹${Math.max(...grades.map(g => g.totalCTC)) / 100000}L`,
      description: "Top salary package",
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
          <SummarySingleCard {...item} />
        </div>
      ))}
    </>
  );
};

export default SalaryGradeSummary;