import React from "react";
import SalesOverview from "../../dashboard/crm-dashboard/SalesOverview";
import DashboardAnalysisCard from "../../dashboard/crm-dashboard/DashboardAnalysisCard";
import AudienceSection from "../../dashboard/crm-dashboard/AudienceSection";
import CrmMiniCalander from "../../dashboard/crm-dashboard/CrmMiniCalander";
import CrmOrderOverview from "../../dashboard/crm-dashboard/CrmOrderOverview";
import CrmCustomerSatisfaction from "../../dashboard/crm-dashboard/CrmCustomerSatisfaction";
import CrmUserActivity from "../../dashboard/crm-dashboard/CrmUserActivity";
import CrmDealsStaticTable from "../../dashboard/crm-dashboard/CrmDealsStaticTable";

const ReportsMainArea = () => {
  return (
    <>
      {/* -- App side area start -- */}
      <div className="app__slide-wrapper">
        <div className="grid grid-cols-12 gap-x-5 maxXs:gap-x-0">
          <div className="col-span-12 xl:col-span-6 xxl:col-span-4">
            <SalesOverview />
          </div>
          <div className="col-span-12 xl:col-span-6 xxl:col-span-5">
            <DashboardAnalysisCard />
          </div>
          <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-5 xxl:col-span-3">
            <AudienceSection />
          </div>
          <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-7 xxl:col-span-4">
            <div className="card__wrapper">
              <div className="mini__calendar fc fc-media-screen fc-direction-ltr fc-theme-standard">
                <CrmMiniCalander />
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 xxl:col-span-5">
            <CrmOrderOverview />
          </div>
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 xxl:col-span-3">
            <CrmCustomerSatisfaction />
          </div>
          <div className="col-span-12 xl:col-span-6 xxl:col-span-8">
            <CrmDealsStaticTable />
          </div>
          <div className="col-span-12 xl:col-span-6 xxl:col-span-4">
            <CrmUserActivity />
          </div>
        </div>
      </div>
      {/* -- App side area end -- */}
    </>
  );
};

export default ReportsMainArea;
