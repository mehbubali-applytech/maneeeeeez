import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";

const PerformanceReportsSummary: React.FC = () => {
  const reportData = [
    {
      iconClass: "fa-light fa-chart-line",
      title: "Total Reports",
      value: "89",
      description: "",
      percentageChange: "+18%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-star",
      title: "Avg. Performance Score",
      value: "4.2/5.0",
      description: "",
      percentageChange: "+5%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-light fa-users",
      title: "Employees Assessed",
      value: "1,245",
      description: "",
      percentageChange: "+12%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-light fa-download",
      title: "Total Downloads",
      value: "342",
      description: "",
      percentageChange: "+25%",
      isIncrease: true,
    },
  ];

  return (
    <>
      {reportData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={index}>
          <SummarySingleCard {...item} />
        </div>
      ))}
    </>
  );
};

export default PerformanceReportsSummary;