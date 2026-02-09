"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import { ICompany } from "../../super-admin/companies/companies.interface";
import BasicInfo from "./BasicInfo";
import CompanySideContentSection from "../../super-admin/companies/[id]/CompanySideContentSection";
import CompanyAddDealsModal from "@/components/pagesUI/company/company-details/CompanyAddDealsModal";
import CompanySendMailModal from "../../super-admin/companies/[id]/CompanySendMailModal";
import QuickAccess from "./QuickAccess";
import axios from "axios";
import { SessionResponseData } from "../ownerTypes";



const CompanyOverviewMainArea = () => {
  const params = useParams();
  const id = Number(params?.id) || 1;

  const [openModal, setOpenModal] = useState(false);
  const [openSendEMailModal, setSendEMailModal] = useState(false);

  const handleToggle = () => setOpenModal(!openModal);
  const handleSendEmailToggle = () => setSendEMailModal(!openSendEMailModal);

  const router = useRouter()
  const [companyData, setCompanyData] = useState<SessionResponseData | null>(null);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        withCredentials: true,
      });
      console.log(response.data.data)
      setCompanyData(response.data.data);
      localStorage.setItem("companyName", JSON.stringify(response.data.data.company.company_name));
      localStorage.setItem("contactPerson", JSON.stringify(response.data.data.company.contact_person));
    } catch (error:any) {
      if(error.response.status === 401){
        router.push("/")
      }
    }
  }

  useEffect(()=>{
    fetchProfileData();
  },[])

  

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
                  companyData={companyData}
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
