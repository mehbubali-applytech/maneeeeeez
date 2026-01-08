import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import EmployeeMainArea from "@/components/pagesUI/owner/employees/EmployeeMainArea";
import EmployeeProfileMainArea from "@/components/pagesUI/owner/employees/[id]/EmployeeProfileMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Employees">
        <Wrapper role={"owner"}>
          <EmployeeProfileMainArea employeeId="1" />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
