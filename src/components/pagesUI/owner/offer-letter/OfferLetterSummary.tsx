"use client";

import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { IOfferLetter } from "./OfferLetterTypes";

interface OfferLetterSummaryProps {
  offers: IOfferLetter[];
}

const OfferLetterSummary: React.FC<OfferLetterSummaryProps> = ({ offers }) => {
  const totalOffers = offers.length;
  const sentOffers = offers.filter(offer => offer.offerStatus === 'Sent').length;
  const acceptedOffers = offers.filter(offer => offer.offerStatus === 'Accepted').length;
  const draftOffers = offers.filter(offer => offer.offerStatus === 'Draft').length;
  
  // Calculate average CTC
  const avgCTC = offers.length > 0 
    ? offers.reduce((sum, offer) => sum + offer.ctc, 0) / offers.length 
    : 0;
  
  // Calculate acceptance rate
  const acceptanceRate = sentOffers > 0 
    ? Math.round((acceptedOffers / sentOffers) * 100) 
    : 0;

  const summaryData = [
    {
      iconClass: "fa-light fa-file-contract",
      title: "Total Offers",
      value: totalOffers.toString(),
      description: "",
      percentageChange: "+15%",
      isIncrease: true,
      color: "primary"
    },
    {
      iconClass: "fa-light fa-paper-plane",
      title: "Sent Offers",
      value: sentOffers.toString(),
      description: "",
      percentageChange: "+8%",
      isIncrease: true,
      color: "info"
    },
    {
      iconClass: "fa-light fa-check-circle",
      title: "Accepted",
      value: acceptedOffers.toString(),
      description: `${acceptanceRate}% acceptance rate`,
      percentageChange: "+12%",
      isIncrease: true,
      color: "success"
    },
    {
      iconClass: "fa-light fa-edit",
      title: "Drafts",
      value: draftOffers.toString(),
      description: "Pending send",
      percentageChange: "-3%",
      isIncrease: false,
      color: "warning"
    },
    {
      iconClass: "fa-light fa-money-bill-wave",
      title: "Avg. CTC",
      value: `₹${(avgCTC / 100000).toFixed(1)}L`,
      description: "Average package",
      percentageChange: "+10%",
      isIncrease: true,
      color: "secondary"
    },
    {
      iconClass: "fa-light fa-clock",
      title: "Pending Response",
      value: sentOffers.toString(),
      description: "Awaiting candidate",
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

export default OfferLetterSummary;