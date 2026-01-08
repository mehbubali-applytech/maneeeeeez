import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import DepartmentMainArea from "@/components/pagesUI/owner/departments/DepartmentMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Departments">
        <Wrapper role={"owner"}>
          <DepartmentMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
