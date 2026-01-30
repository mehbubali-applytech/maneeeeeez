import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";

interface Props {
  summaryData: {
    totalDepartments: number;
    activeDepartments: number;
    inactiveDepartments: number;
    parentDepartments: number;
    hierarchyDepth: number;
  };
}

const DepartmentSummary: React.FC<Props> = ({ summaryData }) => {
  const summaryCards = [
    {
      iconClass: "fa-light fa-building",
      title: "Total Departments",
      value: summaryData.totalDepartments.toString(),
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-tie",
      title: "Active Departments",
      value: summaryData.activeDepartments.toString(),
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-slash",
      title: "Inactive Departments",
      value: summaryData.inactiveDepartments.toString(),
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-sitemap",
      title: "Parent Departments",
      value: summaryData.parentDepartments.toString(),
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-layer-group",
      title: "Hierarchy Depth",
      value: summaryData.hierarchyDepth.toString(),
      isIncrease: false,
      suffix: " levels",
    },
  ];

  return (
    <>
      {summaryCards.map((item, index) => (
        <div key={index} className="col-span-12 sm:col-span-6 xxl:col-span-3">
          <SummarySingleCard {...item} />
        </div>
      ))}
    </>
  );
};

export default DepartmentSummary;