import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";

const SubscriptionsSummary: React.FC = () => {
  const subscriptionData = [
    {
      iconClass: "fa-light fa-credit-card",
      title: "Total Subscriptions",
      value: "1,234",
      description: "",
      percentageChange: "+12%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-money-bill-wave",
      title: "Active Revenue",
      value: "$45,678",
      description: "",
      percentageChange: "+8%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-regular fa-user-check",
      title: "Active Users",
      value: "850",
      description: "",
      percentageChange: "+5%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-regular fa-clock",
      title: "Pending Renewals",
      value: "45",
      description: "",
      percentageChange: "-2%",
      isIncrease: false,
    },
  ];

  return (
    <>
      {subscriptionData.map((item, index) => (
        <div className="col-span-12 sm:col-span-6 xxl:col-span-3" key={index}>
          <SummarySingleCard {...item} />
        </div>
      ))}
    </>
  );
};

export default SubscriptionsSummary;