"use client";
import Link from "next/link";
import React, { useState } from "react";
import HrManagersTable from "./HrManagersTable";
import AllHrManagersSummary from "./AllHrManagersSummary";
import HrManagerFilters from "./HrManagerFilters";
// import AddHrManagerModal from "./AddHrManagerModal";
import { useRouter } from "next/navigation";

const HrManagersMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  // REMOVE DEFAULT DATE RANGE - let it be empty
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const router = useRouter();

  // Use the same pattern as StaffMainArea
  return (
    <>
      <div className="app__slide-wrapper">
        <div className="breadcrumb__area">
          <div className="breadcrumb__wrapper mb-[25px]">
            <nav>
              <ol className="breadcrumb flex items-center mb-0">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item"><Link href="/super-admin">Super Admin</Link></li>
                <li className="breadcrumb-item active">HR Managers</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={()=>router.push('/super-admin/hr-manager/add-hr-manager')}
                className="btn btn-primary"
              >
                <i className="fa-regular fa-plus mr-2"></i>
                Add New HR Manager
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6">
          <AllHrManagersSummary />
        </div>

        {/* Filters Section - Same pattern as StaffFilters */}
        <HrManagerFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Table Section - Pass filters as props like StaffTable */}
        <HrManagersTable
          status={selectedStatus}
          department={selectedDepartment}
          company={selectedCompany}
          dateRange={dateRange}
        />
      </div>

      {/* {modalOpen && <AddHrManagerModal open={modalOpen} setOpen={setModalOpen} />} */}
    </>
  );
};

export default HrManagersMainArea;