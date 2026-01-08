import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";

const HrReportsSummary: React.FC = () => {
  const reportData = [
    {
      iconClass: "fa-light fa-file-chart-column",
      title: "Total Reports",
      value: "245",
      description: "",
      percentageChange: "+15%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-file-check",
      title: "Completed Reports",
      value: "198",
      description: "",
      percentageChange: "+8%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-light fa-file-clock",
      title: "Pending Reports",
      value: "32",
      description: "",
      percentageChange: "-5%",
      isIncrease: false,
    },
    {
      iconClass: "fa-sharp fa-light fa-download",
      title: "Total Downloads",
      value: "1,245",
      description: "",
      percentageChange: "+22%",
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

export default HrReportsSummary;