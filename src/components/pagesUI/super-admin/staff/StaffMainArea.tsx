"use client";
import Link from "next/link";
import React, { useState } from "react";
import StaffTable from "./StaffTable";
import AddStaffModal from "./AddStaffModal";
import AllStaffSummary from "./AllStaffSummary";
import StaffFilters from "./StaffFilters";
import { useRouter } from "next/navigation";

const StaffMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-03-31",
  });

  const router = useRouter();

  const handleAddClick = () => {
    router.push("/super-admin/staff/add-staff");
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
                <li className="breadcrumb-item active">All Staff</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={handleAddClick}
                className="btn btn-primary"
              >
                <i className="fa-regular fa-user-plus mr-2"></i>
                Add New Staff
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6">
          <AllStaffSummary />
        </div>

        <StaffFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <StaffTable
          status={selectedStatus}
          department={selectedDepartment}
          company={selectedCompany}
          dateRange={dateRange}

        />
      </div>

      {modalOpen && <AddStaffModal open={modalOpen} setOpen={setModalOpen} />}
    </>
  );
};

export default StaffMainArea;
