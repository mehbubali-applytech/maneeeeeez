import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AddDeptMainArea from "@/components/pagesUI/owner/departments/add-dept/AddDeptMainArea";
import AddBranchMainArea from "@/components/pagesUI/owner/branches/add-branch/AddBranchMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Add Branch">
        <Wrapper role={"owner"}>
          <AddBranchMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
