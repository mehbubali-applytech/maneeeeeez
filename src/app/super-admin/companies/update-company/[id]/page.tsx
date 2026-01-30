"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import AddEditCompanyMainArea from "@/components/pagesUI/super-admin/companies/add-company/AddCompanyMainArea";

const CompanyDetailPage = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const fetchCompanyDetails = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/company/details/${id}`
      );

      // ✅ API structure: res.data.data
      setCompanyData(res.data?.data || null);
    } catch (err: any) {
      console.error("Failed to fetch company details:", err);
      setError("Failed to load company details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompanyDetails();
    }
  }, [id]); // ✅ dependency added

  if (isLoading) {
    return (
      <Wrapper role="super-admin">
        <div className="p-6 text-center">Loading company details...</div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper role="super-admin">
        <div className="p-6 text-center text-red-600">{error}</div>
      </Wrapper>
    );
  }

  return (
    <>
      <MetaData pageTitle="Edit Company">
        <Wrapper role="super-admin">
          <AddEditCompanyMainArea
            mode="edit"
            companyData={companyData}
          />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default CompanyDetailPage;
