import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AddEditEmployee from "@/components/pagesUI/owner/employees/UpdateEmployeeModal";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Update Employees">
        <Wrapper role={"owner"}>
          <AddEditEmployee mode="edit"/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
