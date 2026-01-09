import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";


import React from "react";
import AddEditCompanyMainArea from "@/components/pagesUI/super-admin/companies/add-company/AddCompanyMainArea";
const CompanyDetailPage = () => {
  return (
    <>
      <MetaData pageTitle="Add Company">
        <Wrapper role="super-admin">
          <AddEditCompanyMainArea mode="edit" companyData={null} />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default CompanyDetailPage;
