import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import SalaryStructureMainArea from "@/components/pagesUI/owner/payroll/salary-structure/SalaryStructureMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Salary Structure">
        <Wrapper role={"owner"}>
          <SalaryStructureMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
