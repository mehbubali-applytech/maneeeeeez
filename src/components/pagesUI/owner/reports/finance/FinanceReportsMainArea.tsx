"use client";
import Link from "next/link";
import React, { useState } from "react";
import FinanceReportsTable from "./FinanceReportsTable";
import GenerateFinanceReportModal from "./GenerateFinanceReportModal";
import FinanceReportsSummary from "./FinanceReportsSummary";
import FinanceReportFilters from "./FinanceReportFilters";

const FinanceReportsMainArea = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReportType, setSelectedReportType] = useState<string>("all");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
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
                                <li className="breadcrumb-item active">Finance Reports</li>
                            </ol>
                        </nav>
                        <div className="breadcrumb__btn">
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className="btn btn-primary"
                            >
                                Generate Finance Report
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
                    <FinanceReportsSummary />
                </div>

                <FinanceReportFilters
                    selectedReportType={selectedReportType}
                    setSelectedReportType={setSelectedReportType}
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
                <FinanceReportsTable
                    reportType={selectedReportType}
                    period={selectedPeriod}
                    dateRange={dateRange}
                />

            </div>

            {modalOpen && <GenerateFinanceReportModal open={modalOpen} setOpen={setModalOpen} />}
        </>
    );
};

export default FinanceReportsMainArea;