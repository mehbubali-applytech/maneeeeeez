"use client";
import Link from "next/link";
import React, { useState } from "react";
import CompaniesTable from "./CompaniesTable";
import AllCompaniesSummary from "./AllCompaniesSummary";
import CompanyFilters from "./CompanyFilters";
import { useRouter } from "next/navigation";

const AllCompaniesMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "2024-01-01",
    end: "2024-03-31"
  });

  const router = useRouter();

  const handleAddClick = ()=>{
    router.push("/super-admin/companies/add-company")
  }

  return (
    <>
      <div className="app__slide-wrapper">
        <div className="breadcrumb__area">
          <div className="breadcrumb__wrapper mb-[25px]">
            <nav>
              <ol className="breadcrumb flex items-center mb-0">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item"><Link href="/super-admin">Super Admin</Link></li>
                <li className="breadcrumb-item active">All Companies</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={handleAddClick}
                className="btn btn-primary"
              >
                <i className="fa-regular fa-plus mr-2"></i>
                Add New Company
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
          <AllCompaniesSummary />
        </div>

        <CompanyFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <CompaniesTable
          status={selectedStatus}
          industry={selectedIndustry}
          country={selectedCountry}
          dateRange={dateRange}
        />

      </div>

    </>
  );
};

export default AllCompaniesMainArea;