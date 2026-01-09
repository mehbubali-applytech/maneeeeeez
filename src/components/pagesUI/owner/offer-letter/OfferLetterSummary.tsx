"use client";

import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IOfferLetterTemplate } from "./OfferLetterTypes";

interface OfferLetterSummaryProps {
  templates: IOfferLetterTemplate[];
}

const OfferLetterSummary: React.FC<OfferLetterSummaryProps> = ({ templates }) => {
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter(t => t.isActive).length;
  const totalVersions = templates.reduce((sum, template) => sum + template.versions.length, 0);
  const draftTemplates = templates.filter(t => t.status === 'Draft').length;
  const publishedTemplates = templates.filter(t => t.status === 'Published').length;
  const usageCount = templates.reduce((sum, t) => sum + t.usageCount, 0);

  const summaryData = [
    {
      iconClass: "fa-light fa-file-contract",
      title: "Total Templates",
      value: totalTemplates.toString(),
      description: `${activeTemplates} active`,
      percentageChange: "+8%",
      isIncrease: true,
      color: "primary"
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Published",
      value: publishedTemplates.toString(),
      description: `${draftTemplates} in draft`,
      percentageChange: "+12%",
      isIncrease: true,
      color: "success"
    },
    {
      iconClass: "fa-light fa-layer-group",
      title: "Total Versions",
      value: totalVersions.toString(),
      description: "Across all templates",
      percentageChange: "+5%",
      isIncrease: true,
      color: "info"
    },
    {
      iconClass: "fa-light fa-chart-line",
      title: "Times Used",
      value: usageCount.toString(),
      description: "Offer letters generated",
      percentageChange: "+25%",
      isIncrease: true,
      color: "warning"
    },
    {
      iconClass: "fa-light fa-building",
      title: "Departments",
      value: "5",
      description: "With templates",
      percentageChange: "+2",
      isIncrease: true,
      color: "secondary"
    },
    {
      iconClass: "fa-light fa-clock",
      title: "Latest Update",
      value: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      description: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
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
          className={`
            col-span-12 
            sm:col-span-6 
            ${index === 0 || index === 5 ? 'lg:col-span-4' : 'lg:col-span-4'}
            xl:col-span-3
            2xl:col-span-2
          `}
        >
          <SummarySingleCard {...item} />
        </div>
      ))}
    </>
  );
};

export default OfferLetterSummary;