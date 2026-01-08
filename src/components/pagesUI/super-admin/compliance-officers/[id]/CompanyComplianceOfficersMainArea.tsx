"use client";
import React, { useState } from "react";
import Link from "next/link";
import CompanyComplianceOfficersTable from "./CompanyComplianceOfficersTable";
import AllCompanyComplianceOfficersSummary from "./AllCompanyComplianceOfficersSummary";
import CompanyComplianceOfficerFilters from "./CompanyComplianceOfficerFilters";
import { useRouter } from "next/navigation";

// Company data mapping
const COMPANY_DATA: Record<string, { name: string; code: string }> = {
  '1': { name: 'TechNova Solutions', code: 'TECH' },
  '2': { name: 'Global Finance Group', code: 'GFG' },
  '3': { name: 'MediCare Innovations', code: 'MEDI' },
  '4': { name: 'RetailMax Corporation', code: 'RMAX' },
  '5': { name: 'Alpha Industries', code: 'ALPH' },
  '6': { name: 'Beta Technologies', code: 'BETA' },
};

interface CompanyComplianceOfficersMainAreaProps {
  id: string | number;
}

const CompanyComplianceOfficersMainArea: React.FC<CompanyComplianceOfficersMainAreaProps> = ({
  id
}) => {
  const companyId = id.toString();
  const companyData = COMPANY_DATA[companyId] || { 
    name: `Company ${companyId}`, 
    code: `COMP${companyId}` 
  };
  
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
                  <Link href="/super-admin/compliance-officers">Compliance Officers</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/super-admin/companies">Companies</Link>
                </li>
                <li className="breadcrumb-item active">
                  {companyData.name} Compliance Officers
                </li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() => router.push(`/super-admin/compliance-officers/add-compliance-officer?companyId=${companyId}`)}
                className="btn btn-primary"
              >
                <i className="fa-regular fa-plus mr-2"></i>
                Add Compliance Officer
              </button>
            </div>
          </div>
        </div>

        {/* Company Info Banner */}
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
              <div className="text-sm text-gray-500">Showing Compliance Officers for</div>
              <div className="font-semibold text-gray-800">{companyData.name}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6">
          <AllCompanyComplianceOfficersSummary companyId={companyId} companyName={companyData.name} />
        </div>

        {/* Filters Section */}
        <CompanyComplianceOfficerFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Table Section */}
        <CompanyComplianceOfficersTable
          companyId={companyId}
          companyName={companyData.name}
          status={selectedStatus}
          department={selectedDepartment}
          role={selectedRole}
          dateRange={dateRange}
        />
      </div>
    </>
  );
};

export default CompanyComplianceOfficersMainArea;