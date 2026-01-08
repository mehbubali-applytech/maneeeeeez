import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import SalaryGradeMainArea from "@/components/pagesUI/owner/grade/SalaryGradeMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Grade List">
        <Wrapper role={"owner"}>
          <SalaryGradeMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
