import Wrapper from "@/components/layouts/DefaultWrapper";
import MetaData from "@/hooks/useMetaData";
import FinanceDashboardCards from "./FinanceDashboardCards";
import ComplianceStatus from "./ComplianceStatus";
import BankProcessingStatus from "./BankProcessingStatus";
import CostAnalysisChart from "./CostAnalysisChart";
import UpcomingDeadlines from "./UpcomingDeadlines";
import RecentPayrollActivity from "./RecentPayrollActivity";
import PayrollApprovalQueue from "./PayrollApprovalQueue";


// Mock data for dashboard cards
const financeCardsData = [
  {
    iconClass: "fa-light fa-money-bill-wave",
    title: "Total Payroll This Month",
    value: "₹15,87,500",
    description: "Processed Amount",
    percentageChange: "+12.5%",
    isIncrease: true,
  },
  {
    iconClass: "fa-light fa-users",
    title: "Employees on Payroll",
    value: "247",
    description: "Active Employees",
    percentageChange: "+5.2%",
    isIncrease: true,
  },

  {
    iconClass: "fa-light fa-file-contract",
    title: "Compliance Due",
    value: "4",
    description: "Statutory Reports",
    percentageChange: "0%",
    isIncrease: false,
  },
  {
    iconClass: "fa-light fa-chart-pie",
    title: "Cost Variance",
    value: "-1.2%",
    description: "vs Budget",
    percentageChange: "+0.5%",
    isIncrease: true,
  },
];

export default function FinanceDashboard() {
  return (
    <MetaData pageTitle="Finance Dashboard">
      <Wrapper role={"finance-executive"}>
        <div className="app__slide-wrapper">
          <div className="grid grid-cols-12 gap-x-5 maxXs:gap-x-0">
            <FinanceDashboardCards cardsData={financeCardsData} />
            <PayrollApprovalQueue />
            <ComplianceStatus />
            <BankProcessingStatus />
            <CostAnalysisChart />
            <UpcomingDeadlines />
            <RecentPayrollActivity />
          </div>
        </div>
      </Wrapper>
    </MetaData>
  );
}