import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import CompaniesMainArea from "@/components/pagesUI/super-admin/companies/CompaniesMainArea";
import React from "react";
import CompanyDetailsMainArea from "@/components/pagesUI/company/company-details/CompanyDetailsMainArea";
import CompanyOverviewMainArea from "@/components/pagesUI/owner/overview/CompanyOverviewMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Overview">
        <Wrapper role={"owner"}>
          <CompanyOverviewMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
