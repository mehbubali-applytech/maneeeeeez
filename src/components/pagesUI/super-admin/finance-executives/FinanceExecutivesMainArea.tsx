"use client";
import Link from "next/link";
import React, { useState } from "react";
import FinanceExecutivesTable from "./FinanceExecutivesTable";
import AllFinanceExecutivesSummary from "./AllFinanceExecutivesSummary";
import FinanceExecutiveFilters from "./FinanceExecutiveFilters";
// import AddFinanceExecutiveModal from "./AddFinanceExecutiveModal";
import AddNewFinanceExecutive from "./add-finance-executive/AddNewFinanceExecutive";
import { useRouter } from "next/navigation";

const FinanceExecutivesMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
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
                <li className="breadcrumb-item active">Finance Executives</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() => router.push('/super-admin/finance-executives/add-finance-executive')}
                className="btn btn-primary"
              >
                <i className="fa-regular fa-plus mr-2"></i>
                Add New Finance Executive
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6">
          <AllFinanceExecutivesSummary />
        </div>

        {/* Filters Section - PASS THE STATE VALUES, NOT SETTER FUNCTIONS */}
        <FinanceExecutiveFilters
          selectedStatus={selectedStatus}  // Pass the value
          setSelectedStatus={setSelectedStatus}  // Pass the setter function
          selectedDepartment={selectedDepartment}  // Pass the value
          setSelectedDepartment={setSelectedDepartment}  // Pass the setter function
          selectedCompany={selectedCompany}  // Pass the value
          setSelectedCompany={setSelectedCompany}  // Pass the setter function
          selectedRole={selectedRole}  // Pass the value
          setSelectedRole={setSelectedRole}  // Pass the setter function
          dateRange={dateRange}  // Pass the value
          setDateRange={setDateRange}  // Pass the setter function
        />

        {/* Table Section */}
        <FinanceExecutivesTable
          status={selectedStatus}
          department={selectedDepartment}
          company={selectedCompany}
          role={selectedRole}
          dateRange={dateRange}
        />
      </div>

      {/* {modalOpen && <AddFinanceExecutiveModal open={modalOpen} setOpen={setModalOpen} />} */}
    </>
  );
};

export default FinanceExecutivesMainArea;