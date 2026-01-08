import SummarySingleCard from "@/components/common/SummarySingleCard";
import React from "react";
import { DashboardCardData } from "@/interface/DashboardDetailsCards.interface";

interface DashboardDetailsCardsProps {
  cardsData: DashboardCardData[];
}

const DashboardDetailsCards: React.FC<DashboardDetailsCardsProps> = ({ cardsData }) => {
  return (
    <>
      {cardsData.map((card, index) => (
        <div key={index} className="col-span-12 sm:col-span-6 xxl:col-span-3">
          <SummarySingleCard {...card} />
        </div>
      ))}
    </>
  );
};

export default DashboardDetailsCards;
