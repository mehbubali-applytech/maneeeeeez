import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import DashboardDetailsCards from "@/components/pagesUI/apps/home/DashboardDetailsCards";
import MettingSchedule from "@/components/pagesUI/apps/home/MettingSchedule";
import CalanderSection from "@/components/pagesUI/apps/home/CalanderSection";
import OrderOverview from "@/components/pagesUI/apps/home/OrderOverview";
import CustomerSatisfaction from "@/components/pagesUI/apps/home/CustomerSatisfaction";
import UserActivity from "@/components/pagesUI/apps/home/UserActivity";
import AnnouncementTable from "@/components/pagesUI/apps/home/AnnouncementTable";

const SuperAdminDashboard = () => {

  const cardsData = [
    {
      iconClass: "fa-sharp fa-regular fa-user",
      title: "Total Employee",
      value: 313,
      description: "Than Last Year",
      percentageChange: "+10%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-regular fa-house-person-leave",
      title: "On Leave Employee",
      value: 55,
      description: "Than Last Month",
      percentageChange: "+2.15%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-regular fa-gear",
      title: "Total Project",
      value: 313,
      description: "Than Last Month",
      percentageChange: "+5.15%",
      isIncrease: true,
    },
    {
      iconClass: "fa-light fa-badge-check",
      title: "Compleat Project",
      value: 150,
      description: "Than Last Month",
      percentageChange: "+5.5%",
      isIncrease: false,
    },
    {
      iconClass: "fa-sharp fa-regular fa-users",
      title: "Total Client",
      value: 151,
      description: "Than Last Month",
      percentageChange: "+2.15%",
      isIncrease: true,
    },
    {
      iconClass: "fa-regular fa-arrow-up-right-dots",
      title: "Total Revenue",
      value: "$55",
      description: "Than Last Month",
      percentageChange: "+2.15%",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-light fa-suitcase",
      title: "Total Jobs",
      value: 55,
      description: "Than Last Month",
      percentageChange: "+2.15%",
      isIncrease: true,
    },
    {
      iconClass: "icon-tickets1",
      title: "Total Ticket",
      value: 55,
      description: "Than Last Month",
      percentageChange: "+2.15%",
      isIncrease: true,
    },
  ];

  return (
    <>
      <MetaData pageTitle="HRM Dashboard">
        <Wrapper role="super-admin">
      <div className="app__slide-wrapper">
        <div className="grid grid-cols-12 gap-x-5 maxXs:gap-x-0">
          <DashboardDetailsCards cardsData={cardsData} />
          <MettingSchedule />
          <CalanderSection />
          <OrderOverview />
          <CustomerSatisfaction />
          <UserActivity />
          <AnnouncementTable />
        </div>
      </div>
    </Wrapper>
      </MetaData>
    </>
  );
};

export default SuperAdminDashboard;
