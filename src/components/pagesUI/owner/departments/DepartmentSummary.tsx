import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";

const DepartmentSummary: React.FC = () => {
  const departmentData = [
    {
      iconClass: "fa-light fa-building",
      title: "Total Departments",
      value: "12",
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-tie",
      title: "Active Departments",
      value: "9",
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-slash",
      title: "Inactive Departments",
      value: "3",
      description: "",
      percentageChange: "",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: "256",
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
  ];

  return (
    <>
      {departmentData.map((item, index) => (
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

export default DepartmentSummary;
