"use client";
import Link from "next/link";
import React, { useState } from "react";
import PayrollVerificationTable from "./PayrollVerificationTable";
import PayrollSummary from "./PayrollSummary";
import PayrollFilters from "./PayrollFilters";
import { useRouter } from "next/navigation";

const PayrollVerificationMainArea = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const router = useRouter();

  return (
    <>
      <div className="app__slide-wrapper">
        <div className="breadcrumb__area">
          <div className="breadcrumb__wrapper mb-[25px]">
            <nav>
              <ol className="breadcrumb flex items-center mb-0">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item"><Link href="/finance-executive">Finance Executive</Link></li>
                <li className="breadcrumb-item active">Payroll Verification</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() => router.push('/finance-executive/payroll/run-payroll')}
                className="btn btn-primary"
              >
                <i className="fa-regular fa-calculator mr-2"></i>
                Run New Payroll
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-12 gap-x-6 mb-6">
          <PayrollSummary />
        </div>

        {/* Filters Section */}
        <PayrollFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Table Section */}
        <PayrollVerificationTable
          status={selectedStatus}
          month={selectedMonth}
          department={selectedDepartment}
          searchQuery={searchQuery}
          dateRange={dateRange}
        />
      </div>
    </>
  );
};

export default PayrollVerificationMainArea;