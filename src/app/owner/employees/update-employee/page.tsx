import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import EmployeeMainArea from "@/components/pagesUI/owner/employees/EmployeeMainArea";
import AddEditEmployee from "@/components/pagesUI/owner/employees/UpdateEmployeeModal";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Add Employees">
        <Wrapper role={"owner"}>
          <AddEditEmployee mode="edit"/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
