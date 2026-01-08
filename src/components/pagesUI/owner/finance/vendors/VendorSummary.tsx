import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";

const VendorSummary: React.FC = () => {
  const vendorData = [
    {
      iconClass: "fa-light fa-building",
      title: "Total Vendors",
      value: "1,234",
      description: "",
      percentageChange: "+12%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-money-bill-wave",
      title: "Active Purchases",
      value: "$456,789",
      description: "",
      percentageChange: "+8%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-light fa-credit-card",
      title: "Outstanding Balance",
      value: "$78,900",
      description: "",
      percentageChange: "-5%",
      isIncrease: false,
    },
    {
      iconClass: "fa-sharp fa-light fa-file-invoice-dollar",
      title: "Pending Invoices",
      value: "45",
      description: "",
      percentageChange: "+3%",
      isIncrease: true,
    },
  ];

  return (
    <>
      {vendorData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={index}>
          <SummarySingleCard {...item} />
        </div>
      ))}
    </>
  );
};

export default VendorSummary;