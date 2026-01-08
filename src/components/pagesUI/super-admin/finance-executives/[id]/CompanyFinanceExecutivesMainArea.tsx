"use client";
import React, { useState } from "react";
import Link from "next/link";
import CompanyFinanceExecutivesTable from "./CompanyFinanceExecutivesTable";
import AllCompanyFinanceExecutivesSummary from "./AllCompanyFinanceExecutivesSummary";
import CompanyFinanceExecutiveFilters from "./CompanyFinanceExecutiveFilters";
import { ro } from "date-fns/locale";
import { useRouter } from "next/navigation";
// import AddCompanyFinanceExecutiveModal from "./AddCompanyFinanceExecutiveModal";

// Company data mapping - In real app, this would come from an API
const COMPANY_DATA: Record<string, { name: string; code: string }> = {
  '1': { name: 'TechNova Solutions', code: 'TECH' },
  '2': { name: 'Global Finance Group', code: 'GFG' },
  '3': { name: 'MediCare Innovations', code: 'MEDI' },
  '4': { name: 'RetailMax Corporation', code: 'RMAX' },
  '5': { name: 'Alpha Industries', code: 'ALPH' },
  '6': { name: 'Beta Technologies', code: 'BETA' },
};

interface CompanyFinanceExecutivesMainAreaProps {
  id: string | number;
}

const CompanyFinanceExecutivesMainArea: React.FC<CompanyFinanceExecutivesMainAreaProps> = ({
  id
}) => {
  const companyId = id.toString();
  const companyData = COMPANY_DATA[companyId] || { 
    name: `Company ${companyId}`, 
    code: `COMP${companyId}` 
  };
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
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
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/super-admin">Super Admin</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/super-admin/finance-executives">Finance Executives</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/super-admin/companies">Companies</Link>
                </li>
                <li className="breadcrumb-item active">
                  {companyData.name} Finance Executives
                </li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() =>router.push(`/super-admin/finance-executives/add-finance-executive?companyId=${companyId}`)}
                className="btn btn-primary"
              >
                <i className="fa-regular fa-plus mr-2"></i>
                Add Finance Executive
              </button>
            </div>
          </div>
        </div>

        {/* Company Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{companyData.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-600">Company ID: {companyId}</span>
                  <span className="text-sm text-gray-600">Code: {companyData.code}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Showing Finance Executives for</div>
              <div className="font-semibold text-gray-800">{companyData.name}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6">
          <AllCompanyFinanceExecutivesSummary companyId={companyId} companyName={companyData.name} />
        </div>

        {/* Filters Section */}
        <CompanyFinanceExecutiveFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Table Section - Pass companyId for filtering */}
        <CompanyFinanceExecutivesTable
          companyId={companyId}
          companyName={companyData.name}
          status={selectedStatus}
          department={selectedDepartment}
          role={selectedRole}
          dateRange={dateRange}
        />
      </div>

      {/* {modalOpen && (
        <AddCompanyFinanceExecutiveModal 
          open={modalOpen} 
          setOpen={setModalOpen} 
          companyId={companyId}
          companyName={companyData.name}
        />
      )} */}
    </>
  );
};

export default CompanyFinanceExecutivesMainArea;