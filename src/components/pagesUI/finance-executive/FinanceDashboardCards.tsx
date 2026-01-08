// components/finance/dashboard/FinanceDashboardCards.tsx
import React from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import { DashboardCardData } from "@/interface/DashboardDetailsCards.interface";

interface FinanceDashboardCardsProps {
  cardsData: DashboardCardData[];
}

const FinanceDashboardCards: React.FC<FinanceDashboardCardsProps> = ({ cardsData }) => {
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

export default FinanceDashboardCards;