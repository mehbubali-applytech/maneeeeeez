import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import CompaniesMainArea from "@/components/pagesUI/super-admin/companies/CompaniesMainArea";
import React from "react";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="All Companies">
        <Wrapper role="super-admin">
          <CompaniesMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
