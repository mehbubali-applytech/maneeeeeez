import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IEmployee } from "./EmployeeTypes";

interface Props {
  employees: IEmployee[];
}

const EmployeeSummary: React.FC<Props> = ({ employees }) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (e) => e.status === "Active"
  ).length;
  const inactiveEmployees = employees.filter(
    (e) => e.status === "Inactive"
  ).length;

  const summaryData = [
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: totalEmployees.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-check",
      title: "Active Employees",
      value: activeEmployees.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-user-xmark",
      title: "Inactive Employees",
      value: inactiveEmployees.toString(),
      description: "",
      percentageChange: "",
      isIncrease: false,
    }
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

export default EmployeeSummary;
