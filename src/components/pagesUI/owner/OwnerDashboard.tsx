'use client';

import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import DashboardDetailsCards from "@/components/pagesUI/apps/home/DashboardDetailsCards";
import MettingSchedule from "@/components/pagesUI/apps/home/MettingSchedule";
import CalanderSection from "@/components/pagesUI/apps/home/CalanderSection";
import OrderOverview from "@/components/pagesUI/apps/home/OrderOverview";
import CustomerSatisfaction from "@/components/pagesUI/apps/home/CustomerSatisfaction";
import UserActivity from "@/components/pagesUI/apps/home/UserActivity";
import AnnouncementTable from "@/components/pagesUI/apps/home/AnnouncementTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SessionResponseData } from "./ownerTypes";

interface DashboardSummary {
  totalEmployees: number;
  onLeaveEmployees: number;
  pendingLeaves: number;
  attendancePercentage: number;
}

const OwnerDashboard = () => {
  const router = useRouter();

  const [companyData, setCompanyData] =
    useState<SessionResponseData | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        { withCredentials: true }
      );

      setCompanyData(response.data.data);
      localStorage.setItem(
        "companyName",
        JSON.stringify(response.data.data.company.company_name)
      );
      localStorage.setItem(
        "contactPerson",
        JSON.stringify(response.data.data.company.contact_person)
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/");
      }
    }
  };

  const fetchCardData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/dashboard-summary`,
        { withCredentials: true }
      );

      setSummary(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchCardData();
  }, []);

  const cardsData = [
    {
      iconClass: "fa-sharp fa-regular fa-user",
      title: "Total Employee",
      value: summary?.totalEmployees ?? 0,
      description: "Than Last Year",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-regular fa-house-person-leave",
      title: "On Leave Employee",
      value: summary?.onLeaveEmployees ?? 0,
      description: "Than Last Month",
      percentageChange: "",
      isIncrease: true,
    },
    {
      iconClass: "fa-sharp fa-regular fa-gear",
      title: "Attendance Percentage",
      value: `${summary?.attendancePercentage ?? 0}%`,
      description: "Than Last Month",
      percentageChange: "",
      isIncrease: true,
    },
    // {
    //   iconClass: "fa-light fa-badge-check",
    //   title: "Payroll Status",
    //   value: "Completed",
    //   isIncrease: true,
    // },
    {
      iconClass: "fa-sharp fa-regular fa-users",
      title: "Pending Leaves",
      value: summary?.pendingLeaves ?? 0,
      description: "Than Last Month",
      percentageChange: "",
      isIncrease: true,
    },
  ];

  return (
    <MetaData pageTitle="Owner Dashboard">
      <Wrapper role="owner" cData={companyData}>
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
  );
};

export default OwnerDashboard;
