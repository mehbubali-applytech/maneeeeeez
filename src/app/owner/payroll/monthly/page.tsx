import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import PayrollMainArea from "@/components/pagesUI/owner/payroll/monthly/PayrollMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Monthly Payroll">
        <Wrapper role={"owner"}>
          <PayrollMainArea/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
