import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IBranch } from "./BranchTypes";

interface Props {
  branches: IBranch[];
}

const BranchSummary: React.FC<Props> = ({ branches }) => {
  const totalBranches = branches.length;
  const activeBranches = branches.filter((b) => b.status === "Active").length;
  const inactiveBranches = branches.filter((b) => b.status === "Inactive").length;
  const closedBranches = branches.filter((b) => b.status === "Closed").length;

  const totalEmployees = branches.reduce(
    (sum, b) => sum + (b.totalEmployees || 0),
    0
  );

  const summaryData = [
    {
      iconClass: "fa-light fa-code-branch",
      title: "Total Branches",
      value: totalBranches.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Active Branches",
      value: activeBranches.toString(),
      description: "",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-pause-circle",
      title: "Inactive Branches",
      value: inactiveBranches.toString(),
      description: "",
      percentageChange: "",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-xmark-circle",
      title: "Closed Branches",
      value: closedBranches.toString(),
      description: "",
      percentageChange: "",
      isIncrease: false,
    },
    {
      iconClass: "fa-light fa-users",
      title: "Total Employees",
      value: totalEmployees.toString(),
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

export default BranchSummary;
