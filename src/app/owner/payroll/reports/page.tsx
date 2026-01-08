import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import ReportsMainArea from "@/components/pagesUI/owner/payroll/reports/ReportsMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Reports">
        <Wrapper role={"owner"}>
          <ReportsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
