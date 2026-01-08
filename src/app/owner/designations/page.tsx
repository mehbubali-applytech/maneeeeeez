import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import DesignationMainArea from "@/components/pagesUI/owner/designations/DesignationMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="All Companies">
        <Wrapper role={"owner"}>
          <DesignationMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
