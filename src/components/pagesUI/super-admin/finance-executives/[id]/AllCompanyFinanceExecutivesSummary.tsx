"use client";
import React, { useMemo } from "react";
import SummarySingleCard from "@/components/common/SummarySingleCard";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AllCompanyFinanceExecutivesSummaryProps {
  companyId: string;
  companyName?: string;
}

const AllCompanyFinanceExecutivesSummary: React.FC<AllCompanyFinanceExecutivesSummaryProps> = ({ 
  companyId,
  companyName = "Company"
}) => {
  // ... rest of the component remains the same, just use companyName where needed
  // For example in the title:
  
  return (
    <>
      {/* Summary Cards */}
      {/* ... existing code ... */}
      
      {/* Charts Section */}
      <div className="col-span-12 mt-6">
        <div className="card__wrapper style_two">
          <div className="card__title-wrap mb-[25px]">
            <h5 className="card__heading-title">{companyName} Finance Executives Overview</h5>
            <p className="text-gray-600 text-sm mt-1">Statistics for this company only</p>
          </div>
          {/* ... rest of the component ... */}
        </div>
      </div>
    </>
  );
};

export default AllCompanyFinanceExecutivesSummary;