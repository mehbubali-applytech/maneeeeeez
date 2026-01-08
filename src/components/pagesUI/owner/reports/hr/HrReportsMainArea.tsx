"use client";
import Link from "next/link";
import React, { useState } from "react";
import HrReportsTable from "./HrReportsTable";
import GenerateReportModal from "./GenerateReportModal";
import HrReportsSummary from "./HrReportsSummary";
import ReportFilters from "./ReportFilters";

const HrReportsMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "2024-01-01",
    end: "2024-03-31"
  });

  return (
    <>
      <div className="app__slide-wrapper">
        <div className="breadcrumb__area">
          <div className="breadcrumb__wrapper mb-[25px]">
            <nav>
              <ol className="breadcrumb flex items-center mb-0">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item"><Link href="/owner">Owner</Link></li>
                <li className="breadcrumb-item active">Hr Reports</li>
              </ol>
            </nav>

            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn btn-primary"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

    

        <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
          <HrReportsSummary />
        </div>
            <ReportFilters
          selectedReportType={selectedReportType}
          setSelectedReportType={setSelectedReportType}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
          <HrReportsTable
            reportType={selectedReportType}
            dateRange={dateRange}
          />
      </div>

      {modalOpen && <GenerateReportModal open={modalOpen} setOpen={setModalOpen} />}
    </>
  );
};

export default HrReportsMainArea;