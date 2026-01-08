"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import { ICompany } from "../../super-admin/companies/companies.interface";
import BasicInfo from "./BasicInfo";
import CompanySideContentSection from "../../super-admin/companies/[id]/CompanySideContentSection";
import CompanyAddDealsModal from "@/components/pagesUI/company/company-details/CompanyAddDealsModal";
import CompanySendMailModal from "../../super-admin/companies/[id]/CompanySendMailModal";
import QuickAccess from "./QuickAccess";

const dummyCompaniesData: ICompany[] = [
  {
    id: 1,
    name: "TechVision Pvt Ltd",
    location: "Bangalore, India",
    phone: "080-23456789",
    mobile: "+91-9876543210",
    fax: "080-987654",
    websites: "https://techvision.com",
    industry: "Software",
    currencyType: "INR",
    source: "LinkedIn",
    description: "A leading software development company",
    language: "English",
    country: "India",
    city: "Bangalore",
    zipCode: "560001",
    state: "Karnataka",
    address: "MG Road, Bangalore",
    email: "contact@techvision.com",
    owner: "Rahul Sharma",
    rating: 4.5,
    tag: "IT",
    status: "Active",

    employees: 250,
    departments: 8,
    projects: 35,
    revenue: 12000000,
    established: "2012",
    licenseNumber: "LIC-TECH-12345",
    taxId: "GSTIN123456",
  },
  {
    id: 2,
    name: "Global Traders Inc",
    location: "Mumbai, India",
    phone: "022-28976543",
    mobile: "+91-9123456780",
    fax: "022-345678",
    websites: "https://globaltraders.com",
    industry: "Import/Export",
    currencyType: "USD",
    source: "Website",
    description: "Deals in international trade and logistics",
    language: "English",
    country: "India",
    city: "Mumbai",
    zipCode: "400001",
    state: "Maharashtra",
    address: "Andheri East, Mumbai",
    email: "info@globaltraders.com",
    owner: "Sanjay Mehta",
    rating: 4.2,
    tag: "Trading",
    status: "Active",

    employees: 120,
    departments: 5,
    projects: 18,
    revenue: 8500000,
    established: "2016",
    licenseNumber: "LIC-GLOBAL-67890",
    taxId: "GSTIN654321",
  },
];

const CompanyOverviewMainArea = () => {
  const params = useParams();
  const id = Number(params?.id) || 1;

  const [openModal, setOpenModal] = useState(false);
  const [openSendEMailModal, setSendEMailModal] = useState(false);

  const handleToggle = () => setOpenModal(!openModal);
  const handleSendEmailToggle = () => setSendEMailModal(!openSendEMailModal);

  const companyToDisplay = dummyCompaniesData.find(
    (company) => company.id === id
  );

  return (
    <>
      <div className="app__slide-wrapper">
        <Breadcrumb breadTitle="Company Details" subTitle="Home" />
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
              <div className="col-span-12 xl:col-span-3">
                <BasicInfo
                  handleToggle={handleToggle}
                  handleSendEmailToggle={handleSendEmailToggle}
                  companyData={companyToDisplay}
                />
              </div>

              <div className="col-span-12 xl:col-span-9">
                <QuickAccess />
                <CompanySideContentSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <CompanyAddDealsModal open={openModal} setOpen={setOpenModal} />
      )}

      {openSendEMailModal && (
        <CompanySendMailModal
          open={openSendEMailModal}
          setOpen={setSendEMailModal}
        />
      )}
    </>
  );
};

export default CompanyOverviewMainArea;
