import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import BranchMainArea from "@/components/pagesUI/owner/branches/BranchMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="All Companies">
        <Wrapper role={"owner"}>
                    <BranchMainArea />

        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
