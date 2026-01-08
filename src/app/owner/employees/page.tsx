import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import EmployeeMainArea from "@/components/pagesUI/owner/employees/EmployeeMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Employees">
        <Wrapper role={"owner"}>
          <EmployeeMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
