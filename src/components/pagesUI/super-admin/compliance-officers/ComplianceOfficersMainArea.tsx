"use client";
import Link from "next/link";
import React, { useState } from "react";
import ComplianceOfficersTable from "./ComplianceOfficersTable";
import AllComplianceOfficersSummary from "./AllComplianceOfficersSummary";
import ComplianceOfficerFilters from "./ComplianceOfficerFilters";
// import AddComplianceOfficerModal from "./AddComplianceOfficerModal";
import { useRouter } from "next/navigation";

const ComplianceOfficersMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
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
                <li className="breadcrumb-item"><Link href="/super-admin">Super Admin</Link></li>
                <li className="breadcrumb-item active">Compliance Officers</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() => router.push('/super-admin/compliance-officers/add-compliance-office')}
                className="btn btn-primary"
              >
                <i className="fa-regular fa-plus mr-2"></i>
                Add New Compliance Officer
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6">
          <AllComplianceOfficersSummary />
        </div>

        {/* Filters Section */}
        <ComplianceOfficerFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Table Section */}
        <ComplianceOfficersTable
          status={selectedStatus}
          department={selectedDepartment}
          company={selectedCompany}
          dateRange={dateRange}
        />
      </div>

      {/* {modalOpen && <AddComplianceOfficerModal open={modalOpen} setOpen={setModalOpen} />} */}
    </>
  );
};

export default ComplianceOfficersMainArea;