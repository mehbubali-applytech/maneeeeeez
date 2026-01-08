import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AddDeptMainArea from "@/components/pagesUI/owner/departments/add-dept/AddDeptMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Add Department">
        <Wrapper role={"owner"}>
          <AddDeptMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
